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
import { CreateLocationDto } from '@/types/location';
import { X } from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    district: z.string().min(2, 'District is required'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
});

interface LocationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateLocationDto, images: File[]) => Promise<void>;
}

export function LocationForm({ open, onOpenChange, onSubmit }: LocationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (images.length === 0) {
            alert('Please upload at least one image');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(values, images);
            form.reset();
            setImages([]);
            setImagePreviews([]);
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
                    <DialogTitle className="text-xl">Add Affected Location</DialogTitle>
                    <DialogDescription>
                        Add details about a flood-affected area that needs help
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ස්ථානයේ නම</FormLabel>
                                    <FormControl>
                                        <Input placeholder="උදා: කොළඹ සහන මධ්‍යස්ථානය" {...field} />
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
                                    <FormLabel>දිස්ත්‍රික්කය</FormLabel>
                                    <FormControl>
                                        <Input placeholder="උදා: කොළඹ" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ලිපිනය</FormLabel>
                                    <FormControl>
                                        <Input placeholder="සම්පූර්ණ ලිපිනය" {...field} />
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
                                        <FormLabel>ආරම්භක දිනය</FormLabel>
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
                                        <FormLabel>අවසාන දිනය</FormLabel>
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
                                        <FormLabel>ආරම්භක වේලාව</FormLabel>
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
                                        <FormLabel>අවසාන වේලාව</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>විස්තරය</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="තත්වය සහ අවශ්‍ය ආධාර ගැන විස්තර කරන්න"
                                            {...field}
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel>ඡායාරූප ({images.length}/5)</FormLabel>
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
                                අවලංගු කරන්න
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="flex-1">
                                {isSubmitting ? 'එක් කරමින්...' : 'ස්ථානය එක් කරන්න'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
