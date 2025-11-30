'use client';

import { Donation } from '@/types/donation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, MapPin, Phone, User, Package } from 'lucide-react';

interface DonationCardProps {
    donation: Donation;
    onMarkCollected: (id: string) => Promise<void>;
}

export function DonationCard({ donation, onMarkCollected }: DonationCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Card className={`transition-all ${donation.status === 'collected' ? 'opacity-60 bg-muted' : ''}`}>
            <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{donation.name}</span>
                    </div>
                    {donation.status === 'collected' ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Collected
                        </span>
                    ) : (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Available
                        </span>
                    )}
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                        <Package className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                            <div className="font-medium text-foreground">{donation.items}</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{donation.phone}</span>
                    </div>

                    <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-muted-foreground text-xs">{donation.address}</span>
                    </div>

                    {donation.description && (
                        <div className="bg-muted p-2 rounded text-xs">
                            <span className="text-foreground">{donation.description}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(donation.createdAt)}
                        </span>

                        {donation.status !== 'collected' && (
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => onMarkCollected(donation._id)}
                                className="h-7 text-xs"
                            >
                                Mark as Collected
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
