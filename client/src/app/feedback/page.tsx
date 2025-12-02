'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/LanguageContext';

interface Feedback {
    _id: string;
    name: string;
    thoughts: string;
    improvements: string;
    createdAt: string;
}

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/feedback`);
            if (response.ok) {
                const data = await response.json();
                setFeedbacks(data);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">User Feedback ({feedbacks.length})</h1>
                    <button
                        onClick={fetchFeedback}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading feedback...</div>
                ) : feedbacks.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No feedback received yet.</div>
                ) : (
                    <div className="grid gap-4">
                        {feedbacks.map((feedback) => (
                            <Card key={feedback._id} className="overflow-hidden">
                                <CardHeader className="bg-gray-50 border-b py-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-base font-medium">
                                            {feedback.name || 'Anonymous'}
                                        </CardTitle>
                                        <span className="text-sm text-gray-500">
                                            {new Date(feedback.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 mb-1">Thoughts</h3>
                                        <p className="text-gray-800 whitespace-pre-wrap">
                                            {feedback.thoughts || <span className="text-gray-400 italic">No comments</span>}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 mb-1">Improvements</h3>
                                        <p className="text-gray-800 whitespace-pre-wrap">
                                            {feedback.improvements || <span className="text-gray-400 italic">No suggestions</span>}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
