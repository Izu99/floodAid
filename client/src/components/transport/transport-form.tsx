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
import { transportApi } from '@/lib/api';
import { CreateTransportDto } from '@/types/transport';
import { useLanguage } from '@/lib/LanguageContext';

interface TransportFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function TransportForm({ open, onOpenChange, onSuccess }: TransportFormProps) {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    const formSchema = z.object({
        name: z.string().min(1, t('transport.form.validation.nameRequired')),
        phone: z.string().min(10, t('transport.form.validation.phoneRequired')),
        district: z.string().min(1, t('transport.form.validation.districtRequired')),
        location: z.string().min(1, t('transport.form.validation.locationRequired')),
        vehicleType: z.string().min(1, t('transport.form.validation.vehicleTypeRequired')),
        capacity: z.string().min(1, t('transport.form.validation.capacityRequired')),
        availability: z.string().min(1, t('transport.form.validation.availabilityRequired')),
        additionalDetails: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            district: '',
            location: '',
            vehicleType: '',
            capacity: '',
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
            await transportApi.createTransport(values as CreateTransportDto);
            form.reset();
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to submit transport offer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">{t('transport.form.title')}</DialogTitle>
                    <DialogDescription>
                        {t('transport.form.description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('transport.form.name')} *</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('transport.form.namePlaceholder')} {...field} />
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
                                    <FormLabel>{t('transport.form.phone')} *</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('transport.form.phonePlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="district"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('transport.form.district')} *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('transport.form.districtPlaceholder')} />
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
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('transport.form.location')} *</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('transport.form.locationPlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="vehicleType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('transport.form.vehicleType')} *</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('transport.form.vehicleTypePlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('transport.form.capacity')} *</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('transport.form.capacityPlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="availability"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('transport.form.availability')} *</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('transport.form.availabilityPlaceholder')} {...field} />
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
                                    <FormLabel>{t('transport.form.additionalDetails')}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t('transport.form.additionalDetailsPlaceholder')} {...field} />
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
