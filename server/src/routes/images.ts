import { Router, Response } from 'express';
import { UserModel } from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

const router = Router();

// Delete location image
router.delete('/location-image/:filename', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { filename } = req.params;
        const userId = req.userId;

        // Find user and verify they own this image
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the image exists in any of the user's locations
        let imageFound = false;
        for (const location of user.locations) {
            if (location.images && location.images.includes(filename)) {
                imageFound = true;
                // Remove the image from the array
                location.images = location.images.filter(img => img !== filename);
            }
        }

        if (!imageFound) {
            return res.status(404).json({ error: 'Image not found in your locations' });
        }

        // Save the updated user
        await user.save();

        // Delete the physical file
        const filePath = path.join(__dirname, '../../uploads/locations', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

export default router;
