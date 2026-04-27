import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateCampaign } from '../middleware/validate.js';

const router = Router();

router.get('/', requireAuth, (req, res) => {
  const ownerId = req.query.owner_id ? Number(req.query.owner_id) : null;
  let rows;
  if (req.user.role === 'admin') {
    rows = ownerId
      ? db.query('SELECT * FROM campaigns WHERE owner_id = ? ORDER BY campaign_id DESC').all(ownerId)
      : db.query('SELECT * FROM campaigns ORDER BY campaign_id DESC').all();
  } else {
    rows = db.query('SELECT * FROM campaigns WHERE owner_id = ? ORDER BY campaign_id DESC').all(req.user.user_id);
  }
  res.json(rows);
});

router.get('/:id', requireAuth, (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const campaign = db.query('SELECT * FROM campaigns WHERE campaign_id = ?').get(id);
    if (!campaign) {
      const error = new Error('Campaign not found');
      error.status = 404;
      throw error;
    }
    if (req.user.role !== 'admin' && campaign.owner_id !== req.user.user_id) {
      const error = new Error('You may only view your own campaigns.');
      error.status = 403;
      throw error;
    }
    res.json(campaign);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, validateCampaign, (req, res) => {
  const { title, description = '', channel, start_date, end_date } = req.body;
  const owner_id = req.user.user_id;
  db.run(
    'INSERT INTO campaigns (title, description, channel, start_date, end_date, owner_id) VALUES (?, ?, ?, ?, ?, ?)',
    [title.trim(), description.trim(), channel.trim(), start_date, end_date, owner_id],
  );
  res.status(201).json({ message: 'Campaign created successfully' });
});

router.put('/:id', requireAuth, validateCampaign, (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = db.query('SELECT * FROM campaigns WHERE campaign_id = ?').get(id);
    if (!existing) {
      const error = new Error('Campaign not found');
      error.status = 404;
      throw error;
    }
    if (req.user.role !== 'admin' && existing.owner_id !== req.user.user_id) {
      const error = new Error('You may only update your own campaigns.');
      error.status = 403;
      throw error;
    }
    const { title, description = '', channel, start_date, end_date } = req.body;
    db.run(
      'UPDATE campaigns SET title = ?, description = ?, channel = ?, start_date = ?, end_date = ? WHERE campaign_id = ?',
      [title.trim(), description.trim(), channel.trim(), start_date, end_date, id],
    );
    res.json({ message: 'Campaign updated successfully' });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = db.query('SELECT * FROM campaigns WHERE campaign_id = ?').get(id);
    if (!existing) {
      const error = new Error('Campaign not found');
      error.status = 404;
      throw error;
    }
    db.run('DELETE FROM campaigns WHERE campaign_id = ?', [id]);
    res.json({ message: 'Campaign deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
