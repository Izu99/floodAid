import { Router, Request, Response } from 'express';
import Feedback from '../models/Feedback';

const router = Router();

// POST /api/feedback - Submit new feedback
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, thoughts, improvements } = req.body;

        const feedback = new Feedback({
            name: name || 'Anonymous',
            thoughts: thoughts || '',
            improvements: improvements || ''
        });

        await feedback.save();

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Failed to submit feedback' });
    }
});

// GET /api/feedback - Get all feedback (admin only)
router.get('/', async (req: Request, res: Response) => {
    try {
        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 }); // Most recent first

        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Failed to fetch feedback' });
    }
});

export default router;
