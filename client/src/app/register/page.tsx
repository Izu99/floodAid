'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi, tokenStorage } from '@/lib/auth-api';
import { AlertCircle, Upload, Users, Package } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
    name: z.string().min(2, 'නම අවම වශයෙන් අක්ෂර 2ක් විය යුතුය'),
    phone: z.string().min(10, 'කරුණාකර වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න'),
    password: z.string().min(6, 'මුරපදය අවම වශයෙන් අක්ෂර 6ක් විය යුතුය'),
    confirmPassword: z.string(),
    role: z.enum(['donor', 'collector']),
    faceImage: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "මුරපද ගැලපෙන්නේ නැත",
    path: ['confirmPassword'],
}).refine((data) => {
    if (data.role === 'collector' && !data.faceImage) {
        return false;
    }
    return true;
}, {
    message: "වංචාවන් වැළැක්වීම සඳහා එකතු කරන්නන්ට මුහුණේ ඡායාරූපය අවශ්‍යයි",
    path: ['faceImage'],
});

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            password: '',
            confirmPassword: '',
            role: 'donor',
        },
    });

    const selectedRole = form.watch('role');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            form.setValue('faceImage', file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setError(null);

        try {
            const { confirmPassword, faceImage, ...registerData } = values;
            const response = await authApi.register(registerData, selectedFile || undefined);

            tokenStorage.setToken(response.token);
            tokenStorage.setUserData(response.user);

            router.push('/');
        } catch (err: any) {
            setError(err.message || 'ලියාපදිංචිය අසාර්ථක විය');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">FloodAid සඳහා ලියාපදිංචි වන්න</CardTitle>
                    <CardDescription className="text-center">
                        ගංවතුර වින්දිතයින්ට උදව් කිරීම සඳහා ගිණුමක් සාදන්න
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>මට අවශ්‍යයි</FormLabel>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => field.onChange('donor')}
                                                className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${field.value === 'donor'
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                <Package className="w-8 h-8" />
                                                <span className="font-medium">පරිත්‍යාග කරන්න</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => field.onChange('collector')}
                                                className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${field.value === 'collector'
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                <Users className="w-8 h-8" />
                                                <span className="font-medium">එකතු කරන්න</span>
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>නම</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ඔබේ නම" {...field} />
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
                                        <FormLabel>දුරකථන අංකය</FormLabel>
                                        <FormControl>
                                            <Input placeholder="077XXXXXXX" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>මුරපදය</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="අවම වශයෙන් අක්ෂර 6ක්" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>මුරපදය තහවුරු කරන්න</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="මුරපදය නැවත ඇතුලත් කරන්න" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {selectedRole === 'collector' && (
                                <FormField
                                    control={form.control}
                                    name="faceImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>මුහුණේ ඡායාරූපය *</FormLabel>
                                            <FormDescription className="text-xs">
                                                වංචාවන් වැළැක්වීම සඳහා එකතු කරන්නන් සත්‍යාපනය කිරීමට අවශ්‍යයි
                                            </FormDescription>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                                                        {previewUrl ? (
                                                            <img
                                                                src={previewUrl}
                                                                alt="පෙරදසුන"
                                                                className="h-full object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                                                <span className="text-sm text-muted-foreground">
                                                                    මුහුණේ ඡායාරූපය උඩුගත කරන්න
                                                                </span>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg,image/jpg,image/png"
                                                            className="hidden"
                                                            onChange={handleFileChange}
                                                        />
                                                    </label>
                                                    {selectedFile && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {selectedFile.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? 'ගිණුම සාදමින්...' : 'ලියාපදිංචි වන්න'}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-4 text-center text-sm">
                        දැනටමත් ගිණුමක් තිබේද?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            මෙතනින් ප්‍රවේශ වන්න
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
