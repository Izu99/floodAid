import { Location, CreateLocationDto } from '@/types/location';
import { tokenStorage } from './auth-api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const locationApi = {
    async getLocations(district?: string, page: number = 1, limit: number = 15): Promise<{ data: Location[], totalPages: number, currentPage: number, totalItems: number }> {
        console.log('📍 Fetching locations', district ? `for district: ${district}` : '', `page: ${page}`);

        const token = tokenStorage.getToken();
        let url = `${API_URL}/locations?page=${page}&limit=${limit}`;

        if (district) {
            url += `&district=${encodeURIComponent(district)}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Error fetching locations:', error);
            throw new Error(error.error || 'Failed to fetch locations');
        }

        const result = await response.json();
        console.log(`✅ Fetched ${result.data.length} locations (Page ${result.currentPage} of ${result.totalPages})`);
        return result;
    },

    async createLocation(data: CreateLocationDto, images: File[]): Promise<Location> {
        console.log('📤 Creating location');
        console.log('Data:', data);
        console.log('Images:', images.length);

        const token = tokenStorage.getToken();
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('district', data.district);
        formData.append('address', data.address);
        formData.append('description', data.description);
        formData.append('startDate', data.startDate);
        formData.append('endDate', data.endDate);
        formData.append('startTime', data.startTime);
        formData.append('endTime', data.endTime);

        images.forEach((image) => {
            formData.append('images', image);
        });

        const response = await fetch(`${API_URL}/locations`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Error creating location:', error);
            throw new Error(error.error || 'Failed to create location');
        }

        const location = await response.json();
        console.log('✅ Location created:', location._id);
        return location;
    },

    async getDistricts(): Promise<string[]> {
        const token = tokenStorage.getToken();
        const response = await fetch(`${API_URL}/locations/districts`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch districts');
        }

        return response.json();
    },
};
