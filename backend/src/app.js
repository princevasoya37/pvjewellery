import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from 'config';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.set('trust proxy', 1); // Trust proxy on Render / Cloudflare
const rawFrontendUrl = process.env.FRONTEND_URL || config.get('frontendUrl');
const frontendUrl = rawFrontendUrl.replace(/\/+$/, '');

const allowedOrigins = [
  frontendUrl,
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://127.0.0.1:5000',
  'http://localhost:5000',
].filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const sanitizedOrigin = origin.replace(/\/+$/, '');
    if (
      allowedOrigins.includes(sanitizedOrigin) ||
      sanitizedOrigin.endsWith('.vercel.app') ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(sanitizedOrigin)
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS Error: Origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Expose uploads folder so /uploads/products/xxx serves saved images
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsDir));

const limiter = rateLimit(config.get('rateLimit'));
app.use('/api/', limiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
