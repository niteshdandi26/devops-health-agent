'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Filter } from 'lucide-react';
import Link from 'next/link';

interface HistoryItem {
    id: string;
    timestamp: string;
    severity: string;
    error: string;
    status: string;
}

export default function HistoryPage() {
    const [filter, setFilter] = useState<string>('ALL');

    // Mock data - in production, fetch from API
    const historyData: HistoryItem[] = [
        { id: '1', timestamp: new Date().toISOString(), severity: 'HIGH', error: 'Database connection failed', status: 'Resolved' },
        { id: '2', timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'MEDIUM', error: 'API timeout', status: 'Monitoring' },
        { id: '3', timestamp: new Date(Date.now() - 7200000).toISOString(), severity: 'LOW', error: 'Slow query detected', status: 'Fixed' },
        { id: '4', timestamp: new Date(Date.now() - 10800000).toISOString(), severity: 'CRITICAL', error: 'Service outage', status: 'Resolved' },
        { id: '5', timestamp: new Date(Date.now() - 14400000).toISOString(), severity: 'HIGH', error: 'Memory leak detected', status: 'In Progress' },
    ];

    const filteredData = filter === 'ALL'
        ? historyData
        : historyData.filter(item => item.severity === filter);

    const getSeverityColor = (severity: string) => {
        const colors = {
            CRITICAL: 'from-red-500 to-pink-600',
            HIGH: 'from-orange-500 to-red-500',
            MEDIUM: 'from-yellow-500 to-orange-500',
            LOW: 'from-green-500 to-emerald-500',
        };
        return colors[severity as keyof typeof colors] || 'from-gray-500 to-slate-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden opacity-50">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Analysis History</h1>
                        <p className="text-purple-200">View past AI-powered error analyses</p>
                    </div>
                    <Link
                        href="/"
                        className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-8 flex-wrap">
                    {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setFilter(level)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === level
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                                    : 'backdrop-blur-md bg-white/10 border border-white/20 text-purple-200 hover:bg-white/20'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                {/* History List */}
                <div className="space-y-4">
                    {filteredData.map((item) => (
                        <div
                            key={item.id}
                            className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getSeverityColor(item.severity)} text-white text-sm font-medium shadow-lg`}>
                                            {item.severity}
                                        </div>
                                        <span className="text-purple-300 text-sm flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {new Date(item.timestamp).toLocaleString()}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                        {item.error}
                                    </h3>

                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        <span className="text-green-300 text-sm font-medium">
                                            Status: {item.status}
                                        </span>
                                    </div>
                                </div>

                                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-xl transition-all">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredData.length === 0 && (
                    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
                        <p className="text-purple-200 text-lg">No analyses found for this filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}
