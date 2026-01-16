'use client';

import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

export default function PrivacyPage() {
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
                <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Privacy Policy</h1>

                <div className="space-y-6" style={{ color: 'var(--text-secondary)' }}>
                    <section>
                        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, including your name, email address, phone number, and any other information you choose to provide when using HireIQ.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, send you technical notices and support messages, and respond to your comments and questions.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>3. Information Sharing</h2>
                        <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>4. Data Security</h2>
                        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>5. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at privacy@hireiq.com</p>
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
