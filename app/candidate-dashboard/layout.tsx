'use client';

import { useRouter, usePathname } from 'next/navigation';
import styles from './layout.module.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const handleSignOut = () => {
        localStorage.removeItem('hireiq_user');
        router.push('/auth');
    };

    const handleLogoClick = () => {
        router.push('/');
    };

    const isActive = (path: string) => pathname === path;

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
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
                        <div className={styles.logoTextGroup}>
                            <span className={styles.logoText}>HireIQ</span>
                            <span className={styles.logoSubtext}>CANDIDATE PORTAL</span>
                        </div>
                    </div>
                </div>

                <nav className={styles.nav}>
                    <a
                        href="/dashboard/profile"
                        className={`${styles.navItem} ${isActive('/dashboard/profile') ? styles.navItemActive : ''}`}
                        onClick={(e) => { e.preventDefault(); router.push('/dashboard/profile'); }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>Profile</span>
                    </a>
                    <a
                        href="/dashboard/security"
                        className={`${styles.navItem} ${isActive('/dashboard/security') ? styles.navItemActive : ''}`}
                        onClick={(e) => { e.preventDefault(); router.push('/dashboard/security'); }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>Account Security</span>
                    </a>
                    <a
                        href="/dashboard/notifications"
                        className={`${styles.navItem} ${isActive('/dashboard/notifications') ? styles.navItemActive : ''}`}
                        onClick={(e) => { e.preventDefault(); router.push('/dashboard/notifications'); }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span>Notifications</span>
                    </a>
                    <a
                        href="/dashboard/billing"
                        className={`${styles.navItem} ${isActive('/dashboard/billing') ? styles.navItemActive : ''}`}
                        onClick={(e) => { e.preventDefault(); router.push('/dashboard/billing'); }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        <span>Billing</span>
                    </a>
                    <a
                        href="/dashboard/applications"
                        className={`${styles.navItem} ${isActive('/dashboard/applications') ? styles.navItemActive : ''}`}
                        onClick={(e) => { e.preventDefault(); router.push('/dashboard/applications'); }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <span>My Applications</span>
                    </a>
                </nav>

                <div className={styles.sidebarFooter}>
                    <a
                        href="#"
                        className={styles.signOutLink}
                        onClick={(e) => { e.preventDefault(); handleSignOut(); }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Sign Out</span>
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
