import { Donation, CreateDonationDto, PaginatedResponse } from '@/types/donation';
import { tokenStorage } from './auth-api';
import { API_URL } from './config';

const getHeaders = () => {
    const token = tokenStorage.getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const donationApi = {
    async getDonations(page: number = 1, limit: number = 15): Promise<PaginatedResponse<Donation>> {
        console.log('📋 Fetching donations, page:', page);
        const response = await fetch(`${API_URL}/api/donations?page=${page}&limit=${limit}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to fetch donations');
        const result = await response.json();
        console.log('✅ Fetched donations:', result.data.length);
        return result;
    },

    async createDonation(data: CreateDonationDto): Promise<Donation> {
        console.log('📤 Creating donation:', data);
        const response = await fetch(`${API_URL}/api/donations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Failed to create donation' }));
            console.error('❌ Error:', error);
            throw new Error(error.error || 'Failed to create donation');
        }

        const result = await response.json();
        console.log('✅ Donation created:', result);
        return result;
    },

    async updateDonation(id: string, data: CreateDonationDto): Promise<Donation> {
        console.log('✏️ Updating donation:', id);
        const response = await fetch(`${API_URL}/api/donations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update donation');
        const result = await response.json();
        console.log('✅ Donation updated');
        return result;
    },

    async markAsCollected(id: string): Promise<Donation> {
        const response = await fetch(`${API_URL}/api/donations/${id}/collect`, {
            method: 'PATCH',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to mark as collected');
        return response.json();
    },
};
