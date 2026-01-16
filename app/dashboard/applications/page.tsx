'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/dashboard/components/Sidebar';
import TopBar from '@/app/dashboard/components/TopBar';
import {
    Search, Upload, Filter, ChevronDown, CheckCircle, Clock, XCircle,
    Calendar, Video, AlertCircle, ExternalLink, Lightbulb, Archive, X
} from 'lucide-react';
import { useApplications, Application } from '@/contexts/ApplicationContext';

export default function JobApplicationsPage() {
    const router = useRouter();
    const { applications, updateApplication, loading } = useApplications();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [jobTypeFilter, setJobTypeFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'shortlisted', label: 'Shortlisted' },
        { value: 'interview', label: 'Interview Scheduled' },
        { value: 'applied', label: 'Applied' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'offer', label: 'Offer' }
    ];

    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'Full-time', label: 'Full-time' },
        { value: 'Part-time', label: 'Part-time' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Internship', label: 'Internship' }
    ];

    const dateOptions = [
        { value: 'all', label: 'All Time' },
        { value: '7', label: 'Last 7 Days' },
        { value: '30', label: 'Last 30 Days' },
        { value: '90', label: 'Last 90 Days' }
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'shortlisted':
                return { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', text: 'Shortlisted' };
            case 'interview':
                return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', text: 'Interview Scheduled' };
            case 'rejected':
                return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', text: 'Rejected' };
            case 'applied':
                return { bg: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', text: 'Applied' };
            case 'offer':
                return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', text: 'Offer' };
            default:
                return { bg: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', text: status };
        }
    };

    const getScoreBarColor = (score: number, cutoff: number) => {
        if (score >= cutoff) return '#10b981';
        if (score >= cutoff - 10) return '#f59e0b';
        return '#ef4444';
    };

    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setJobTypeFilter('all');
        setDateFilter('all');
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = searchQuery === '' ||
            app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.position.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        const matchesType = jobTypeFilter === 'all' || app.type === jobTypeFilter;

        let matchesDate = true;
        if (dateFilter !== 'all') {
            const daysAgo = parseInt(dateFilter);
            const appDate = new Date(app.dateApplied);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
            matchesDate = appDate >= cutoffDate;
        }

        return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    const handleJoinMeeting = (app: Application) => {
        alert(`Joining meeting for ${app.position} at ${app.company}...\n\nIn a real implementation, this would open the video call link from the interview invitation.`);
    };

    const handleReschedule = async (app: Application) => {
        const newDate = prompt(`Reschedule interview for ${app.position}?\n\nEnter new date (e.g., "Oct 28"):`, app.interview?.date);
        if (newDate && app.interview) {
            await updateApplication(app.id, {
                interview: { ...app.interview, date: newDate }
            });
            alert(`Interview rescheduled to ${newDate}`);
        }
    };

    return (
        <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />

            <main className="flex-1 p-8 space-y-6 overflow-y-auto">
                <TopBar />

                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>My Job Applications</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Track your applications and interview progress</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg transition hover:opacity-80"
                            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                            onClick={() => window.open('https://linkedin.com/jobs', '_blank')}
                        >
                            <Search size={16} /> Browse Jobs
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition hover:opacity-80"
                            style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
                            onClick={() => router.push('/dashboard/profile')}
                        >
                            <Upload size={16} /> Upload Updated Resume
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search by job title or company..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg outline-none"
                            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                        />
                        {searchQuery && (
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onClick={() => setSearchQuery('')}
                            >
                                <X size={16} style={{ color: 'var(--text-muted)' }} />
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        {/* Status Filter */}
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                                onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowTypeDropdown(false); setShowDateDropdown(false); }}
                            >
                                {statusOptions.find(o => o.value === statusFilter)?.label} <ChevronDown size={16} />
                            </button>
                            {showStatusDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-48 rounded-lg overflow-hidden z-20" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                                    {statusOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-tertiary)] transition"
                                            style={{ color: statusFilter === opt.value ? '#3b82f6' : 'var(--text-primary)' }}
                                            onClick={() => { setStatusFilter(opt.value); setShowStatusDropdown(false); }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Job Type Filter */}
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                                onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowStatusDropdown(false); setShowDateDropdown(false); }}
                            >
                                {typeOptions.find(o => o.value === jobTypeFilter)?.label} <ChevronDown size={16} />
                            </button>
                            {showTypeDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-40 rounded-lg overflow-hidden z-20" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                                    {typeOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-tertiary)] transition"
                                            style={{ color: jobTypeFilter === opt.value ? '#3b82f6' : 'var(--text-primary)' }}
                                            onClick={() => { setJobTypeFilter(opt.value); setShowTypeDropdown(false); }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Date Filter */}
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                                onClick={() => { setShowDateDropdown(!showDateDropdown); setShowStatusDropdown(false); setShowTypeDropdown(false); }}
                            >
                                {dateOptions.find(o => o.value === dateFilter)?.label} <ChevronDown size={16} />
                            </button>
                            {showDateDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-40 rounded-lg overflow-hidden z-20" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                                    {dateOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-tertiary)] transition"
                                            style={{ color: dateFilter === opt.value ? '#3b82f6' : 'var(--text-primary)' }}
                                            onClick={() => { setDateFilter(opt.value); setShowDateDropdown(false); }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            className="text-sm hover:underline"
                            style={{ color: '#3b82f6' }}
                            onClick={resetFilters}
                        >
                            Reset filters
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Showing {filteredApplications.length} of {applications.length} applications
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                    {filteredApplications.length === 0 ? (
                        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <Search size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Applications Found</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                            <button
                                className="mt-4 px-4 py-2 rounded-lg text-white"
                                style={{ backgroundColor: '#3b82f6' }}
                                onClick={resetFilters}
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        filteredApplications.map(app => {
                            const statusStyle = getStatusStyle(app.status);
                            return (
                                <div
                                    key={app.id}
                                    className="rounded-xl p-6"
                                    style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
                                >
                                    {/* Header Row */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                                                style={{ backgroundColor: app.logoColor }}
                                            >
                                                {app.logo}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{app.position}</h3>
                                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                    {app.company} • {app.type} • {app.location}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                                        >
                                            {app.status === 'interview' && <Calendar size={14} />}
                                            {app.status === 'rejected' && <XCircle size={14} />}
                                            {statusStyle.text}
                                        </span>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs uppercase mb-1" style={{ color: 'var(--text-muted)' }}>ATS Score</p>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{app.atsScore}/100</span>
                                                <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${app.atsScore}%`, backgroundColor: getScoreBarColor(app.atsScore, app.cutoff) }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Cut-off 🔒</p>
                                            <span style={{ color: 'var(--text-muted)' }}>{app.cutoff}% Match</span>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Job Match</p>
                                            <span style={{ color: app.jobMatch >= 70 ? '#10b981' : '#ef4444' }}>{app.jobMatch}% Match</span>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Activity</p>
                                            <span style={{ color: 'var(--text-secondary)' }}>{app.activity}</span>
                                        </div>
                                    </div>

                                    {/* Insight/Interview Info */}
                                    {app.insight && (
                                        <div
                                            className="flex items-start gap-2 p-3 rounded-lg mb-4"
                                            style={{
                                                backgroundColor: app.insight.type === 'positive' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                borderLeft: `3px solid ${app.insight.type === 'positive' ? '#10b981' : '#ef4444'}`
                                            }}
                                        >
                                            <Lightbulb size={16} style={{ color: app.insight.type === 'positive' ? '#10b981' : '#ef4444', marginTop: 2 }} />
                                            <div>
                                                <span style={{ color: app.insight.type === 'positive' ? '#10b981' : '#ef4444' }}>
                                                    {app.insight.message}
                                                </span>
                                                {app.insight.link && (
                                                    <button
                                                        className="ml-2 text-sm hover:underline"
                                                        style={{ color: '#3b82f6' }}
                                                        onClick={() => router.push('/dashboard/skills')}
                                                    >
                                                        {app.insight.link}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {app.interview && (
                                        <>
                                            <div className="grid grid-cols-3 gap-4 mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                                <div>
                                                    <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Date & Time</p>
                                                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{app.interview.date}, {app.interview.time}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Round</p>
                                                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{app.interview.round} ({app.interview.duration})</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Interviewers</p>
                                                    <div className="flex -space-x-2">
                                                        {[...Array(app.interview.interviewers)].map((_, i) => (
                                                            <div key={i} className="w-8 h-8 rounded-full bg-gray-500 border-2" style={{ borderColor: 'var(--bg-secondary)' }} />
                                                        ))}
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                                                            +1
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {app.interview.alert && (
                                                <div
                                                    className="flex items-center gap-2 p-3 rounded-lg mb-4"
                                                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444' }}
                                                >
                                                    <AlertCircle size={16} style={{ color: '#ef4444' }} />
                                                    <span style={{ color: '#ef4444' }}>{app.interview.alert}</span>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        {app.status === 'shortlisted' && (
                                            <>
                                                <button
                                                    className="px-4 py-2 rounded-lg text-white transition hover:opacity-80"
                                                    style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
                                                    onClick={() => router.push('/mock-interview')}
                                                >
                                                    Prepare for Interview
                                                </button>
                                                <button
                                                    className="px-4 py-2 rounded-lg transition hover:opacity-80"
                                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                                    onClick={() => router.push('/dashboard/profile')}
                                                >
                                                    View Details
                                                </button>
                                            </>
                                        )}
                                        {app.status === 'interview' && (
                                            <>
                                                <button
                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition hover:opacity-80"
                                                    style={{ backgroundColor: '#3b82f6' }}
                                                    onClick={() => handleJoinMeeting(app)}
                                                >
                                                    <Video size={16} /> Join Meeting
                                                </button>
                                                <button
                                                    className="px-4 py-2 rounded-lg transition hover:opacity-80"
                                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                                    onClick={() => handleReschedule(app)}
                                                >
                                                    Reschedule
                                                </button>
                                            </>
                                        )}
                                        {app.status === 'rejected' && (
                                            <>
                                                <button
                                                    className="px-4 py-2 rounded-lg transition hover:opacity-80"
                                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                                    onClick={() => router.push('/dashboard/feedback')}
                                                >
                                                    View Feedback
                                                </button>
                                                <button
                                                    className="px-4 py-2 rounded-lg transition hover:opacity-80"
                                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                                    onClick={() => window.open('https://linkedin.com/jobs', '_blank')}
                                                >
                                                    Apply to Similar Roles
                                                </button>
                                            </>
                                        )}
                                        {app.status === 'applied' && (
                                            <>
                                                <button
                                                    className="px-4 py-2 rounded-lg transition hover:opacity-80"
                                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                                    onClick={() => router.push('/dashboard/profile')}
                                                >
                                                    View Resume Sent
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Archived Applications */}
                <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <Archive size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Archived Applications</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Applications older than 90 days will appear here.<br />
                        Keep applying to keep your pipeline fresh!
                    </p>
                </div>
            </main>
        </div>
    );
}
