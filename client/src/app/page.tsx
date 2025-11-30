'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Heart, MapPin, Languages } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { tokenStorage } from '@/lib/auth-api';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const token = tokenStorage.getToken();
    const userData = tokenStorage.getUserData();

    if (token && userData) {
      setUser(userData);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">

        {/* Hero Section with Language Switcher */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">{t('main.title')}</h1>
            <p className="text-xl text-gray-600">{t('main.subtitle')}</p>

            {/* Language Switcher */}
            <div className="mt-6 flex justify-center items-center gap-2">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Card 1: Need Help? */}
            <Card
              className="bg-rose-50 border-rose-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => router.push('/help-requests')}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="p-4 bg-rose-100 rounded-full text-rose-600 mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-rose-900 mb-2">{t('main.helpCard.title')}</h3>
                <p className="text-rose-700">{t('main.helpCard.description')}</p>
              </CardContent>
            </Card>

            {/* Card 2: Give Help */}
            <Card
              className="bg-emerald-50 border-emerald-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => router.push('/donations')}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="p-4 bg-emerald-100 rounded-full text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">{t('main.donationsCard.title')}</h3>
                <p className="text-emerald-700">{t('main.donationsCard.description')}</p>
              </CardContent>
            </Card>

            {/* Card 3: Collection Points */}
            <Card
              className="bg-sky-50 border-sky-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => router.push('/locations')}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="p-4 bg-sky-100 rounded-full text-sky-600 mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-sky-900 mb-2">{t('main.locationsCard.title')}</h3>
                <p className="text-sky-700">{t('main.locationsCard.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </main>
  );
}