import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';
import { validateAiChat } from '../middleware/validate.js';

const AI_BASE = process.env.AI_BASE_URL || 'http://127.0.0.1:8000';
const router = Router();

router.get('/history/:user_id', requireAuth, (req, res, next) => {
  try {
    const targetId = Number(req.params.user_id);
    if (req.user.role !== 'admin' && req.user.user_id !== targetId) {
      const error = new Error('You may only view your own AI history.');
      error.status = 403;
      throw error;
    }
    const history = db
      .query('SELECT * FROM ai_conversations WHERE user_id = ? ORDER BY timestamp DESC')
      .all(targetId);
    res.json(history);
  } catch (err) {
    next(err);
  }
});

router.post('/chat', requireAuth, validateAiChat, async (req, res, next) => {
  try {
    const { prompt, use_live_llm = false } = req.body;
    const aiRes = await fetch(`${AI_BASE}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: req.user.user_id,
        question: prompt,
        use_live_llm,
      }),
    });
    if (!aiRes.ok) {
      const detail = await aiRes.text();
      const error = new Error(`AI service failed: ${detail}`);
      error.status = 502;
      throw error;
    }
    const result = await aiRes.json();
    db.run(
      'INSERT INTO ai_conversations (user_id, prompt, response) VALUES (?, ?, ?)',
      [req.user.user_id, prompt, result.answer],
    );
    res.json({
      response: result.answer,
      tools_used: result.tools_used,
      context: result.context,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
