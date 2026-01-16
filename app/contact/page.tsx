'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

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
            <main className="max-w-6xl mx-auto px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Contact Us</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Have questions? We'd love to hear from you.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Get in Touch</h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                        <Mail size={20} style={{ color: 'var(--accent-primary)' }} />
                                    </div>
                                    <div>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email</p>
                                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>support@hireiq.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                        <Phone size={20} style={{ color: 'var(--accent-primary)' }} />
                                    </div>
                                    <div>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Phone</p>
                                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                        <MapPin size={20} style={{ color: 'var(--accent-primary)' }} />
                                    </div>
                                    <div>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Address</p>
                                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>123 Innovation Drive, San Francisco, CA 94105</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>We'll get back to you as soon as possible.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 px-6 py-2 rounded-lg transition"
                                    style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg outline-none"
                                        style={{
                                            backgroundColor: 'var(--bg-input)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)'
                                        }}
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg outline-none"
                                        style={{
                                            backgroundColor: 'var(--bg-input)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)'
                                        }}
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg outline-none"
                                        style={{
                                            backgroundColor: 'var(--bg-input)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)'
                                        }}
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg outline-none resize-none"
                                        style={{
                                            backgroundColor: 'var(--bg-input)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)'
                                        }}
                                        placeholder="Your message..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition"
                                    style={{ background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)' }}
                                >
                                    {isSubmitting ? 'Sending...' : (
                                        <>
                                            Send Message
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="mt-12 text-center">
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
