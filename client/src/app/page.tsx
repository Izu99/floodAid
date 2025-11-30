'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Heart, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { tokenStorage } from '@/lib/auth-api';



export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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

        {/* Hero Section with 4 Cards */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">ශ්‍රී ලංකා ආධාර ලැයිස්තුව</h1>
            <p className="text-xl text-gray-600">ගංවතුරින් විපතට පත් ජනතාවට සහන</p>
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
                <h3 className="text-2xl font-bold text-rose-900 mb-2">උදව් අවශ්‍යද?</h3>
                <p className="text-rose-700">ඔබට හෝ ඔබ දන්නා අයෙකුට ආධාර අවශ්‍ය නම් මෙතැනින් ඉල්ලීම් කරන්න</p>
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
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">ආධාර ලබාදෙන්න</h3>
                <p className="text-emerald-700">ඔබට හැකි අයුරින් විපතට පත් ජනතාවට ආධාර ලබාදෙන්න</p>
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
                <h3 className="text-2xl font-bold text-sky-900 mb-2">එකතු කරන ස්ථාන</h3>
                <p className="text-sky-700">ආධාර භාර දිය හැකි ළඟම ඇති මධ්‍යස්ථාන සොයාගන්න</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Existing Dashboard Content (Only if logged in) */}

      </div>

      {/* Help Request Form Dialog */}

    </main>
  );
}