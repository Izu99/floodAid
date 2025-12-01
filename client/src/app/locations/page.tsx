'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationForm } from '@/components/donations/location-form';
import { LocationCard } from '@/components/donations/location-card';
import { locationApi } from '@/lib/location-api';
import { Location } from '@/types/location';
import { Plus, MapPin, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function LocationsPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    useEffect(() => {
        loadLocations('all', 1);

        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50 relative pb-12">
            {/* Header */}
            <div className="bg-sky-900 text-white py-8 fixed top-0 left-0 right-0 z-30 shadow-md">
                <div className="max-w-7xl mx-auto px-4">
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-white hover:text-sky-900 mb-4 pl-2 pr-4 transition-colors"
                        onClick={() => router.push('/')}
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        {t('common.back')}
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{t('locations.title')}</h1>
                        <p className="text-sky-200">{t('locations.subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 pt-48">
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
                        <Button onClick={() => setShowForm(true)} className="mt-4 bg-sky-600 hover:bg-sky-700 text-white">
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
            <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
                {showBackToTop && (
                    <Button
                        onClick={scrollToTop}
                        className="w-10 h-10 rounded-full shadow-lg bg-gray-600 hover:bg-gray-700 text-white p-0 flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                    >
                        <ArrowUp className="w-6 h-6" />
                    </Button>
                )}
                <Button
                    onClick={() => setShowForm(true)}
                    className="w-14 h-14 rounded-full shadow-lg bg-sky-600 hover:bg-sky-700 text-white p-0 flex items-center justify-center transition-transform hover:scale-105"
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
