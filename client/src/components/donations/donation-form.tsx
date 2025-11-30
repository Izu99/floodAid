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
import { DISTRICTS } from '@/lib/districts';

const formSchema = z.object({
    name: z.string().min(1, 'නම ඇතුළත් කරන්න'),
    phone: z.string().min(10, 'වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න'),
    district: z.string().min(1, 'දිස්ත්‍රික්කයක් තෝරන්න'),
    address: z.string().min(1, 'ලිපිනය ඇතුළත් කරන්න'),
    items: z.string().min(1, 'ද්‍රව්‍ය ඇතුළත් කරන්න'),
    description: z.string().optional(),
});

interface DonationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    initialData?: Donation | null;
    userData?: any;
}

export function DonationForm({ open, onOpenChange, onSuccess, initialData, userData }: DonationFormProps) {
    const [isLoading, setIsLoading] = useState(false);

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
                    <DialogTitle>{initialData ? 'පරිත්‍යාගය සංස්කරණය කරන්න' : 'නව පරිත්‍යාගයක් එක් කරන්න'}</DialogTitle>
                    <DialogDescription>
                        ඔබේ පරිත්‍යාග තොරතුරු පහත පුරවන්න
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
                                        <FormLabel>නම *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="ඔබේ නම" />
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
                                        <FormLabel>දුරකථන අංකය *</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="07xxxxxxxx" />
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
                                    <FormLabel>දිස්ත්‍රික්කය *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="දිස්ත්‍රික්කය තෝරන්න" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {DISTRICTS.map((d) => (
                                                <SelectItem key={d.value} value={d.value}>
                                                    {d.label}
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
                                    <FormLabel>සම්පූර්ණ ලිපිනය *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="නිවස අංකය, වීථිය, ගම" />
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
                                    <FormLabel>ඔබට සපයිය හැකි ද්‍රව්‍ය *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="උදා: සහල් 10kg, පාන් 5, බ්ලැන්කට් 3" />
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
                                    <FormLabel>අමතර විස්තර</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="විශේෂ උපදෙස්, ස්ථානයට යන ආකාරය, හෝ වෙනත් වැදගත් තොරතුරු" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {initialData ? 'යාවත්කාලීන කරන්න' : 'පරිත්‍යාගය එක් කරන්න'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
