<<<<<<< HEAD
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
=======
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
>>>>>>> 618980a04255771618d8942af1bb77064c76a757
