'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpRequestForm } from '@/components/help-requests/help-request-form';
import { HelpRequestCard } from '@/components/help-requests/help-request-card';
import { helpRequestApi } from '@/lib/help-request-api';
import { HelpRequest } from '@/types/help-request';
import { Plus, MapPin, ChevronLeft, ChevronRight, HeartHandshake, ArrowUp, X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/layout/header';
import { getDistricts } from '@/lib/districts';

export default function HelpRequestsPage() {
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const { t, language } = useLanguage();

    useEffect(() => {
        loadRequests(selectedDistrict, selectedCategory, 1);

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

    const loadRequests = async (district: string, category: string, pageNum: number = 1) => {
        try {
            setLoading(true);
            const response = await helpRequestApi.getHelpRequests(
                pageNum,
                15,
                district === 'all' ? undefined : district,
                undefined, // status
                category === 'all' ? undefined : category
            );
            
            // Sort: pending requests first, fulfilled requests last
            const sortedRequests = response.data.sort((a, b) => {
                if (a.status === 'fulfilled' && b.status !== 'fulfilled') return 1;
                if (a.status !== 'fulfilled' && b.status === 'fulfilled') return -1;
                // If both same status, sort by date (newest first)
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            
            setRequests(sortedRequests);
            setTotalPages(response.totalPages);
            setPage(pageNum);
        } catch (error) {
            console.error('Failed to load help requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        loadRequests(selectedDistrict, selectedCategory, 1);
    };

    const handleDistrictChange = (district: string) => {
        setSelectedDistrict(district);
        loadRequests(district, selectedCategory, 1);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        loadRequests(selectedDistrict, category, 1);
    };

    const handleClearFilters = () => {
        setSelectedDistrict('all');
        setSelectedCategory('all');
        loadRequests('all', 'all', 1);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const districts = getDistricts(language);

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <Header />
            {/* Header Section */}
            <div className="bg-gradient-to-r from-red-800 to-red-700 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <button 
                        onClick={() => window.history.back()} 
                        className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
                    >
                        <ChevronLeft size={20} />
                        <span>{language === 'si' ? 'ආපසු' : 'Back'}</span>
                    </button>
                    <h1 className="text-3xl font-bold mb-2">{t('helpRequests.title')}</h1>
                    <p className="text-white/90">{t('helpRequests.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
                {/* Filters */}
                <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
                    {/* District Filter */}
                    <div className="w-full md:w-64">
                         <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder={t('common.selectDistrict')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('districts.all')}</SelectItem>
                                {districts.map((district) => (
                                    <SelectItem key={district.value} value={district.value}>
                                        {district.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Category Filter */}
                    <div className="w-full md:w-64">
                        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder={t('common.filterByCategory')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('helpRequests.categories.all')}</SelectItem>
                                {['food', 'education', 'shelter', 'transport', 'other'].map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {t(`helpRequests.categories.${category}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Clear Button */}
                    {(selectedDistrict !== 'all' || selectedCategory !== 'all') && (
                        <Button variant="ghost" onClick={handleClearFilters} className="text-sm">
                            <X size={16} className="mr-1" />
                            {t('common.clearFilters')}
                        </Button>
                    )}
                </div>

                {/* Requests Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{t('helpRequests.loading')}</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <HeartHandshake className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">{t('helpRequests.noRequests')}</p>
                        <Button onClick={() => setShowForm(true)} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                            {t('helpRequests.firstRequest')}
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {requests.map((request) => (
                                <HelpRequestCard 
                                    key={request._id} 
                                    request={request}
                                    onStatusUpdate={() => loadRequests(selectedDistrict, page)}
                                />
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

            {/* Floating Action Buttons */}
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
                    className="w-14 h-14 rounded-full shadow-lg bg-red-600 hover:bg-red-700 text-white p-0 flex items-center justify-center transition-transform hover:scale-105"
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
