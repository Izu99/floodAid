import { Router, Request, Response } from 'express';
import { LocationModel } from '../models/Location';
import { UserModel } from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { upload } from '../config/upload';

const router = Router();

// Get all locations (for donors)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        console.log('📍 Fetching locations');
        const district = req.query.district as string;

        // 1. Fetch from LocationModel (Explicitly created locations)
        const locationQuery: any = { status: 'active' };
        if (district) {
            locationQuery.district = district;
        }

        const explicitLocations = await LocationModel.find(locationQuery)
            .populate('collector', 'name phone faceImage occupation')
            .sort({ createdAt: -1 });

        // 2. Fetch from User Model (Collector Profiles)
        const userQuery: any = { role: 'collector' };
        if (district) {
            userQuery['locations.district'] = district;
        }

        const collectors = await UserModel.find(userQuery).select('name phone faceImage occupation locations');

        // Transform collector locations into the same format as LocationModel
        const profileLocations = collectors.flatMap(collector => {
            return collector.locations
                .filter(loc => !district || loc.district === district)
                .map(loc => ({
                    _id: collector._id + '-' + loc.address, // Generate a temporary ID
                    name: collector.name + ' - ' + loc.district, // Use collector name as location name
                    district: loc.district,
                    address: loc.address,
                    description: collector.occupation ? `${collector.occupation} විසින් පවත්වාගෙන යනු ලැබේ` : 'එකතුකරන්නාගේ ස්ථානය',
                    startDate: loc.startDate || '',
                    endDate: loc.endDate || '',
                    startTime: loc.startTime || '',
                    endTime: loc.endTime || '',
                    images: loc.images || [],
                    collector: {
                        _id: collector._id,
                        name: collector.name,
                        phone: collector.phone,
                        faceImage: collector.faceImage,
                        occupation: collector.occupation
                    },
                    createdAt: new Date(), // Use current date or find a way to track creation
                    status: 'active'
                }));
        });

        // Merge and sort
        const allLocations = [...explicitLocations, ...profileLocations];

        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 15;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedLocations = allLocations.slice(startIndex, endIndex);
        const totalPages = Math.ceil(allLocations.length / limit);

        console.log(`✅ Found ${allLocations.length} locations. Returning page ${page} of ${totalPages}`);

        res.json({
            data: paginatedLocations,
            totalPages,
            currentPage: page,
            totalItems: allLocations.length
        });
    } catch (error) {
        console.error('❌ Error fetching locations:', error);
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

// Create location (collectors only)
router.post('/', authMiddleware, upload.array('images', 5), async (req: AuthRequest, res: Response) => {
    try {
        console.log('📝 Creating location');
        console.log('Body:', req.body);
        console.log('Files:', req.files);

        const { name, district, address, description, startDate, endDate, startTime, endTime } = req.body;

        // Check if user is a collector
        const user = await UserModel.findById(req.userId);
        if (!user || user.role !== 'collector') {
            return res.status(403).json({ error: 'Only collectors can add locations' });
        }

        // Validate required fields
        if (!name || !district || !address || !description || !startDate || !endDate || !startTime || !endTime) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if images are uploaded
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            return res.status(400).json({ error: 'At least one image is required' });
        }

        if ((req.files as Express.Multer.File[]).length > 5) {
            return res.status(400).json({ error: 'Maximum 5 images allowed' });
        }

        // Get image filenames
        const images = (req.files as Express.Multer.File[]).map(file => file.filename);

        const location = await LocationModel.create({
            name,
            district,
            address,
            description,
            startDate,
            endDate,
            startTime,
            endTime,
            images,
            collector: req.userId,
        });

        console.log('✅ Location created:', location._id);
        res.status(201).json(location);
    } catch (error) {
        console.error('❌ Error creating location:', error);
        res.status(500).json({ error: 'Failed to create location' });
    }
});

// Get districts list
router.get('/districts', async (req: Request, res: Response) => {
    try {
        const districts = await LocationModel.distinct('district');
        res.json(districts.sort());
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch districts' });
    }
});

export default router;
