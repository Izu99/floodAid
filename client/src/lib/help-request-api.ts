import { API_URL } from './config';
import { HelpRequest, CreateHelpRequestDto } from '@/types/help-request';

export const helpRequestApi = {
    // Create a new help request (no auth required)
    async createHelpRequest(data: CreateHelpRequestDto): Promise<HelpRequest> {
        const response = await fetch(`${API_URL}/api/help-requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create help request');
        }

        const result = await response.json();
        return result.data;
    },

    // Get all help requests (no auth required)
    async getHelpRequests(
        page: number = 1,
        limit: number = 15,
        district?: string,
        status?: string,
        category?: string
    ): Promise<{
        data: HelpRequest[];
        currentPage: number;
        totalPages: number;
        totalRequests: number;
    }> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (status) {
            params.append('status', status);
        }

        if (category) {
            params.append('category', category);
        }

        if (district) {
            params.append('district', district);
        }

        const response = await fetch(`${API_URL}/api/help-requests?${params}`);

        if (!response.ok) {
            throw new Error('Failed to fetch help requests');
        }

        return response.json();
    },

    // Update help request status
    async updateHelpRequestStatus(id: string, status: 'pending' | 'in-progress' | 'fulfilled'): Promise<HelpRequest> {
        const response = await fetch(`${API_URL}/api/help-requests/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update help request status');
        }

        const result = await response.json();
        return result.data;
    },
};
