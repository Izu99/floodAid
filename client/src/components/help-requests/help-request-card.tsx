'use client';

import { useState } from 'react';
import { HelpRequest } from '@/types/help-request';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Calendar, User, Tag, Check, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDistrictLabel } from '@/lib/districts';
import { useLanguage } from '@/lib/LanguageContext';
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
import { helpRequestApi } from '@/lib/help-request-api';

interface HelpRequestCardProps {
    request: HelpRequest;
    onStatusUpdate?: () => void;
}

export function HelpRequestCard({ request, onStatusUpdate }: HelpRequestCardProps) {
    const { t } = useLanguage();
    const [isUpdating, setIsUpdating] = useState(false);
    const [localStatus, setLocalStatus] = useState(request.status);

    const handleMarkAsFulfilled = async () => {
        if (!confirm(t('helpRequests.card.confirmStatusUpdate'))) {
            return;
        }

        try {
            setIsUpdating(true);
            await helpRequestApi.updateHelpRequestStatus(request._id, 'fulfilled');
            // Update local state immediately for instant UI feedback
            setLocalStatus('fulfilled');
            // Trigger parent refresh to re-sort
            if (onStatusUpdate) {
                onStatusUpdate();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert(t('common.error'));
        } finally {
            setIsUpdating(false);
        }
    };

    const isFulfilled = localStatus === 'fulfilled';
    const hasLongText = (request.name.length > 50 || request.helpDescription.length > 100 || (request.additionalDetails && request.additionalDetails.length > 50));

    const helpDescriptionLineClamp = request.additionalDetails ? 'line-clamp-2' : 'line-clamp-3';

    return (
        <Card className={`overflow-hidden flex flex-col h-full transition-all ${isFulfilled
                ? 'opacity-70 bg-gray-50 border-gray-200'
                : 'hover:shadow-md'
            }`}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className={`text-lg leading-tight ${isFulfilled ? 'text-gray-500' : ''}`}>
                        {request.name}
                    </CardTitle>
                    <Badge
                        className={isFulfilled
                            ? 'bg-green-500 text-white hover:bg-green-500 font-bold shadow-sm'
                            : 'bg-red-500 text-white hover:bg-red-500 font-bold'
                        }
                    >
                        {isFulfilled ? t('helpRequests.status.fulfilled') : t('helpRequests.status.pending')}
                    </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MapPin size={16} className="shrink-0" />
                    <span>{getDistrictLabel(request.district)}</span>
                </div>
                {request.category && (
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Tag size={12} className="mr-1" />
                            {t(`helpRequests.categories.${request.category}`)}
                        </Badge>
                    </div>
                )}
            </CardHeader>

            <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('helpRequests.card.address')}</p>
                        <p className="text-sm text-gray-900 line-clamp-1">{request.address}</p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('helpRequests.card.helpNeeded')}</p>
                        <p className={`text-sm text-gray-900 ${helpDescriptionLineClamp}`}>{request.helpDescription}</p>
                    </div>

                    {request.additionalDetails && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('helpRequests.card.additionalDetails')}</p>
                            <p className="text-sm text-gray-700 line-clamp-1">{request.additionalDetails}</p>
                        </div>
                    )}

                    {hasLongText && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="link" className="p-0 h-auto text-xs mt-1 text-blue-600 hover:text-blue-800">{t('common.readMore')}</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{request.name}'s Request</DialogTitle>
                                    <DialogDescription>
                                        {getDistrictLabel(request.district)}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                    <div>
                                        <h4 className="text-sm font-semibold mb-1">Help Needed</h4>
                                        <p className="text-sm whitespace-pre-wrap">{request.helpDescription}</p>
                                    </div>
                                    {request.additionalDetails && (
                                        <div>
                                            <h4 className="text-sm font-semibold mb-1">Additional Details</h4>
                                            <p className="text-sm whitespace-pre-wrap">{request.additionalDetails}</p>
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
                </div>

                {/* Status Update Button - only show for pending requests */}
                {request.status === 'pending' && (
                    <div className="-mx-6 px-6 py-3 border-t border-gray-100">
                        <Button
                            onClick={handleMarkAsFulfilled}
                            disabled={isUpdating}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                        >
                            <Check size={16} className="mr-2" />
                            {isUpdating ? t('common.updating') : t('helpRequests.card.markAsReceived')}
                        </Button>
                    </div>
                )}

                <div className={`-mx-6 -mb-6 p-4 border-t mt-auto ${isFulfilled
                        ? 'bg-gray-100 border-gray-200'
                        : 'bg-red-50 border-red-100'
                    }`}>
                    <p className={`text-[10px] font-bold mb-3 uppercase tracking-wider ${isFulfilled ? 'text-gray-500' : 'text-red-600'
                        }`}>
                        {t('helpRequests.card.contactInfo')}
                    </p>
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm shrink-0 ${isFulfilled
                                ? 'bg-gray-300 text-gray-600'
                                : 'bg-red-200 text-red-700'
                            }`}>
                            <User size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-semibold text-gray-900 text-sm truncate">{request.name}</span>
                            </div>
                            <a
                                href={`tel:${request.phone}`}
                                className={`flex items-center gap-1.5 text-sm transition-colors w-fit ${isFulfilled
                                        ? 'text-gray-500 hover:text-gray-700'
                                        : 'text-gray-600 hover:text-red-600'
                                    }`}
                            >
                                <Phone size={12} />
                                <span className="font-mono">{request.phone}</span>
                            </a>
                            {request.additionalPhone && (
                                <a
                                    href={`tel:${request.additionalPhone}`}
                                    className={`flex items-center gap-1.5 text-sm transition-colors w-fit mt-1 ${isFulfilled
                                            ? 'text-gray-500 hover:text-gray-700'
                                            : 'text-gray-600 hover:text-red-600'
                                        }`}
                                >
                                    <Phone size={12} />
                                    <span className="font-mono">{request.additionalPhone}</span>
                                </a>
                            )}
                        </div>
                    </div>
                    <div className={`mt-3 pt-2 border-t flex items-center gap-1.5 text-[10px] ${isFulfilled
                            ? 'border-gray-200 text-gray-400'
                            : 'border-red-100 text-red-400'
                        }`}>
                        <Calendar size={10} />
                        <span>{t('helpRequests.card.requestedOn')} {new Date(request.createdAt).toLocaleDateString(t('common.dateLocale'))}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
