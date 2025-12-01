'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpRequestForm } from '@/components/help-requests/help-request-form';
import { HelpRequestCard } from '@/components/help-requests/help-request-card';
import { helpRequestApi } from '@/lib/help-request-api';
import { HelpRequest } from '@/types/help-request';
import { Plus, MapPin, ChevronLeft, ChevronRight, HeartHandshake, ArrowUp, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/layout/header';

export default function HelpRequestsPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [requests, setRequests] = useState<HelpRequest[]>([]);
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
        loadRequests('all', 1);

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

    const loadRequests = async (district?: string, pageNum: number = 1) => {
        try {
            setLoading(true);
            const districtParam = district === 'all' ? undefined : district;
            const response = await helpRequestApi.getHelpRequests(
                pageNum,
                15,
                districtParam
            );
            setRequests(response.data);
            setTotalPages(response.totalPages);
            setPage(pageNum);
        } catch (error) {
            console.error('Failed to load help requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        loadRequests(selectedDistrict, 1);
    };

    const handleDistrictChange = (district: string) => {
        setSelectedDistrict(district);
        loadRequests(district, 1);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50 relative pb-12">
            {/* Fixed Header */}
            <Header showBackButton={false} />

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-rose-800 to-rose-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 mt-16">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-rose-100 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm sm:text-base">{t('common.back')}</span>
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('helpRequests.title')}</h1>
                    <p className="text-rose-100 text-base sm:text-lg">{t('helpRequests.subtitle')}</p>
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

                {/* Help Requests Card Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{t('helpRequests.loading')}</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <HeartHandshake className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">{t('helpRequests.noRequests')}</p>
                        <Button onClick={() => setShowForm(true)} className="mt-4 bg-rose-600 hover:bg-rose-700 text-white">
                            {t('helpRequests.firstRequest')}
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {requests.map((request) => (
                                <HelpRequestCard key={request._id} request={request} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => loadRequests(selectedDistrict, page - 1)}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" /> {t('common.previous')}
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {t('common.page')} {page} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => loadRequests(selectedDistrict, page + 1)}
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
                    className="w-14 h-14 rounded-full shadow-lg bg-rose-600 hover:bg-rose-700 text-white p-0 flex items-center justify-center transition-transform hover:scale-105"
                >
                    <Plus className="w-8 h-8" />
                </Button>
            </div>

            {/* Help Request Form Dialog */}
            <HelpRequestForm
                open={showForm}
                onOpenChange={setShowForm}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
}
