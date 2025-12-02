export interface HelpRequest {
    _id: string;
    name: string;
    phone: string;
    additionalPhone?: string;
    district: string;
    address: string;
    category: 'food' | 'education' | 'shelter' | 'transport' | 'other';
    helpDescription: string;
    additionalDetails?: string;
    status: 'pending' | 'in-progress' | 'fulfilled';
    createdAt: string;
    updatedAt: string;
}

export interface CreateHelpRequestDto {
    name: string;
    phone: string;
    additionalPhone?: string;
    district: string;
    address: string;
    category: 'food' | 'education' | 'shelter' | 'transport' | 'other';
    helpDescription: string;
    additionalDetails?: string;
}
