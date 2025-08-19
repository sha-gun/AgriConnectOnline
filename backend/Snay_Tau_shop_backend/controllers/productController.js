const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, sizes } = req.body;
        
        // Validate required fields
        if (!name || !description || !price || !category || !image || !sizes || !sizes.length) {
            return res.status(400).json({ message: 'All fields are required including at least one size' });
        }

        // Validate sizes array
        if (!sizes.every(size => size.size && size.stock >= 0)) {
            return res.status(400).json({ message: 'Each size must have a valid size name and stock quantity' });
        }

        // Calculate total stock from sizes
        const stock = sizes.reduce((total, size) => total + size.stock, 0);

        const product = new Product({
            name,
            description,
            price,
            category,
            image,
            sizes,
            stock // Total stock calculated from sizes
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, sizes } = req.body;

        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // If sizes are being updated, validate them
        if (sizes) {
            if (!sizes.every(size => size.size && size.stock >= 0)) {
                return res.status(400).json({ message: 'Each size must have a valid size name and stock quantity' });
            }
            // Recalculate total stock
            const stock = sizes.reduce((total, size) => total + size.stock, 0);
            product.stock = stock;
            product.sizes = sizes;
        }

        // Update other fields if provided
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.image = image || product.image;

        await product.save();
        res.json(product);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).send('Server Error ' + error.message);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
};
