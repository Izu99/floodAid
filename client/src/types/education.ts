export interface Education {
    _id: string;
    name: string;
    contactPerson: string;
    phone: string;
    district: string;
    address: string;
    school?: string;
    grade?: string;
    needs: string;
    additionalDetails?: string;
    status: 'pending' | 'fulfilled';
    createdAt: string;
    updatedAt: string;
}

export interface CreateEducationDto {
    name: string;
    contactPerson: string;
    phone: string;
    district: string;
    address: string;
    school?: string;
    grade?: string;
    needs: string;
    additionalDetails?: string;
}
