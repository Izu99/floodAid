import { AuthResponse, RegisterDto, LoginDto } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const authApi = {
    async register(data: RegisterDto, faceImage?: File): Promise<AuthResponse> {
        console.log('📤 Frontend: Sending registration request');
        console.log('Data:', { ...data, password: '***' });
        console.log('Face image:', faceImage ? `${faceImage.name} (${faceImage.size} bytes)` : 'None');

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('phone', data.phone);
        formData.append('password', data.password);
        formData.append('role', data.role);

        if (faceImage) {
            formData.append('faceImage', faceImage);
        }

        console.log('🌐 Sending to:', `${API_URL}/auth/register`);
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            body: formData,
        });

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Registration error:', error);
            throw new Error(error.error || 'Registration failed');
        }

        const result = await response.json();
        console.log('✅ Registration successful:', result);
        return result;
    },

    async login(data: LoginDto): Promise<AuthResponse> {
        console.log('📤 Frontend: Sending login request');
        console.log('Phone:', data.phone);

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Login error:', error);
            throw new Error(error.error || 'Login failed');
        }

        const result = await response.json();
        console.log('✅ Login successful');
        return result;
    },
    async updateProfile(data: any) {
        const token = tokenStorage.getToken();
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update profile');
        return response.json();
    },
    async getProfile() {
        const token = tokenStorage.getToken();
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    },
    async getCollectors(district?: string) {
        const token = tokenStorage.getToken();
        const url = district
            ? `${API_URL}/auth/collectors?district=${encodeURIComponent(district)}`
            : `${API_URL}/auth/collectors`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch collectors');
        return response.json();
    },
    async uploadLocationImage(file: File) {
        const token = tokenStorage.getToken();
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/auth/upload-location-image`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload image');
        return response.json();
    },

    async deleteLocationImage(filename: string) {
        const token = tokenStorage.getToken();
        const response = await fetch(`${API_URL}/images/location-image/${filename}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete image');
        return response.json();
    },
};

export const tokenStorage = {
    setToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            window.dispatchEvent(new Event('auth-change'));
        }
    },
    getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },
    removeToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.dispatchEvent(new Event('auth-change'));
        }
    },
    setUserData(user: any) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
            window.dispatchEvent(new Event('auth-change'));
        }
    },
    getUserData() {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },
    removeUserData() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('auth-change'));
        }
    },
};
