const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
} = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware'); // Middleware to authenticate users
const admin = require('../middleware/adminMiddleware'); // Middleware to verify admin access

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
router.post('/', auth, createOrder);

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', auth, getMyOrders);

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', auth, admin, getAllOrders);

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id
// @access  Private/Admin
router.put('/:id', auth, admin, updateOrderStatus);

module.exports = router;
