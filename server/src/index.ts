import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Hospital Information System (HIS/MIS) API',
    facility: 'مستشفى النيل التخصصي',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mock / Initial Data Fallback endpoints for high reliability
import authRoutes from './modules/auth/auth.routes.js';
app.use('/api/v1/auth', authRoutes);

// Fallback error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API Error]:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`[HIS/MIS Server] running on http://localhost:${PORT}`);
  console.log(`[Health Check] available at http://localhost:${PORT}/api/health`);
});

export default app;
