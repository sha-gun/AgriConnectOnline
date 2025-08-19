// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 🛡️ Middleware to Verify Authentication Token
const authMiddleware = async (req, res, next) => {
    try {
        // ✅ Extract Token from Authorization Header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const token = authHeader.split(' ')[1];

        // ✅ Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Fetch User Details (Excluding Password)
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);

        // Handle Token Expiration and Verification Errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired, please login again' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token, authorization denied' });
        }

        res.status(500).json({ message: 'Internal Server Error in Authentication' });
    }
};

module.exports = authMiddleware;

