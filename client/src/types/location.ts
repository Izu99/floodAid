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
    collector: {
        _id: string;
        name: string;
        phone: string;
        faceImage?: string;
        occupation?: string;
    };
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
}
