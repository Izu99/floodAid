export interface Donation {
    id: string;
    name: string;
    phone: string;
    address: string;
    items: string;
    note?: string;
    collected: boolean;
    createdAt: string;
}

export interface CreateDonationDto {
    name: string;
    phone: string;
    address: string;
    items: string;
    note?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
