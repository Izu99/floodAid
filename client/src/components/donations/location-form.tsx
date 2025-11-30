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

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    district: z.string().min(2, 'District is required'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    contactName: z.string().min(2, 'Contact name is required'),
    contactPhone: z.string().min(9, 'Contact phone is required'),
    additionalPhone: z.string().optional(),
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
    const [contactImage, setContactImage] = useState<File | null>(null);
    const [contactImagePreview, setContactImagePreview] = useState<string>('');

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
            alert('සම්බන්ධ කරගත හැකි අයගේ ඡායාරූපය උඩුගත කරන්න');
            return;
        }

        if (images.length === 0) {
            alert('ස්ථානයේ අවම වශයෙන් එක් ඡායාරූපයක් උඩුගත කරන්න');
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
                    <DialogTitle className="text-xl">එකතු කිරීමේ ස්ථානයක් එක් කරන්න</DialogTitle>
                    <DialogDescription>
                        ආධාර භාර දිය හැකි එකතු කිරීමේ ස්ථානයක් පිළිබඳ විස්තර එක් කරන්න
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="තෝරන්න" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="කොළඹ">කොළඹ</SelectItem>
                                            <SelectItem value="ගම්පහ">ගම්පහ</SelectItem>
                                            <SelectItem value="කළුතර">කළුතර</SelectItem>
                                            <SelectItem value="මහනුවර">මහනුවර</SelectItem>
                                            <SelectItem value="මාතලේ">මාතලේ</SelectItem>
                                            <SelectItem value="නුවරඑළිය">නුවරඑළිය</SelectItem>
                                            <SelectItem value="ගාල්ල">ගාල්ල</SelectItem>
                                            <SelectItem value="මාතර">මාතර</SelectItem>
                                            <SelectItem value="හම්බන්තොට">හම්බන්තොට</SelectItem>
                                            <SelectItem value="යාපනය">යාපනය</SelectItem>
                                            <SelectItem value="කිලිනොච්චිය">කිලිනොච්චිය</SelectItem>
                                            <SelectItem value="මන්නාරම">මන්නාරම</SelectItem>
                                            <SelectItem value="වවුනියාව">වවුනියාව</SelectItem>
                                            <SelectItem value="මුලතිව්">මුලතිව්</SelectItem>
                                            <SelectItem value="මඩකලපුව">මඩකලපුව</SelectItem>
                                            <SelectItem value="අම්පාර">අම්පාර</SelectItem>
                                            <SelectItem value="ත්‍රිකුණාමලය">ත්‍රිකුණාමලය</SelectItem>
                                            <SelectItem value="කුරුණෑගල">කුරුණෑගල</SelectItem>
                                            <SelectItem value="පුත්තලම">පුත්තලම</SelectItem>
                                            <SelectItem value="අනුරාධපුරය">අනුරාධපුරය</SelectItem>
                                            <SelectItem value="පොළොන්නරුව">පොළොන්නරුව</SelectItem>
                                            <SelectItem value="බදුල්ල">බදුල්ල</SelectItem>
                                            <SelectItem value="මොණරාගල">මොණරාගල</SelectItem>
                                            <SelectItem value="රත්නපුර">රත්නපුර</SelectItem>
                                            <SelectItem value="කෑගල්ල">කෑගල්ල</SelectItem>
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

                        {/* Contact Information Section */}
                        <div className="pt-3 mt-2 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">සම්බන්ධතා විස්තර</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contactName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>සම්බන්ධ කරගත හැකි අයගේ නම</FormLabel>
                                        <FormControl>
                                            <Input placeholder="නම" {...field} />
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
                                        <FormLabel>දුරකථන අංකය</FormLabel>
                                        <FormControl>
                                            <Input placeholder="07x xxxxxxx" {...field} />
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
                                    <FormLabel>අමතර දුරකථන (විකල්ප)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="07x xxxxxxx" {...field} />
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
                                    <FormLabel>විස්තරය</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="ස්ථානයේ එකතු කරන්නා විශේෂිත ද්‍රව්‍ය කරන්න (උදා: ආහාර, ඇඳුම් පැළඳුම්, ඖෂධ)"
                                            {...field}
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel>සම්බන්ධ කරගත හැකි අයගේ ඡායාරූපය (අනිවාර්යයි)</FormLabel>
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
                            <p className="text-xs text-gray-500 mt-1">මෙම ඡායාරූපය කාඩ්පතේ දර්ශනය වේ</p>
                        </div>

                        <div>
                            <FormLabel>එකතු කිරීමේ ස්ථානයේ ඡායාරූප (අවම 1ක් - උපරිම 5ක්)</FormLabel>
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
