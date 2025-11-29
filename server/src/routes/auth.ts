import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { upload } from '../config/upload';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'floodaid-secret-key-change-in-production';

// Register (with optional file upload for collectors)
router.post('/register', upload.single('faceImage'), async (req: Request, res: Response) => {
    try {
        console.log('📝 Register request received');
        console.log('Body:', req.body);
        console.log('File:', req.file);

        const { name, phone, password, role } = req.body;

        // Validation
        if (!name || !phone || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!['donor', 'collector'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if collector has uploaded face image
        if (role === 'collector' && !req.file) {
            return res.status(400).json({ error: 'Face image is required for collectors' });
        }

        // Check if user exists
        console.log('🔍 Checking if user exists with phone:', phone);
        const existingUser = await UserModel.findOne({ phone });
        if (existingUser) {
            console.log('❌ User already exists');
            return res.status(400).json({ error: 'Phone number already registered' });
        }
        console.log('✅ User does not exist, proceeding with registration');

        // Create user
        const userData: any = { name, phone, password, role };
        if (req.file) {
            userData.faceImage = req.file.filename;
        }

        console.log('👤 Creating user with data:', { ...userData, password: '***' });
        const user: any = await UserModel.create(userData);
        console.log('✅ User created successfully:', user._id);

        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('❌ Register error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { phone, password } = req.body;

        // Validation
        if (!phone || !password) {
            return res.status(400).json({ error: 'Phone and password are required' });
        }

        // Find user
        const user = await UserModel.findOne({ phone });
        if (!user) {
            return res.status(401).json({ error: 'Invalid phone or password' });
        }

        // Check password
        const isValidPassword = await (user as any).comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid phone or password' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Update Profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { occupation, locations } = req.body;

        const user = await UserModel.findByIdAndUpdate(
            req.userId,
            { occupation, locations },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                occupation: user.occupation,
                locations: user.locations,
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get all collectors (with optional district filter)
router.get('/collectors', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { district } = req.query;

        let query: any = { role: 'collector' };

        if (district) {
            query['locations.district'] = district;
        }

        const collectors = await UserModel.find(query)
            .select('name phone occupation locations faceImage')
            .sort({ createdAt: -1 });

        res.json(collectors);
    } catch (error) {
        console.error('Fetch collectors error:', error);
        res.status(500).json({ error: 'Failed to fetch collectors' });
    }
});

export default router;
