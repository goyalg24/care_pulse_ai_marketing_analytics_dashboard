import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import campaignRoutes from './routes/campaigns.js';
import segmentRoutes from './routes/segments.js';
import reportRoutes from './routes/reports.js';
import aiRoutes from './routes/ai.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandlers.js';

const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN, credentials: false }));
app.use(express.json());
app.use(requestLogger);

app.get('/', (_req, res) => {
  res.json({
    message: 'CarePulse API is running',
    docs: 'See docs/API_DOCUMENTATION.md for route documentation.',
  });
});

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 CarePulse API running on http://localhost:${PORT}`);
});
