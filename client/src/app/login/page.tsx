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
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <Card className="w-full max-w-lg">
                <CardHeader className="px-6 pt-8 pb-6">
                    <CardTitle className="text-2xl sm:text-3xl text-center font-bold">FloodAid වෙත ප්‍රවේශ වන්න</CardTitle>
                    <CardDescription className="text-center text-base mt-2">
                        ගංවතුර වින්දිතයින්ට උදව් කිරීම සඳහා ඔබේ ගිණුමට ප්‍රවේශ වන්න
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                    {error && (
                        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center gap-3 mb-6">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">දුරකථන අංකය</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="077XXXXXXX"
                                                className="h-12 text-base px-4"
                                                {...field}
                                            />
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
                                        <FormLabel className="text-base font-medium">මුරපදය</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="ඔබේ මුරපදය ඇතුලත් කරන්න"
                                                className="h-12 text-base px-4"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 text-base font-semibold mt-6"
                            >
                                {isLoading ? 'ප්‍රවේශ වෙමින්...' : 'ප්‍රවේශ වන්න'}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center text-base">
                        ගිණුමක් නොමැතිද?{' '}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            මෙතනින් ලියාපදිංචි වන්න
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
