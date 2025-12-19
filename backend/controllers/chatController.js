const Groq = require('groq-sdk');
const db = require('../config/koneksi');

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// System prompt untuk AI - ringkas dan to the point
const SYSTEM_PROMPT = `Kamu asisten AI Mory Laundry. Jawab SINGKAT dan LANGSUNG ke poin.

ATURAN PENTING:
- Jawab maksimal 2-3 kalimat saja
- Langsung kasih data/angka yang diminta
- Jangan bertele-tele atau kasih penjelasan panjang
- Gunakan format **bold** untuk angka penting
- Gunakan emoji secukupnya
- Format rupiah: Rp xxx.xxx

Contoh jawaban yang BENAR:
"Total pendapatan hari ini **Rp 150.000** dari **5 pesanan**."

Contoh jawaban yang SALAH (terlalu panjang):
"Baik, saya akan membantu Anda melihat total pendapatan hari ini. Berdasarkan data yang ada di sistem, total pendapatan untuk hari ini adalah..."

Ingat: SINGKAT, PADAT, JELAS.`;

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

        // Fetch relevant data from database untuk konteks
        let contextData = '';
        
        // Get basic stats
        const [totalOrders] = await db.query('SELECT COUNT(*) as count FROM orders');
        const [completedOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Selesai'");
        const [pendingOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status NOT IN ('Selesai', 'Dibatalkan')");
        const [totalRevenue] = await db.query("SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE status = 'Selesai'");
        const [todayOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()");
        const [todayRevenue] = await db.query("SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE DATE(created_at) = CURDATE() AND status = 'Selesai'");
        
        // Get recent orders
        const [recentOrders] = await db.query(`
            SELECT order_number, customer_name, status, total_price, created_at 
            FROM orders 
            ORDER BY created_at DESC 
            LIMIT 5
        `);

        // Get orders by status
        const [ordersByStatus] = await db.query(`
            SELECT status, COUNT(*) as count 
            FROM orders 
            GROUP BY status
        `);

        // Get top customers
        const [topCustomers] = await db.query(`
            SELECT customer_name, COUNT(*) as total_orders, SUM(total_price) as total_spent
            FROM orders 
            WHERE status = 'Selesai'
            GROUP BY customer_name 
            ORDER BY total_orders DESC 
            LIMIT 5
        `);

        // Build context
        contextData = `
DATA LAUNDRY SAAT INI:

📊 STATISTIK UMUM:
- Total semua pesanan: ${totalOrders[0].count}
- Pesanan selesai: ${completedOrders[0].count}
- Pesanan aktif (belum selesai): ${pendingOrders[0].count}
- Total pendapatan (dari pesanan selesai): Rp ${Number(totalRevenue[0].total).toLocaleString('id-ID')}

📅 HARI INI:
- Pesanan hari ini: ${todayOrders[0].count}
- Pendapatan hari ini: Rp ${Number(todayRevenue[0].total).toLocaleString('id-ID')}

📋 PESANAN TERBARU:
${recentOrders.map(o => `- ${o.order_number} | ${o.customer_name} | ${o.status} | Rp ${Number(o.total_price).toLocaleString('id-ID')}`).join('\n')}

📈 PESANAN PER STATUS:
${ordersByStatus.map(s => `- ${s.status}: ${s.count} pesanan`).join('\n')}

👥 TOP PELANGGAN:
${topCustomers.map(c => `- ${c.customer_name}: ${c.total_orders} pesanan (Rp ${Number(c.total_spent).toLocaleString('id-ID')})`).join('\n')}
`;

        // Check if user is asking about specific order
        const orderNumberMatch = message.match(/MRY\d+/i);
        if (orderNumberMatch) {
            const [specificOrder] = await db.query(`
                SELECT o.*, GROUP_CONCAT(CONCAT(s.service_name, ' (', od.quantity, ' ', s.unit, ')') SEPARATOR ', ') as services
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
- Tanggal masuk: ${new Date(order.created_at).toLocaleDateString('id-ID')}
`;
            }
        }

        // Check if user is asking about specific customer
        const customerNameLower = message.toLowerCase();
        if (customerNameLower.includes('pelanggan') || customerNameLower.includes('customer')) {
            const searchTerm = message.replace(/pelanggan|customer|pesanan|order|dari|milik|punya/gi, '').trim();
            if (searchTerm.length > 2) {
                const [customerOrders] = await db.query(`
                    SELECT order_number, customer_name, status, total_price, created_at
                    FROM orders 
                    WHERE customer_name LIKE ?
                    ORDER BY created_at DESC
                    LIMIT 10
                `, [`%${searchTerm}%`]);
                
                if (customerOrders.length > 0) {
                    contextData += `

🔍 PESANAN PELANGGAN "${searchTerm}":
${customerOrders.map(o => `- ${o.order_number} | ${o.status} | Rp ${Number(o.total_price).toLocaleString('id-ID')} | ${new Date(o.created_at).toLocaleDateString('id-ID')}`).join('\n')}
`;
                }
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
                    content: `${contextData}\n\nPERTANYAAN ADMIN: ${message}`
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