const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        console.log('Create Order Request:', req.body);

        const { items, name, address, city, postalCode, country, paymentMethod, totalAmount, shippingFee } = req.body;

        // Validate required fields
        if (!name || !address || !city || !postalCode || !country || !items || items.length === 0) {
            return res.status(400).json({ message: 'All fields are required, and items cannot be empty.' });
        }

        let totalPrice = 0;

        // Validate each product in items
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                console.error(`Product not found: ${item.product}`);
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            if (product.stock < item.qty) {
                console.error(`Insufficient stock for product: ${product.name}`);
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }

            totalPrice += product.price * item.qty;

            // Reduce product stock
            product.stock -= item.qty;
            await product.save();
        }

        // Create and save order
        const order = new Order({
            user: req.user.id,
            name,
            address,
            city,
            postalCode,
            country,
            paymentMethod,
            items,
            totalPrice: totalAmount || totalPrice, // Ensure total price matches
            shippingFee,
            status: 'Pending',
        });

        await order.save();
        console.log('Order Created:', order);
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('items.product', 'name price');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        console.log('Order Updated:', order);
        res.json(order);
    } catch (error) {
        console.error('Error updating order status:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
