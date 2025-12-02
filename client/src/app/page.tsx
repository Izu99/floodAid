'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Heart, MapPin, GraduationCap, Truck, HandHeart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { tokenStorage } from '@/lib/auth-api';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { LanguageSwitcher } from '@/components/common/language-switcher';

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
      {/* Fixed Header */}
      <Header />

      {/* Content with top padding */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 pt-28">
        {/* Hero Section with Language Switcher */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">{t('main.title')}</h2>
            <p className="text-xl text-gray-600 mb-6">{t('main.subtitle')}</p>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Disclaimer Section */}
          <div className="max-w-4xl mx-auto mb-10 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-sm text-yellow-800">{t('main.disclaimer')}</p>
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

            {/* Card 4: Education */}
            <Card
              className="bg-blue-50 border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => router.push('/education')}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="p-4 bg-blue-100 rounded-full text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{t('main.educationCard.title')}</h3>
                <p className="text-blue-700">{t('main.educationCard.description')}</p>
              </CardContent>
            </Card>

            {/* Card 5: Transport */}
            <Card
              className="bg-amber-50 border-amber-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => router.push('/transport')}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="p-4 bg-amber-100 rounded-full text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-2">{t('main.transportCard.title')}</h3>
                <p className="text-amber-700">{t('main.transportCard.description')}</p>
              </CardContent>
            </Card>

            {/* Card 6: Volunteering */}
            <Card
              className="bg-orange-50 border-orange-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => router.push('/volunteering')}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="p-4 bg-orange-100 rounded-full text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                  <HandHeart className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-orange-900 mb-2">{t('main.volunteerCard.title')}</h3>
                <p className="text-orange-700">{t('main.volunteerCard.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}