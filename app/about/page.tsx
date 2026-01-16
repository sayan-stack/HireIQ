'use client';

import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { Users, Target, Rocket, Heart } from 'lucide-react';

export default function AboutPage() {
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
            <section className="text-center py-16 px-8">
                <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>About HireIQ</h1>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    We're on a mission to revolutionize the hiring process with AI-powered solutions that make recruiting smarter, faster, and fairer.
                </p>
            </section>

            {/* Values */}
            <main className="max-w-6xl mx-auto px-8 py-12">
                <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Target, title: 'Precision', desc: 'AI-driven matching with unparalleled accuracy' },
                        { icon: Users, title: 'Inclusivity', desc: 'Bias-free hiring for diverse workplaces' },
                        { icon: Rocket, title: 'Innovation', desc: 'Cutting-edge technology for modern recruitment' },
                        { icon: Heart, title: 'Human-First', desc: 'Technology that enhances human decision-making' }
                    ].map((value, idx) => (
                        <div key={idx} className="rounded-xl p-6 text-center" style={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)'
                        }}>
                            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)' }}>
                                <value.icon size={28} className="text-white" />
                            </div>
                            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{value.title}</h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{value.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { stat: '10,000+', label: 'Companies Trust Us' },
                        { stat: '1M+', label: 'Candidates Placed' },
                        { stat: '95%', label: 'Customer Satisfaction' }
                    ].map((item, idx) => (
                        <div key={idx} className="text-center py-8 rounded-xl" style={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)'
                        }}>
                            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent">
                                {item.stat}
                            </div>
                            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>{item.label}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-2 rounded-lg transition"
                        style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
                    >
                        Back to Home
                    </button>
                </div>
            </main>
        </div>
    );
}
