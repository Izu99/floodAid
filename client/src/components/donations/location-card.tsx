'use client';

import { useState } from 'react';
import { Location } from '@/types/location';
import { BASE_URL as API_URL } from '@/lib/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Calendar, X, ChevronLeft, ChevronRight, ImageIcon, User } from 'lucide-react';
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
import { getDistrictKey } from '@/lib/district-mapping';

interface LocationCardProps {
    location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
    const { t } = useLanguage();
    const [showImages, setShowImages] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openGallery = (index: number) => {
        setCurrentImageIndex(index);
        setShowImages(true);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % location.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + location.images.length) % location.images.length);
    };

    // Contact info
    const contactName = location.contactName || location.collector?.name || 'Unknown';
    const contactPhone = location.contactPhone || location.collector?.phone || '';
    const contactImage = location.contactImage || location.collector?.faceImage;

    // Format date/time display
    const formattedDateTime = `${location.startDate} ${location.startTime} - ${location.endDate} ${location.endTime}`;

    const districtKey = getDistrictKey(location.district || '');
    const districtLabel = districtKey ? t(`districts.${districtKey}`) : location.district;
    
    const hasLongText = (location.name.length > 50) || (location.address.length > 50) || (location.description && location.description.length > 100);

    return (
        <>
            <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg leading-tight line-clamp-1">{location.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin size={16} className="shrink-0" />
                        <span>{districtLabel}</span>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('locations.card.address')}</p>
                            <p className="text-sm text-gray-900 line-clamp-1">{location.address}</p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('locations.card.time')}</p>
                            <p className="text-sm text-gray-900 line-clamp-1">{formattedDateTime}</p>
                        </div>

                        {location.description && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t('locations.card.description')}</p>
                                <p className="text-sm text-gray-900 line-clamp-2">{location.description}</p>
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
                                        <DialogTitle>{location.name}</DialogTitle>
                                        <DialogDescription>{districtLabel}</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                        {location.description && (
                                            <div>
                                                <h4 className="text-sm font-semibold mb-1">Description</h4>
                                                <p className="text-sm whitespace-pre-wrap">{location.description}</p>
                                            </div>
                                        )}
                                         <div>
                                            <h4 className="text-sm font-semibold mb-1">Address</h4>
                                            <p className="text-sm whitespace-pre-wrap">{location.address}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold mb-1">Time</h4>
                                            <p className="text-sm whitespace-pre-wrap">{formattedDateTime}</p>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button">Close</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                        {location.images.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openGallery(0)}
                                className="w-full flex items-center justify-center gap-2 mt-2"
                            >
                                <ImageIcon size={16} />
                                {t('locations.card.viewPhotos')} ({location.images.length})
                            </Button>
                        )}
                    </div>

                    <div className="bg-sky-50 -mx-6 -mb-6 p-4 border-t border-sky-100 mt-auto">
                        <p className="text-[10px] font-bold text-sky-600 mb-3 uppercase tracking-wider">{t('locations.card.collectorInfo')}</p>
                        <div className="flex items-start gap-3">
                            {contactImage ? (
                                <img
                                    src={location.contactImage ? `${API_URL}/uploads/locations/${contactImage}` : `${API_URL}/uploads/faces/${contactImage}`}
                                    alt={contactName}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-sky-500 shadow-sm shrink-0"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold border-2 border-white shadow-sm shrink-0">
                                    <User size={20} />
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-semibold text-gray-900 text-sm truncate">{contactName}</span>
                                </div>
                                <a href={`tel:${contactPhone}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-sky-600 transition-colors w-fit">
                                    <Phone size={12} />
                                    <span className="font-mono">{contactPhone}</span>
                                </a>
                                {location.additionalPhone && (
                                    <a href={`tel:${location.additionalPhone}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-sky-600 transition-colors w-fit mt-1">
                                        <Phone size={12} />
                                        <span className="font-mono">{location.additionalPhone}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-sky-100 flex items-center gap-1.5 text-[10px] text-sky-400">
                            <Calendar size={10} />
                            <span>{t('locations.card.addedOn')} {new Date(location.createdAt).toLocaleDateString(t('common.dateLocale') || 'en-US')}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {showImages && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <button
                        onClick={() => setShowImages(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <X size={32} />
                    </button>

                    <div className="max-w-4xl w-full flex items-center gap-4">
                        <button
                            onClick={prevImage}
                            className="text-white hover:text-gray-300 transition-colors p-2"
                            disabled={location.images.length <= 1}
                        >
                            <ChevronLeft size={48} />
                        </button>

                        <div className="flex-1 flex flex-col items-center">
                            <img
                                src={`${API_URL}/uploads/locations/${location.images[currentImageIndex]}`}
                                alt={`Location ${currentImageIndex + 1}`}
                                className="max-h-[80vh] max-w-full object-contain"
                            />
                            <p className="text-white mt-4 text-sm">
                                {currentImageIndex + 1} / {location.images.length}
                            </p>
                        </div>

                        <button
                            onClick={nextImage}
                            className="text-white hover:text-gray-300 transition-colors p-2"
                            disabled={location.images.length <= 1}
                        >
                            <ChevronRight size={48} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
