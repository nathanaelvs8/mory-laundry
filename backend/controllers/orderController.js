const db = require('../config/koneksi');

// @desc    Get all orders (Admin)
// @route   GET /api/orders
const getAllOrders = async (req, res, next) => {
    try {
        const { status, start_date, end_date, search } = req.query;
        
        let query = `
            SELECT o.*, u.full_name as user_fullname 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            WHERE 1=1
        `;
        const params = [];
        
        if (status) {
            query += ' AND o.status = ?';
            params.push(status);
        }
        
        if (start_date) {
            query += ' AND DATE(o.entry_date) >= ?';
            params.push(start_date);
        }
        
        if (end_date) {
            query += ' AND DATE(o.entry_date) <= ?';
            params.push(end_date);
        }
        
        if (search) {
            query += ' AND (o.order_number LIKE ? OR o.customer_name LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        
        query += ' ORDER BY o.created_at DESC';
        
        const [orders] = await db.query(query, params);
        
        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get customer orders
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res, next) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        
        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order with details
// @route   GET /api/orders/:id
const getOrder = async (req, res, next) => {
    try {
        let query = 'SELECT * FROM orders WHERE id = ?';
        const params = [req.params.id];
        
        if (req.user.role !== 'admin') {
            query += ' AND user_id = ?';
            params.push(req.user.id);
        }
        
        const [orders] = await db.query(query, params);
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pesanan tidak ditemukan'
            });
        }
        
        const [details] = await db.query(`
            SELECT od.*, s.service_name, s.unit 
            FROM order_details od 
            JOIN services s ON od.service_id = s.id 
            WHERE od.order_id = ?
        `, [req.params.id]);
        
        res.json({
            success: true,
            data: {
                ...orders[0],
                details
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
    const connection = await db.getConnection();
    
    try {
        const { customer_name, phone_number, items, notes } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Pilih minimal satu layanan'
            });
        }
        
        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderNumber = 'MRY' + Date.now().toString().slice(-8);
        
        await connection.beginTransaction();
        
        const [orderResult] = await connection.query(
            'INSERT INTO orders (order_number, user_id, customer_name, phone_number, total_price, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [orderNumber, req.user.id, customer_name, phone_number, totalPrice, notes || null]
        );
        
        const orderId = orderResult.insertId;
        
        for (const item of items) {
            const subtotal = item.price * item.quantity;
            await connection.query(
                'INSERT INTO order_details (order_id, service_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.service_id, item.quantity, item.price, subtotal]
            );
        }
        
        await connection.commit();
        
        const [newOrder] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        const [details] = await db.query(`
            SELECT od.*, s.service_name, s.unit 
            FROM order_details od 
            JOIN services s ON od.service_id = s.id 
            WHERE od.order_id = ?
        `, [orderId]);
        
        res.status(201).json({
            success: true,
            message: `Pesanan ${orderNumber} berhasil dibuat`,
            data: {
                ...newOrder[0],
                details
            }
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        const validStatuses = ['Antrian', 'Proses Cuci', 'Proses Kering', 'Setrika', 'Siap Diambil', 'Selesai', 'Dibatalkan'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid'
            });
        }
        
        const [existing] = await db.query('SELECT id FROM orders WHERE id = ?', [req.params.id]);
        
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pesanan tidak ditemukan'
            });
        }
        
        let completedDate = null;
        if (status === 'Selesai') {
            completedDate = new Date();
        }
        
        await db.query(
            'UPDATE orders SET status = ?, completed_date = ? WHERE id = ?',
            [status, completedDate, req.params.id]
        );
        
        const [updatedOrder] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        
        res.json({
            success: true,
            message: 'Status pesanan berhasil diupdate',
            data: updatedOrder[0]
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/orders/stats
const getStats = async (req, res, next) => {
    try {
        const [totalOrders] = await db.query('SELECT COUNT(*) as count FROM orders');
        const [completedOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'Selesai'");
        const [pendingOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE status NOT IN ('Selesai', 'Dibatalkan')");
        const [totalRevenue] = await db.query("SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE status = 'Selesai'");
        const [totalUsers] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'pelanggan'");
        
        res.json({
            success: true,
            data: {
                totalOrders: totalOrders[0].count,
                completedOrders: completedOrders[0].count,
                pendingOrders: pendingOrders[0].count,
                totalRevenue: totalRevenue[0].total,
                totalUsers: totalUsers[0].count
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get customer stats
// @route   GET /api/orders/my-stats
const getMyStats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const [totalOrders] = await db.query('SELECT COUNT(*) as count FROM orders WHERE user_id = ?', [userId]);
        const [activeOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND status NOT IN ('Selesai', 'Dibatalkan')", [userId]);
        const [completedOrders] = await db.query("SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND status = 'Selesai'", [userId]);
        
        res.json({
            success: true,
            data: {
                totalOrders: totalOrders[0].count,
                activeOrders: activeOrders[0].count,
                completedOrders: completedOrders[0].count
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllOrders,
    getMyOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    getStats,
    getMyStats
};
