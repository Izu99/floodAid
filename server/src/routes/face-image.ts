import { Router, Response } from 'express';
import { UserModel } from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { faceUpload } from '../config/upload';
import fs from 'fs';
import path from 'path';

const router = Router();

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

export default router;
