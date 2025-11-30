import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { faceUpload, upload } from '../config/upload';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'floodaid-secret-key-change-in-production';

// Register (with optional file upload for collectors)
router.post('/register', faceUpload.single('faceImage'), async (req: Request, res: Response) => {
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

// Get Profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const user = await UserModel.findById(req.userId).select('-password');
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
                faceImage: user.faceImage
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update Profile (with location images)
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { occupation, locations } = req.body;

        // Parse locations if it's a string (from FormData)
        let parsedLocations = typeof locations === 'string' ? JSON.parse(locations) : locations;

        // Handle uploaded images
        if (req.files && Array.isArray(req.files)) {
            // Map uploaded files to locations based on some logic or index
            // Since FormData doesn't support nested arrays well with files, 
            // we'll assume the frontend sends a map of which image belongs to which location
            // For simplicity in this MVP, we'll just append images to locations if provided

            // A better approach for the future:
            // Frontend sends 'locationIndex' for each file
            // Here we just save filenames and let frontend handle the mapping logic before sending
            // OR we update the location object with the new image filenames
        }

        // For this specific request, we need a more robust way to handle file uploads per location.
        // Given the complexity of multipart/form-data with nested arrays, 
        // we'll implement a separate endpoint for uploading location images 
        // OR we'll expect the frontend to handle image uploads separately and just send filenames here.

        // However, to keep it simple for now as per user request "add 5 images max":
        // We will update the user with the provided data.
        // If images are uploaded, we need to know which location they belong to.

        // Let's stick to the current implementation for text data 
        // and create a specific route for adding images to a location if needed,
        // BUT the user wants it in the profile form.

        // REVISED STRATEGY:
        // The frontend will upload images separately or we handle base64 (not recommended for large files).
        // Best approach for this stack: 
        // 1. Upload images first -> get URLs
        // 2. Send profile update with image URLs

        // OR:
        // Use the existing upload middleware but we need to know the mapping.

        // Let's simply update the text fields for now, and I will create a separate route 
        // for uploading location images to make it cleaner.

        const user = await UserModel.findByIdAndUpdate(
            req.userId,
            { occupation, locations: parsedLocations },
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
                faceImage: user.faceImage
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Upload Location Image
router.post('/upload-location-image', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }
        res.json({ filename: req.file.filename });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Update face image
router.post('/update-face-image', authMiddleware, faceUpload.single('faceImage'), async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const userId = req.userId;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete old face image if it exists
        const fs = require('fs');
        const path = require('path');
        if (user.faceImage) {
            const oldImagePath = path.join(__dirname, '../../uploads/faces', user.faceImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update with new image
        user.faceImage = req.file.filename;
        await user.save();

        res.json({
            message: 'Face image updated successfully',
            faceImage: req.file.filename
        });
    } catch (error) {
        console.error('Update face image error:', error);
        res.status(500).json({ error: 'Failed to update face image' });
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
