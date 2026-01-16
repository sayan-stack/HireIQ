'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './profile-setup.module.css';
import ThemeToggle from '@/components/ThemeToggle';

export default function ProfileSetupPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [headline, setHeadline] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const maxBioLength = 500;

    // Calculate progress based on filled fields
    useEffect(() => {
        let filledFields = 0;
        const totalFields = 5;

        if (firstName.trim()) filledFields++;
        if (lastName.trim()) filledFields++;
        if (headline.trim()) filledFields++;
        if (location.trim()) filledFields++;
        if (bio.trim()) filledFields++;

        // Animate progress bar
        const targetProgress = (filledFields / totalFields) * 100;
        setProgress(targetProgress);
    }, [firstName, lastName, headline, location, bio]);

    // Load existing user data
    useEffect(() => {
        const user = localStorage.getItem('hireiq_user');
        if (user) {
            const userData = JSON.parse(user);
            if (userData.profile) {
                setFirstName(userData.profile.firstName || '');
                setLastName(userData.profile.lastName || '');
                setHeadline(userData.profile.headline || '');
                setLocation(userData.profile.location || '');
                setBio(userData.profile.bio || '');
            } else if (userData.name) {
                // Split name if available
                const nameParts = userData.name.split(' ');
                setFirstName(nameParts[0] || '');
                setLastName(nameParts.slice(1).join(' ') || '');
            }
        }
    }, []);

    const handleSave = async () => {
        setIsLoading(true);

        // Save profile data
        const user = localStorage.getItem('hireiq_user');
        if (user) {
            const userData = JSON.parse(user);
            userData.profile = {
                firstName,
                lastName,
                headline,
                location,
                bio
            };
            userData.name = `${firstName} ${lastName}`.trim();
            localStorage.setItem('hireiq_user', JSON.stringify(userData));
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        setIsLoading(false);
        router.push('/dashboard/profile');
    };

    const handleSkip = () => {
        router.push('/dashboard/profile');
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.logoSection}>
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/onboarding/account-type')}
                        title="Back to Account Type"
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
                    <a href="#" className={styles.helpLink}>Help</a>
                    <div className={styles.avatar}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Progress Section */}
                <div className={styles.progressSection}>
                    <span className={styles.progressLabel}>Profile Setup</span>
                    <span className={styles.progressStep}>Step 2 of 3</span>
                </div>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{
                            width: `${66 + (progress * 0.34)}%`,
                            transition: 'width 0.5s ease-out'
                        }}
                    ></div>
                </div>

                {/* Profile Completion Indicator */}
                <div className={styles.completionIndicator}>
                    <span className={styles.completionLabel}>Profile Completion:</span>
                    <span className={styles.completionValue}>{Math.round(progress)}%</span>
                </div>

                {/* Title */}
                <h1 className={styles.title}>Let&apos;s set up your profile</h1>
                <p className={styles.subtitle}>
                    This information will be displayed on your public profile for recruiters.
                </p>

                {/* Form Card */}
                <div className={styles.card}>
                    <div className={styles.formGrid}>
                        {/* Avatar Section */}
                        <div className={styles.avatarSection}>
                            <div className={styles.avatarLarge}>
                                {firstName || lastName ? (
                                    <span className={styles.avatarInitials}>
                                        {firstName.charAt(0).toUpperCase()}{lastName.charAt(0).toUpperCase()}
                                    </span>
                                ) : (
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                )}
                                <button className={styles.avatarEdit}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </button>
                            </div>
                            <span className={styles.avatarLabel}>Profile Photo</span>
                            <span className={styles.avatarHint}>Max 5MB</span>
                        </div>

                        {/* Name Fields */}
                        <div className={styles.nameFields}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>First Name *</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="e.g. Jane"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Last Name *</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="e.g. Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Headline Field */}
                        <div className={styles.headlineField}>
                            <label className={styles.label}>Professional Headline</label>
                            <div className={styles.inputWithIcon}>
                                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="e.g. Senior Software Engineer"
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Field */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Current Location</label>
                        <div className={styles.inputWithIcon}>
                            <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g. San Francisco, CA"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Bio Field */}
                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <label className={styles.label}>Bio</label>
                            <span className={`${styles.charCount} ${bio.length > maxBioLength * 0.9 ? styles.charCountWarning : ''}`}>
                                {bio.length}/{maxBioLength}
                            </span>
                        </div>
                        <textarea
                            className={styles.textarea}
                            placeholder="Tell recruiters a bit about yourself..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value.slice(0, maxBioLength))}
                            rows={4}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actions}>
                        <button className={styles.skipButton} onClick={handleSkip}>
                            Skip for now
                        </button>
                        <button
                            className={styles.saveButton}
                            onClick={handleSave}
                            disabled={isLoading || (!firstName.trim() && !lastName.trim())}
                        >
                            {isLoading ? 'Saving...' : 'Save & Continue'}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className={styles.footerText}>
                    Need help? <a href="#">Contact Support</a>
                </p>
            </main>
        </div>
    );
}
