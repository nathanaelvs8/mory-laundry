const db = require('../config/koneksi');

// @desc    Get all users
// @route   GET /api/users
const getAllUsers = async (req, res, next) => {
    try {
        const { search } = req.query;
        
        let query = `
            SELECT id, username, full_name, phone_number, role, created_at 
            FROM users 
            WHERE 1=1
        `;
        const params = [];
        
        if (search) {
            query += ' AND (username LIKE ? OR full_name LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [users] = await db.query(query, params);
        
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
const getUser = async (req, res, next) => {
    try {
        const [users] = await db.query(
            'SELECT id, username, full_name, phone_number, role, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }
        
        res.json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
    try {
        const [existing] = await db.query('SELECT id, role FROM users WHERE id = ?', [req.params.id]);
        
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }
        
        if (existing[0].role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Tidak dapat menghapus admin'
            });
        }
        
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        
        res.json({
            success: true,
            message: 'User berhasil dihapus'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUser,
    deleteUser
};
