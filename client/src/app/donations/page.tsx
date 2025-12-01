'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DonationCard } from '@/components/donations/donation-card';
import { DonationForm } from '@/components/donations/donation-form';

<div className="max-w-7xl mx-auto px-4 py-8 pt-48">
    {/* Filter by District */}
    <div className="mb-6 flex items-center gap-4">
        <MapPin className="text-gray-500" />
        <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
            <SelectTrigger className="w-64 bg-white">
                <SelectValue placeholder={t('districts.all')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{t('districts.all')}</SelectItem>
                {DISTRICTS.map((districtKey) => (
                    <SelectItem key={districtKey} value={t(`districts.${districtKey}`)}>
                        {t(`districts.${districtKey}`)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>

    {/* Donations Grid */}
    {loading ? (
        <div className="text-center py-12">
            <p className="text-gray-500">{t('donations.loading')}</p>
        </div>
    ) : donations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{t('donations.noDonations')}</p>
            <Button onClick={handleAddNew} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                {t('common.add')} {t('donations.card.badge')}
            </Button>
        </div>
    ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donations.map((donation) => (
                    <DonationCard
                        key={donation._id}
                        donation={donation}
                        currentUserId={user?.id}
                        userRole={user?.role}
                        onEdit={handleEdit}
                        onCollect={handleCollect}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <Button
                        variant="outline"
                        onClick={() => loadDonations(selectedDistrict, page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> {t('common.previous')}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {t('common.page')} {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => loadDonations(selectedDistrict, page + 1)}
                        disabled={page === totalPages}
                    >
                        {t('common.next')} <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}
        </>
    )}
</div>

{/* Floating Action Button */ }
<div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
    {showBackToTop && (
        <Button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full shadow-lg bg-gray-600 hover:bg-gray-700 text-white p-0 flex items-center justify-center transition-all opacity-80 hover:opacity-100"
        >
            <ArrowUp className="w-6 h-6" />
        </Button>
    )}
    <Button
        onClick={handleAddNew}
        className="w-14 h-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white p-0 flex items-center justify-center transition-transform hover:scale-105"
    >
        <Plus className="w-8 h-8" />
    </Button>
</div>

{/* Donation Form Dialog */ }
<DonationForm
    open={showForm}
    onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingDonation(null);
    }}
    onSuccess={handleCreateSuccess}
    initialData={editingDonation}
    userData={user}
/>
        </div >
    );
}
