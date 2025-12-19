const Groq = require('groq-sdk');
const db = require('../config/koneksi');

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// System prompt untuk AI - dengan konteks lengkap tentang Mory Laundry
const SYSTEM_PROMPT = `Kamu adalah asisten AI untuk **Mory Laundry**.

TENTANG MORY LAUNDRY:
- Website sistem manajemen laundry online
- Tujuan: Mempermudah pemesanan dan pengelolaan laundry
- Fitur: Pemesanan online, tracking status, manajemen pelanggan, laporan keuangan
- Customer bisa daftar, login, pesan laundry, dan pantau status pesanan
- Admin bisa kelola pesanan, layanan, user, dan lihat laporan

ATURAN MENJAWAB:
- Jawab SINGKAT dan LANGSUNG ke poin (2-4 kalimat)
- Gunakan **bold** untuk angka/data penting
- Gunakan emoji secukupnya
- Format rupiah: Rp xxx.xxx
- Kalo ditanya tentang web/aplikasi, jelaskan fitur Mory Laundry
- Kalo ditanya data, langsung kasih datanya

STATUS PESANAN YANG TERSEDIA:
- Antrian: Pesanan baru masuk
- Proses Cuci: Sedang dicuci
- Proses Kering: Sedang dikeringkan
- Setrika: Sedang disetrika
- Siap Diambil: Sudah selesai, menunggu diambil
- Selesai: Sudah diambil customer
- Dibatalkan: Pesanan dibatalkan`;

// @desc    Chat with AI
// @route   POST /api/chat
const chat = async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Pesan tidak boleh kosong'
            });
        }

        // Fetch ALL relevant data from database
        let contextData = '';
        
        // ==================== ORDERS STATS ====================
        const [totalOrders] = await db.query('SELECT COUNT(*) as count FROM orders');
        const [completedOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Selesai'");
        const [pendingOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status NOT IN ('Selesai', 'Dibatalkan')");
        const [cancelledOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Dibatalkan'");
        const [totalRevenue] = await db.query("SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE status = 'Selesai'");
        
        // Today stats
        const [todayOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()");
        const [todayRevenue] = await db.query("SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE DATE(created_at) = CURDATE() AND status = 'Selesai'");
        
        // This week stats
        const [weekOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE YEARWEEK(created_at) = YEARWEEK(CURDATE())");
        const [weekRevenue] = await db.query("SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE YEARWEEK(created_at) = YEARWEEK(CURDATE()) AND status = 'Selesai'");
        
        // This month stats
        const [monthOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())");
        const [monthRevenue] = await db.query("SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) AND status = 'Selesai'");

        // Orders by status
        const [ordersByStatus] = await db.query(`
            SELECT status, COUNT(*) as count 
            FROM orders 
            GROUP BY status
            ORDER BY FIELD(status, 'Antrian', 'Proses Cuci', 'Proses Kering', 'Setrika', 'Siap Diambil', 'Selesai', 'Dibatalkan')
        `);

        // Recent orders (last 10)
        const [recentOrders] = await db.query(`
            SELECT order_number, customer_name, phone_number, status, total_price, created_at 
            FROM orders 
            ORDER BY created_at DESC 
            LIMIT 10
        `);

        // All orders (for search)
        const [allOrders] = await db.query(`
            SELECT order_number, customer_name, phone_number, address, status, total_price, notes, created_at, completed_date
            FROM orders 
            ORDER BY created_at DESC 
            LIMIT 50
        `);

        // ==================== SERVICES ====================
        const [allServices] = await db.query(`
            SELECT id, service_name, unit, price, description, is_active 
            FROM services 
            ORDER BY service_name
        `);
        const [activeServices] = await db.query("SELECT COUNT(*) as count FROM services WHERE is_active = 1");

        // ==================== USERS ====================
        const [totalUsers] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'pelanggan'");
        const [totalAdmins] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
        const [allUsers] = await db.query(`
            SELECT id, username, full_name, phone_number, role, created_at 
            FROM users 
            ORDER BY created_at DESC
        `);

        // ==================== TOP CUSTOMERS ====================
        const [topCustomers] = await db.query(`
            SELECT customer_name, phone_number, COUNT(*) as total_orders, SUM(total_price) as total_spent
            FROM orders 
            WHERE status = 'Selesai'
            GROUP BY customer_name, phone_number
            ORDER BY total_orders DESC 
            LIMIT 10
        `);

        // ==================== ORDER DETAILS (Popular Services) ====================
        const [popularServices] = await db.query(`
            SELECT s.service_name, s.unit, s.price, COUNT(od.id) as times_ordered, SUM(od.quantity) as total_quantity
            FROM order_details od
            JOIN services s ON od.service_id = s.id
            GROUP BY od.service_id
            ORDER BY times_ordered DESC
            LIMIT 10
        `);

        // Build comprehensive context
        contextData = `
========== DATA MORY LAUNDRY ==========

📊 STATISTIK PESANAN:
- Total semua pesanan: ${totalOrders[0].count}
- Pesanan selesai: ${completedOrders[0].count}
- Pesanan aktif (dalam proses): ${pendingOrders[0].count}
- Pesanan dibatalkan: ${cancelledOrders[0].count}
- Total pendapatan keseluruhan: Rp ${Number(totalRevenue[0].total).toLocaleString('id-ID')}

📅 HARI INI:
- Pesanan masuk: ${todayOrders[0].count}
- Pendapatan: Rp ${Number(todayRevenue[0].total).toLocaleString('id-ID')}

📅 MINGGU INI:
- Pesanan masuk: ${weekOrders[0].count}
- Pendapatan: Rp ${Number(weekRevenue[0].total).toLocaleString('id-ID')}

📅 BULAN INI:
- Pesanan masuk: ${monthOrders[0].count}
- Pendapatan: Rp ${Number(monthRevenue[0].total).toLocaleString('id-ID')}

📈 PESANAN PER STATUS:
${ordersByStatus.map(s => `- ${s.status}: ${s.count} pesanan`).join('\n')}

📋 10 PESANAN TERBARU:
${recentOrders.map(o => `- ${o.order_number} | ${o.customer_name} | ${o.phone_number} | ${o.status} | Rp ${Number(o.total_price).toLocaleString('id-ID')} | ${new Date(o.created_at).toLocaleDateString('id-ID')}`).join('\n')}

🧺 DAFTAR LAYANAN (${activeServices[0].count} aktif):
${allServices.map(s => `- ${s.service_name}: Rp ${Number(s.price).toLocaleString('id-ID')}/${s.unit} ${s.is_active ? '✅' : '❌'} - ${s.description || 'Tidak ada deskripsi'}`).join('\n')}

🔥 LAYANAN TERPOPULER:
${popularServices.map(s => `- ${s.service_name}: dipesan ${s.times_ordered}x (total ${s.total_quantity} ${s.unit})`).join('\n')}

👥 DATA USER:
- Total pelanggan terdaftar: ${totalUsers[0].count}
- Total admin: ${totalAdmins[0].count}

👤 DAFTAR USER:
${allUsers.map(u => `- ${u.full_name} (@${u.username}) | ${u.role} | HP: ${u.phone_number || '-'} | Daftar: ${new Date(u.created_at).toLocaleDateString('id-ID')}`).join('\n')}

🏆 TOP 10 PELANGGAN:
${topCustomers.map((c, i) => `${i + 1}. ${c.customer_name} (${c.phone_number || '-'}): ${c.total_orders} pesanan, total Rp ${Number(c.total_spent).toLocaleString('id-ID')}`).join('\n')}

📦 SEMUA PESANAN (50 terbaru):
${allOrders.map(o => `- ${o.order_number} | ${o.customer_name} | ${o.status} | Rp ${Number(o.total_price).toLocaleString('id-ID')} | ${o.address || 'Tanpa alamat'} | ${o.notes || 'Tanpa catatan'}`).join('\n')}
`;

        // Check if user is asking about specific order
        const orderNumberMatch = message.match(/MRY\d+/i);
        if (orderNumberMatch) {
            const [specificOrder] = await db.query(`
                SELECT o.*, GROUP_CONCAT(CONCAT(s.service_name, ' (', od.quantity, ' ', s.unit, ' x Rp ', FORMAT(od.price, 0), ' = Rp ', FORMAT(od.subtotal, 0), ')') SEPARATOR ', ') as services
                FROM orders o
                LEFT JOIN order_details od ON o.id = od.order_id
                LEFT JOIN services s ON od.service_id = s.id
                WHERE o.order_number = ?
                GROUP BY o.id
            `, [orderNumberMatch[0].toUpperCase()]);
            
            if (specificOrder.length > 0) {
                const order = specificOrder[0];
                contextData += `

🔍 DETAIL PESANAN ${order.order_number}:
- Pelanggan: ${order.customer_name}
- No HP: ${order.phone_number}
- Alamat: ${order.address || 'Tidak ada'}
- Status: ${order.status}
- Total: Rp ${Number(order.total_price).toLocaleString('id-ID')}
- Layanan: ${order.services}
- Catatan: ${order.notes || 'Tidak ada'}
- Tanggal masuk: ${new Date(order.created_at).toLocaleDateString('id-ID')} ${new Date(order.created_at).toLocaleTimeString('id-ID')}
- Tanggal selesai: ${order.completed_date ? new Date(order.completed_date).toLocaleDateString('id-ID') : 'Belum selesai'}
`;
            } else {
                contextData += `\n\n⚠️ Pesanan ${orderNumberMatch[0].toUpperCase()} tidak ditemukan.`;
            }
        }

        // Check if user is asking about specific customer
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('pelanggan') || lowerMessage.includes('customer') || lowerMessage.includes('pesanan dari')) {
            const searchTerm = message.replace(/pelanggan|customer|pesanan|order|dari|milik|punya|cari|tampilkan/gi, '').trim();
            if (searchTerm.length > 2) {
                const [customerOrders] = await db.query(`
                    SELECT order_number, customer_name, phone_number, status, total_price, created_at
                    FROM orders 
                    WHERE customer_name LIKE ? OR phone_number LIKE ?
                    ORDER BY created_at DESC
                    LIMIT 20
                `, [`%${searchTerm}%`, `%${searchTerm}%`]);
                
                if (customerOrders.length > 0) {
                    contextData += `

🔍 PESANAN UNTUK "${searchTerm}" (${customerOrders.length} ditemukan):
${customerOrders.map(o => `- ${o.order_number} | ${o.customer_name} | ${o.phone_number} | ${o.status} | Rp ${Number(o.total_price).toLocaleString('id-ID')} | ${new Date(o.created_at).toLocaleDateString('id-ID')}`).join('\n')}
`;
                } else {
                    contextData += `\n\n⚠️ Tidak ada pesanan untuk "${searchTerm}".`;
                }
            }
        }

        // Check if asking about specific service
        if (lowerMessage.includes('layanan') || lowerMessage.includes('service') || lowerMessage.includes('harga')) {
            const serviceMatch = allServices.find(s => lowerMessage.includes(s.service_name.toLowerCase()));
            if (serviceMatch) {
                contextData += `

🧺 DETAIL LAYANAN "${serviceMatch.service_name}":
- Harga: Rp ${Number(serviceMatch.price).toLocaleString('id-ID')} per ${serviceMatch.unit}
- Status: ${serviceMatch.is_active ? 'Aktif ✅' : 'Nonaktif ❌'}
- Deskripsi: ${serviceMatch.description || 'Tidak ada deskripsi'}
`;
            }
        }

        // Call Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: `${contextData}\n\n========== PERTANYAAN ==========\n${message}`
                }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 1024
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || 'Maaf, saya tidak bisa memproses permintaan Anda saat ini.';

        res.json({
            success: true,
            data: {
                message: aiResponse
            }
        });

    } catch (error) {
        console.error('Chat AI Error:', error);
        
        // Handle specific Groq errors
        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                message: 'Terlalu banyak permintaan. Silakan coba lagi dalam beberapa detik.'
            });
        }

        if (error.status === 401) {
            return res.status(500).json({
                success: false,
                message: 'API key tidak valid. Hubungi administrator.'
            });
        }

        next(error);
    }
};

module.exports = {
    chat
};