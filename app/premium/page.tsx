'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Star, Check, Zap, Lock, Crown, Sparkles, TrendingUp,
    Users, Video, FileText, BarChart, Award
} from 'lucide-react';

interface PlanFeature {
    text: string;
    included: boolean;
}

interface Plan {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    features: PlanFeature[];
    popular?: boolean;
    current?: boolean;
}

export default function PremiumPage() {
    const router = useRouter();

    const [plans] = useState<Plan[]>([
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            period: '/month',
            description: 'Perfect for getting started',
            current: true,
            features: [
                { text: '10 mock interviews per month', included: true },
                { text: 'Basic ATS score analysis', included: true },
                { text: '3 resume versions', included: true },
                { text: 'Community support', included: true },
                { text: 'Recruiter cut-off scores', included: false },
                { text: 'Advanced analytics', included: false },
                { text: 'Priority support', included: false },
                { text: 'Custom interview scenarios', included: false }
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '$19',
            period: '/month',
            description: 'Best for active job seekers',
            popular: true,
            features: [
                { text: 'Unlimited mock interviews', included: true },
                { text: 'Advanced ATS analysis', included: true },
                { text: 'Unlimited resume versions', included: true },
                { text: 'Priority email support', included: true },
                { text: 'Recruiter cut-off scores', included: true },
                { text: 'Advanced analytics', included: true },
                { text: 'AI-powered feedback', included: true },
                { text: 'Custom interview scenarios', included: false }
            ]
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: '$49',
            period: '/month',
            description: 'For serious professionals',
            features: [
                { text: 'Everything in Pro', included: true },
                { text: 'Custom interview scenarios', included: true },
                { text: '1-on-1 career coaching', included: true },
                { text: 'Resume writing service', included: true },
                { text: 'Dedicated account manager', included: true },
                { text: 'API access', included: true },
                { text: 'Team management', included: true },
                { text: 'White-label options', included: true }
            ]
        }
    ]);

    const benefits = [
        { icon: <Video size={24} />, title: 'Unlimited Interviews', description: 'Practice as much as you need with AI-powered mock interviews' },
        { icon: <BarChart size={24} />, title: 'Advanced Analytics', description: 'Get detailed insights into your performance and progress' },
        { icon: <Lock size={24} />, title: 'Recruiter Insights', description: 'See cut-off scores and what recruiters are looking for' },
        { icon: <Award size={24} />, title: 'Priority Support', description: '24/7 support from our career experts team' }
    ];

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            {/* Header */}
            <div className="text-center py-16 px-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Crown size={32} style={{ color: '#f59e0b' }} />
                    <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Upgrade to Premium</h1>
                </div>
                <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    Unlock unlimited interviews, advanced analytics, and recruiter insights to land your dream job faster.
                </p>
            </div>

            {/* Benefits */}
            <div className="max-w-6xl mx-auto px-8 mb-16">
                <div className="grid grid-cols-4 gap-6">
                    {benefits.map((benefit, i) => (
                        <div
                            key={i}
                            className="rounded-xl p-6 text-center"
                            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
                        >
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                                style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)', color: 'white' }}
                            >
                                {benefit.icon}
                            </div>
                            <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{benefit.title}</h3>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-6xl mx-auto px-8 pb-16">
                <div className="grid grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <div
                            key={plan.id}
                            className="rounded-xl p-6 relative"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                border: plan.popular ? '2px solid #3b82f6' : '1px solid var(--border-subtle)'
                            }}
                        >
                            {plan.popular && (
                                <div
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs text-white font-medium"
                                    style={{ backgroundColor: '#3b82f6' }}
                                >
                                    Most Popular
                                </div>
                            )}
                            {plan.current && (
                                <div
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium"
                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                                >
                                    Current Plan
                                </div>
                            )}

                            <div className="text-center mb-6 pt-4">
                                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                                <div className="flex items-end justify-center gap-1">
                                    <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{plan.price}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                                </div>
                                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        {feature.included ? (
                                            <Check size={16} style={{ color: '#10b981' }} />
                                        ) : (
                                            <Lock size={16} style={{ color: 'var(--text-muted)' }} />
                                        )}
                                        <span style={{ color: feature.included ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className="w-full py-3 rounded-lg font-medium transition"
                                style={{
                                    background: plan.current ? 'var(--bg-tertiary)' : plan.popular ? 'linear-gradient(135deg, #14b8a6, #3b82f6)' : 'var(--bg-tertiary)',
                                    color: plan.current ? 'var(--text-muted)' : plan.popular ? 'white' : 'var(--text-primary)'
                                }}
                                disabled={plan.current}
                            >
                                {plan.current ? 'Current Plan' : plan.popular ? 'Upgrade Now' : 'Get Started'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Back Button */}
            <div className="text-center pb-16">
                <button
                    onClick={() => router.back()}
                    className="text-sm"
                    style={{ color: 'var(--text-muted)' }}
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
}
