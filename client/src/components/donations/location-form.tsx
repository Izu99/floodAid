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
import { CreateLocationDto } from '@/types/location';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface LocationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateLocationDto, images: File[]) => Promise<void>;
}

export function LocationForm({ open, onOpenChange, onSubmit }: LocationFormProps) {
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [contactImage, setContactImage] = useState<File | null>(null);
    const [contactImagePreview, setContactImagePreview] = useState<string>('');

    const DISTRICTS = [
        'colombo', 'gampaha', 'kalutara', 'kandy', 'matale', 'nuwara_eliya', 'galle', 'matara', 'hambantota',
        'jaffna', 'kilinochchi', 'mannar', 'vavuniya', 'mullaitivu', 'batticaloa', 'ampara', 'trincomalee',
        'kurunegala', 'puttalam', 'anuradhapura', 'polonnaruwa', 'badulla', 'monaragala', 'ratnapura', 'kegalle'
    ];

    const formSchema = z.object({
        name: z.string().min(2, t('locations.form.name') + ' ' + t('common.error')),
        district: z.string().min(2, t('locations.form.district') + ' ' + t('common.error')),
        address: z.string().min(5, t('locations.form.address') + ' ' + t('common.error')),
        description: z.string().min(10, t('locations.form.description') + ' ' + t('common.error')),
        startDate: z.string().min(1, t('locations.form.startDate') + ' ' + t('common.error')),
        endDate: z.string().min(1, t('locations.form.endDate') + ' ' + t('common.error')),
        startTime: z.string().min(1, t('locations.form.startTime') + ' ' + t('common.error')),
        endTime: z.string().min(1, t('locations.form.endTime') + ' ' + t('common.error')),
        contactName: z.string().min(2, t('locations.form.contactName') + ' ' + t('common.error')),
        contactPhone: z.string().min(9, t('locations.form.contactPhone') + ' ' + t('common.error')),
        additionalPhone: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            district: '',
            address: '',
            description: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            contactName: '',
            contactPhone: '',
            additionalPhone: '',
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (images.length + files.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        const newImages = [...images, ...files].slice(0, 5);
        setImages(newImages);

        // Create previews
        const previews = newImages.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleContactImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setContactImage(file);
            setContactImagePreview(URL.createObjectURL(file));
        }
    };

    const removeContactImage = () => {
        setContactImage(null);
        setContactImagePreview('');
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!contactImage) {
            alert(t('locations.form.contactImage') + ' ' + t('common.error'));
            return;
        }

        if (images.length === 0) {
            alert(t('locations.form.locationImages') + ' ' + t('common.error'));
            return;
        }

        setIsSubmitting(true);
        try {
            // Combine contact image and location images
            const allImages = [contactImage, ...images];
            await onSubmit(values, allImages);
            form.reset();
            setImages([]);
            setImagePreviews([]);
            setContactImage(null);
            setContactImagePreview('');
            onOpenChange(false);
        } catch (error) {
            console.error('Error submitting location:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">{t('locations.form.title')}</DialogTitle>
                    <DialogDescription>
                        {t('locations.form.description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('locations.form.name')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('locations.form.namePlaceholder')} {...field} />
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
                                    <FormLabel>{t('locations.form.district')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('locations.form.districtPlaceholder')} />
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
                                    <FormLabel>{t('locations.form.address')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('locations.form.addressPlaceholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('locations.form.startDate')}</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('locations.form.endDate')}</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('locations.form.startTime')}</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('locations.form.endTime')}</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Contact Information Section */}
                        <div className="pt-3 mt-2 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('locations.form.contactSection')}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contactName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('locations.form.contactName')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('locations.form.contactNamePlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contactPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('locations.form.contactPhone')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('locations.form.contactPhonePlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="additionalPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('locations.form.additionalPhone')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('locations.form.contactPhonePlaceholder')} {...field} />
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
                                    <FormLabel>{t('locations.form.description')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('locations.form.descriptionPlaceholder')}
                                            {...field}
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel>{t('locations.form.contactImage')}</FormLabel>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleContactImageChange}
                                className="mt-2"
                            />
                            {contactImagePreview && (
                                <div className="relative mt-3 w-32">
                                    <img
                                        src={contactImagePreview}
                                        alt="Contact Preview"
                                        className="w-32 h-32 object-cover rounded border-2 border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeContactImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">{t('locations.form.contactImageNote')}</p>
                        </div>

                        <div>
                            <FormLabel>{t('locations.form.locationImages')}</FormLabel>
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                disabled={images.length >= 5}
                                className="mt-2"
                            />
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="flex-1"
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="flex-1">
                                {isSubmitting ? t('common.loading') : t('common.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
