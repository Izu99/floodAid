'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationForm } from '@/components/donations/location-form';
import { LocationCard } from '@/components/donations/location-card';
import { locationApi } from '@/lib/location-api';
import { tokenStorage } from '@/lib/auth-api';
import { Location } from '@/types/location';
import { Plus, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LocationsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('සියල්ල');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const DISTRICTS = [
        'සියල්ල', 'කොළඹ', 'ගම්පහ', 'කළුතර', 'මහනුවර', 'මාතලේ', 'නුවරඑළිය', 'ගාල්ල', 'මාතර', 'හම්බන්තොට',
        'යාපනය', 'කිලිනොච්චිය', 'මන්නාරම', 'වවුනියාව', 'මුලතිව්', 'මඩකලපුව', 'අම්පාර', 'ත්‍රිකුණාමලය',
        'කුරුණෑගල', 'පුත්තලම', 'අනුරාධපුරය', 'පොළොන්නරුව', 'බදුල්ල', ' මොණරාගල', 'රත්නපුර', 'කෑගල්ල'
    ];

    useEffect(() => {
        const userData = tokenStorage.getUserData();
        if (!userData) {
            router.push('/login');
            return;
        }
        setUser(userData);
        loadLocations('සියල්ල', 1);
    }, []);

    const loadLocations = async (district?: string, pageNum: number = 1) => {
        try {
            setLoading(true);
            const response = await locationApi.getLocations(district === 'සියල්ල' ? undefined : district, pageNum, 15);
            setLocations(response.data);
            setTotalPages(response.totalPages);
            setPage(pageNum);
        } catch (error) {
            console.error('Failed to load locations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLocation = async (data: any, images: File[]) => {
        try {
            await locationApi.createLocation(data, images);
            loadLocations(selectedDistrict);
        } catch (error: any) {
            alert(error.message || 'ස්ථානය එක් කිරීමට නොහැකි විය');
            throw error;
        }
    };

    const handleDistrictChange = (district: string) => {
        setSelectedDistrict(district);
        loadLocations(district, 1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">ආධාර එකතු කරන ස්ථාන</h1>
                        <p className="text-gray-600 mt-1">
                            {user?.role === 'collector'
                                ? 'ඔබ ආධාර එකතු කරන ස්ථාන කළමනාකරණය කරන්න'
                                : 'ඔබගේ ආධාර භාර දිය හැකි ස්ථාන සොයන්න'}
                        </p>
                    </div>
                    {user?.role === 'collector' && (
                        <Button onClick={() => setShowForm(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            නව ස්ථානයක්
                        </Button>
                    )}
                </div>

                {/* Filter by District */}
                <div className="mb-6 flex items-center gap-4">
                    <MapPin className="text-gray-500" />
                    <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                        <SelectTrigger className="w-64 bg-white">
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

                {/* Locations Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">තොරතුරු ලබා ගනිමින්...</p>
                    </div>
                ) : locations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">ප්‍රදේශ කිසිවක් හමු නොවීය</p>
                        {user?.role === 'collector' && (
                            <Button onClick={() => setShowForm(true)} className="mt-4">
                                පළමු ස්ථානය එක් කරන්න
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {locations.map((location) => (
                                <LocationCard key={location._id} location={location} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => loadLocations(selectedDistrict, page - 1)}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" /> පෙර
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    පිටුව {page} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => loadLocations(selectedDistrict, page + 1)}
                                    disabled={page === totalPages}
                                >
                                    ඊළඟ <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Location Form Dialog */}
            {user?.role === 'collector' && (
                <LocationForm
                    open={showForm}
                    onOpenChange={setShowForm}
                    onSubmit={handleCreateLocation}
                />
            )}
        </div>
    );
}
