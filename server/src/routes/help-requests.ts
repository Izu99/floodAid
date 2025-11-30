import express, { Request, Response } from 'express';
import HelpRequest from '../models/HelpRequest';

const router = express.Router();

// Create new help request (public - no auth required)
router.post('/', async (req: Request, res: Response) => {
    try {
        const {
            name,
            phone,
            additionalPhone,
            district,
            address,
            helpDescription,
            additionalDetails
        } = req.body;

        // Validate required fields
        if (!name || !phone || !district || !address || !helpDescription) {
            return res.status(400).json({
                message: 'Name, phone, district, address, and help description are required'
            });
        }

        const helpRequest = new HelpRequest({
            name,
            phone,
            additionalPhone,
            district: district.toLowerCase(),
            address,
            helpDescription,
            additionalDetails
        });

        await helpRequest.save();

        res.status(201).json({
            message: 'Help request created successfully',
            data: helpRequest
        });
    } catch (error) {
        console.error('Error creating help request:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all help requests (public - no auth required)
router.get('/', async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 15,
            district,
            status = 'pending'
        } = req.query;

        const query: any = {};

        if (district) {
            query.district = (district as string).toLowerCase();
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const helpRequests = await HelpRequest.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await HelpRequest.countDocuments(query);

        res.json({
            data: helpRequests,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalRequests: total
        });
    } catch (error) {
        console.error('Error fetching help requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
