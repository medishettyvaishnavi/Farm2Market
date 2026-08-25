import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { router } from './routes/index.js';
import { errorHandler } from './middleware/error.js';

export const app = express();
app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', router);
app.use(errorHandler);
