import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectRedis } from './config/redis';
import { runMigrations } from './config/migrations';
import chatRoutes from './routes/chat';
import { errorHandler } from './middleware/validation';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173'
    'https://beacon-beta-dusky.vercel.app',
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '10kb' }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Beacon backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/chat', chatRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const start = async () => {
  try {
    // Connect to Redis
    await connectRedis();

    // Run database migrations
    await runMigrations();

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Beacon backend running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

start();
