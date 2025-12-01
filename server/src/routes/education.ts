import express, { Request, Response } from 'express';
import Education from '../models/Education';

const router = express.Router();

// Get all education requests
router.get('/', async (req: Request, res: Response) => {
    try {
        const { district, page = 1, limit = 20 } = req.query;
        const query: any = {};

        if (district && district !== 'all') {
            query.district = district;
        }

        const educationRequests = await Education.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Education.countDocuments(query);

        res.json({
            data: educationRequests,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch education requests' });
    }
});

// Create new education request
router.post('/', async (req: Request, res: Response) => {
    try {
        const newRequest = new Education(req.body);
        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create education request' });
    }
});

export default router;
