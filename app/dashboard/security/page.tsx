'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../profile/profile.module.css';
import ThemeToggle from '@/components/ThemeToggle';
export default function AccountSecurityPage() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('hireiq_user');
        if (user) {
            const userData = JSON.parse(user);
            setTwoFactorEnabled(userData.twoFactorEnabled || false);
        }
    }, []);

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setNotificationMessage('Passwords do not match!');
            setShowNotification(true);
            return;
        }
        if (newPassword.length < 6) {
            setNotificationMessage('Password must be at least 6 characters!');
            setShowNotification(true);
            return;
        }

        setIsLoading(true);
        console.log('Password change requested');

        await new Promise(resolve => setTimeout(resolve, 800));

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsLoading(false);
        setNotificationMessage('Password updated successfully!');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const handleToggle2FA = async () => {
        setIsLoading(true);
        console.log('2FA toggle requested:', !twoFactorEnabled);

        const user = localStorage.getItem('hireiq_user');
        if (user) {
            const userData = JSON.parse(user);
            userData.twoFactorEnabled = !twoFactorEnabled;
            localStorage.setItem('hireiq_user', JSON.stringify(userData));
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        setTwoFactorEnabled(!twoFactorEnabled);
        setIsLoading(false);
        setNotificationMessage(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
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
                    <span className={styles.breadcrumbActive}>Account Security</span>
                </nav>
                <ThemeToggle />
            </header>

            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Account Security</h1>
                    <p className={styles.pageSubtitle}>Manage your password and security settings</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className={styles.contentGrid}>
                {/* Password Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Change Password</h2>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Current Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                className={styles.input}
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                    console.log('Current password field changed');
                                }}
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)'
                                }}
                            >
                                {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                className={styles.input}
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    console.log('New password field changed');
                                }}
                                placeholder="Enter new password (min 6 characters)"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)'
                                }}
                            >
                                {showNewPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Confirm New Password</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                console.log('Confirm password field changed');
                            }}
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        className={styles.saveButton}
                        onClick={handlePasswordChange}
                        disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                        style={{ marginTop: '1rem' }}
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>

                {/* 2FA Section */}
                <div className={styles.sectionSmall}>
                    <h2 className={styles.sectionTitle}>Two-Factor Authentication</h2>

                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Add an extra layer of security to your account by requiring a verification code in addition to your password.
                        </p>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: 'var(--bg-tertiary)',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    {twoFactorEnabled ? 'Your account is protected' : 'Enable for better security'}
                                </p>
                            </div>
                            <button
                                onClick={handleToggle2FA}
                                disabled={isLoading}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: twoFactorEnabled ? 'var(--error-red, #ef4444)' : 'var(--accent-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: 500
                                }}
                            >
                                {twoFactorEnabled ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle} style={{ marginTop: '1.5rem' }}>Active Sessions</h2>
                    <div style={{
                        padding: '1rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                💻
                            </div>
                            <div>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', display: 'block' }}>
                                    Current Session
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Active now • This device
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Bar */}
            {showNotification && (
                <div className={styles.notificationBar}>
                    <span className={styles.notificationMessage}>
                        {notificationMessage}
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
