const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/user');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', auth, admin, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', auth, admin, async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is already taken by another user
        if (email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        user.name = name;
        user.email = email;
        user.role = role;

        await user.save();
        
        // Return user without password
        const updatedUser = await User.findById(user._id).select('-password');
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', auth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }

        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', auth, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        
        const orders = await Order.find()
            .populate('items.product', 'price');
        
        const totalOrders = orders.length;
        let totalRevenue = 0;

        // Calculate total revenue and prepare daily revenue data
        const dailyRevenue = {};
        const today = new Date();
        const last7Days = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));

        orders.forEach(order => {
            // Calculate total revenue
            const orderTotal = order.items.reduce((sum, item) => {
                return sum + (item.product.price * item.qty);
            }, 0);
            totalRevenue += orderTotal;

            // Calculate daily revenue for last 7 days
            if (order.createdAt >= last7Days) {
                const date = order.createdAt.toISOString().split('T')[0];
                dailyRevenue[date] = (dailyRevenue[date] || 0) + orderTotal;
            }
        });

        // Convert daily revenue to array format
        const dailyRevenueArray = Object.entries(dailyRevenue).map(([date, amount]) => ({
            date,
            amount
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json({
            totalUsers,
            totalOrders,
            totalRevenue,
            totalProducts,
            dailyRevenue: dailyRevenueArray
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get recent orders
// @route   GET /api/admin/orders/recent
// @access  Private/Admin
router.get('/orders/recent', auth, admin, async (req, res) => {
    try {
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.json(recentOrders);
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get recent users
// @route   GET /api/admin/users/recent
// @access  Private/Admin
router.get('/users/recent', auth, admin, async (req, res) => {
    try {
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.json(recentUsers);
    } catch (error) {
        console.error('Error fetching recent users:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router; 