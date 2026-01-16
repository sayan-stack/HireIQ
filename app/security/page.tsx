'use client';

import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { Shield, Lock, Eye, Server, CheckCircle } from 'lucide-react';

export default function SecurityPage() {
    const router = useRouter();

    const securityFeatures = [
        {
            icon: Lock,
            title: 'End-to-End Encryption',
            desc: 'All data is encrypted in transit and at rest using AES-256 encryption.'
        },
        {
            icon: Shield,
            title: 'SOC 2 Compliant',
            desc: 'We maintain SOC 2 Type II compliance for enterprise-grade security.'
        },
        {
            icon: Eye,
            title: 'Privacy by Design',
            desc: 'Built with privacy-first principles and GDPR compliance.'
        },
        {
            icon: Server,
            title: 'Secure Infrastructure',
            desc: 'Hosted on AWS with multi-region redundancy and 99.99% uptime SLA.'
        }
    ];

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

            {/* Content */}
            <main className="max-w-4xl mx-auto px-8 py-12">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)' }}>
                        <Shield size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Security at HireIQ</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Your data security is our top priority. We implement industry-leading security measures to protect your information.
                    </p>
                </div>

                {/* Security Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {securityFeatures.map((feature, idx) => (
                        <div key={idx} className="rounded-xl p-6" style={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)'
                        }}>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
                                    <feature.icon size={24} style={{ color: 'var(--accent-primary)' }} />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Certifications */}
                <div className="rounded-xl p-6 mb-12" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)'
                }}>
                    <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Our Certifications</h2>
                    <div className="space-y-3">
                        {[
                            'SOC 2 Type II Certified',
                            'GDPR Compliant',
                            'ISO 27001 Certified',
                            'CCPA Compliant',
                            'Regular Third-Party Security Audits'
                        ].map((cert, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <CheckCircle size={20} style={{ color: 'var(--accent-primary)' }} />
                                <span style={{ color: 'var(--text-primary)' }}>{cert}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                        Have security questions? Contact our security team.
                    </p>
                    <button
                        onClick={() => router.push('/contact')}
                        className="px-6 py-2 rounded-lg transition mr-4"
                        style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
                    >
                        Contact Security Team
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
