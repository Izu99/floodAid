'use client';

import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/LanguageContext';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center justify-center gap-2">
            <Languages className="w-5 h-5 text-gray-500" />
            <div className="flex gap-1 bg-white rounded-lg shadow-sm p-1 border border-gray-200">
                <Button
                    variant={language === 'si' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLanguage('si')}
                    className={language === 'si' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-gray-100'}
                >
                    සිං
                </Button>
                <Button
                    variant={language === 'en' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-gray-100'}
                >
                    EN
                </Button>
                <Button
                    variant={language === 'ta' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLanguage('ta')}
                    className={language === 'ta' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-gray-100'}
                >
                    த
                </Button>
            </div>
        </div>
    );
}
