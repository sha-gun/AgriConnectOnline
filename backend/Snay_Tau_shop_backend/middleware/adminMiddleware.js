// backend/middleware/adminMiddleware.js
// 🛡️ Admin Middleware to Restrict Access to Admins Only
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

module.exports = adminMiddleware;
