import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateReport } from '../middleware/validate.js';

const router = Router();

function normalize(report) {
  return { ...report, metrics_data: JSON.parse(report.metrics_data) };
}

router.get('/', requireAuth, (_req, res) => {
  const reports = db.query('SELECT * FROM analytics_reports ORDER BY report_id DESC').all();
  res.json(reports.map(normalize));
});

router.get('/campaign/:campaign_id', requireAuth, (req, res) => {
  const reports = db
    .query('SELECT * FROM analytics_reports WHERE campaign_id = ? ORDER BY report_id DESC')
    .all(Number(req.params.campaign_id));
  res.json(reports.map(normalize));
});

router.post('/generate', requireAuth, requireRole('admin'), validateReport, (req, res) => {
  const { campaign_id, segment_id, metrics_data } = req.body;
  db.run(
    'INSERT INTO analytics_reports (campaign_id, segment_id, metrics_data) VALUES (?, ?, ?)',
    [campaign_id, segment_id, JSON.stringify(metrics_data)],
  );
  res.status(201).json({ message: 'Report generated successfully' });
});

export default router;
