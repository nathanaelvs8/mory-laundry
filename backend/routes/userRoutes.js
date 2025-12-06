const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { getAllUsers, getUser, deleteUser } = require('../controllers/userController');

// All routes require admin
router.use(authMiddleware, adminMiddleware);

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);

module.exports = router;
