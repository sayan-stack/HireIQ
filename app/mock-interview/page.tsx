'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/dashboard/components/Sidebar';
import TopBar from '@/app/dashboard/components/TopBar';
import {
    Code, Users, Briefcase, Lock, Star, TrendingUp, Target, AlertTriangle,
    Settings, ArrowRight, Sparkles, ChevronDown, ChevronUp, Eye, EyeOff,
    Zap, Brain, Rocket
} from 'lucide-react';

interface SessionType {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    locked: boolean;
}

export default function MockInterviewPracticePage() {
    const router = useRouter();
    const [userName, setUserName] = useState('Alex Johnson');
    const [plan, setPlan] = useState('Free Plan');

    // Toggle states
    const [showStats, setShowStats] = useState(true);
    const [showPremiumSessions, setShowPremiumSessions] = useState(true);
    const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [compactView, setCompactView] = useState(false);

    const difficultyConfig = {
        easy: { label: 'Easy', color: '#10b981', icon: Zap, description: 'Perfect for beginners' },
        medium: { label: 'Medium', color: '#f59e0b', icon: Brain, description: 'Balanced challenge' },
        hard: { label: 'Hard', color: '#ef4444', icon: Rocket, description: 'Expert level' }
    };

    const [stats] = useState({
        usedInterviews: 3,
        totalInterviews: 10,
        daysUntilReset: 14,
        averageScore: 7.5,
        scoreChange: '+12%',
        readiness: 68,
        weakestArea: 'System Design'
    });

    const [sessions] = useState<SessionType[]>([
        {
            id: '1',
            title: 'Technical',
            description: 'Algorithms, Data Structures, and coding challenges.',
            icon: <Code size={24} />,
            color: '#3b82f6',
            locked: false
        },
        {
            id: '2',
            title: 'Behavioral',
            description: 'Master the STAR method for cultural fit questions.',
            icon: <Users size={24} />,
            color: '#f97316',
            locked: false
        },
        {
            id: '3',
            title: 'HR Screening',
            description: 'Common introductory questions and soft skills.',
            icon: <Briefcase size={24} />,
            color: '#10b981',
            locked: false
        }
    ]);

    const [premiumSessions] = useState([
        { title: 'System Design', description: 'Architecture and scalability patterns', color: '#ef4444' },
        { title: 'Live Coding', description: 'Real-time coding with feedback', color: '#8b5cf6' },
        { title: 'Custom Interview', description: 'AI-powered custom scenarios', color: '#ec4899' }
    ]);

    useEffect(() => {
        const userData = localStorage.getItem('hireiq_user');
        if (userData) {
            const user = JSON.parse(userData);
            const name = user.profile?.firstName
                ? `${user.profile.firstName} ${user.profile.lastName || ''}`
                : user.name || 'Alex Johnson';
            setUserName(name);
        }
    }, []);

    const remainingInterviews = stats.totalInterviews - stats.usedInterviews;
    const usagePercentage = (stats.usedInterviews / stats.totalInterviews) * 100;

    return (
        <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />

            <main className="flex-1 p-8 space-y-6 overflow-y-auto">
                <TopBar />

                {/* Page Header with Toggle Controls */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Mock Interview Practice</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Practice. Improve. Perform better in real interviews.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Compact View Toggle */}
                        <button
                            onClick={() => setCompactView(!compactView)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                            style={{
                                backgroundColor: compactView ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                border: '1px solid var(--border-subtle)',
                                color: compactView ? 'white' : 'var(--text-secondary)'
                            }}
                        >
                            {compactView ? <Eye size={18} /> : <EyeOff size={18} />}
                            {compactView ? 'Full View' : 'Compact'}
                        </button>

                        {/* Stats Toggle */}
                        <button
                            onClick={() => setShowStats(!showStats)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            {showStats ? 'Hide Stats' : 'Show Stats'}
                            {showStats ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        <button
                            className="flex items-center gap-2 px-5 py-3 rounded-lg text-white font-medium"
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
                            onClick={() => router.push('/premium')}
                        >
                            Upgrade to Premium <Star size={18} fill="white" />
                        </button>
                    </div>
                </div>

                {/* Difficulty Level Toggle */}
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Difficulty Level</h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {difficultyConfig[selectedDifficulty].description}
                            </p>
                        </div>
                        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                            {(Object.keys(difficultyConfig) as Array<keyof typeof difficultyConfig>).map(level => {
                                const config = difficultyConfig[level];
                                const Icon = config.icon;
                                const isSelected = selectedDifficulty === level;

                                return (
                                    <button
                                        key={level}
                                        onClick={() => setSelectedDifficulty(level)}
                                        className="flex items-center gap-2 px-4 py-2 transition-all"
                                        style={{
                                            backgroundColor: isSelected ? config.color : 'var(--bg-tertiary)',
                                            color: isSelected ? 'white' : 'var(--text-secondary)'
                                        }}
                                    >
                                        <Icon size={16} />
                                        {config.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Free Plan Status */}
                <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Free Plan Status</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span style={{ color: 'var(--text-secondary)' }}>Resets in {stats.daysUntilReset} days</span>
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{Math.round(usagePercentage)}%</span>
                        </div>
                    </div>
                    <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>
                        You have <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{remainingInterviews} / {stats.totalInterviews}</span> free mock interviews remaining
                    </p>
                    <div className="h-3 rounded-full mb-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <div
                            className="h-full rounded-full transition-all"
                            style={{
                                width: `${usagePercentage}%`,
                                background: 'linear-gradient(90deg, #ef4444, #f59e0b, #10b981)'
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {stats.totalInterviews - remainingInterviews} attempts left before you hit your monthly limit.
                        </p>
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                            onClick={() => router.push('/premium')}
                        >
                            <Lock size={14} /> Unlock Unlimited
                        </button>
                    </div>
                </div>

                {/* Stats Cards - Collapsible */}
                <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                        maxHeight: showStats ? '500px' : '0',
                        opacity: showStats ? 1 : 0
                    }}
                >
                    <div className="grid grid-cols-3 gap-6">
                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Average Score</p>
                                    <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                        {stats.averageScore}<span className="text-xl" style={{ color: 'var(--text-muted)' }}>/10</span>
                                    </p>
                                    <p className="text-sm mt-1" style={{ color: '#10b981' }}>{stats.scoreChange} from last week</p>
                                </div>
                                <TrendingUp size={32} style={{ color: '#10b981' }} />
                            </div>
                        </div>

                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Readiness</p>
                                    <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.readiness}%</p>
                                    <p className="text-sm mt-1" style={{ color: '#3b82f6' }}>On track for Level 4</p>
                                </div>
                                <Target size={32} style={{ color: '#3b82f6' }} />
                            </div>
                        </div>

                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Weakest Area</p>
                                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.weakestArea}</p>
                                    <button
                                        className="text-sm mt-1"
                                        style={{ color: '#3b82f6' }}
                                        onClick={() => router.push('/dashboard/skills')}
                                    >
                                        View recommended resources
                                    </button>
                                </div>
                                <AlertTriangle size={32} style={{ color: '#f59e0b' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Start a New Session */}
                <div>
                    <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Start a New Session</h2>
                    <div className="grid grid-cols-3 gap-6">
                        {sessions.map(session => (
                            <div
                                key={session.id}
                                className={`rounded-xl ${compactView ? 'p-4' : 'p-6'} cursor-pointer transition hover:scale-[1.02]`}
                                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
                                onClick={() => router.push(`/dashboard/interview-session?type=${session.title.toLowerCase()}&difficulty=${selectedDifficulty}`)}
                            >
                                <div
                                    className={`${compactView ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg flex items-center justify-center mb-4 text-white`}
                                    style={{ backgroundColor: session.color }}
                                >
                                    {session.icon}
                                </div>
                                <h3 className={`font-semibold ${compactView ? 'text-base' : 'text-lg'} mb-2`} style={{ color: 'var(--text-primary)' }}>{session.title}</h3>
                                {!compactView && (
                                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{session.description}</p>
                                )}
                                <button
                                    className={`w-full ${compactView ? 'py-2' : 'py-3'} rounded-lg text-white font-medium transition`}
                                    style={{ backgroundColor: session.color }}
                                >
                                    Start Interview
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Premium Sessions Toggle */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Premium Sessions</h2>
                        <button
                            onClick={() => setShowPremiumSessions(!showPremiumSessions)}
                            className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                        >
                            {showPremiumSessions ? 'Hide' : 'Show'}
                            {showPremiumSessions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>

                    <div
                        className="overflow-hidden transition-all duration-300"
                        style={{
                            maxHeight: showPremiumSessions ? '400px' : '0',
                            opacity: showPremiumSessions ? 1 : 0
                        }}
                    >
                        <div className="grid grid-cols-3 gap-6">
                            {premiumSessions.map((session, index) => (
                                <div
                                    key={index}
                                    className={`rounded-xl ${compactView ? 'p-4' : 'p-6'} relative overflow-hidden`}
                                    style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', opacity: 0.7 }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="flex flex-col items-center">
                                            <Lock size={32} style={{ color: 'var(--text-muted)' }} />
                                            <button
                                                className="mt-3 px-4 py-2 rounded-lg text-sm"
                                                style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
                                                onClick={() => router.push('/premium')}
                                            >
                                                Upgrade to Unlock
                                            </button>
                                        </div>
                                    </div>
                                    <div className="blur-sm">
                                        <div
                                            className={`${compactView ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg flex items-center justify-center mb-4`}
                                            style={{ backgroundColor: session.color }}
                                        >
                                            <Sparkles size={24} className="text-white" />
                                        </div>
                                        <h3 className={`font-semibold ${compactView ? 'text-base' : 'text-lg'} mb-2`} style={{ color: 'var(--text-primary)' }}>{session.title}</h3>
                                        {!compactView && (
                                            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{session.description}</p>
                                        )}
                                        <button className={`w-full ${compactView ? 'py-2' : 'py-3'} rounded-lg`} style={{ backgroundColor: session.color }}>
                                            Locked
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
