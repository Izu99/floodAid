'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, GraduationCap, Phone, MapPin, ArrowUp, ArrowLeft, BookOpen, HandHeart } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { educationApi } from '@/lib/api';
import { helpRequestApi } from '@/lib/help-request-api';
import { Education } from '@/types/education';
import { HelpRequest } from '@/types/help-request';
import { EducationForm } from '@/components/education/education-form';
import { HelpRequestForm } from '@/components/help-requests/help-request-form';
import { HelpRequestCard } from '@/components/help-requests/help-request-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from '@/components/ui/dialog';

export default function EducationPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [educationRequests, setEducationRequests] = useState<Education[]>([]);
    const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEducationFormOpen, setIsEducationFormOpen] = useState(false);
    const [isHelpRequestFormOpen, setIsHelpRequestFormOpen] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [activeTab, setActiveTab] = useState<'requests' | 'offers'>('requests');

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    useEffect(() => {
        loadData(selectedDistrict);

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

    const loadData = async (district: string) => {
        try {
            setIsLoading(true);
            const districtParam = district === 'all' ? undefined : district;

            // Load Education Support (Offers)
            const eduResponse = await educationApi.getEducationRequests(1, 100, districtParam);
            setEducationRequests(eduResponse.data);

            // Load Help Requests (Category: Education)
            const helpResponse = await helpRequestApi.getHelpRequests(1, 100, districtParam, undefined, 'education');
            
            // Sort: pending requests first, fulfilled requests last
            const sortedHelpRequests = helpResponse.data.sort((a, b) => {
                if (a.status === 'fulfilled' && b.status !== 'fulfilled') return 1;
                if (a.status !== 'fulfilled' && b.status === 'fulfilled') return -1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            setHelpRequests(sortedHelpRequests);

        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDistrictChange = (district: string) => {
        setSelectedDistrict(district);
        loadData(district);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFabClick = () => {
        if (activeTab === 'requests') {
            setIsHelpRequestFormOpen(true);
        } else {
            setIsEducationFormOpen(true);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-12 relative">
            {/* Fixed Header */}
            <Header />

            {/* Page Header */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm sm:text-base">{t('common.back')}</span>
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-2">
                        {activeTab === 'requests' ? t('education.requestsTabTitle') : t('education.offersTabTitle')}
                        {!isLoading && activeTab === 'requests' && helpRequests.length > 0 && (
                            <span className="text-xl font-semibold px-3 py-1 bg-blue-600 rounded-full">{helpRequests.length}</span>
                        )}
                        {!isLoading && activeTab === 'offers' && educationRequests.length > 0 && (
                            <span className="text-xl font-semibold px-3 py-1 bg-blue-600 rounded-full">{educationRequests.length}</span>
                        )}
                    </h1>
                    <p className="text-blue-100 text-base sm:text-lg">
                        {activeTab === 'requests' ? t('education.tabs.requests') : t('education.tabs.offers')}
                    </p>
                </div>
            </div>

            {/* Content with top padding */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Controls Section: Tabs & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    {/* Custom Tabs */}
                    <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'requests'
                                ? 'bg-blue-100 text-blue-700 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <HandHeart className="w-4 h-4" />
                            {t('education.tabs.requests')}
                        </button>
                        <button
                            onClick={() => setActiveTab('offers')}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'offers'
                                ? 'bg-blue-100 text-blue-700 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            {t('education.tabs.offers')}
                        </button>
                    </div>

                    {/* District Filter */}
                    <div className="w-full md:w-64">
                        <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder={t('common.selectDistrict')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('districts.all')}</SelectItem>
                                {DISTRICTS.map((d) => (
                                    <SelectItem key={d} value={d}>
                                        {t(`districts.${d}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                        <p className="text-gray-500">{t('common.loading')}</p>
                    </div>
                ) : (
                    <>
                        {/* Help Requests Tab Content */}
                        {activeTab === 'requests' && (
                            helpRequests.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <HandHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">{t('helpRequests.noRequests')}</h3>
                                    <p className="text-gray-500 mb-6">{t('helpRequests.firstRequest')}</p>
                                    <Button onClick={() => setIsHelpRequestFormOpen(true)}>
                                        {t('common.add')}
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {helpRequests.map((request) => (
                                        <div key={request._id} className="h-full">
                                            <HelpRequestCard
                                                request={request}
                                                onStatusUpdate={() => loadData(selectedDistrict)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )
                        )}

                        {activeTab === 'offers' && (
                            educationRequests.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">{t('education.offers.noOffers')}</h3>
                                    <p className="text-gray-500 mb-6">{t('education.offers.noOffersDesc')}</p>
                                    <Button onClick={() => setIsEducationFormOpen(true)}>
                                        {t('education.offers.addFirstOffer')}
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {educationRequests.map((request) => (
                                        <Card key={request._id} className="hover:shadow-md transition-shadow h-full flex flex-col">
                                            <CardContent className="p-6 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {t('education.card.badge')}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(request.createdAt).toLocaleDateString(t('common.dateLocale'))}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{request.name}</h3>

                                                <div className="space-y-3 text-sm text-gray-600 flex-1">
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                                        <span className="line-clamp-1">{request.address}, {t(`districts.${request.district}`)}</span>
                                                    </div>
                                                    {request.school && (
                                                        <div className="flex items-start gap-2">
                                                            <GraduationCap className="w-4 h-4 mt-0.5 shrink-0" />
                                                            <span className="line-clamp-1">{request.school} {request.grade ? `(${request.grade})` : ''}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-start gap-2">
                                                        <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                                                        <span>{request.contactPerson}: {request.phone}</span>
                                                    </div>
                                                
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <p className="font-medium text-gray-900 mb-1">{t('education.card.needs')}:</p>
                                                        <p className="text-gray-600 text-sm line-clamp-3">{request.needs}</p>
                                                    </div>
                                                </div>

                                                {(request.name.length > 50 || request.address.length > 50 || (request.school && request.school.length > 50) || request.needs.length > 150) && (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="link" className="p-0 h-auto text-xs mt-2 text-blue-600 hover:text-blue-800 self-start">
                                                                {t('common.readMore')}
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>{t('education.card.dialog.title', { name: request.name })}</DialogTitle>
                                                                <DialogDescription>
                                                                    {request.address}, {t(`districts.${request.district}`)}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="py-4 max-h-[60vh] overflow-y-auto">
                                                                <h4 className="text-sm font-semibold mb-1">{t('education.card.dialog.needs')}</h4>
                                                                <p className="text-sm whitespace-pre-wrap">{request.needs}</p>
                                                            </div>
                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button type="button">{t('common.close')}</Button>
                                                                </DialogClose>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )
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
                    onClick={handleFabClick}
                    className="w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white p-0 flex items-center justify-center transition-transform hover:scale-105"
                >
                    <Plus className="w-8 h-8" />
                </Button>
            </div>

            <EducationForm
                open={isEducationFormOpen}
                onOpenChange={setIsEducationFormOpen}
                onSuccess={() => {
                    setIsEducationFormOpen(false);
                    loadData(selectedDistrict);
                }}
            />

            <HelpRequestForm
                open={isHelpRequestFormOpen}
                onOpenChange={setIsHelpRequestFormOpen}
                onSuccess={() => {
                    setIsHelpRequestFormOpen(false);
                    loadData(selectedDistrict);
                }}
            />
        </main>
    );
}
