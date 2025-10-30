// verify-token.js
require('dotenv').config();
const { verifyToken } = require('./src/utils/jwt');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbmlydWRoaGthbnNhcmEwNEBnbWFpbC5jb20iLCJpYXQiOjE3NjE4MTAxMjcsImV4cCI6MTc2MTgxNzMyN30.r5XuUFG8v_7yLlrWg17tcGiN0bq435u4Nc7wIxa3qNk";

console.log('🔐 Testing token verification...');
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('Token to verify:', token);

try {
  const decoded = verifyToken(token);
  console.log('✅ Token verified successfully');
  console.log('Decoded payload:', decoded);
} catch (err) {
  console.error('❌ Token verification failed:', err.message);
  console.log('This means the JWT_SECRET used to create the token is different from the one used to verify it.');
}