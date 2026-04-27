import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/:id', requireAuth, (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (req.user.role !== 'admin' && req.user.user_id !== id) {
      const error = new Error('You may only view your own profile.');
      error.status = 403;
      throw error;
    }
    const user = db
      .query('SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?')
      .get(id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuth, requireRole('admin'), (_req, res) => {
  const users = db.query('SELECT user_id, name, email, role, created_at FROM users ORDER BY user_id').all();
  res.json(users);
});

export default router;
