const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product', 'name price image'); // Populate product details

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        res.json(cart.items);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { productId, qty } = req.body;

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            // Create new cart if doesn't exist
            cart = new Cart({
                user: req.user._id,
                items: [{ product: productId, qty }]
            });
        } else {
            // Check if product already in cart
            const existingItem = cart.items.find(
                item => item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.qty = qty;
            } else {
                cart.items.push({ product: productId, qty });
            }
        }

        await cart.save();
        
        // Fetch updated cart with populated product details
        const updatedCart = await Cart.findById(cart._id)
            .populate('items.product', 'name price image');

        res.json(updatedCart.items);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
router.put('/:productId', auth, async (req, res) => {
    try {
        const { qty } = req.body;
        const productId = req.params.productId;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cartItem.qty = qty;
        await cart.save();

        // Return updated cart with populated product details
        const updatedCart = await Cart.findById(cart._id)
            .populate('items.product', 'name price image');

        res.json(updatedCart.items);
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();

        // Return updated cart with populated product details
        const updatedCart = await Cart.findById(cart._id)
            .populate('items.product', 'name price image');

        res.json(updatedCart.items);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete('/clear', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
