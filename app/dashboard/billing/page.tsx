'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../profile/profile.module.css';
import ThemeToggle from '@/components/ThemeToggle';
interface PaymentMethod {
    id: string;
    type: 'visa' | 'mastercard' | 'amex';
    last4: string;
    expiry: string;
    isDefault: boolean;
}

interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'paid' | 'pending' | 'failed';
}

export default function BillingPage() {
    const router = useRouter();
    const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        { id: '1', type: 'visa', last4: '4242', expiry: '12/25', isDefault: true }
    ]);
    const [invoices, setInvoices] = useState<Invoice[]>([
        { id: 'INV-001', date: '2024-12-01', amount: '$0.00', status: 'paid' },
        { id: 'INV-002', date: '2024-11-01', amount: '$0.00', status: 'paid' },
    ]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('hireiq_user');
        if (user) {
            const userData = JSON.parse(user);
            if (userData.billing) {
                setCurrentPlan(userData.billing.plan || 'free');
                if (userData.billing.paymentMethods) {
                    setPaymentMethods(userData.billing.paymentMethods);
                }
                if (userData.billing.invoices) {
                    setInvoices(userData.billing.invoices);
                }
            }
        }
    }, []);

    const handleUpgrade = (plan: 'pro' | 'enterprise') => {
        console.log('Upgrading to:', plan);

        const user = localStorage.getItem('hireiq_user');
        if (user) {
            const userData = JSON.parse(user);
            userData.billing = { ...userData.billing, plan };
            localStorage.setItem('hireiq_user', JSON.stringify(userData));
        }

        setCurrentPlan(plan);
        setNotificationMessage(`Successfully upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan!`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const handleAddPaymentMethod = () => {
        console.log('Adding payment method...');
        setNotificationMessage('Payment method form would open here');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const plans = [
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            period: '/month',
            features: ['5 job applications/month', 'Basic profile', 'Email support'],
            current: currentPlan === 'free'
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '$19',
            period: '/month',
            features: ['Unlimited applications', 'Priority profile visibility', 'Resume builder', 'Analytics dashboard', 'Priority support'],
            current: currentPlan === 'pro',
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: '$49',
            period: '/month',
            features: ['Everything in Pro', 'Dedicated account manager', 'Custom branding', 'API access', 'Advanced analytics'],
            current: currentPlan === 'enterprise'
        }
    ];

    const getCardIcon = (type: string) => {
        switch (type) {
            case 'visa': return '💳 Visa';
            case 'mastercard': return '💳 Mastercard';
            case 'amex': return '💳 Amex';
            default: return '💳';
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <nav className={styles.breadcrumb}>
                    <span
                        className={`${styles.breadcrumbItem} ${styles.breadcrumbLink}`}
                        onClick={() => router.push('/')}
                    >
                        Home
                    </span>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <span
                        className={`${styles.breadcrumbItem} ${styles.breadcrumbLink}`}
                        onClick={() => router.push('/dashboard/security')}
                    >
                        Settings
                    </span>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <span className={styles.breadcrumbActive}>Billing</span>
                </nav>
                <ThemeToggle />
            </header>

            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Billing & Plans</h1>
                    <p className={styles.pageSubtitle}>Manage your subscription and payment methods</p>
                </div>
            </div>

            {/* Plans Section */}
            <div style={{ padding: '0 2rem', marginBottom: '1.5rem' }}>
                <h2 className={styles.sectionTitle}>Choose Your Plan</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {plans.map(plan => (
                        <div key={plan.id} style={{
                            background: 'var(--bg-secondary)',
                            border: plan.popular ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            position: 'relative',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            {plan.popular && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
                                    color: 'white',
                                    padding: '0.25rem 1rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                }}>
                                    Most Popular
                                </span>
                            )}
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                {plan.name}
                            </h3>
                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{plan.price}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{ color: 'var(--accent-primary)' }}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => plan.id !== 'free' && handleUpgrade(plan.id as 'pro' | 'enterprise')}
                                disabled={plan.current}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    border: plan.current ? '1px solid var(--border-color)' : 'none',
                                    background: plan.current ? 'transparent' : (plan.popular ? 'var(--accent-primary)' : 'var(--bg-tertiary)'),
                                    color: plan.current ? 'var(--text-muted)' : (plan.popular ? 'white' : 'var(--text-primary)'),
                                    fontWeight: 500,
                                    cursor: plan.current ? 'default' : 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {plan.current ? 'Current Plan' : 'Upgrade'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className={styles.contentGrid}>
                {/* Payment Methods */}
                <div className={styles.section}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Payment Methods</h2>
                        <button
                            onClick={handleAddPaymentMethod}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'var(--bg-tertiary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-primary)',
                                fontSize: '0.875rem',
                                cursor: 'pointer'
                            }}
                        >
                            + Add New
                        </button>
                    </div>

                    {paymentMethods.map(method => (
                        <div key={method.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: 'var(--bg-tertiary)',
                            borderRadius: '10px',
                            marginBottom: '0.75rem',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>{getCardIcon(method.type)}</span>
                                <div>
                                    <span style={{ fontWeight: 500, color: 'var(--text-primary)', display: 'block' }}>
                                        •••• {method.last4}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Expires {method.expiry}
                                    </span>
                                </div>
                            </div>
                            {method.isDefault && (
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    background: 'rgba(20, 184, 166, 0.15)',
                                    color: 'var(--accent-primary)',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 500
                                }}>
                                    Default
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Billing History */}
                <div className={styles.sectionSmall}>
                    <h2 className={styles.sectionTitle}>Billing History</h2>

                    {invoices.map(invoice => (
                        <div key={invoice.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                            background: 'var(--bg-tertiary)',
                            borderRadius: '10px',
                            marginBottom: '0.5rem',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', display: 'block', fontSize: '0.875rem' }}>
                                    {invoice.id}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {invoice.date}
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', display: 'block', fontSize: '0.875rem' }}>
                                    {invoice.amount}
                                </span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: invoice.status === 'paid' ? 'var(--success-green, #22c55e)' :
                                        invoice.status === 'pending' ? 'var(--warning-yellow, #f59e0b)' : 'var(--error-red, #ef4444)'
                                }}>
                                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    ))}

                    <button style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'transparent',
                        border: '1px dashed var(--border-color)',
                        borderRadius: '10px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                    }}>
                        View All Invoices
                    </button>
                </div>
            </div>

            {/* Notification Bar */}
            {showNotification && (
                <div className={styles.notificationBar}>
                    <span className={styles.notificationMessage}>
                        ✓ {notificationMessage}
                    </span>
                    <button
                        className={styles.cancelButton}
                        onClick={() => setShowNotification(false)}
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </div>
    );
}
