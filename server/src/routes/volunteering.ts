import express, { Request, Response } from 'express';
import Volunteer from '../models/Volunteer';

const router = express.Router();

// Get all volunteers
router.get('/', async (req: Request, res: Response) => {
    try {
        const { district, page = 1, limit = 20 } = req.query;
        const query: any = {};

        if (district && district !== 'all') {
            query.district = district;
        }

        const volunteers = await Volunteer.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Volunteer.countDocuments(query);

        res.json({
            data: volunteers,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch volunteers' });
    }
});

// Create new volunteer
router.post('/', async (req: Request, res: Response) => {
    try {
        const newVolunteer = new Volunteer(req.body);
        const savedVolunteer = await newVolunteer.save();
        res.status(201).json(savedVolunteer);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create volunteer' });
    }
});

export default router;
