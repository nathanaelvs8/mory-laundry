const jwt = require('jsonwebtoken');
const db = require('../config/koneksi');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Akses ditolak. Token tidak ditemukan.'
            });
        }
        
        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const [users] = await db.query(
            'SELECT id, username, full_name, role FROM users WHERE id = ?',
            [decoded.id]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }
        
        req.user = users[0];
        next();
        
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token tidak valid'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token sudah expired'
            });
        }
        next(error);
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Akses ditolak. Hanya admin yang diizinkan.'
        });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
