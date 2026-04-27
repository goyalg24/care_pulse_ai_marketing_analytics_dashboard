import { Router } from 'express';
import db from '../db/index.js';
import { signToken } from '../utils/token.js';
import { requireAuth } from '../middleware/auth.js';
import { validateLogin, validateRegister } from '../middleware/validate.js';

const router = Router();

router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { name, email, password, role = 'analyst' } = req.body;
    const hash = await Bun.password.hash(password);
    const result = db
      .query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?) RETURNING user_id')
      .get(name.trim(), email.trim().toLowerCase(), hash, role);
    res.status(201).json({ id: result.user_id, message: 'User created successfully' });
  } catch (err) {
    err.status = 400;
    err.message = 'Email already registered';
    next(err);
  }
});

router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = db.query('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }
    const isMatch = await Bun.password.verify(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }
    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
    const token = signToken({ user_id: user.user_id, role: user.role });
    res.json({ token, user: safeUser });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json(req.user);
});

export default router;
