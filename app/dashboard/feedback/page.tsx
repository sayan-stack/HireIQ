'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/dashboard/components/Sidebar';
import TopBar from '@/app/dashboard/components/TopBar';
import {
    MessageSquare, ThumbsUp, ThumbsDown, TrendingUp, FileText,
    ChevronRight, Star, Clock, CheckCircle, AlertTriangle
} from 'lucide-react';

interface Feedback {
    id: string;
    type: 'interview' | 'resume' | 'application';
    title: string;
    date: string;
    score: number;
    status: 'positive' | 'needs_improvement';
    summary: string;
    strengths: string[];
    improvements: string[];
}

export default function FeedbackPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'all' | 'interview' | 'resume' | 'application'>('all');

    const [feedbacks] = useState<Feedback[]>([
        {
            id: '1',
            type: 'interview',
            title: 'Technical Interview - TechFlow Inc.',
            date: 'Dec 28, 2024',
            score: 78,
            status: 'positive',
            summary: 'Strong performance on React and JavaScript fundamentals. Room for improvement in system design.',
            strengths: ['Clear communication', 'Strong React knowledge', 'Good problem-solving approach'],
            improvements: ['System design patterns', 'Database optimization', 'Time management']
        },
        {
            id: '2',
            type: 'resume',
            title: 'Resume ATS Analysis',
            date: 'Dec 25, 2024',
            score: 84,
            status: 'positive',
            summary: 'Your resume is well-optimized for ATS systems. Consider adding more quantifiable achievements.',
            strengths: ['Clear formatting', 'Relevant keywords', 'Strong summary section'],
            improvements: ['Add more metrics', 'Include certifications', 'Expand project descriptions']
        },
        {
            id: '3',
            type: 'interview',
            title: 'Behavioral Interview - Global Systems',
            date: 'Dec 20, 2024',
            score: 65,
            status: 'needs_improvement',
            summary: 'Good responses but lacked specific examples. Practice STAR method for better structuring.',
            strengths: ['Positive attitude', 'Good eye contact', 'Professional demeanor'],
            improvements: ['Use STAR method', 'Prepare specific examples', 'Research company better']
        },
        {
            id: '4',
            type: 'application',
            title: 'Application Feedback - MegaCorp',
            date: 'Dec 15, 2024',
            score: 45,
            status: 'needs_improvement',
            summary: 'Your application was rejected due to missing required skills. Consider upskilling in React Native.',
            strengths: ['Relevant experience', 'Good cover letter'],
            improvements: ['Learn React Native', 'Add mobile development projects', 'Get relevant certifications']
        }
    ]);

    const filteredFeedbacks = feedbacks.filter(fb =>
        activeTab === 'all' || fb.type === activeTab
    );

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'interview': return <MessageSquare size={20} />;
            case 'resume': return <FileText size={20} />;
            case 'application': return <TrendingUp size={20} />;
            default: return <MessageSquare size={20} />;
        }
    };

    return (
        <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />

            <main className="flex-1 p-8 space-y-6 overflow-y-auto">
                <TopBar />

                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Reports & Feedback</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Review your performance feedback and improvement suggestions</p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Total Feedbacks</p>
                        <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{feedbacks.length}</p>
                    </div>
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Avg. Score</p>
                        <p className="text-3xl font-bold" style={{ color: '#3b82f6' }}>
                            {Math.round(feedbacks.reduce((acc, fb) => acc + fb.score, 0) / feedbacks.length)}%
                        </p>
                    </div>
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Positive Feedback</p>
                        <p className="text-3xl font-bold" style={{ color: '#10b981' }}>
                            {feedbacks.filter(fb => fb.status === 'positive').length}
                        </p>
                    </div>
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Needs Work</p>
                        <p className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
                            {feedbacks.filter(fb => fb.status === 'needs_improvement').length}
                        </p>
                    </div>
                </div>

                {/* Tabs & Feedback List */}
                <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex gap-2 mb-6">
                        {(['all', 'interview', 'resume', 'application'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="px-4 py-2 rounded-lg text-sm capitalize transition"
                                style={{
                                    backgroundColor: activeTab === tab ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                    color: activeTab === tab ? 'white' : 'var(--text-secondary)'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredFeedbacks.map(feedback => (
                            <div
                                key={feedback.id}
                                className="p-6 rounded-lg"
                                style={{ backgroundColor: 'var(--bg-tertiary)' }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{
                                                backgroundColor: feedback.status === 'positive' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                color: feedback.status === 'positive' ? '#10b981' : '#f59e0b'
                                            }}
                                        >
                                            {getTypeIcon(feedback.type)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{feedback.title}</h3>
                                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{feedback.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold" style={{ color: feedback.score >= 70 ? '#10b981' : '#f59e0b' }}>
                                                {feedback.score}%
                                            </p>
                                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Score</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>{feedback.summary}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: '#10b981' }}>
                                            <ThumbsUp size={16} /> Strengths
                                        </p>
                                        <ul className="space-y-1">
                                            {feedback.strengths.map((s, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                    <CheckCircle size={14} style={{ color: '#10b981' }} /> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: '#f59e0b' }}>
                                            <ThumbsDown size={16} /> Areas to Improve
                                        </p>
                                        <ul className="space-y-1">
                                            {feedback.improvements.map((s, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                    <AlertTriangle size={14} style={{ color: '#f59e0b' }} /> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                    <button
                                        className="px-4 py-2 rounded-lg text-sm text-white"
                                        style={{ backgroundColor: '#3b82f6' }}
                                        onClick={() => router.push('/dashboard/skills')}
                                    >
                                        View Learning Path
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded-lg text-sm"
                                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                    >
                                        Download Report
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
