'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, RefreshCw, Shield, Clock, User, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface Feedback {
    _id: string;
    name: string;
    thoughts: string;
    improvements: string;
    createdAt: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
}

export default function SecureFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        setRefreshing(true);
        setError(null);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/feedback`,
                {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Sanitize and validate data
            const sanitizedData = data.map((item: any) => ({
                _id: String(item._id || '').slice(0, 100),
                name: String(item.name || 'Anonymous').slice(0, 100),
                thoughts: String(item.thoughts || '').slice(0, 2000),
                improvements: String(item.improvements || '').slice(0, 2000),
                createdAt: item.createdAt,
                sentiment: analyzeSentiment(item.thoughts, item.improvements)
            }));

            setFeedbacks(sanitizedData);
        } catch (error: any) {
            if (error.name === 'AbortError') {
                setError('Request timeout. Please try again.');
            } else {
                setError('Failed to load feedback. Please check your connection.');
            }
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const analyzeSentiment = (thoughts: string, improvements: string): 'positive' | 'neutral' | 'negative' => {
        const text = `${thoughts} ${improvements}`.toLowerCase();
        const positiveWords = ['great', 'excellent', 'love', 'amazing', 'perfect', 'good', 'helpful', 'useful'];
        const negativeWords = ['bad', 'terrible', 'hate', 'poor', 'confusing', 'broken', 'useless', 'awful'];
        
        const positiveCount = positiveWords.filter(word => text.includes(word)).length;
        const negativeCount = negativeWords.filter(word => text.includes(word)).length;
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    };

    const filteredFeedbacks = feedbacks.filter(fb => 
        filter === 'all' || fb.sentiment === filter
    );

    const stats = {
        total: feedbacks.length,
        positive: feedbacks.filter(f => f.sentiment === 'positive').length,
        neutral: feedbacks.filter(f => f.sentiment === 'neutral').length,
        negative: feedbacks.filter(f => f.sentiment === 'negative').length
    };

    const getSentimentColor = (sentiment?: string) => {
        switch (sentiment) {
            case 'positive': return 'bg-green-100 text-green-800 border-green-200';
            case 'negative': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getSentimentIcon = (sentiment?: string) => {
        switch (sentiment) {
            case 'positive': return <CheckCircle className="w-4 h-4" />;
            case 'negative': return <AlertCircle className="w-4 h-4" />;
            default: return <MessageSquare className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
                                <p className="text-sm text-gray-600">Secure & Real-time Analytics</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchFeedback}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Positive</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{stats.positive}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Neutral</p>
                                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.neutral}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                                <p className="text-3xl font-bold text-red-600 mt-2">{stats.negative}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-xl">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl p-4 shadow-lg mb-8 border border-gray-100">
                    <div className="flex flex-wrap gap-2">
                        {(['all', 'positive', 'neutral', 'negative'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                    filter === f
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                {f !== 'all' && ` (${stats[f]})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-6 shadow-lg">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <p className="text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-600 font-medium">Loading feedback...</p>
                    </div>
                ) : filteredFeedbacks.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl font-semibold text-gray-700 mb-2">
                            {filter === 'all' ? 'No feedback yet' : `No ${filter} feedback`}
                        </p>
                        <p className="text-gray-500">
                            {filter === 'all' 
                                ? 'Feedback will appear here once submitted'
                                : 'Try selecting a different filter'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredFeedbacks.map((feedback, index) => (
                            <div
                                key={feedback._id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 p-4">
                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <User className="w-5 h-5 text-gray-700" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {feedback.name || 'Anonymous User'}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Clock className="w-3 h-3 text-gray-500" />
                                                    <span className="text-xs text-gray-600">
                                                        {new Date(feedback.createdAt).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getSentimentColor(feedback.sentiment)}`}>
                                            {getSentimentIcon(feedback.sentiment)}
                                            <span className="text-xs font-semibold uppercase tracking-wide">
                                                {feedback.sentiment}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6 grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-3">
                                            <MessageSquare className="w-4 h-4 text-blue-600" />
                                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                                Thoughts
                                            </h4>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 min-h-[100px]">
                                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                                {feedback.thoughts || (
                                                    <span className="text-gray-400 italic">No comments provided</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-3">
                                            <TrendingUp className="w-4 h-4 text-indigo-600" />
                                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                                Improvements
                                            </h4>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 min-h-[100px]">
                                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                                {feedback.improvements || (
                                                    <span className="text-gray-400 italic">No suggestions provided</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
}