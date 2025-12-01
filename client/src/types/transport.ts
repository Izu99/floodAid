export interface Transport {
    _id: string;
    name: string;
    phone: string;
    district: string;
    location: string;
    vehicleType: string;
    capacity: string;
    availability: string;
    additionalDetails?: string;
    status: 'available' | 'busy';
    createdAt: string;
    updatedAt: string;
}

export interface CreateTransportDto {
    name: string;
    phone: string;
    district: string;
    location: string;
    vehicleType: string;
    capacity: string;
    availability: string;
    additionalDetails?: string;
}
