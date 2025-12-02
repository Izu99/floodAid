'use client';

import { useState, useEffect } from 'react';
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

    const CATEGORIES = ['food', 'education', 'shelter', 'transport', 'other'];

    const formSchema = z.object({
        name: z.string().min(1, t('common.validation.nameRequired')),
        phone: z.string().min(10, t('common.validation.phoneRequired')),
        additionalPhone: z.string().optional(),
        category: z.string().min(1, t('common.validation.required')),
        district: z.string().min(1, t('common.validation.districtRequired')),
        address: z.string().min(1, t('common.validation.addressRequired')),
        helpDescription: z.string().min(3, t('common.validation.helpDescriptionRequired')),
        additionalDetails: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            additionalPhone: '',
            category: '',
            district: '',
            address: '',
            helpDescription: '',
            additionalDetails: '',
        },
    });

    useEffect(() => {
        if (open) {
            form.reset();
        }
    }, [open, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            await helpRequestApi.createHelpRequest(values as CreateHelpRequestDto);
            form.reset();
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

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('helpRequests.form.name')} *</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('helpRequests.form.namePlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('helpRequests.form.phone')} *</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder={t('helpRequests.form.phonePlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Additional Phone */}
                        <FormField
                            control={form.control}
                            name="additionalPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('helpRequests.form.additionalPhone')}</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder={t('helpRequests.form.phonePlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* District */}
                        <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('helpRequests.form.district')} *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('helpRequests.form.districtPlaceholder')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {DISTRICTS.map((d) => (
                                                <SelectItem key={d} value={t(`districts.${d}`)}>
                                                    {t(`districts.${d}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('helpRequests.form.address')} *</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('helpRequests.form.addressPlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Category */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('helpRequests.form.category')} *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('helpRequests.form.categoryPlaceholder')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {t(`helpRequests.categories.${cat}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Help Description */}
                        <FormField
                            control={form.control}
                            name="helpDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('helpRequests.form.helpDescription')} *</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t('helpRequests.form.helpDescriptionPlaceholder')} rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Additional Details */}
                        <FormField
                            control={form.control}
                            name="additionalDetails"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('helpRequests.form.additionalDetails')}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t('helpRequests.form.additionalDetailsPlaceholder')} rows={2} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                </Form>
            </DialogContent>
        </Dialog>
    );
}
