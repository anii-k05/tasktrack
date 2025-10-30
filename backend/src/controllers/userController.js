// backend/src/controllers/userController.js
const prisma = require('../db');

async function getMe(req, res) {
  try {
    console.log('👤 GetMe called for user:', req.user.id);
    
    // Get user from database to ensure they exist and get latest data
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User data retrieved:', user.email);
    res.json({ user });
  } catch (err) {
    console.error('❌ GetMe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getMe };