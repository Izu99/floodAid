'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpRequestForm } from '@/components/help-requests/help-request-form';
import { HelpRequestCard } from '@/components/help-requests/help-request-card';
import { helpRequestApi } from '@/lib/help-request-api';
import { HelpRequest } from '@/types/help-request';
import { Plus, MapPin, ChevronLeft, ChevronRight, HeartHandshake } from 'lucide-react';
import { DISTRICTS } from '@/lib/districts';

export default function HelpRequestsPage() {
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('සියල්ල');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const DISTRICTS = [
        'කොළඹ', 'ගම්පහ', 'කළුතර', 'මහනුවර', 'මාතලේ', 'නුවරඑළිය', 'ගාල්ල', 'මාතර', 'හම්බන්තොට',
        'යාපනය', 'කිලිනොච්චිය', 'මන්නාරම', 'වවුනියාව', 'මුලතිව්', 'මඩකලපුව', 'අම්පාර', 'ත්‍රිකුණාමලය',
        'කුරුණෑගල', 'පුත්තලම', 'අනුරාධපුරය', 'පොළොන්නරුව', 'බදුල්ල', 'මොණරාගල', 'රත්නපුර', 'කෑගල්ල'
    ];

    useEffect(() => {
        loadRequests('සියල්ල', 1);
    }, []);

    const loadRequests = async (district?: string, pageNum: number = 1) => {
        try {
            setLoading(true);
            const response = await helpRequestApi.getHelpRequests(
                pageNum,
                15,
                district === 'සියල්ල' ? undefined : district
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
                        <h1 className="text-3xl font-bold text-gray-900">උදව් ඉල්ලීම්</h1>
                        <p className="text-gray-600 mt-1">
                            ඔබට හෝ ඔබ දන්නා අයෙකුට ආධාර අවශ්‍ය නම් මෙතැනින් ඉල්ලීම් කරන්න
                        </p>
                    </div>
                </div>

                {/* Filter by District */}
                <div className="mb-6 flex items-center gap-4">
                    <MapPin className="text-gray-500" />
                    <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                        <SelectTrigger className="w-64 bg-white">
                            <SelectValue placeholder="දිස්ත්‍රික්කය තෝරන්න" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="සියල්ල">සියල්ල</SelectItem>
                            {DISTRICTS.map((district) => (
                                <SelectItem key={district} value={district}>
                                    {district}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>



                {/* Help Requests Card Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">තොරතුරු ලබා ගනිමින්...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <HeartHandshake className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">දැනට උදව් ඉල්ලීම් කිසිවක් නොමැත</p>
                        <Button onClick={() => setShowForm(true)} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                            පළමු ඉල්ලීම එක් කරන්න
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
                                    <ChevronLeft className="w-4 h-4 mr-1" /> පෙර
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    පිටුව {page} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => loadRequests(selectedDistrict, page + 1)}
                                    disabled={page === totalPages}
                                >
                                    ඊළඟ <ChevronRight className="w-4 h-4 ml-1" />
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
