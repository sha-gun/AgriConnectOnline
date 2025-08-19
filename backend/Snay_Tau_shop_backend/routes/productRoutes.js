const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// @route   GET /api/products
// @desc    Get all products (Public)
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get single product (Public)
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Create a new product (Private/Admin)
router.post('/', auth, admin, createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product (Private/Admin)
router.put('/:id', auth, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product (Private/Admin)
router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;
