import { Router, Request, Response } from 'express';
import { DonationModel } from '../models/Donation';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all donations with pagination
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
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
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        console.log('➕ Creating donation');
        const { name, phone, address, items, description } = req.body;
        console.log('Donation data:', { name, phone, address, items, description });

        const donation = await DonationModel.create({
            name,
            phone,
            address,
            items,
            description: description || '',
            donor: req.userId,
        });

        console.log('✅ Donation created:', donation._id);
        res.status(201).json(donation);
    } catch (error) {
        console.error('❌ Error creating donation:', error);
        res.status(500).json({ error: 'Failed to create donation' });
    }
});

// Update donation (only owner can edit)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { name, phone, address, items, description } = req.body;

        // Find donation and check ownership
        const donation = await DonationModel.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        if (donation.donor.toString() !== req.userId) {
            return res.status(403).json({ error: 'You can only edit your own donations' });
        }

        // Update donation
        const updatedDonation = await DonationModel.findByIdAndUpdate(
            req.params.id,
            { name, phone, address, items, description },
            { new: true }
        );

        res.json(updatedDonation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update donation' });
    }
});

// Mark donation as collected
router.patch('/:id/collect', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const donation = await DonationModel.findByIdAndUpdate(
            req.params.id,
            {
                status: 'collected',
                collectedBy: req.userId,
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
