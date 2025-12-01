export interface Volunteer {
    _id: string;
    name: string;
    phone: string;
    district: string;
    skills: string;
    availability: string;
    additionalDetails?: string;
    status: 'available' | 'busy';
    createdAt: string;
    updatedAt: string;
}

export interface CreateVolunteerDto {
    name: string;
    phone: string;
    district: string;
    skills: string;
    availability: string;
    additionalDetails?: string;
}
