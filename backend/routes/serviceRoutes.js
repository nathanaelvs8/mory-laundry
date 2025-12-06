const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateMiddleware');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
    getAllServices,
    getAllServicesAdmin,
    getService,
    createService,
    updateService,
    deleteService
} = require('../controllers/serviceController');

// Validation
const serviceValidation = [
    body('service_name').notEmpty().withMessage('Nama layanan wajib diisi'),
    body('unit').notEmpty().withMessage('Satuan wajib diisi'),
    body('price').isNumeric().withMessage('Harga harus berupa angka')
];

// Public routes
router.get('/', getAllServices);
router.get('/:id', getService);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, getAllServicesAdmin);
router.post('/', authMiddleware, adminMiddleware, serviceValidation, validateRequest, createService);
router.put('/:id', authMiddleware, adminMiddleware, serviceValidation, validateRequest, updateService);
router.delete('/:id', authMiddleware, adminMiddleware, deleteService);

module.exports = router;
