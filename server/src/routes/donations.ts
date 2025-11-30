import { Router, Request, Response } from 'express';
import { DonationModel } from '../models/Donation';
// import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all donations with pagination
router.get('/', async (req: Request, res: Response) => {
    try {
        console.log('📋 Fetching donations');
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 15;
        const skip = (page - 1) * limit;
        console.log(`Page: ${page}, Limit: ${limit}, Skip: ${skip}`);

        const [donations, total] = await Promise.all([
            DonationModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            DonationModel.countDocuments(),
        ]);

        console.log(`✅ Found ${donations.length} donations (total: ${total})`);
        res.json({
            data: donations,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('❌ Error fetching donations:', error);
        res.status(500).json({ error: 'Failed to fetch donations' });
    }
});

// Create donation
router.post('/', async (req: Request, res: Response) => {
    try {
        console.log('➕ Creating donation');
        const { name, phone, district, address, items, description, urgency, availableUntil } = req.body;
        console.log('Donation data:', { name, phone, district, address, items, description, urgency, availableUntil });

        const donation = await DonationModel.create({
            name,
            phone,
            district,
            address,
            items,
            description: description || '',
            urgency: urgency || 'medium',
            availableUntil: availableUntil || null
            // donor field removed to allow unauthenticated creation
        });

        console.log('✅ Donation created:', donation._id);
        res.status(201).json(donation);
    } catch (error) {
        console.error('❌ Error creating donation:', error);
        console.error('Error details:', error);
        res.status(500).json({ error: 'Failed to create donation', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});

// Update donation
router.put('/:id', async (req: Request, res: Response) => {
    try {
        console.log('✏️ Updating donation:', req.params.id);
        const { name, phone, district, address, items, description, urgency, availableUntil } = req.body;

        // Find donation
        const donation = await DonationModel.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        // Update donation
        const updatedDonation = await DonationModel.findByIdAndUpdate(
            req.params.id,
            { name, phone, district, address, items, description, urgency, availableUntil },
            { new: true }
        );

        console.log('✅ Donation updated:', updatedDonation?._id);
        res.json(updatedDonation);
    } catch (error) {
        console.error('❌ Error updating donation:', error);
        res.status(500).json({ error: 'Failed to update donation' });
    }
});

// Mark donation as collected
router.patch('/:id/collect', async (req: Request, res: Response) => {
    try {
        const donation = await DonationModel.findByIdAndUpdate(
            req.params.id,
            {
                status: 'collected',
                collectedBy: null, // No userId available
            },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        res.json(donation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to collect donation' });
    }
});

export default router;
