export interface Donation {
    _id: string;
    name: string;
    phone: string;
    address: string;
    district?: string;
    items: string;
    description: string;
    urgency?: 'low' | 'medium' | 'high';
    availableUntil?: string;
    collectedBy?: string;
    status: 'available' | 'collected';
    donor: string;
    createdAt: string;
}

export interface CreateDonationDto {
    name: string;
    phone: string;
    address: string;
    district: string;
    items: string;
    description?: string;
    urgency?: 'low' | 'medium' | 'high';
    availableUntil?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
