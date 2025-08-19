const Cart = require('../models/Cart');
const Product = require('../models/Product');

// 🛒 **Get User Cart**
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price category image stock');
        
        if (!cart) {
            return res.status(200).json([]);
        }

        res.json(cart.items);
    } catch (error) {
        console.error('Get Cart Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
};

// 🛒 **Add Item to Cart**
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
    const { productId, qty } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.qty += qty;
        } else {
            cart.items.push({ product: productId, qty });
        }

        await cart.save();
        const updatedCart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price category image stock');
        
        res.status(201).json(updatedCart.items);
    } catch (error) {
        console.error('Add to Cart Error:', error.message);
        res.status(500).json({ message: 'Failed to add product to cart' });
    }
};

// @desc    Remove Item from Cart
// @route   DELETE /api/cart/:id
// @access  Private
exports.removeFromCart = async (req, res) => {
    const productId = req.params.id; // Ensure you're passing the product's ID

    try {
        console.log(`🔍 Attempting to remove product: ${productId} from cart`);

        // Fetch the user's cart
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            console.error('❌ Cart not found for user');
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Check if the product exists in the cart
        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        if (cart.items.length === initialItemCount) {
            console.error('❌ Product not found in cart');
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Save the updated cart
        await cart.save();

        // Return the updated cart with populated product details
        const updatedCart = await Cart.findOne({ user: req.user.id })
            .populate('items.product', 'name price category image stock');

        console.log('✅ Product removed successfully from cart');
        res.json(updatedCart.items);
    } catch (error) {
        console.error('🔥 Error removing item from cart:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};