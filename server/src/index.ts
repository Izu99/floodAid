import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/database';
import donationRoutes from './routes/donations';
import authRoutes from './routes/auth';
import helpRequestRoutes from './routes/help-requests';
import locationRoutes from './routes/locations';
import imageRoutes from './routes/images';
import educationRoutes from './routes/education';
import transportRoutes from './routes/transport';
import volunteerRoutes from './routes/volunteering';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.log(`\n📨 [${timestamp}] ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }

    // Log response
    const originalSend = res.send;
    res.send = function (data: any) {
        console.log(`📤 [${timestamp}] Response ${res.statusCode}`);
        return originalSend.call(this, data);
    };

    next();
});

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://flood-aid-one.vercel.app',
        'https://flood-aid-git-development-izu99s-projects.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to FloodAid API' });
});

app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Donation routes
app.use('/api/donations', donationRoutes);

// Help request routes
app.use('/api/help-requests', helpRequestRoutes);

// Location routes
app.use('/api/locations', locationRoutes);

// Education routes
app.use('/api/education', educationRoutes);

// Transport routes
app.use('/api/transport', transportRoutes);

// Volunteer routes
app.use('/api/volunteering', volunteerRoutes);

// Image routes
app.use('/api/images', imageRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('❌ ERROR CAUGHT:');
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({
        error: err.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    console.log(`⚠️ 404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(port, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`⚡️ FloodAid Server is running`);
    console.log(`🌐 URL: http://localhost:${port}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`${'='.repeat(60)}\n`);
});
