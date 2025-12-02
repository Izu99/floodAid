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
import { educationApi } from '@/lib/api';
import { CreateEducationDto } from '@/types/education';
import { useLanguage } from '@/lib/LanguageContext';

interface EducationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EducationForm({ open, onOpenChange, onSuccess }: EducationFormProps) {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    const formSchema = z.object({
        name: z.string().min(1, t('education.form.validation.nameRequired')),
        contactPerson: z.string().min(1, t('education.form.validation.contactPersonRequired')),
        phone: z.string().min(10, t('education.form.validation.phoneRequired')),
        district: z.string().min(1, t('education.form.validation.districtRequired')),
        address: z.string().min(1, t('education.form.validation.addressRequired')),
        school: z.string().optional(),
        grade: z.string().optional(),
        needs: z.string().min(1, t('education.form.validation.needsRequired')),
        additionalDetails: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            contactPerson: '',
            phone: '',
            district: '',
            address: '',
            school: '',
            grade: '',
            needs: '',
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
            await educationApi.createEducation(values as CreateEducationDto);
            form.reset();
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to submit education request:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">{t('education.form.title')}</DialogTitle>
                    <DialogDescription>
                        {t('education.form.description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('education.form.name')} *</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('education.form.namePlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contactPerson"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('education.form.contactPerson')} *</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('education.form.contactPersonPlaceholder')} {...field} />
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
                                        <FormLabel>{t('education.form.phone')} *</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('education.form.phonePlaceholder')} {...field} />
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
                                    <FormLabel>{t('education.form.district')} *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('education.form.districtPlaceholder')} />
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
                                    <FormLabel>{t('education.form.address')} *</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('education.form.addressPlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="school"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('education.form.school')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('education.form.schoolPlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="grade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('education.form.grade')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('education.form.gradePlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="needs"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('education.form.needs')} *</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t('education.form.needsPlaceholder')} {...field} />
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
                                    <FormLabel>{t('education.form.additionalDetails')}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t('education.form.additionalDetailsPlaceholder')} {...field} />
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
