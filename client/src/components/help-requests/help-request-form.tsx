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
import { DISTRICTS } from '@/lib/districts';

const formSchema = z.object({
    name: z.string().min(1, 'කරුණාකර ඔබේ නම ඇතුළත් කරන්න'),
    phone: z.string().min(10, 'දුරකථන අංකය අක්ෂර 10ක් විය යුතුයි (උදා: 0771234567)'),
    additionalPhone: z.string().optional(),
    district: z.string().min(1, 'කරුණාකර දිස්ත්‍රික්කයක් තෝරන්න'),
    address: z.string().min(1, 'කරුණාකර ඔබේ ලිපිනය ඇතුළත් කරන්න'),
    helpDescription: z.string().min(3, 'කරුණාකර අවශ්‍ය උදව ඇතුළත් කරන්න (අක්ෂර 3ක් හෝ වැඩි)'),
    additionalDetails: z.string().optional(),
});

interface HelpRequestFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function HelpRequestForm({ open, onOpenChange, onSuccess }: HelpRequestFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            await helpRequestApi.createHelpRequest(values as CreateHelpRequestDto);
            reset();
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Error submitting help request:', error);
            alert('උදව් ඉල්ලීම ඉදිරිපත් කිරීමේදී දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">උදව් ඉල්ලීමක් කරන්න</DialogTitle>
                    <DialogDescription>
                        ඔබට අවශ්‍ය උදව් පිළිබඳ තොරතුරු පහත පුරවන්න
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name" className="text-sm sm:text-base">නම *</Label>
                        <Input
                            id="name"
                            placeholder="ඔබේ සම්පූර්ණ නම"
                            {...register('name')}
                            className="mt-1"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <Label htmlFor="phone" className="text-sm sm:text-base">දුරකථන අංකය *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="0771234567"
                            {...register('phone')}
                            className="mt-1"
                        />
                        {errors.phone && (
                            <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Additional Phone (Optional) */}
                    <div>
                        <Label htmlFor="additionalPhone" className="text-sm sm:text-base">අතිරේක දුරකථන අංකය</Label>
                        <Input
                            id="additionalPhone"
                            type="tel"
                            placeholder="0771234567"
                            {...register('additionalPhone')}
                            className="mt-1"
                        />
                    </div>

                    {/* District */}
                    <div>
                        <Label htmlFor="district" className="text-sm sm:text-base">දිස්ත්‍රික්කය *</Label>
                        <select
                            id="district"
                            {...register('district')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                        >
                            <option value="">තෝරන්න...</option>
                            {DISTRICTS.map((d) => (
                                <option key={d.value} value={d.value}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                        {errors.district && (
                            <p className="text-xs text-red-600 mt-1">{errors.district.message}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <Label htmlFor="address" className="text-sm sm:text-base">ලිපිනය *</Label>
                        <textarea
                            id="address"
                            {...register('address')}
                            placeholder="නිවස අංකය, වීථිය, ප්‍රදේශය"
                            rows={2}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                        />
                        {errors.address && (
                            <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>
                        )}
                    </div>

                    {/* Help Description */}
                    <div>
                        <Label htmlFor="helpDescription" className="text-sm sm:text-base">අවශ්‍ය උදව් *</Label>
                        <textarea
                            id="helpDescription"
                            {...register('helpDescription')}
                            placeholder="ඔබට අවශ්‍ය උදව් විස්තර කරන්න (උදා: ආහාර, පිරිසිදු කිරීම, වෛද්‍ය සහාය)"
                            rows={3}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                        />
                        {errors.helpDescription && (
                            <p className="text-xs text-red-600 mt-1">{errors.helpDescription.message}</p>
                        )}
                    </div>

                    {/* Additional Details (Optional) */}
                    <div>
                        <Label htmlFor="additionalDetails" className="text-sm sm:text-base">අමතර විස්තර</Label>
                        <textarea
                            id="additionalDetails"
                            {...register('additionalDetails')}
                            placeholder="වෙනත් වැදගත් තොරතුරු"
                            rows={2}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                        />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs sm:text-sm text-amber-900">
                        <p className="font-semibold mb-1">📝 සටහන:</p>
                        <p>ඔබේ තොරතුරු ආධාර සැපයීමට බලාපොරොත්තු වන අය සඳහා පෙන්වනු ඇත. කරුණාකර නිවැරදි තොරතුරු ලබා දෙන්න.</p>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                ඉදිරිපත් කරමින්...
                            </>
                        ) : (
                            'උදව් ඉල්ලීම ඉදිරිපත් කරන්න'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
