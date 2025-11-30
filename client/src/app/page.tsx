'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, LogOut, Edit, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { donationApi } from '@/lib/api';
import { tokenStorage } from '@/lib/auth-api';

interface Donation {
  _id: string;
  name: string;
  phone: string;
  address: string;
  district?: string;
  items: string;
  description: string;
  urgency?: 'low' | 'medium' | 'high';
  availableUntil?: string;
  collectedBy?: string;
  status: 'available' | 'collected';
  donor: string;
  createdAt: string;
}

export default function Home() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    district: '',
    items: '',
    description: '',
    urgency: 'medium',
    availableUntil: '',
  });

  const districts = [
    { value: 'colombo', label: 'කොළඹ' },
    { value: 'gampaha', label: 'ගම්පහ' },
    { value: 'kalutara', label: 'කළුතර' },
    { value: 'kandy', label: 'මහනුවර' },
    { value: 'matale', label: 'මාතලේ' },
    { value: 'nuwara-eliya', label: 'නුවර එළිය' },
    { value: 'galle', label: 'ගාල්ල' },
    { value: 'matara', label: 'මාතර' },
    { value: 'hambantota', label: 'හම්බන්තොට' },
    { value: 'jaffna', label: 'යාපනය' },
    { value: 'kilinochchi', label: 'කිලිනොච්චි' },
    { value: 'mannar', label: 'මන්නාරම' },
    { value: 'vavuniya', label: 'වව්නියාව' },
    { value: 'mullaitivu', label: 'මුලතිව්' },
    { value: 'batticaloa', label: 'මඩකලපුව' },
    { value: 'ampara', label: 'අම්පාර' },
    { value: 'trincomalee', label: 'ත්‍රිකුණාමලය' },
    { value: 'kurunegala', label: 'කුරුණෑගල' },
    { value: 'puttalam', label: 'පුත්තලම' },
    { value: 'anuradhapura', label: 'අනුරාධපුරය' },
    { value: 'polonnaruwa', label: 'පොළොන්නරුව' },
    { value: 'badulla', label: 'බදුල්ල' },
    { value: 'monaragala', label: 'මොණරාගල' },
    { value: 'ratnapura', label: 'රත්නපුර' },
    { value: 'kegalle', label: 'කෑගල්ල' },
  ];

  useEffect(() => {
    const token = tokenStorage.getToken();
    const userData = tokenStorage.getUserData();

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(userData);
    setFormData(prev => ({
      ...prev,
      name: userData.name || '',
      phone: userData.phone || '',
      district: userData.district || '',
    }));

    loadDonations(1);
  }, []);

  const loadDonations = async (pageNum: number = page) => {
    try {
      setLoading(true);
      const response = await donationApi.getDonations(pageNum, 15);
      setDonations(response.data);
      setTotalPages(response.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingDonation) {
        await donationApi.updateDonation(editingDonation._id, formData);
      } else {
        await donationApi.createDonation(formData);
      }
      setIsDialogOpen(false);
      setEditingDonation(null);
      resetForm();
      loadDonations(page);
    } catch (error) {
      console.error('Error saving donation:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      district: user?.district || '',
      address: '',
      items: '',
      description: '',
      urgency: 'medium',
      availableUntil: '',
    });
  };

  const handleEdit = (donation: Donation) => {
    setEditingDonation(donation);
    setFormData({
      name: donation.name,
      phone: donation.phone,
      address: donation.address,
      district: donation.district || user?.district || '',
      items: donation.items,
      description: donation.description || '',
      urgency: donation.urgency || 'medium',
      availableUntil: donation.availableUntil || '',
    });
    setIsDialogOpen(true);
  };

  const handleCollect = async (id: string) => {
    try {
      await donationApi.markAsCollected(id);
      loadDonations(page);
    } catch (error) {
      console.error('Error collecting donation:', error);
    }
  };

  const handleLogout = () => {
    tokenStorage.removeToken();
    tokenStorage.removeUserData();
    router.push('/login');
  };

  const handleAddNew = () => {
    setEditingDonation(null);
    resetForm();
    setIsDialogOpen(true);
  };

  // Filter donations
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !filterDistrict || donation.district === filterDistrict;
    const matchesStatus = filterStatus === 'all' || donation.status === filterStatus;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {user.role === 'donor' && (
          <div className="mb-6 sm:mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-amber-100 rounded-full text-amber-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2">ශ්‍රම මෙහෙයුමට අවශ්‍ය උපකරණ</h3>
                <p className="text-amber-800 mb-3 sm:mb-4 text-sm">
                  පහත උපකරණ පිරිසිදු කිරීමේ කටයුතු සඳහා විශේෂයෙන් අවශ්‍ය වේ.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {[
                    "ඉදල්", "වයිෆර්", "ක්ලීනින් ලික්විඩ්", "ප්‍රෙෂර් ගන්",
                    "චේන් සෝ", "අත් පොරව", "මන්නාපිහි", "රේක්ක",
                    "උදලු", "වීල් බැරෝ", "බූට්ස්", "ග්ලවුස්",
                    "කියත්/මිටි", "ගලිමෝටර්", "ජෙනරේටර්", "රබර් හෝස්"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white/60 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-amber-100 text-amber-900 text-xs sm:text-sm font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">පරිත්‍යාග</h2>
            <p className="text-muted-foreground text-sm mt-1">ගංවතුර වින්දිතයින්ට උදව් කරන්න</p>
          </div>

          <Button size="lg" className="rounded-full shadow-lg w-full sm:w-auto" onClick={handleAddNew}>
            <Plus className="w-5 h-5 mr-2" />
            පරිත්‍යාගයක් එක් කරන්න
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ද්‍රව්‍ය, ස්ථානය හෝ විස්තර සොයන්න..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full sm:w-auto"
            >
              <Filter className="w-4 h-4 mr-2" />
              පෙරහන්
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg border">
              <div>
                <Label className="text-xs mb-2 block">දිස්ත්‍රික්කය</Label>
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">සියල්ල</option>
                  {districts.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs mb-2 block">තත්ත්වය</Label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="all">සියල්ල</option>
                  <option value="available">ලබා ගත හැක</option>
                  <option value="collected">එකතු කළා</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingDonation(null);
        }}>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDonation ? 'පරිත්‍යාගය සංස්කරණය කරන්න' : 'නව පරිත්‍යාගයක් එක් කරන්න'}
              </DialogTitle>
              <DialogDescription>
                ඔබේ පරිත්‍යාග තොරතුරු පහත පුරවන්න
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">නම *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">දුරකථන අංකය *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="district">දිස්ත්‍රික්කය *</Label>
                <select
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">තෝරන්න...</option>
                  {districts.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="address">සම්පූර්ණ ලිපිනය *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="නිවස අංකය, වීථිය, ගම"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  එකතු කරන්නන්ට පහසුවෙන් සොයා ගත හැකි පරිදි නිවසේ අංකය සහ වීථිය ඇතුළත් කරන්න
                </p>
              </div>

              <div>
                <Label htmlFor="items">ඔබට සපයිය හැකි ද්‍රව්‍ය *</Label>
                <Input
                  id="items"
                  value={formData.items}
                  onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                  placeholder="උදා: සහල් 10kg, පාන් 5, බ්ලැන්කට් 3"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="urgency">ප්‍රමුඛතාව</Label>
                  <select
                    id="urgency"
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="low">අඩු</option>
                    <option value="medium">මධ්‍යම</option>
                    <option value="high">ඉහළ</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="availableUntil">ලබා ගත හැකි දක්වා</Label>
                  <Input
                    id="availableUntil"
                    type="date"
                    value={formData.availableUntil}
                    onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">අමතර විස්තර</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="විශේෂ උපදෙස්, ස්ථානයට යන ආකාරය, හෝ වෙනත් වැදගත් තොරතුරු"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <Button type="submit" className="w-full">
                {editingDonation ? 'යාවත්කාලීන කරන්න' : 'පරිත්‍යාගය එක් කරන්න'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-muted-foreground text-lg">
              {searchTerm || filterDistrict || filterStatus !== 'all'
                ? 'පරිත්‍යාග හමු නොවීය'
                : 'තවමත් පරිත්‍යාග නොමැත'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {searchTerm || filterDistrict || filterStatus !== 'all'
                ? 'වෙනත් පෙරහන් උත්සාහ කරන්න'
                : 'පළමු පරිත්‍යාගය එකතු කරන්න!'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <div
                  key={donation._id}
                  className={`border-l-4 ${donation.status === 'collected'
                    ? 'border-l-green-500 bg-green-50/50'
                    : 'border-l-blue-500 bg-white'
                    } rounded-lg shadow-sm hover:shadow-md transition-all p-4 sm:p-5`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-base sm:text-lg">{donation.items}</h3>
                        {donation.urgency === 'high' && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                            ඉහළ ප්‍රමුඛතාව
                          </span>
                        )}
                      </div>
                      {donation.description && (
                        <p className="text-sm text-gray-600 mb-3">{donation.description}</p>
                      )}
                      <div className="space-y-1.5 text-sm text-gray-700">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold shrink-0">📍 ස්ථානය:</span>
                          <span className="flex-1">{donation.address}</span>
                          {donation.district && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded shrink-0">
                              {districts.find(d => d.value === donation.district)?.label || donation.district}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">📞</span>
                          <span>{donation.name} - {donation.phone}</span>
                        </div>
                        {donation.availableUntil && new Date(donation.availableUntil) > new Date() && (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">⏰</span>
                            <span>{new Date(donation.availableUntil).toLocaleDateString('si-LK', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })} දක්වා</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${donation.status === 'collected'
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white'
                      }`}>
                      {donation.status === 'collected' ? '✓ එකතු කළා' : 'ලබා ගත හැක'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-3 border-t">
                    <div className="text-xs text-gray-500">
                      📅 {new Date(donation.createdAt).toLocaleString('si-LK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      {donation.donor === user.id && donation.status === 'available' && (
                        <Button
                          onClick={() => handleEdit(donation)}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <Edit className="w-4 h-4 mr-1" /> සංස්කරණය
                        </Button>
                      )}
                      {donation.status === 'available' && user.role === 'collector' && (
                        <Button
                          onClick={() => handleCollect(donation._id)}
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          එකතු කරන්න
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => loadDonations(page - 1)}
                  disabled={page === 1}
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> පෙර
                </Button>
                <span className="text-sm text-muted-foreground">
                  පිටුව {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => loadDonations(page + 1)}
                  disabled={page === totalPages}
                  size="sm"
                >
                  ඊළඟ <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}