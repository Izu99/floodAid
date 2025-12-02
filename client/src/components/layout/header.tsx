'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { tokenStorage } from '@/lib/auth-api';
import { useLanguage } from '@/lib/LanguageContext';
import { LanguageSwitcher } from '@/components/common/language-switcher';

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        setMounted(true);
        checkUser();
        window.addEventListener('storage', checkUser);
        window.addEventListener('auth-change', checkUser);
        return () => {
            window.removeEventListener('storage', checkUser);
            window.removeEventListener('auth-change', checkUser);
        };
    }, []);

    const checkUser = () => {
        const userData = tokenStorage.getUserData();
        setUser(userData);
    };

    const handleLogout = () => {
        tokenStorage.removeToken();
        tokenStorage.removeUserData();
        setUser(null);
        router.push('/login');
    };

    if (pathname === '/login' || pathname === '/register') {
        return null;
    }

    if (!mounted) return null;

    return (
        <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="cursor-pointer flex items-center" onClick={() => router.push('/')}>
                        <img src="/logo.png" alt="HelpLK" className="h-12 w-auto" />
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        {user && (
                            <>
                                {user.role === 'collector' && (
                                    <Button variant="ghost" size="sm" onClick={() => router.push('/collector-profile')}>
                                        👤 {language === 'si' ? 'පැතිකඩ' : 'Profile'}
                                    </Button>
                                )}
                                {user.role === 'donor' && (
                                    <Button variant="ghost" size="sm" onClick={() => router.push('/locations')}>
                                        📍 {language === 'si' ? 'ස්ථාන' : 'Locations'}
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4 mr-1" /> {language === 'si' ? 'පිටවීම' : 'Logout'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
