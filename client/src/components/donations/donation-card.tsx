'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Calendar, User, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getDistrictKey } from '@/lib/district-mapping';
import { Donation } from '@/types/donation';
import { Button } from '@/components/ui/button';
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
import { useLanguage } from '@/lib/LanguageContext';

interface DonationCardProps {
    donation: Donation;
    currentUserId?: string;
    userRole?: string;
    onEdit?: (donation: Donation) => void;
    onCollect?: (id: string) => void;
}

export function DonationCard({ donation, userRole, onCollect }: DonationCardProps) {
    const { t } = useLanguage();
    const isCollector = userRole === 'collector';

    const districtKey = getDistrictKey(donation.district || '');
    const districtLabel = districtKey ? t(`districts.${districtKey}`) : donation.district;

    const hasLongText =
        (donation.items && donation.items.length > 100) ||
        (donation.address && donation.address.length > 100) ||
        (donation.description && donation.description.length > 150);

    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
            {/* Donation Card Label */}
            <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-1 border-b border-emerald-200 tracking-wider uppercase flex items-center gap-2">
                <Package size={14} className="mr-1" />
                {t('donations.card.label')}
            </div>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight line-clamp-2">{donation.items}</CardTitle>
                    <Badge variant={donation.status === 'collected' ? 'secondary' : 'default'} className={donation.status === 'collected' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-emerald-500 text-white hover:bg-emerald-600'}>
                        {donation.status === 'collected' ? t('donations.card.collected') : t('donations.card.badge')}
                    </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MapPin size={16} className="shrink-0" />
                    <span>{districtLabel}</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('donations.card.address')}</p>
                        <p className="text-sm text-gray-900 line-clamp-1">{donation.address}</p>
                    </div>

                    {donation.description && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('donations.card.description')}</p>
                            <p className="text-sm text-gray-900 line-clamp-2">{donation.description}</p>
                        </div>
                    )}

                    {hasLongText && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="link" className="p-0 h-auto text-xs mt-1 text-blue-600 hover:text-blue-800">
                                    {t('common.readMore')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Donation Details</DialogTitle>
                                    <DialogDescription>
                                        {districtLabel}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                    <div>
                                        <h4 className="text-sm font-semibold mb-1">Items to Donate</h4>
                                        <p className="text-sm whitespace-pre-wrap">{donation.items}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold mb-1">Address</h4>
                                        <p className="text-sm whitespace-pre-wrap">{donation.address}</p>
                                    </div>
                                    {donation.description && (
                                         <div>
                                            <h4 className="text-sm font-semibold mb-1">Description</h4>
                                            <p className="text-sm whitespace-pre-wrap">{donation.description}</p>
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

                <div className="bg-emerald-50 -mx-6 -mb-6 p-4 border-t border-emerald-100 mt-auto">
                    <p className="text-[10px] font-bold text-emerald-600 mb-3 uppercase tracking-wider">{t('donations.card.donor')}</p>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm shrink-0">
                            <User size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-semibold text-gray-900 text-sm truncate">{donation.name}</span>
                            </div>
                            <a href={`tel:${donation.phone}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-emerald-600 transition-colors w-fit">
                                <Phone size={12} />
                                <span className="font-mono">{donation.phone}</span>
                            </a>
                        </div>
                        {isCollector && donation.status === 'available' && onCollect && (
                            <Button size="sm" onClick={() => onCollect(donation._id)} className="h-8 bg-green-600 hover:bg-green-700 shrink-0">
                                {t('donations.card.collectButton')}
                            </Button>
                        )}
                    </div>
                    <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center gap-1.5 text-[10px] text-emerald-400">
                        <Calendar size={10} />
                        <span>{t('donations.card.donatedOn')} {new Date(donation.createdAt).toLocaleDateString(t('common.dateLocale') || 'en-US')}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
