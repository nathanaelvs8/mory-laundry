const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/koneksi');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// @desc    Register new user
// @route   POST /api/auth/signup
const signup = async (req, res, next) => {
    try {
        const { full_name, username, phone_number, password } = req.body;
        
        // Check if username exists
        const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username sudah digunakan'
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user
        await db.query(
            'INSERT INTO users (full_name, username, password, phone_number, role) VALUES (?, ?, ?, ?, ?)',
            [full_name, username, hashedPassword, phone_number || null, 'pelanggan']
        );
        
        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil! Silakan login.'
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }
        
        const user = users[0];
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }
        
        // Generate token
        const token = generateToken(user);
        
        res.json({
            success: true,
            message: 'Login berhasil',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    full_name: user.full_name,
                    phone_number: user.phone_number,
                    role: user.role
                }
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
    try {
        const [users] = await db.query(
            'SELECT id, username, full_name, phone_number, role, created_at FROM users WHERE id = ?',
            [req.user.id]
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

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
    try {
        const { full_name, phone_number, new_password } = req.body;
        const userId = req.user.id;
        
        await db.query(
            'UPDATE users SET full_name = ?, phone_number = ? WHERE id = ?',
            [full_name, phone_number || null, userId]
        );
        
        if (new_password) {
            const hashedPassword = await bcrypt.hash(new_password, 10);
            await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
        }
        
        const [users] = await db.query(
            'SELECT id, username, full_name, phone_number, role FROM users WHERE id = ?',
            [userId]
        );
        
        res.json({
            success: true,
            message: 'Profil berhasil diupdate',
            data: users[0]
        });
        
    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login, getMe, updateProfile };
