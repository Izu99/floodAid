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
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi, tokenStorage } from '@/lib/auth-api';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
    phone: z.string().min(10, 'කරුණාකර වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න'),
    password: z.string().min(1, 'මුරපදය අවශ්‍යයි'),
});

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: '',
            password: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authApi.login(values);

            tokenStorage.setToken(response.token);
            tokenStorage.setUserData(response.user);

            router.push('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'ප්‍රවේශය අසාර්ථක විය');
            } else {
                setError(String(err) || 'ප්‍රවේශය අසාර්ථක විය');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">FloodAid වෙත ප්‍රවේශ වන්න</CardTitle>
                    <CardDescription className="text-center">
                        ගංවතුර වින්දිතයින්ට උදව් කිරීම සඳහා ඔබේ ගිණුමට ප්‍රවේශ වන්න
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
                                            <Input type="password" placeholder="ඔබේ මුරපදය ඇතුලත් කරන්න" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? 'ප්‍රවේශ වෙමින්...' : 'ප්‍රවේශ වන්න'}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-4 text-center text-sm">
                        ගිණුමක් නොමැතිද?{' '}
                        <Link href="/register" className="text-primary hover:underline">
                            මෙතනින් ලියාපදිංචි වන්න
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
