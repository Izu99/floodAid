'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DonationCard } from '@/components/donations/donation-card';
import { DonationForm } from '@/components/donations/donation-form';
import { donationApi } from '@/lib/api';
import { Donation } from '@/types/donation';
import { Plus, MapPin, ChevronLeft, ChevronRight, Package, ArrowUp, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Header } from '@/components/layout/header';
import { useRouter } from 'next/navigation';

export default function DonationsPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    useEffect(() => {
        loadDonations('all', 1);

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

    const loadDonations = async (district?: string, pageNum: number = 1) => {
        try {
            setIsLoading(true);
            const response = await donationApi.getDonations(pageNum, 15);
            setDonations(response.data);
            setTotalPages(response.totalPages);
            setPage(pageNum);
        } catch (error) {
            console.error('Failed to load donations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = () => {
        loadDonations(selectedDistrict, 1);
        setEditingDonation(null);
    };

    const handleDistrictChange = (district: string) => {
        setSelectedDistrict(district);
        loadDonations(district, 1);
    };

    const handleEdit = (donation: Donation) => {
        setEditingDonation(donation);
        setShowForm(true);
    };

    const handleCollect = async (id: string) => {
        try {
            await donationApi.markAsCollected(id);
            loadDonations(selectedDistrict, page);
        } catch (error) {
            console.error('Error collecting donation:', error);
        }
    };

    const handleAddNew = () => {
        setEditingDonation(null);
        setShowForm(true);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50 relative pb-12">
            {/* Fixed Header */}
            <Header />

            {/* Page Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 mt-16">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-emerald-100 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm sm:text-base">{t('common.back')}</span>
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('donations.title')}</h1>
                    <p className="text-emerald-100 text-base sm:text-lg">{t('donations.subtitle')}</p>
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

                {/* Donations Grid */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{t('donations.loading')}</p>
                    </div>
                ) : donations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">{t('donations.noDonations')}</p>
                        <Button onClick={handleAddNew} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                            {t('common.add')} {t('donations.card.badge')}
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {donations.map((donation) => (
                                <DonationCard
                                    key={donation._id}
                                    donation={donation}
                                    currentUserId={undefined}
                                    userRole={undefined}
                                    onEdit={handleEdit}
                                    onCollect={handleCollect}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => loadDonations(selectedDistrict, page - 1)}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" /> {t('common.previous')}
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {t('common.page')} {page} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => loadDonations(selectedDistrict, page + 1)}
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
                    onClick={handleAddNew}
                    className="w-14 h-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white p-0 flex items-center justify-center transition-transform hover:scale-105"
                >
                    <Plus className="w-8 h-8" />
                </Button>
            </div>

            {/* Donation Form Dialog */}
            <DonationForm
                open={showForm}
                onOpenChange={(open) => {
                    setShowForm(open);
                    if (!open) setEditingDonation(null);
                }}
                onSuccess={handleSuccess}
                initialData={editingDonation}
                userData={undefined}
            />
        </div>
    );
}
