'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../profile/profile.module.css';
import ThemeToggle from '@/components/ThemeToggle';
interface NotificationSetting {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
}

export default function NotificationsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const [emailSettings, setEmailSettings] = useState<NotificationSetting[]>([
        { id: 'job_alerts', label: 'Job Alerts', description: 'Receive notifications about new job matches', enabled: true },
        { id: 'application_updates', label: 'Application Updates', description: 'Get notified when your application status changes', enabled: true },
        { id: 'messages', label: 'Messages', description: 'Receive email notifications for new messages', enabled: false },
        { id: 'weekly_digest', label: 'Weekly Digest', description: 'Weekly summary of job opportunities', enabled: true },
    ]);

    const [pushSettings, setPushSettings] = useState<NotificationSetting[]>([
        { id: 'push_job_alerts', label: 'Job Alerts', description: 'Browser notifications for new jobs', enabled: false },
        { id: 'push_messages', label: 'Messages', description: 'Instant notifications for new messages', enabled: true },
        { id: 'push_reminders', label: 'Reminders', description: 'Interview and deadline reminders', enabled: true },
    ]);

    useEffect(() => {
        const user = localStorage.getItem('hireiq_user');
        if (user) {
            const userData = JSON.parse(user);
            if (userData.notificationSettings) {
                if (userData.notificationSettings.email) {
                    setEmailSettings(userData.notificationSettings.email);
                }
                if (userData.notificationSettings.push) {
                    setPushSettings(userData.notificationSettings.push);
                }
            }
        }
    }, []);

    const handleEmailToggle = (id: string) => {
        console.log('Email setting toggled:', id);
        setEmailSettings(prev =>
            prev.map(setting =>
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        );
        setHasChanges(true);
    };

    const handlePushToggle = (id: string) => {
        console.log('Push setting toggled:', id);
        setPushSettings(prev =>
            prev.map(setting =>
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        );
        setHasChanges(true);
    };

    const handleSave = async () => {
        setIsLoading(true);
        console.log('Saving notification settings...');

        const user = localStorage.getItem('hireiq_user');
        if (user) {
            const userData = JSON.parse(user);
            userData.notificationSettings = {
                email: emailSettings,
                push: pushSettings
            };
            localStorage.setItem('hireiq_user', JSON.stringify(userData));
        }

        await new Promise(resolve => setTimeout(resolve, 800));

        setIsLoading(false);
        setHasChanges(false);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
        <button
            onClick={onToggle}
            style={{
                width: '48px',
                height: '26px',
                borderRadius: '13px',
                border: 'none',
                background: enabled ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s'
            }}
        >
            <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '2px',
                left: enabled ? '24px' : '2px',
                transition: 'left 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
        </button>
    );

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
                    <span className={styles.breadcrumbActive}>Notifications</span>
                </nav>
                <ThemeToggle />
            </header>

            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Notifications</h1>
                    <p className={styles.pageSubtitle}>Choose how and when you want to be notified</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className={styles.contentGrid}>
                {/* Email Notifications */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Email Notifications</h2>

                    {emailSettings.map(setting => (
                        <div key={setting.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: 'var(--bg-tertiary)',
                            borderRadius: '10px',
                            marginBottom: '0.75rem',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', display: 'block' }}>
                                    {setting.label}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {setting.description}
                                </span>
                            </div>
                            <ToggleSwitch
                                enabled={setting.enabled}
                                onToggle={() => handleEmailToggle(setting.id)}
                            />
                        </div>
                    ))}
                </div>

                {/* Push Notifications */}
                <div className={styles.sectionSmall}>
                    <h2 className={styles.sectionTitle}>Push Notifications</h2>

                    {pushSettings.map(setting => (
                        <div key={setting.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: 'var(--bg-tertiary)',
                            borderRadius: '10px',
                            marginBottom: '0.75rem',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', display: 'block' }}>
                                    {setting.label}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {setting.description}
                                </span>
                            </div>
                            <ToggleSwitch
                                enabled={setting.enabled}
                                onToggle={() => handlePushToggle(setting.id)}
                            />
                        </div>
                    ))}

                    <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: 'rgba(20, 184, 166, 0.1)',
                        borderRadius: '8px'
                    }}>
                        💡 Push notifications require browser permission
                    </p>
                </div>
            </div>

            {/* Notification Bar */}
            {(hasChanges || showNotification) && (
                <div className={styles.notificationBar}>
                    <span className={styles.notificationMessage}>
                        {showNotification ? '✓ Settings saved successfully!' : 'You have unsaved changes'}
                    </span>
                    {hasChanges && !showNotification && (
                        <div className={styles.notificationActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setHasChanges(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.saveButton}
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
