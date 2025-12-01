'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ChevronLeft, GraduationCap, Phone, MapPin, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { educationApi } from '@/lib/api';
import { Education } from '@/types/education';
import { EducationForm } from '@/components/education/education-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EducationPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [requests, setRequests] = useState<Education[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [showBackToTop, setShowBackToTop] = useState(false);

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const response = await educationApi.getEducationRequests(1, 50, selectedDistrict);
            setRequests(response.data);
        } catch (error) {
            console.error('Failed to fetch education requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();

        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [selectedDistrict]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-12 relative">
            {/* Header */}
            <div className="bg-blue-900 text-white py-8 fixed top-0 left-0 right-0 z-30 shadow-md">
                <div className="max-w-6xl mx-auto px-4">
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-white hover:text-blue-900 mb-4 pl-2 pr-4 transition-colors"
                        onClick={() => router.push('/')}
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        {t('common.back')}
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{t('education.title')}</h1>
                        <p className="text-blue-200">{t('education.subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 pt-48">
                {/* Filters */}
                <div className="mb-8">
                    <div className="max-w-xs">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('common.filterByDistrict')}
                        </label>
                        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                            <SelectTrigger>
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
                ) : requests.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">{t('education.noRequests')}</h3>
                        <p className="text-gray-500 mb-6">{t('education.noRequestsDesc')}</p>
                        <Button onClick={() => setIsFormOpen(true)}>
                            {t('education.addFirstRequest')}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map((request) => (
                            <Card key={request._id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {t('education.card.badge')}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(request.createdAt).toLocaleDateString(t('common.dateLocale'))}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{request.name}</h3>

                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>{request.address}, {t(`districts.${request.district}`)}</span>
                                        </div>
                                        {request.school && (
                                            <div className="flex items-start gap-2">
                                                <GraduationCap className="w-4 h-4 mt-0.5 shrink-0" />
                                                <span>{request.school} {request.grade ? `(${request.grade})` : ''}</span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-2">
                                            <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>{request.contactPerson}: {request.phone}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="font-medium text-gray-900 mb-1">{t('education.card.needs')}:</p>
                                        <p className="text-gray-600 text-sm line-clamp-3">{request.needs}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
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
                    onClick={() => setIsFormOpen(true)}
                    className="w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white p-0 flex items-center justify-center transition-transform hover:scale-105"
                >
                    <Plus className="w-8 h-8" />
                </Button>
            </div>

            <EducationForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSuccess={fetchRequests}
            />
        </main>
    );
}
