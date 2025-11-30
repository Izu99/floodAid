'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { tokenStorage } from '@/lib/auth-api';

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initial check
        checkUser();

        // Listen for storage events (in case of changes in other tabs)
        window.addEventListener('storage', checkUser);

        // Custom event for login/logout updates within the same tab
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

    // Don't show header on login or register pages
    if (pathname === '/login' || pathname === '/register') {
        return null;
    }

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) return null;

    return (
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="cursor-pointer" onClick={() => router.push('/')}>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            FloodAid
                        </h1>
                        {user && (
                            <p className="text-sm text-muted-foreground">
                                ආයුබෝවන්, {user.name} ({user.role === 'donor' ? 'පරිත්‍යාගශීලී' : 'එකතුකරන්නා'})
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {user ? (
                            <>
                                {user.role === 'collector' && (
                                    <Button variant="outline" size="sm" onClick={() => router.push('/collector-profile')}>
                                        <span className="mr-2">👤</span> පැතිකඩ
                                    </Button>
                                )}
                                {user.role === 'donor' && (
                                    <Button variant="outline" size="sm" onClick={() => router.push('/locations')}>
                                        <span className="mr-2">📍</span> ස්ථාන
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4 mr-2" /> පිටවීම
                                </Button>
                            </>
                        ) : (
                            <Button variant="default" size="sm" onClick={() => router.push('/login')}>
                                ඇතුල් වන්න
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
