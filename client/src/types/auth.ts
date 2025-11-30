export interface User {
    _id: string;
    name: string;
    phone: string;
    role: 'donor' | 'collector';
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        phone: string;
        role: 'donor' | 'collector';
    };
}

export interface RegisterDto {
    name: string;
    phone: string;
    password: string;
    role: 'donor' | 'collector';
}

export interface LoginDto {
    phone: string;
    password: string;
}
