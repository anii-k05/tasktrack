// test-jwt.js
require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length); 