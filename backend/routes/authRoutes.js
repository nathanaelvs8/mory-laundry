const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware');
const { signup, login, getMe, updateProfile } = require('../controllers/authController');

// Validation rules
const signupValidation = [
    body('full_name')
        .notEmpty().withMessage('Nama lengkap wajib diisi')
        .isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
    body('username')
        .notEmpty().withMessage('Username wajib diisi')
        .isLength({ min: 3 }).withMessage('Username minimal 3 karakter')
        .isAlphanumeric().withMessage('Username hanya boleh huruf dan angka'),
    body('password')
        .notEmpty().withMessage('Password wajib diisi')
        .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
    body('confirm_password')
        .notEmpty().withMessage('Konfirmasi password wajib diisi')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password tidak cocok');
            }
            return true;
        })
];

const loginValidation = [
    body('username').notEmpty().withMessage('Username wajib diisi'),
    body('password').notEmpty().withMessage('Password wajib diisi')
];

const profileValidation = [
    body('full_name')
        .notEmpty().withMessage('Nama lengkap wajib diisi')
        .isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
    body('new_password')
        .optional()
        .isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
];

// Routes
router.post('/signup', signupValidation, validateRequest, signup);
router.post('/login', loginValidation, validateRequest, login);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, profileValidation, validateRequest, updateProfile);

module.exports = router;
