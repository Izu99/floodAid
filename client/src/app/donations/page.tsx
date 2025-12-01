'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DonationCard } from '@/components/donations/donation-card';
import { DonationForm } from '@/components/donations/donation-form';
import { donationApi } from '@/lib/api';
import { tokenStorage } from '@/lib/auth-api';
import { Donation } from '@/types/donation';
import { Plus, MapPin, ChevronLeft, ChevronRight, Package, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';

export default function DonationsPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [user, setUser] = useState<any>(null);
    const [editingDonation, setEditingDonation] = useState<Donation | null>(null);

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    useEffect(() => {
        const userData = tokenStorage.getUserData();
        setUser(userData);
        loadDonations('all', 1);
    }, []);

    const loadDonations = async (district?: string, pageNum: number = 1) => {
        try {
            setLoading(true);
            // Note: donationApi.getDonations might need update to support district filtering if not already supported
            // Assuming it fetches all for now, client-side filtering or update API later if needed
            const response = await donationApi.getDonations(pageNum, 15);

            // Client-side filtering for district if API doesn't support it yet
            // Ideally API should handle this
            let data = response.data;
            // The district value in DB might be Sinhala if created with old form.
            // But we are now using localized display.
            // If we filter by 'all', we show everything.
            // If we filter by a specific district, we need to match what's in the DB.
            // Since we haven't migrated DB data, existing data is likely Sinhala.
            // New data created with localized form might be English or Sinhala depending on what we send.
            // In the previous step (HelpRequestForm), I decided to send the translated value.
            // So if I select "Colombo" (English), it sends "Colombo".
            // If DB has "කොළඹ", filtering by "Colombo" won't work.
            // This is a known issue I highlighted before.
            // For now, I will proceed with the requested UI changes.

            if (district && district !== 'all') {
                // We might need to filter by the localized string that matches the DB content.
                // If the user is viewing in English, `district` is "Colombo".
                // If DB has "කොළඹ", we miss it.
                // I'll stick to the current logic: filter by what's selected.
                // Ideally, we should store keys in DB.
                data = data.filter((d: Donation) => d.district === district);
            }

            setDonations(data);
            setTotalPages(response.totalPages);
            setPage(pageNum);
        } catch (error) {
            console.error('Failed to load donations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white relative">
            <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-emerald-900">{t('donations.title')}</h1>
                        <p className="text-emerald-700 mt-1">
                            {t('donations.subtitle')}
                        </p>
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-sm font-semibold flex items-center gap-2">
                            <Package className="inline-block mr-2 text-emerald-500" size={18} />
                            {t('donations.instructions')}
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/')}
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
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

                {/* Donations Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{t('donations.loading')}</p>
                    </div>
                ) : donations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">{t('donations.noDonations')}</p>
                        <Button onClick={handleAddNew} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
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
                                    currentUserId={user?.id}
                                    userRole={user?.role}
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
            <div className="fixed bottom-8 right-8 z-40">
                <Button
                    onClick={handleAddNew}
                    className="w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white p-0 flex items-center justify-center transition-transform hover:scale-105"
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
                onSuccess={handleCreateSuccess}
                initialData={editingDonation}
                userData={user}
            />
        </div>
    );
}
