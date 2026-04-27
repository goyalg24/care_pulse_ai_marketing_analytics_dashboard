import db from '../db/index.js';
import { verifyToken } from '../utils/token.js';

export function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      const error = new Error('Missing bearer token');
      error.status = 401;
      throw error;
    }
    const token = header.replace('Bearer ', '');
    const payload = verifyToken(token);
    const user = db
      .query('SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?')
      .get(payload.user_id);
    if (!user) {
      const error = new Error('User not found for token');
      error.status = 401;
      throw error;
    }
    req.user = user;
    next();
  } catch (err) {
    err.status = err.status || 401;
    next(err);
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      const error = new Error('Authentication required');
      error.status = 401;
      return next(error);
    }
    if (!roles.includes(req.user.role)) {
      const error = new Error('You do not have permission to perform this action');
      error.status = 403;
      return next(error);
    }
    next();
  };
}
