'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationForm } from '@/components/donations/location-form';
import { LocationCard } from '@/components/donations/location-card';
import { locationApi } from '@/lib/location-api';
import { Location } from '@/types/location';
import { Plus, MapPin, ChevronLeft, ChevronRight, ArrowUp, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/layout/header';
import { useRouter } from 'next/navigation';

export default function LocationsPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
            setIsLoading(true);
            const response = await locationApi.getLocations(district === 'all' ? undefined : district, pageNum, 15);
            setLocations(response.data);
            setTotalPages(response.totalPages);
            setPage(pageNum);
        } catch (error) {
            console.error('Failed to load locations:', error);
        } finally {
            setIsLoading(false);
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
            {/* Fixed Header */}
            <Header showBackButton={false} />

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-sky-800 to-sky-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 mt-16">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-sky-100 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm sm:text-base">{t('common.back')}</span>
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('locations.title')}</h1>
                    <p className="text-sky-100 text-base sm:text-lg">{t('locations.subtitle')}</p>
                </div>
            </div>

            {/* Content with top padding */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                {isLoading ? (
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
