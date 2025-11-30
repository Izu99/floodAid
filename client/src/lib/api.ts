import { Donation, CreateDonationDto, PaginatedResponse } from '@/types/donation';
import { tokenStorage } from './auth-api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = tokenStorage.getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const donationApi = {
    async getDonations(page: number = 1, limit: number = 15): Promise<PaginatedResponse<Donation>> {
        const response = await fetch(`${API_URL}/donations?page=${page}&limit=${limit}`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch donations');
        return response.json();
    },

    async createDonation(data: CreateDonationDto): Promise<Donation> {
        const response = await fetch(`${API_URL}/donations`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create donation');
        return response.json();
    },

    async updateDonation(id: string, data: CreateDonationDto): Promise<Donation> {
        const response = await fetch(`${API_URL}/donations/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update donation');
        return response.json();
    },

    async markAsCollected(id: string): Promise<Donation> {
        const response = await fetch(`${API_URL}/donations/${id}/collect`, {
            method: 'PATCH',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to mark as collected');
        return response.json();
    },
};
