'use client';

import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

export default function TermsPage() {
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

            {/* Content */}
            <main className="max-w-4xl mx-auto px-8 py-12">
                <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Terms of Service</h1>

                <div className="space-y-6" style={{ color: 'var(--text-secondary)' }}>
                    <section>
                        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>1. Acceptance of Terms</h2>
                        <p>By accessing and using HireIQ, you accept and agree to be bound by the terms and provisions of this agreement.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>2. Use License</h2>
                        <p>Permission is granted to temporarily use HireIQ for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>3. User Account</h2>
                        <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>4. Prohibited Uses</h2>
                        <p>You may not use HireIQ for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>5. Modifications</h2>
                        <p>HireIQ reserves the right to modify or replace these Terms at any time. It is your responsibility to check these Terms periodically for changes.</p>
                    </section>
                </div>

                <div className="mt-12">
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
