const prisma = require('../db');
const { hashPassword, comparePasswords } = require('../utils/hash');
const { signToken } = require('../utils/jwt');

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production'
};

// REGISTER FUNCTION
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, passwordHash }
    });

    const token = signToken({ id: user.id, email: user.email });
    res.cookie('token', token, cookieOptions);
    res.status(201).json({ 
      user: { id: user.id, name: user.name, email: user.email },
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// LOGIN FUNCTION
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await comparePasswords(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken({ id: user.id, email: user.email });
    res.cookie('token', token, cookieOptions);
    res.json({ 
      user: { id: user.id, name: user.name, email: user.email },
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// LOGOUT FUNCTION
function logout(req, res) {
  res.clearCookie('token', cookieOptions);
  res.json({ message: 'Logged out' });
}

// EXPORTS
module.exports = { register, login, logout };