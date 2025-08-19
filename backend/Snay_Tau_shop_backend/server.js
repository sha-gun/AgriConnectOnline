// ✅ Import Required Modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// ✅ Load Environment Variables
dotenv.config();

// ✅ Connect to Database
connectDB().catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
});

// ✅ Initialize Express App
const app = express();

// ✅ Middleware
app.use(cors({
    origin: '*', 
    credentials: true,
}));
app.use(express.json());

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));       // Authentication Routes
app.use('/api/products', require('./routes/productRoutes')); // Product Routes
app.use('/api/orders', require('./routes/orderRoutes'));     // Order Routes
app.use('/api/cart', require('./routes/cartRoutes'));        // Cart Routes
app.use('/api/admin', require('./routes/adminRoutes'));      // Admin Routes ✅ Added

// ✅ Default Route
app.get('/', (req, res) => {
    res.send('🚀 API is running...');
});

// ✅ 404 Handler for Undefined Routes
app.use((req, res, next) => {
    res.status(404).json({ 
        success: false, 
        message: '🔍 Route not found' 
    });
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
