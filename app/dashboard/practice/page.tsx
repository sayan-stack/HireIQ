'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import {
    BookOpen, Target, Brain, Code, Award,
    TrendingUp, Play, Clock, Star, CheckCircle,
    ChevronRight, Lock, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PracticeCategory {
    id: string;
    title: string;
    description: string;
    icon: typeof BookOpen;
    color: string;
    topics: number;
    completed: number;
    isPremium?: boolean;
}

interface PracticeSession {
    id: string;
    title: string;
    category: string;
    duration: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    completedAt: string;
    score: number;
}

export default function PracticePage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories: PracticeCategory[] = [
        {
            id: 'behavioral',
            title: 'Behavioral Questions',
            description: 'Master STAR method responses for common behavioral questions',
            icon: Target,
            color: '#3b82f6',
            topics: 25,
            completed: 12
        },
        {
            id: 'technical',
            title: 'Technical Concepts',
            description: 'Review core concepts for your target role',
            icon: Code,
            color: '#8b5cf6',
            topics: 40,
            completed: 18
        },
        {
            id: 'system-design',
            title: 'System Design',
            description: 'Practice architectural and scalability discussions',
            icon: Brain,
            color: '#f59e0b',
            topics: 15,
            completed: 5,
            isPremium: true
        },
        {
            id: 'case-studies',
            title: 'Case Studies',
            description: 'Work through real-world problem-solving scenarios',
            icon: BookOpen,
            color: '#10b981',
            topics: 20,
            completed: 8
        }
    ];

    const recentSessions: PracticeSession[] = [
        {
            id: '1',
            title: 'Leadership & Teamwork',
            category: 'Behavioral',
            duration: '25 min',
            difficulty: 'Intermediate',
            completedAt: 'Today',
            score: 85
        },
        {
            id: '2',
            title: 'React State Management',
            category: 'Technical',
            duration: '30 min',
            difficulty: 'Advanced',
            completedAt: 'Yesterday',
            score: 78
        },
        {
            id: '3',
            title: 'Conflict Resolution',
            category: 'Behavioral',
            duration: '20 min',
            difficulty: 'Beginner',
            completedAt: '2 days ago',
            score: 92
        }
    ];

    const [stats] = useState({
        totalSessions: 45,
        avgScore: 82,
        streak: 7,
        hoursSpent: 12.5
    });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner': return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' };
            case 'Intermediate': return { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
            case 'Advanced': return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
            default: return { bg: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af' };
        }
    };

    return (
        <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />

            <main className="flex-1 p-8 space-y-6 overflow-y-auto">
                <TopBar />

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Practice Zone 🎯
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Sharpen your skills with targeted practice sessions
                        </p>
                    </div>
                    <button
                        className="flex items-center gap-2 px-5 py-3 rounded-lg text-white font-medium"
                        style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
                        onClick={() => router.push('/mock-interview')}
                    >
                        <Play size={18} /> Start Quick Practice
                    </button>
                </div>

                {/* Quick Start Cards */}
                <div className="grid grid-cols-2 gap-6">
                    <div
                        className="rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}
                        onClick={() => router.push('/dashboard/coding')}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}>
                                        <Code size={28} style={{ color: '#3b82f6' }} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Coding Challenges</h3>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Solve algorithm problems</p>
                                    </div>
                                </div>
                                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                                    Practice coding with real interview questions. Write code, run tests, and improve your skills.
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>JavaScript</span>
                                    <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>Python</span>
                                    <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }}>Java</span>
                                </div>
                            </div>
                            <ChevronRight size={24} style={{ color: '#3b82f6' }} />
                        </div>
                    </div>

                    <div
                        className="rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(236, 72, 153, 0.15))',
                            border: '1px solid rgba(245, 158, 11, 0.3)'
                        }}
                        onClick={() => router.push('/dashboard/practice/assessment')}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}>
                                        <Brain size={28} style={{ color: '#f59e0b' }} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>MCQ & Aptitude</h3>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Test your knowledge</p>
                                    </div>
                                </div>
                                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                                    Take assessments with multiple choice, aptitude, and true/false questions.
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }}>MCQ</span>
                                    <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}>Aptitude</span>
                                    <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>True/False</span>
                                </div>
                            </div>
                            <ChevronRight size={24} style={{ color: '#f59e0b' }} />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                <Target size={24} style={{ color: '#3b82f6' }} />
                            </div>
                            <div>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Sessions</p>
                                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalSessions}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                <Award size={24} style={{ color: '#10b981' }} />
                            </div>
                            <div>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Avg. Score</p>
                                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.avgScore}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                                <Zap size={24} style={{ color: '#f59e0b' }} />
                            </div>
                            <div>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Day Streak</p>
                                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.streak} 🔥</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                                <Clock size={24} style={{ color: '#8b5cf6' }} />
                            </div>
                            <div>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Hours Spent</p>
                                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.hoursSpent}h</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Practice Categories */}
                <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Practice Categories</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {categories.map(category => (
                            <div
                                key={category.id}
                                className="p-5 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
                                style={{
                                    backgroundColor: 'var(--bg-tertiary)',
                                    border: selectedCategory === category.id ? `2px solid ${category.color}` : '2px solid transparent'
                                }}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                                            <category.icon size={24} style={{ color: category.color }} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{category.title}</h4>
                                                {category.isPremium && (
                                                    <span className="px-2 py-0.5 rounded text-xs flex items-center gap-1" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                                                        <Lock size={10} /> Premium
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{category.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span style={{ color: 'var(--text-muted)' }}>{category.completed}/{category.topics} topics</span>
                                        <span style={{ color: category.color }}>{Math.round((category.completed / category.topics) * 100)}%</span>
                                    </div>
                                    <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${(category.completed / category.topics) * 100}%`,
                                                backgroundColor: category.color
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Sessions */}
                <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Recent Practice Sessions</h3>
                        <button
                            className="flex items-center gap-1 text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {recentSessions.map(session => {
                            const difficultyStyle = getDifficultyColor(session.difficulty);
                            return (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between p-4 rounded-lg"
                                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                            <CheckCircle size={20} style={{ color: '#10b981' }} />
                                        </div>
                                        <div>
                                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{session.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{session.category}</span>
                                                <span style={{ color: 'var(--text-muted)' }}>•</span>
                                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{session.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span
                                            className="px-2 py-1 rounded text-xs"
                                            style={{ backgroundColor: difficultyStyle.bg, color: difficultyStyle.color }}
                                        >
                                            {session.difficulty}
                                        </span>
                                        <div className="text-right">
                                            <p className="font-semibold" style={{ color: session.score >= 80 ? '#10b981' : '#f59e0b' }}>
                                                {session.score}%
                                            </p>
                                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{session.completedAt}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recommended Topics */}
                <div className="rounded-xl p-6" style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                    border: '1px solid var(--border-subtle)'
                }}>
                    <div className="flex items-center gap-2 mb-3">
                        <Star size={20} style={{ color: '#f59e0b' }} fill="#f59e0b" />
                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Recommended for You</h3>
                    </div>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                        Based on your resume and target role, we recommend focusing on these areas:
                    </p>
                    <div className="flex gap-3 flex-wrap">
                        {['React Hooks Deep Dive', 'Leadership Stories', 'System Design Basics', 'Problem-Solving'].map(topic => (
                            <button
                                key={topic}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-105"
                                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                onClick={() => router.push('/mock-interview')}
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
