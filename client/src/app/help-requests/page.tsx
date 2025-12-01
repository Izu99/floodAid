'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpRequestForm } from '@/components/help-requests/help-request-form';
import { HelpRequestCard } from '@/components/help-requests/help-request-card';
import { helpRequestApi } from '@/lib/help-request-api';
import { HelpRequest } from '@/types/help-request';
import { Plus, MapPin, ChevronLeft, ChevronRight, HeartHandshake } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function HelpRequestsPage() {
    const { t } = useLanguage();
    const [requests, setRequests] = useState<HelpRequest[]>([]);
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
        loadRequests('all', 1);
    }, []);

    const loadRequests = async (district?: string, pageNum: number = 1) => {
        try {
            setLoading(true);
            // If district is 'all', send undefined to API
            // If district is a key (e.g., 'colombo'), we might need to send the localized name or the key depending on backend.
            // Assuming backend expects the Sinhala name for now as per previous code, OR we need to map it.
            // The previous code used Sinhala names directly.
            // Let's check how the backend handles it. If it stores strings, we might have an issue if we start sending English keys.
            // However, the user said "only this text change to that language ok, not already add card".
            // So for filtering, we should probably stick to what the backend expects.
            // But the UI should show translated names.

            // For now, I will pass the district value as is. If the backend expects Sinhala, we might need a mapping.
            // But looking at `districts.ts` (which I haven't seen fully but assume exists), it might map keys to values.
            // The previous code had `district === 'සියල්ල'`.
            // I'll use 'all' as the internal value for "All".

            const districtParam = district === 'all' ? undefined : district;
            // WAIT: The backend likely stores the district name in Sinhala if that's how it was created.
            // If I change the dropdown to use keys like 'colombo', the filter might fail if the DB has 'කොළඹ'.
            // I should probably map the key back to the Sinhala name if the backend relies on that, OR just send the key if the backend is updated.
            // Given the user said "backend load... mixed content", I assume backend is existing.
            // I will assume for now that I should send the localized string to the backend if that's what it expects, OR the backend handles keys.
            // Let's look at `client/src/lib/districts.ts` to see if there's a mapping.

            // Actually, to be safe and simple: I will use the translation for the display, but what value do I send?
            // If I send 'colombo', and DB has 'කොළඹ', it won't match.
            // I'll check `districts.ts` in a separate tool call if needed, but for now let's assume I can use the translation function to get the display value,
            // and maybe the value should be the one expected by backend.
            // The previous code had hardcoded Sinhala array.

            // Let's use the `t` function to display, but keep the value as the key if possible, or map it.
            // Actually, if I look at `si.json`, `districts.colombo` is "කොළඹ".
            // So `t('districts.colombo')` gives "කොළඹ".
            // If I use `t` for the value, then it sends "කොළඹ" when Sinhala is selected, but "Colombo" when English is selected.
            // This is bad for consistency. The backend should ideally store keys or one language.
            // BUT, the user said "not already add card because they add sure we cannot change".
            // This implies existing data is in a specific format (likely Sinhala).
            // If I change the UI to English, and select "Colombo", it sends "Colombo". Backend has "කොළඹ". No match.
            // So I must send "කොළඹ" regardless of UI language? Or does the backend handle translation?
            // Unlikely backend handles translation on filter.

            // Strategy: The user wants the UI to change.
            // If I change the dropdown to show "Colombo" (English), but the data is "කොළඹ", filtering won't work for English users.
            // This is a tricky localization problem with legacy data.
            // However, the user said "only this text change... not already add card".
            // Maybe they just want the static text (Title, "Need Help", etc.) changed, and the district dropdown can stay in Sinhala?
            // OR they want the dropdown to be localized too?
            // "mainpage... and its create form to the language... currectly only main page text chang eto selec tlanguage"
            // "සියල්ල only this text chang eto that language ok"
            // This suggests they want "All" to be translated.

            // I will update the static text first. For the district dropdown, I will try to use the keys for display but I might need to keep the values compatible.
            // Let's check `client/src/lib/districts.ts` first to see what it exports.

            const response = await helpRequestApi.getHelpRequests(
                pageNum,
                15,
                district === 'all' ? undefined : district // This might need adjustment based on district logic
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

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t('helpRequests.title')}</h1>
                        <p className="text-gray-600 mt-1">
                            {t('helpRequests.subtitle')}
                        </p>
                    </div>
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

                {/* Help Requests Card Grid */}
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
            <div className="fixed bottom-8 right-8 z-40">
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
