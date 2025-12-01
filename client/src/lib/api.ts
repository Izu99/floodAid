import { Donation, CreateDonationDto, PaginatedResponse } from '@/types/donation';
import { Education, CreateEducationDto } from '@/types/education';
import { Transport, CreateTransportDto } from '@/types/transport';
import { Volunteer, CreateVolunteerDto } from '@/types/volunteer';
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

export const helpRequestApi = {
    async createHelpRequest(data: any): Promise<any> {
        const response = await fetch(`${API_URL}/api/help-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create help request');
        return response.json();
    },
    async getHelpRequests(page: number = 1, limit: number = 15, district?: string): Promise<any> {
        let url = `${API_URL}/api/help-requests?page=${page}&limit=${limit}`;
        if (district && district !== 'all') {
            url += `&district=${district}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch help requests');
        return response.json();
    }
};

export const locationApi = {
    async createLocation(data: any): Promise<any> {
        const response = await fetch(`${API_URL}/api/locations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create location');
        return response.json();
    },
    async getLocations(page: number = 1, limit: number = 15, district?: string): Promise<any> {
        let url = `${API_URL}/api/locations?page=${page}&limit=${limit}`;
        if (district && district !== 'all') {
            url += `&district=${district}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch locations');
        return response.json();
    }
};

export const educationApi = {
    async createEducation(data: CreateEducationDto): Promise<Education> {
        const response = await fetch(`${API_URL}/api/education`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create education request');
        return response.json();
    },
    async getEducationRequests(page: number = 1, limit: number = 15, district?: string): Promise<PaginatedResponse<Education>> {
        let url = `${API_URL}/api/education?page=${page}&limit=${limit}`;
        if (district && district !== 'all') {
            url += `&district=${district}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch education requests');
        return response.json();
    }
};

export const transportApi = {
    async createTransport(data: CreateTransportDto): Promise<Transport> {
        const response = await fetch(`${API_URL}/api/transport`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create transport offer');
        return response.json();
    },
    async getTransportOffers(page: number = 1, limit: number = 15, district?: string): Promise<PaginatedResponse<Transport>> {
        let url = `${API_URL}/api/transport?page=${page}&limit=${limit}`;
        if (district && district !== 'all') {
            url += `&district=${district}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch transport offers');
        return response.json();
    }
};

export const volunteerApi = {
    async createVolunteer(data: CreateVolunteerDto): Promise<Volunteer> {
        const response = await fetch(`${API_URL}/api/volunteering`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create volunteer');
        return response.json();
    },
    async getVolunteers(page: number = 1, limit: number = 15, district?: string): Promise<PaginatedResponse<Volunteer>> {
        let url = `${API_URL}/api/volunteering?page=${page}&limit=${limit}`;
        if (district && district !== 'all') {
            url += `&district=${district}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch volunteers');
        return response.json();
    }
};
