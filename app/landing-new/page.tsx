'use client';

import { useRouter } from 'next/navigation';
import styles from './landing.module.css';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.logo} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
                        <div className={styles.logoIcon}>H</div>
                        <span className={styles.logoText}>HireIQ</span>
                    </div>
                    <nav className={styles.nav}>
                        <a href="#features" className={styles.navLink}>Features</a>
                        <a href="#testimonials" className={styles.navLink}>Testimonials</a>
                        <a href="#pricing" className={styles.navLink}>Pricing</a>
                    </nav>
                </div>
                <div className={styles.headerRight}>
                    <ThemeToggle />
                    <span
                        className={styles.signInLink}
                        onClick={() => router.push('/auth')}
                    >
                        Sign In
                    </span>
                    <button
                        className={styles.getStartedBtn}
                        onClick={() => router.push('/auth')}
                    >
                        Get Started
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.aiBadge}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Powered by Advanced AI
                    </div>
                    <h1 className={styles.heroTitle}>
                        The Future of<br />
                        <span className={styles.heroTitleGradient}>Intelligent Hiring</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Revolutionize your recruitment with AI-powered interviews, resume analysis,
                        and evidence-based candidate evaluation. Hire smarter, faster, better.
                    </p>
                    <div className={styles.heroCtas}>
                        <button
                            className={styles.primaryCta}
                            onClick={() => router.push('/auth')}
                        >
                            Start Free Trial
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button
                            className={styles.secondaryCta}
                            onClick={() => router.push('/auth')}
                        >
                            I'm a Candidate
                        </button>
                    </div>
                    <div className={styles.socialProof}>
                        <div className={styles.avatarGroup}>
                            <div className={styles.avatar}>👨</div>
                            <div className={styles.avatar}>👩</div>
                            <div className={styles.avatar}>👨‍💼</div>
                            <div className={styles.avatar}>👩‍💼</div>
                        </div>
                        <div className={styles.proofText}>
                            <span className={styles.stars}>★★★★★</span>
                            <span className={styles.proofLabel}>Loved by 10,000+ hiring professionals</span>
                        </div>
                    </div>
                </div>

                <div className={styles.heroVisual}>
                    <div className={styles.candidateCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardProfile}>
                                <div className={styles.cardAvatar}>JD</div>
                                <div className={styles.cardInfo}>
                                    <h4>John Doe</h4>
                                    <p>Senior Developer</p>
                                </div>
                            </div>
                            <span className={styles.matchBadge}>94% Match</span>
                        </div>
                        <div className={styles.skillTags}>
                            <span className={styles.skillTag}>React</span>
                            <span className={styles.skillTag}>TypeScript</span>
                            <span className={styles.skillTag}>Node.js</span>
                        </div>
                        <div className={styles.aiScore}>
                            <span className={styles.aiScoreLabel}>AI Score</span>
                            <div className={styles.scoreBar}>
                                <div className={styles.scoreBarFill}></div>
                            </div>
                            <span className={styles.scoreValue}>92/100</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className={styles.features}>
                <h2 className={styles.sectionTitle}>Why Choose HireIQ?</h2>
                <p className={styles.sectionSubtitle}>
                    Our AI-powered platform transforms how you find and hire the best talent.
                </p>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🎯</div>
                        <h3 className={styles.featureTitle}>Smart Matching</h3>
                        <p className={styles.featureDesc}>
                            AI-powered algorithms match candidates to roles with unprecedented accuracy.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📊</div>
                        <h3 className={styles.featureTitle}>Resume Analysis</h3>
                        <p className={styles.featureDesc}>
                            Automated parsing and scoring of resumes to save hours of manual review.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🎥</div>
                        <h3 className={styles.featureTitle}>AI Interviews</h3>
                        <p className={styles.featureDesc}>
                            Conduct preliminary interviews with our AI assistant, available 24/7.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📈</div>
                        <h3 className={styles.featureTitle}>Analytics Dashboard</h3>
                        <p className={styles.featureDesc}>
                            Real-time insights and metrics to optimize your hiring process.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔒</div>
                        <h3 className={styles.featureTitle}>Bias-Free Hiring</h3>
                        <p className={styles.featureDesc}>
                            AI-driven evaluations focused purely on skills and qualifications.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>⚡</div>
                        <h3 className={styles.featureTitle}>Fast Onboarding</h3>
                        <p className={styles.featureDesc}>
                            Get started in minutes with our intuitive setup wizard.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <span className={styles.footerCopyright}>
                    © 2025 HireIQ. All rights reserved.
                </span>
                <div className={styles.footerLinks}>
                    <span onClick={() => router.push('/privacy')} className={styles.footerLink} style={{ cursor: 'pointer' }}>Privacy Policy</span>
                    <span onClick={() => router.push('/terms')} className={styles.footerLink} style={{ cursor: 'pointer' }}>Terms of Service</span>
                    <span onClick={() => router.push('/contact')} className={styles.footerLink} style={{ cursor: 'pointer' }}>Contact</span>
                </div>
            </footer>
        </div>
    );
}
