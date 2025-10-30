// backend/src/middleware/authMiddleware.js
const { verifyToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  try {
    console.log('🔐 Auth Middleware - Checking authentication');
    console.log('🔐 Request headers:', req.headers.authorization ? 'Authorization header present' : 'No Authorization header');
    console.log('🔐 Cookies:', req.cookies ? 'Cookies present' : 'No cookies');
    
    // Get token from either cookies or Authorization header
    let token = req.cookies?.token;
    
    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7); // Remove 'Bearer ' prefix
        console.log('🔐 Using token from Authorization header');
      } else {
        token = authHeader;
        console.log('🔐 Using raw token from Authorization header');
      }
    }

    console.log('🔐 Token found:', token ? `Yes (length: ${token.length})` : 'No');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    // Verify token
    console.log('🔐 Verifying token...');
    const payload = verifyToken(token);
    console.log('✅ Token verified successfully for user:', payload.email);
    
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;