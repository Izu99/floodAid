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
import { volunteerApi } from '@/lib/api';
import { CreateVolunteerDto } from '@/types/volunteer';
import { useLanguage } from '@/lib/LanguageContext';

interface VolunteerFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function VolunteerForm({ open, onOpenChange, onSuccess }: VolunteerFormProps) {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    const formSchema = z.object({
        name: z.string().min(1, t('volunteer.form.validation.nameRequired')),
        phone: z.string().min(10, t('volunteer.form.validation.phoneRequired')),
        district: z.string().min(1, t('volunteer.form.validation.districtRequired')),
        skills: z.string().min(1, t('volunteer.form.validation.skillsRequired')),
        availability: z.string().min(1, t('volunteer.form.validation.availabilityRequired')),
        additionalDetails: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            district: '',
            skills: '',
            availability: '',
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
            setIsLoading(true);
            await volunteerApi.createVolunteer(values as CreateVolunteerDto);
            form.reset();
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to submit volunteer registration:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">{t('volunteer.form.title')}</DialogTitle>
                    <DialogDescription>
                        {t('volunteer.form.description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('volunteer.form.name')} *</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('volunteer.form.namePlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('volunteer.form.phone')} *</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('volunteer.form.phonePlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('volunteer.form.district')} *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('volunteer.form.districtPlaceholder')} />
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

                        <FormField
                            control={form.control}
                            name="skills"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('volunteer.form.skills')} *</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t('volunteer.form.skillsPlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="availability"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('volunteer.form.availability')} *</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('volunteer.form.availabilityPlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="additionalDetails"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('volunteer.form.additionalDetails')}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t('volunteer.form.additionalDetailsPlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {t('common.submit')}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
