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
import { donationApi } from '@/lib/api';
import { CreateDonationDto, Donation } from '@/types/donation';
import { useLanguage } from '@/lib/LanguageContext';

interface DonationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    initialData?: Donation | null;
    userData?: any;
}

export function DonationForm({ open, onOpenChange, onSuccess, initialData, userData }: DonationFormProps) {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    const formSchema = z.object({
        name: z.string().min(1, t('donations.form.name') + ' ' + t('common.error')),
        phone: z.string().min(10, t('donations.form.phone') + ' ' + t('common.error')),
        district: z.string().min(1, t('donations.form.district') + ' ' + t('common.error')),
        address: z.string().min(1, t('donations.form.address') + ' ' + t('common.error')),
        items: z.string().min(1, t('donations.form.items') + ' ' + t('common.error')),
        description: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            district: '',
            address: '',
            items: '',
            description: '',
        },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                    phone: initialData.phone,
                    district: initialData.district || '',
                    address: initialData.address,
                    items: initialData.items,
                    description: initialData.description || '',
                });
            } else if (userData) {
                form.reset({
                    name: userData.name || '',
                    phone: userData.phone || '',
                    district: userData.district || '',
                    address: '',
                    items: '',
                    description: '',
                });
            } else {
                form.reset({
                    name: '',
                    phone: '',
                    district: '',
                    address: '',
                    items: '',
                    description: '',
                });
            }
        }
    }, [open, initialData, userData, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            // Same logic as before: we send the value from the dropdown.
            if (initialData) {
                await donationApi.updateDonation(initialData._id, values);
            } else {
                await donationApi.createDonation(values as CreateDonationDto);
            }
            form.reset();
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to submit donation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? t('common.edit') : t('donations.form.title')}</DialogTitle>
                    <DialogDescription>
                        {t('donations.form.description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('donations.form.name')} *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={t('donations.form.namePlaceholder')} />
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
                                        <FormLabel>{t('donations.form.phone')} *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={t('donations.form.phonePlaceholder')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('donations.form.district')} *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('donations.form.districtPlaceholder')} />
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
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('donations.form.address')} *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t('donations.form.addressPlaceholder')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="items"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('donations.form.items')} *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t('donations.form.itemsPlaceholder')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('donations.form.description')}</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder={t('donations.form.descriptionPlaceholder')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {initialData ? t('common.save') : t('common.submit')}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
