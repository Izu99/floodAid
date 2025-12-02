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
            additionalDetails,
            category
        } = req.body;

        // Validate required fields
        if (!name || !phone || !district || !address || !helpDescription || !category) {
            return res.status(400).json({
                message: 'Name, phone, district, address, help description, and category are required'
            });
        }

        const helpRequest = new HelpRequest({
            name,
            phone,
            additionalPhone,
            district: district.toLowerCase(),
            address,
            helpDescription,
            additionalDetails,
            category
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
            status
        } = req.query;

        const query: any = {};

        if (district) {
            query.district = (district as string).toLowerCase();
        }

        if (status && status !== 'all') {
            query.status = status;
        }

        if (req.query.category) {
            query.category = req.query.category;
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

// Update help request status (public - no auth required)
// This endpoint allows users to mark their help request as fulfilled once they receive help
router.patch('/:id/status', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!status || !['pending', 'in-progress', 'fulfilled'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid status. Must be one of: pending, in-progress, fulfilled'
            });
        }

        const helpRequest = await HelpRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!helpRequest) {
            return res.status(404).json({ message: 'Help request not found' });
        }

        res.json({
            message: 'Status updated successfully',
            data: helpRequest
        });
    } catch (error) {
        console.error('Error updating help request status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
