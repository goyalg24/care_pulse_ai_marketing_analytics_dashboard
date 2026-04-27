import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateSegment } from '../middleware/validate.js';

const router = Router();

function normalize(segment) {
  return { ...segment, criteria: JSON.parse(segment.criteria || '{}') };
}

router.get('/', requireAuth, (_req, res) => {
  const segments = db.query('SELECT * FROM customer_segments ORDER BY segment_id DESC').all();
  res.json(segments.map(normalize));
});

router.get('/:id', requireAuth, (req, res, next) => {
  try {
    const segment = db.query('SELECT * FROM customer_segments WHERE segment_id = ?').get(Number(req.params.id));
    if (!segment) {
      const error = new Error('Segment not found');
      error.status = 404;
      throw error;
    }
    res.json(normalize(segment));
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, validateSegment, (req, res) => {
  const { name, description = '', criteria } = req.body;
  db.run(
    'INSERT INTO customer_segments (name, description, criteria, created_by) VALUES (?, ?, ?, ?)',
    [name.trim(), description.trim(), JSON.stringify(criteria), req.user.user_id],
  );
  res.status(201).json({ message: 'Segment created successfully' });
});

router.put('/:id', requireAuth, requireRole('admin'), validateSegment, (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = db.query('SELECT * FROM customer_segments WHERE segment_id = ?').get(id);
    if (!existing) {
      const error = new Error('Segment not found');
      error.status = 404;
      throw error;
    }
    const { name, description = '', criteria } = req.body;
    db.run(
      'UPDATE customer_segments SET name = ?, description = ?, criteria = ? WHERE segment_id = ?',
      [name.trim(), description.trim(), JSON.stringify(criteria), id],
    );
    res.json({ message: 'Segment updated successfully' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = db.query('SELECT * FROM customer_segments WHERE segment_id = ?').get(id);
    if (!existing) {
      const error = new Error('Segment not found');
      error.status = 404;
      throw error;
    }
    db.run('DELETE FROM customer_segments WHERE segment_id = ?', [id]);
    res.json({ message: 'Segment deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
