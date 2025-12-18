const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
    getAllOrders,
    getMyOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    cancelMyOrder,
    getStats,
    getMyStats
} = require('../controllers/orderController');

// Customer routes
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/my-stats', authMiddleware, getMyStats);
router.post('/', authMiddleware, createOrder);
router.put('/:id/cancel', authMiddleware, cancelMyOrder);  // NEW: Customer cancel order

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.get('/stats', authMiddleware, adminMiddleware, getStats);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

// Shared routes
router.get('/:id', authMiddleware, getOrder);

module.exports = router;