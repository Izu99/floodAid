import { AuthResponse, RegisterDto, LoginDto } from '@/types/auth';
import { API_URL } from './config';
import { safeStorage } from './safe-storage';

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
        safeStorage.setItem('token', token);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-change'));
        }
    },
    getToken() {
        return safeStorage.getItem('token');
    },
    removeToken() {
        safeStorage.removeItem('token');
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-change'));
        }
    },
    setUserData(user: any) {
        safeStorage.setItem('user', JSON.stringify(user));
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-change'));
        }
    },
    getUserData() {
        const user = safeStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    removeUserData() {
        safeStorage.removeItem('user');
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-change'));
        }
    },
};
