'use client';

import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { MapPin, Clock, DollarSign } from 'lucide-react';

const jobOpenings = [
    {
        title: 'Senior AI Engineer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$180k - $250k'
    },
    {
        title: 'Product Designer',
        department: 'Design',
        location: 'Remote',
        type: 'Full-time',
        salary: '$120k - $160k'
    },
    {
        title: 'Customer Success Manager',
        department: 'Customer Success',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$90k - $120k'
    },
    {
        title: 'Backend Developer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        salary: '$140k - $180k'
    }
];

export default function CareersPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => router.push('/')}
                >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        H
                    </div>
                    <span className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>HireIQ</span>
                </div>
                <ThemeToggle />
            </header>

            {/* Hero */}
            <section className="text-center py-16 px-8" style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(139, 92, 246, 0.1))' }}>
                <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Join Our Team</h1>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    Help us shape the future of hiring. We're looking for talented individuals who are passionate about AI and recruitment.
                </p>
            </section>

            {/* Job Listings */}
            <main className="max-w-4xl mx-auto px-8 py-12">
                <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Open Positions</h2>

                <div className="space-y-4">
                    {jobOpenings.map((job, idx) => (
                        <div
                            key={idx}
                            className="rounded-xl p-6 cursor-pointer transition hover:shadow-lg"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-subtle)'
                            }}
                            onClick={() => alert(`Apply for ${job.title} - This would open the application form`)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{job.department}</p>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {job.type}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <DollarSign size={14} />
                                        {job.salary}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition"
                                style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
                            >
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                        Don't see a role that fits? Send us your resume anyway!
                    </p>
                    <button
                        onClick={() => router.push('/contact')}
                        className="px-6 py-2 rounded-lg transition mr-4"
                        style={{ background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)', color: 'white' }}
                    >
                        Contact Us
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-2 rounded-lg transition"
                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                    >
                        Back to Home
                    </button>
                </div>
            </main>
        </div>
    );
}
