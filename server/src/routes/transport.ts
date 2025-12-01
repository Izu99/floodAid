import express, { Request, Response } from 'express';
import Transport from '../models/Transport';

const router = express.Router();

// Get all transport offers
router.get('/', async (req: Request, res: Response) => {
    try {
        const { district, page = 1, limit = 20 } = req.query;
        const query: any = {};

        if (district && district !== 'all') {
            query.district = district;
        }

        const transportOffers = await Transport.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Transport.countDocuments(query);

        res.json({
            data: transportOffers,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transport offers' });
    }
});

// Create new transport offer
router.post('/', async (req: Request, res: Response) => {
    try {
        const newOffer = new Transport(req.body);
        const savedOffer = await newOffer.save();
        res.status(201).json(savedOffer);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create transport offer' });
    }
});

export default router;
