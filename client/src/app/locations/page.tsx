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
import { useLanguage } from '@/lib/LanguageContext';

export default function LocationsPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    useEffect(() => {
        loadLocations('all', 1);
    }, []);

    const loadLocations = async (district?: string, pageNum: number = 1) => {
        try {
            setLoading(true);
            const response = await locationApi.getLocations(district === 'all' ? undefined : district, pageNum, 15);
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
            alert(error.message || t('common.error'));
            throw error;
        }
    };

    const handleDistrictChange = (district: string) => {
        setSelectedDistrict(district);
        loadLocations(district, 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
            <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-sky-900">{t('locations.title')}</h1>
                        <p className="text-sky-700 mt-1">
                            {t('locations.subtitle')}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/')}
                        className="border-sky-300 text-sky-700 hover:bg-sky-50"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        {t('common.back')}
                    </Button>
                </div>

                {/* Filter by District */}
                <div className="mb-6 flex items-center gap-4">
                    <MapPin className="text-gray-500" />
                    <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                        <SelectTrigger className="w-64 bg-white">
                            <SelectValue placeholder={t('districts.all')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('districts.all')}</SelectItem>
                            {DISTRICTS.map((districtKey) => (
                                <SelectItem key={districtKey} value={t(`districts.${districtKey}`)}>
                                    {t(`districts.${districtKey}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Locations Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{t('locations.loading')}</p>
                    </div>
                ) : locations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">{t('locations.noLocations')}</p>
                        <Button onClick={() => setShowForm(true)} className="mt-4">
                            {t('common.add')}
                        </Button>
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
                                    <ChevronLeft className="w-4 h-4 mr-1" /> {t('common.previous')}
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {t('common.page')} {page} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => loadLocations(selectedDistrict, page + 1)}
                                    disabled={page === totalPages}
                                >
                                    {t('common.next')} <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-8 right-8 z-40">
                <Button
                    onClick={() => setShowForm(true)}
                    className="w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white p-0 flex items-center justify-center transition-transform hover:scale-105"
                >
                    <Plus className="w-8 h-8" />
                </Button>
            </div>

            {/* Location Form Dialog */}
            <LocationForm
                open={showForm}
                onOpenChange={setShowForm}
                onSubmit={handleCreateLocation}
            />
        </div>
    );
}
