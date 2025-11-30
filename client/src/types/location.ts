export interface Location {
    _id: string;
    name: string;
    district: string;
    address: string;
    description: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    images: string[];
    collector?: {
        _id: string;
        name: string;
        phone: string;
        faceImage?: string;
        occupation?: string;
    };
    contactName?: string;
    contactPhone?: string;
    contactImage?: string;
    additionalPhone?: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface CreateLocationDto {
    name: string;
    district: string;
    address: string;
    description: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    contactName?: string;
    contactPhone?: string;
    contactImage?: string;
    additionalPhone?: string;
}
