'use client';

import { HelpRequest } from '@/types/help-request';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getDistrictLabel } from '@/lib/districts';

interface HelpRequestCardProps {
    request: HelpRequest;
}

export function HelpRequestCard({ request }: HelpRequestCardProps) {
    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight">{request.name}</CardTitle>
                    <Badge variant={request.status === 'fulfilled' ? 'secondary' : 'default'} className={request.status === 'fulfilled' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}>
                        {request.status === 'fulfilled' ? 'විසඳන ලදී' : 'උදව් අවශ්‍යයි'}
                    </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MapPin size={16} className="shrink-0" />
                    <span>{getDistrictLabel(request.district)}</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">ලිපිනය</p>
                        <p className="text-sm text-gray-900">{request.address}</p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">අවශ්‍ය උදව්</p>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{request.helpDescription}</p>
                    </div>

                    {request.additionalDetails && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">අමතර විස්තර</p>
                            <p className="text-sm text-gray-700">{request.additionalDetails}</p>
                        </div>
                    )}
                </div>

                <div className="bg-red-50 -mx-6 -mb-6 p-4 border-t border-red-100 mt-auto">
                    <p className="text-[10px] font-bold text-red-600 mb-3 uppercase tracking-wider">සම්බන්ධ කරගන්න</p>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold border-2 border-white shadow-sm shrink-0">
                            <User size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-semibold text-gray-900 text-sm truncate">{request.name}</span>
                            </div>
                            <a href={`tel:${request.phone}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors w-fit">
                                <Phone size={12} />
                                <span className="font-mono">{request.phone}</span>
                            </a>
                            {request.additionalPhone && (
                                <a href={`tel:${request.additionalPhone}`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors w-fit mt-1">
                                    <Phone size={12} />
                                    <span className="font-mono">{request.additionalPhone}</span>
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-red-100 flex items-center gap-1.5 text-[10px] text-red-400">
                        <Calendar size={10} />
                        <span>ඉල්ලීම කළේ {new Date(request.createdAt).toLocaleDateString('si-LK')}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
