'use client';    

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authApi, tokenStorage } from '@/lib/auth-api';
import { API_URL, BASE_URL } from '@/lib/config';

const DISTRICTS = [
    'කොළඹ', 'ගම්පහ', 'කළුතර', 'මහනුවර', 'මාතලේ', 'නුවරඑළිය', 'ගාල්ල', 'මාතර', 'හම්බන්තොට',
    'යාපනය', 'කිලිනොච්චිය', 'මන්නාරම', 'වවුනියාව', 'මුලතිව්', 'මඩකලපුව', 'අම්පාර', 'ත්‍රිකුණාමලය',
    'කුරුණෑගල', 'පුත්තලම', 'අනුරාධපුරය', 'පොළොන්නරුව', 'බදුල්ල', ' මොණරාගල', 'රත්නපුර', 'කෑගල්ල'
];

interface Location {
    district: string;
    address: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    images?: string[];
}

export default function CollectorProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [occupation, setOccupation] = useState('');
    const [locations, setLocations] = useState<Location[]>([{ district: '', address: '', startDate: '', endDate: '', startTime: '', endTime: '', images: [] }]);

    useEffect(() => {
        const loadProfile = async () => {
            const token = tokenStorage.getToken();
            if (!token) {
                router.push('/');
                return;
            }

            try {
                // First check local storage for role
                const localUserData = tokenStorage.getUserData();
                if (localUserData && localUserData.role !== 'collector') {
                    router.push('/');
                    return;
                }

                // Fetch fresh data from server
                const response = await authApi.getProfile();
                const userData = response.user;

                setUser(userData);
                if (userData.occupation) setOccupation(userData.occupation);
                if (userData.locations && userData.locations.length > 0) {
                    setLocations(userData.locations);
                }

                // Update local storage to keep it in sync
                tokenStorage.setUserData(userData);
            } catch (error) {
                console.error('Failed to load profile:', error);
                // Fallback to local storage if API fails
                const userData = tokenStorage.getUserData();
                if (userData) {
                    setUser(userData);
                    if (userData.occupation) setOccupation(userData.occupation);
                    if (userData.locations && userData.locations.length > 0) setLocations(userData.locations);
                }
            }
        };

        loadProfile();
    }, []);

    const handleAddLocation = () => {
        setLocations([...locations, { district: '', address: '', startDate: '', endDate: '', startTime: '', endTime: '', images: [] }]);
    };

    const handleRemoveLocation = (index: number) => {
        const newLocations = locations.filter((_, i) => i !== index);
        setLocations(newLocations);
    };

    const handleLocationChange = (index: number, field: keyof Location, value: string) => {
        const newLocations = [...locations];
        if (field === 'district' || field === 'address' || field === 'startDate' || field === 'endDate' || field === 'startTime' || field === 'endTime') {
            newLocations[index][field] = value;
        }
        setLocations(newLocations);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Filter out empty locations
            const validLocations = locations.filter(loc => loc.district && loc.address);

            const response = await authApi.updateProfile({
                occupation,
                locations: validLocations
            });

            // Update local storage
            const updatedUser = { ...user, ...response.user };
            tokenStorage.setUserData(updatedUser);
            setUser(updatedUser);

            router.push('/');
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">එකතුකරන්නාගේ විස්තර</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info (Read Only) */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <Label className="text-gray-500">නම</Label>
                            <p className="font-medium">{user?.name}</p>
                        </div>
                        <div>
                            <Label className="text-gray-500">දුරකථන අංකය</Label>
                            <p className="font-medium">{user?.phone}</p>
                        </div>
                        {user?.faceImage && (
                            <div className="col-span-2 mt-2">
                                <Label className="text-gray-500 mb-2 block">ඔබගේ ඡායාරූපය</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                                        <img
                                            src={`${BASE_URL}/uploads/faces/${user.faceImage}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <label className="cursor-pointer">
                                            <div className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                                                ඡායාරූපය වෙනස් කරන්න
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    try {
                                                        setLoading(true);
                                                        // Upload new face image
                                                        const formData = new FormData();
                                                        formData.append('faceImage', file);

                                                        const token = tokenStorage.getToken();
                                                        const response = await fetch(`${API_URL}/auth/update-face-image`, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Authorization': `Bearer ${token}`
                                                            },
                                                            body: formData
                                                        });

                                                        if (!response.ok) throw new Error('Failed to update image');
                                                        const data = await response.json();

                                                        // Update local user data
                                                        const updatedUser = { ...user, faceImage: data.faceImage };
                                                        setUser(updatedUser);
                                                        tokenStorage.setUserData(updatedUser);
                                                    } catch (error) {
                                                        console.error('Failed to update face image:', error);
                                                        alert('ඡායාරූපය යාවත්කාලීන කිරීම අසාර්ථකයි');
                                                    } finally {
                                                        setLoading(false);
                                                    }
                                                }}
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">JPG, PNG (උපරිම 100MB)</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Occupation */}
                    <div>
                        <Label htmlFor="occupation">රැකියාව / ආයතනය</Label>
                        <Input
                            id="occupation"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            placeholder="උදා: රජයේ සේවක / ස්වයං රැකියා"
                            className="mt-1"
                        />
                    </div>

                    {/* Locations */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>එකතු කරන ප්‍රදේශ</Label>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddLocation}>
                                <Plus className="w-4 h-4 mr-1" /> ප්‍රදේශයක් එක් කරන්න
                            </Button>
                        </div>

                        {locations.map((location, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3 relative bg-gray-50">
                                {locations.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveLocation(index)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>දිස්ත්‍රික්කය</Label>
                                        <Select
                                            value={location.district}
                                            onValueChange={(value) => handleLocationChange(index, 'district', value)}
                                        >
                                            <SelectTrigger className="mt-1 bg-white">
                                                <SelectValue placeholder="දිස්ත්‍රික්කය තෝරන්න" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DISTRICTS.map((district) => (
                                                    <SelectItem key={district} value={district}>
                                                        {district}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>ලිපිනය / ප්‍රදේශය</Label>
                                        <Input
                                            value={location.address}
                                            onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                                            placeholder="උදා: මාතර නගරය"
                                            className="mt-1 bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>ආරම්භක දිනය</Label>
                                        <Input
                                            type="date"
                                            value={location.startDate || ''}
                                            onChange={(e) => handleLocationChange(index, 'startDate', e.target.value)}
                                            className="mt-1 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <Label>අවසාන දිනය</Label>
                                        <Input
                                            type="date"
                                            value={location.endDate || ''}
                                            onChange={(e) => handleLocationChange(index, 'endDate', e.target.value)}
                                            className="mt-1 bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>ආරම්භක වේලාව</Label>
                                        <Input
                                            type="time"
                                            value={location.startTime || ''}
                                            onChange={(e) => handleLocationChange(index, 'startTime', e.target.value)}
                                            className="mt-1 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <Label>අවසාන වේලාව</Label>
                                        <Input
                                            type="time"
                                            value={location.endTime || ''}
                                            onChange={(e) => handleLocationChange(index, 'endTime', e.target.value)}
                                            className="mt-1 bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Location Images */}
                                <div className="mt-4">
                                    <Label className="text-sm text-gray-600 mb-2 block">ස්ථානයේ ඡායාරූප (උපරිම 5)</Label>
                                    <div className="flex flex-wrap gap-3">
                                        {location.images?.map((img, imgIndex) => (
                                            <div key={imgIndex} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                                <img
                                                    src={`${BASE_URL}/uploads/locations/${img}`}
                                                    alt={`Location ${index + 1} Image ${imgIndex + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        try {
                                                            setLoading(true);
                                                            const newLocations = [...locations];
                                                            const filename = newLocations[index].images![imgIndex];
                                                            await authApi.deleteLocationImage(filename);
                                                            newLocations[index].images = newLocations[index].images?.filter((_, i) => i !== imgIndex);
                                                            setLocations(newLocations);
                                                        } catch (error) {
                                                            console.error('Failed to delete image:', error);
                                                            alert('Failed to delete image');
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }}
                                                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}

                                        {(!location.images || location.images.length < 5) && (
                                            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                <Plus className="w-6 h-6 text-gray-400" />
                                                <span className="text-xs text-gray-500 mt-1">එක් කරන්න</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        try {
                                                            setLoading(true);
                                                            const response = await authApi.uploadLocationImage(file);
                                                            const newLocations = [...locations];
                                                            if (!newLocations[index].images) newLocations[index].images = [];
                                                            newLocations[index].images.push(response.filename);
                                                            setLocations(newLocations);
                                                        } catch (error) {
                                                            console.error('Failed to upload image:', error);
                                                        } finally {
                                                            setLoading(false);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'සුරකිමින්...' : 'තොරතුරු සුරකින්න'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
