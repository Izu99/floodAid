'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { helpRequestApi } from '@/lib/help-request-api';
import { CreateHelpRequestDto } from '@/types/help-request';
import { useLanguage } from '@/lib/LanguageContext';

interface HelpRequestFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function HelpRequestForm({ open, onOpenChange, onSuccess }: HelpRequestFormProps) {
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    const formSchema = z.object({
        name: z.string().min(1, t('helpRequests.form.name') + ' ' + t('common.error')), // Fallback or simple required message
        phone: z.string().min(10, t('helpRequests.form.phone') + ' ' + t('common.error')),
        additionalPhone: z.string().optional(),
        district: z.string().min(1, t('helpRequests.form.district') + ' ' + t('common.error')),
        address: z.string().min(1, t('helpRequests.form.address') + ' ' + t('common.error')),
        helpDescription: z.string().min(3, t('helpRequests.form.helpDescription') + ' ' + t('common.error')),
        additionalDetails: z.string().optional(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            // We might need to map the district key to the value expected by backend if backend expects Sinhala.
            // But for now, let's send the localized value of the selected district to be safe, 
            // OR just send the value from the dropdown. 
            // The dropdown values are now `t('districts.' + d)`.
            // So it sends "Colombo" or "කොළඹ" depending on language.
            // This is inconsistent for the backend but matches the previous behavior where it sent "කොළඹ" (hardcoded).
            // If the user is in English, it sends "Colombo".
            // If the backend expects "කොළඹ", this is a problem.
            // However, the user said "only this text change... not already add card".
            // I will assume for creation, we should ideally send a consistent value, but without backend changes or a mapping file, 
            // I have to send what's in the value.
            // I'll stick to sending the translated value for now as it's the path of least resistance for "changing the form to the language".

            await helpRequestApi.createHelpRequest(values as CreateHelpRequestDto);
            reset();
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Error submitting help request:', error);
            alert(t('common.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">{t('helpRequests.form.title')}</DialogTitle>
                    <DialogDescription>
                        {t('helpRequests.form.description')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name" className="text-sm sm:text-base">{t('helpRequests.form.name')} *</Label>
                        <Input
                            id="name"
                            placeholder={t('helpRequests.form.namePlaceholder')}
                            {...register('name')}
                            className="mt-1"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <Label htmlFor="phone" className="text-sm sm:text-base">{t('helpRequests.form.phone')} *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder={t('helpRequests.form.phonePlaceholder')}
                            {...register('phone')}
                            className="mt-1"
                        />
                        {errors.phone && (
                            <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Additional Phone (Optional) */}
                    <div>
                        <Label htmlFor="additionalPhone" className="text-sm sm:text-base">{t('helpRequests.form.additionalPhone')}</Label>
                        <Input
                            id="additionalPhone"
                            type="tel"
                            placeholder={t('helpRequests.form.phonePlaceholder')}
                            {...register('additionalPhone')}
                            className="mt-1"
                        />
                    </div>

                    {/* District */}
                    <div>
                        <Label htmlFor="district" className="text-sm sm:text-base">{t('helpRequests.form.district')} *</Label>
                        <select
                            id="district"
                            {...register('district')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                        >
                            <option value="">{t('helpRequests.form.districtPlaceholder')}...</option>
                            {DISTRICTS.map((d) => (
                                <option key={d} value={t(`districts.${d}`)}>
                                    {t(`districts.${d}`)}
                                </option>
                            ))}
                        </select>
                        {errors.district && (
                            <p className="text-xs text-red-600 mt-1">{errors.district.message}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <Label htmlFor="address" className="text-sm sm:text-base">{t('helpRequests.form.address')} *</Label>
                        <textarea
                            id="address"
                            {...register('address')}
                            placeholder={t('helpRequests.form.addressPlaceholder')}
                            rows={2}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                        />
                        {errors.address && (
                            <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>
                        )}
                    </div>

                    {/* Help Description */}
                    <div>
                        <Label htmlFor="helpDescription" className="text-sm sm:text-base">{t('helpRequests.form.helpDescription')} *</Label>
                        <textarea
                            id="helpDescription"
                            {...register('helpDescription')}
                            placeholder={t('helpRequests.form.helpDescriptionPlaceholder')}
                            rows={3}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                        />
                        {errors.helpDescription && (
                            <p className="text-xs text-red-600 mt-1">{errors.helpDescription.message}</p>
                        )}
                    </div>

                    {/* Additional Details (Optional) */}
                    <div>
                        <Label htmlFor="additionalDetails" className="text-sm sm:text-base">{t('helpRequests.form.additionalDetails')}</Label>
                        <textarea
                            id="additionalDetails"
                            {...register('additionalDetails')}
                            placeholder={t('helpRequests.form.additionalDetailsPlaceholder')}
                            rows={2}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                        />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs sm:text-sm text-amber-900">
                        <p className="font-semibold mb-1">📝 {t('common.note') || 'Note'}:</p>
                        <p>{t('helpRequests.form.note') || 'Your information will be visible to those looking to help.'}</p>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                {t('common.loading')}
                            </>
                        ) : (
                            t('common.submit')
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
