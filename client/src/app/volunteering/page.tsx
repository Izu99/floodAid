'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, HandHeart, Phone, MapPin, ArrowUp, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { volunteerApi } from '@/lib/api';
import { Volunteer } from '@/types/volunteer';
import { VolunteerForm } from '@/components/volunteering/volunteer-form';
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

export default function VolunteeringPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [registrations, setRegistrations] = useState<Volunteer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [showBackToTop, setShowBackToTop] = useState(false);

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    useEffect(() => {
        loadRegistrations('all');

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

    const loadRegistrations = async (district?: string) => {
        try {
            setIsLoading(true);
            const districtParam = district === 'all' ? undefined : district;
            const response = await volunteerApi.getVolunteers(1, 100, districtParam);
            setRegistrations(response.data);
        } catch (error) {
            console.error('Failed to load volunteer registrations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = () => {
        setIsFormOpen(false);
        loadRegistrations(selectedDistrict);
    };

    const handleDistrictChange = (district: string) => {
        setSelectedDistrict(district);
        loadRegistrations(district);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-12 relative">
            {/* Fixed Header */}
            <Header />

            {/* Page Header */}
            <div className="bg-gradient-to-r from-orange-800 to-orange-700 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-orange-100 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm sm:text-base">{t('common.back')}</span>
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-2">
                        {t('volunteer.title')}
                        {!isLoading && registrations.length > 0 && (
                            <span className="text-xl font-semibold px-3 py-1 bg-orange-600 rounded-full">{registrations.length}</span>
                        )}
                    </h1>
                    <p className="text-orange-100 text-base sm:text-lg">{t('volunteer.subtitle')}</p>
                </div>
            </div>

            {/* Content with top padding */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-900 mx-auto mb-4"></div>
                        <p className="text-gray-500">{t('common.loading')}</p>
                    </div>
                ) : registrations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                        <HandHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">{t('volunteer.noVolunteers')}</h3>
                        <p className="text-gray-500 mb-6">{t('volunteer.noVolunteersDesc')}</p>
                        <Button onClick={() => setIsFormOpen(true)} className="bg-orange-600 hover:bg-orange-700">
                            {t('volunteer.addFirstVolunteer')}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {registrations.map((volunteer) => (
                            <Card key={volunteer._id} className="hover:shadow-md transition-shadow flex flex-col">
                                <CardContent className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${volunteer.status === 'available' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {t(`volunteer.status.${volunteer.status}`)}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(volunteer.createdAt).toLocaleDateString(t('common.dateLocale'))}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{volunteer.name}</h3>

                                    <div className="space-y-3 text-sm text-gray-600 flex-1">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>{t(`districts.${volunteer.district}`)}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>{volunteer.phone}</span>
                                        </div>
                                    
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="font-medium text-gray-900 mb-1">{t('volunteer.card.skills')}:</p>
                                            <p className="text-gray-600 text-sm line-clamp-2">{volunteer.skills}</p>
                                        </div>
                                        <div className="mt-2">
                                            <p className="font-medium text-gray-900 mb-1">{t('volunteer.card.availability')}:</p>
                                            <p className="text-gray-600 text-sm line-clamp-2">{volunteer.availability}</p>
                                        </div>
                                    </div>

                                    {(volunteer.name.length > 50 || t(`districts.${volunteer.district}`).length > 50 || volunteer.phone.length > 50 || volunteer.skills.length > 100 || volunteer.availability.length > 100) && (
                                         <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="link" className="p-0 h-auto text-xs mt-2 text-blue-600 hover:text-blue-800 self-start">
                                                    {t('common.readMore')}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{volunteer.name}</DialogTitle>
                                                    <DialogDescription>
                                                        {t(`districts.${volunteer.district}`)}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4 max-h-[60vh] overflow-y-auto space-y-4">
                                                    <div>
                                                        <h4 className="text-sm font-semibold mb-1">Skills</h4>
                                                        <p className="text-sm whitespace-pre-wrap">{volunteer.skills}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold mb-1">Availability</h4>
                                                        <p className="text-sm whitespace-pre-wrap">{volunteer.availability}</p>
                                                    </div>
                                                    {volunteer.additionalDetails && (
                                                         <div>
                                                            <h4 className="text-sm font-semibold mb-1">Additional Details</h4>
                                                            <p className="text-sm whitespace-pre-wrap">{volunteer.additionalDetails}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="button">Close</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
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
                    className="w-14 h-14 rounded-full shadow-lg bg-orange-600 hover:bg-orange-700 text-white p-0 flex items-center justify-center transition-transform hover:scale-105"
                >
                    <Plus className="w-8 h-8" />
                </Button>
            </div>

            <VolunteerForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSuccess={handleSuccess}
            />
        </main>
    );
}
