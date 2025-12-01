'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';

interface HeaderProps {
    showBackButton?: boolean;
}

export function Header({ showBackButton = false }: HeaderProps) {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <div className="bg-white border-b border-gray-200 py-4 fixed top-0 left-0 right-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-4">
                    {showBackButton && (
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/')}
                            className="hover:bg-gray-100"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            {t('common.back')}
                        </Button>
                    )}
                    <h1 className="text-2xl font-bold text-blue-900">FloodAid</h1>
                </div>
            </div>
        </div>
    );
}
