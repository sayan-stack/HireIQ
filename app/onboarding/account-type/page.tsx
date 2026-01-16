'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './account-type.module.css';
import ThemeToggle from '@/components/ThemeToggle';

export default function AccountTypePage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<'candidate' | 'recruiter' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Check if user is logged in
        const user = localStorage.getItem('hireiq_user');
        if (user) {
            const userData = JSON.parse(user);
            setUserName(userData.name || 'User');
        }
    }, []);

    const handleContinue = async () => {
        if (!selectedType) return;

        setIsLoading(true);

        // Save account type
        const user = localStorage.getItem('hireiq_user');
        if (user) {
            const userData = JSON.parse(user);
            userData.accountType = selectedType;
            localStorage.setItem('hireiq_user', JSON.stringify(userData));
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        setIsLoading(false);
        router.push('/onboarding/profile-setup');
    };

    const handleLogout = () => {
        localStorage.removeItem('hireiq_user');
        router.push('/auth');
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.logoSection}>
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/auth')}
                        title="Back to Sign In"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className={styles.logo} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#14b8a6" />
                                    <stop offset="50%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                            <rect x="4" y="4" width="24" height="24" rx="6" fill="url(#logoGradient)" />
                            <path d="M12 16L15 19L20 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className={styles.logoText}>HireIQ</span>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <ThemeToggle />
                    <span className={styles.dividerLine}></span>
                    <a href="#" className={styles.helpLink}>Need help?</a>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome{userName ? `, ${userName}` : ''}! Let&apos;s get you set up.
                </h1>
                <p className={styles.subtitle}>
                    Select your account type to customize your experience. This will help<br />
                    us tailor job recommendations or candidate matches for you.
                </p>

                {/* Selection Cards */}
                <div className={styles.cards}>
                    <div
                        className={`${styles.card} ${selectedType === 'candidate' ? styles.cardSelected : ''}`}
                        onClick={() => setSelectedType('candidate')}
                    >
                        <div className={styles.cardIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        </div>
                        <h2 className={styles.cardTitle}>I am a Candidate</h2>
                        <p className={styles.cardDescription}>
                            I am looking for jobs, internships, or remote opportunities. I want to build my profile and apply to companies.
                        </p>
                    </div>

                    <div
                        className={`${styles.card} ${selectedType === 'recruiter' ? styles.cardSelected : ''}`}
                        onClick={() => setSelectedType('recruiter')}
                    >
                        <div className={styles.cardIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <h2 className={styles.cardTitle}>I am a Recruiter</h2>
                        <p className={styles.cardDescription}>
                            I want to post jobs and find top talent for my company. I need tools to manage applications and candidates.
                        </p>
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    className={styles.continueButton}
                    disabled={!selectedType || isLoading}
                    onClick={handleContinue}
                >
                    {isLoading ? 'Please wait...' : 'Continue'}
                </button>

                {/* Logout Link */}
                <p className={styles.logoutText}>
                    Logged in by mistake? <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Log out</a>
                </p>
            </main>
        </div>
    );
}
