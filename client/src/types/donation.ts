export interface Donation {
    _id: string;
    name: string;
    phone: string;
    address: string;
    items: string;
    description: string;
    status: 'available' | 'collected';
    collectedBy?: string;
    donor: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDonationDto {
    name: string;
    phone: string;
    address: string;
    items: string;
    description?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
