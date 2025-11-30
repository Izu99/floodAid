'use client';

import { useState } from 'react';
import { Location } from '@/types/location';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, User, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LocationCardProps {
    location: Location;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function LocationCard({ location }: LocationCardProps) {
    const [showImages, setShowImages] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [showCollectorImage, setShowCollectorImage] = useState(false);

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

    return (
        <>
            <Card className="overflow-hidden flex flex-col h-full">
                <div className="relative group cursor-pointer" onClick={() => openGallery(0)}>
                    <div className="grid grid-cols-3 gap-1 p-2 bg-gray-50 hover:opacity-90 transition-opacity">
                        {location.images.length > 0 ? (
                            <>
                                {location.images.slice(0, 3).map((image, index) => (
                                    <img
                                        key={index}
                                        src={`${API_URL}/uploads/locations/${image}`}
                                        alt={`${location.name} ${index + 1}`}
                                        className="w-full h-24 object-cover rounded"
                                    />
                                ))}
                                {location.images.length > 3 && (
                                    <div className="relative w-full h-24 rounded overflow-hidden">
                                        <img
                                            src={`${API_URL}/uploads/locations/${location.images[3]}`}
                                            alt={`${location.name} 4`}
                                            className="w-full h-full object-cover"
                                        />
                                        {location.images.length > 4 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                                +{location.images.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="col-span-3 h-24 bg-gray-200 flex items-center justify-center text-gray-400 rounded">
                                <MapPin className="w-8 h-8 opacity-50" />
                            </div>
                        )}
                    </div>
                    {location.images.length > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                            <span className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
                                ඡායාරූප බලන්න
                            </span>
                        </div>
                    )}
                </div>

                <CardHeader className="pb-2">
                    <CardTitle className="text-lg leading-tight">{location.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin size={16} className="shrink-0" />
                        <span>{location.district}</span>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">ලිපිනය</p>
                            <p className="text-sm text-gray-900">{location.address}</p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">විස්තරය</p>
                            <p className="text-sm text-gray-700 line-clamp-3">{location.description}</p>
                        </div>

                        {(location.startDate || location.endDate || location.startTime || location.endTime) && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">එකතු කරන දින සහ වේලාවන්</p>
                                <div className="flex flex-col gap-2 text-sm text-gray-700 bg-blue-50 p-2 rounded border border-blue-100">
                                    {(location.startDate || location.endDate) && (
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-blue-600" />
                                            <span>
                                                {location.startDate ? new Date(location.startDate).toLocaleDateString('si-LK') : '---'} සිට {location.endDate ? new Date(location.endDate).toLocaleDateString('si-LK') : '---'} දක්වා
                                            </span>
                                        </div>
                                    )}
                                    {(location.startTime || location.endTime) && (
                                        <div className="flex items-center gap-2 pl-6">
                                            <span className="text-blue-600">⏰</span>
                                            <span>
                                                {location.startTime || '---'} සිට {location.endTime || '---'} දක්වා
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50 -mx-6 -mb-6 p-4 border-t border-blue-100 mt-auto">
                        <p className="text-[10px] font-bold text-blue-600 mb-3 uppercase tracking-wider">ස්ථාන භාරකරු (සම්බන්ධ කරගන්න)</p>
                        <div className="flex items-start gap-3">
                            <div
                                onClick={() => location.collector.faceImage && setShowCollectorImage(true)}
                                className={`shrink-0 ${location.collector.faceImage ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                            >
                                {location.collector.faceImage ? (
                                    <img
                                        src={`${API_URL}/uploads/faces/${location.collector.faceImage}`}
                                        alt={location.collector.name}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                                        {location.collector.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-semibold text-gray-900 text-sm truncate">{location.collector.name}</span>
                                    {location.collector.occupation && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium truncate max-w-[120px]">
                                            {location.collector.occupation}
                                        </span>
                                    )}
                                </div>
                                <a href={`tel:${location.collector.phone}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors w-fit">
                                    <Phone size={12} />
                                    <span className="font-mono">{location.collector.phone}</span>
                                </a>
                            </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-blue-100 flex items-center gap-1.5 text-[10px] text-blue-400">
                            <Calendar size={10} />
                            <span>එක් කළේ {new Date(location.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Location Images Gallery Dialog */}
            {showImages && location.images.length > 0 && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
                    <button
                        onClick={() => setShowImages(false)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50"
                    >
                        <X size={32} />
                    </button>

                    <div className="relative w-full max-w-4xl max-h-[80vh] flex items-center justify-center group">
                        {location.images.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 p-3 text-white hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-all backdrop-blur-sm z-10"
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={32} />
                            </button>
                        )}

                        <img
                            src={`${API_URL}/uploads/locations/${location.images[currentImageIndex]}`}
                            alt={`View ${currentImageIndex + 1}`}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
                        />

                        {location.images.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 p-3 text-white hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-all backdrop-blur-sm z-10"
                                aria-label="Next image"
                            >
                                <ChevronRight size={32} />
                            </button>
                        )}
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {location.images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Collector Image Dialog */}
            {showCollectorImage && location.collector.faceImage && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowCollectorImage(false)}>
                    <button
                        onClick={() => setShowCollectorImage(false)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50"
                    >
                        <X size={32} />
                    </button>
                    <div className="relative max-w-lg max-h-[80vh] p-1 bg-white rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        <img
                            src={`${API_URL}/uploads/faces/${location.collector.faceImage}`}
                            alt={location.collector.name}
                            className="max-w-full max-h-[80vh] object-contain rounded"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-center text-sm font-medium backdrop-blur-sm">
                            {location.collector.name}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
