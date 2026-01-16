'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/dashboard/components/Sidebar';
import TopBar from '@/app/dashboard/components/TopBar';
import {
    BookOpen, CheckCircle, Clock, Play, Award, Target, TrendingUp,
    ExternalLink, ChevronRight, Star
} from 'lucide-react';

interface Skill {
    id: string;
    name: string;
    status: 'mastered' | 'learning' | 'missing';
    progress: number;
    courses: number;
    lastPracticed?: string;
}

interface Course {
    id: string;
    title: string;
    skill: string;
    duration: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    rating: number;
    enrolled: boolean;
}

export default function SkillsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'all' | 'mastered' | 'learning' | 'missing'>('all');

    const [skills] = useState<Skill[]>([
        { id: '1', name: 'JavaScript', status: 'mastered', progress: 95, courses: 12, lastPracticed: '2 days ago' },
        { id: '2', name: 'React.js', status: 'mastered', progress: 90, courses: 8, lastPracticed: 'Today' },
        { id: '3', name: 'TypeScript', status: 'learning', progress: 65, courses: 6, lastPracticed: '1 week ago' },
        { id: '4', name: 'Node.js', status: 'learning', progress: 55, courses: 10, lastPracticed: '3 days ago' },
        { id: '5', name: 'GraphQL', status: 'missing', progress: 0, courses: 5 },
        { id: '6', name: 'AWS', status: 'missing', progress: 10, courses: 15 },
        { id: '7', name: 'Docker', status: 'learning', progress: 40, courses: 7 },
        { id: '8', name: 'CI/CD Pipelines', status: 'missing', progress: 0, courses: 4 }
    ]);

    const [recommendedCourses] = useState<Course[]>([
        { id: '1', title: 'GraphQL Fundamentals', skill: 'GraphQL', duration: '4h 30m', level: 'beginner', rating: 4.8, enrolled: false },
        { id: '2', title: 'AWS Solutions Architect', skill: 'AWS', duration: '12h', level: 'intermediate', rating: 4.9, enrolled: false },
        { id: '3', title: 'Docker & Kubernetes Masterclass', skill: 'Docker', duration: '8h', level: 'intermediate', rating: 4.7, enrolled: true },
        { id: '4', title: 'CI/CD with GitHub Actions', skill: 'CI/CD Pipelines', duration: '3h', level: 'beginner', rating: 4.6, enrolled: false }
    ]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'mastered': return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', text: 'Mastered' };
            case 'learning': return { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', text: 'Learning' };
            case 'missing': return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', text: 'Missing' };
            default: return { bg: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', text: status };
        }
    };

    const filteredSkills = skills.filter(skill =>
        activeTab === 'all' || skill.status === activeTab
    );

    const stats = {
        mastered: skills.filter(s => s.status === 'mastered').length,
        learning: skills.filter(s => s.status === 'learning').length,
        missing: skills.filter(s => s.status === 'missing').length
    };

    return (
        <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />

            <main className="flex-1 p-8 space-y-6 overflow-y-auto">
                <TopBar />

                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Skills & Learning</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Track your skills and discover courses to fill gaps</p>
                    </div>
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
                        style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
                    >
                        <Target size={18} /> Take Skill Assessment
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Mastered Skills</p>
                                <p className="text-3xl font-bold" style={{ color: '#10b981' }}>{stats.mastered}</p>
                            </div>
                            <Award size={32} style={{ color: '#10b981' }} />
                        </div>
                    </div>
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Currently Learning</p>
                                <p className="text-3xl font-bold" style={{ color: '#3b82f6' }}>{stats.learning}</p>
                            </div>
                            <TrendingUp size={32} style={{ color: '#3b82f6' }} />
                        </div>
                    </div>
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Skills to Learn</p>
                                <p className="text-3xl font-bold" style={{ color: '#ef4444' }}>{stats.missing}</p>
                            </div>
                            <BookOpen size={32} style={{ color: '#ef4444' }} />
                        </div>
                    </div>
                </div>

                {/* Skills List */}
                <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Your Skills</h2>
                        <div className="flex gap-2">
                            {(['all', 'mastered', 'learning', 'missing'] as const).map(tab => (
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {filteredSkills.map(skill => {
                            const statusStyle = getStatusStyle(skill.status);
                            return (
                                <div
                                    key={skill.id}
                                    className="p-4 rounded-lg cursor-pointer transition hover:scale-[1.02]"
                                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{skill.name}</h3>
                                        <span
                                            className="px-2 py-1 rounded text-xs"
                                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                                        >
                                            {statusStyle.text}
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                                            <span style={{ color: 'var(--text-primary)' }}>{skill.progress}%</span>
                                        </div>
                                        <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${skill.progress}%`, backgroundColor: statusStyle.color }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span style={{ color: 'var(--text-muted)' }}>{skill.courses} courses available</span>
                                        {skill.lastPracticed && (
                                            <span style={{ color: 'var(--text-muted)' }}>Practiced {skill.lastPracticed}</span>
                                        )}
                                    </div>
                                    {skill.status === 'missing' && (
                                        <button
                                            className="w-full mt-3 py-2 rounded-lg text-sm text-white"
                                            style={{ backgroundColor: '#3b82f6' }}
                                        >
                                            Start Learning
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recommended Courses */}
                <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Recommended Courses</h2>
                        <button className="text-sm" style={{ color: '#3b82f6' }}>View All Courses</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {recommendedCourses.map(course => (
                            <div
                                key={course.id}
                                className="p-4 rounded-lg"
                                style={{ backgroundColor: 'var(--bg-tertiary)' }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{course.title}</h3>
                                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>For: {course.skill}</p>
                                    </div>
                                    <span
                                        className="px-2 py-1 rounded text-xs capitalize"
                                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                                    >
                                        {course.level}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} /> {course.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star size={14} fill="#f59e0b" stroke="#f59e0b" /> {course.rating}
                                    </span>
                                </div>
                                <button
                                    className="w-full py-2 rounded-lg text-sm transition"
                                    style={{
                                        backgroundColor: course.enrolled ? 'var(--bg-secondary)' : '#3b82f6',
                                        color: course.enrolled ? 'var(--text-primary)' : 'white'
                                    }}
                                >
                                    {course.enrolled ? 'Continue Learning' : 'Enroll Now'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
