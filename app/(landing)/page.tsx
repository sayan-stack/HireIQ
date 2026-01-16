"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Sparkles,
    Users,
    FileText,
    Video,
    Target,
    Zap,
    ArrowRight,
    Check,
    Star,
    ChevronRight,
    Brain,
    Shield,
    Clock,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import "./landing.css";

interface FeatureType {
    icon: React.ReactNode;
    title: string;
    description: string;
    details: string[];
}

function FlipCard({
    feature,
    index,
}: {
    feature: FeatureType;
    index: number;
}) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div
            className={`flip-card animate-slide-up color-${index + 1} ${isFlipped ? "flipped" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={handleFlip}
        >
            <div className="flip-card-inner">
                {/* Front Side */}
                <div className="flip-card-front card">
                    <div className="feature-icon icon-box-primary">{feature.icon}</div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                    <span className="flip-hint">Click to see features →</span>
                </div>

                {/* Back Side */}
                <div className="flip-card-back card">
                    <div className="flip-back-header">
                        <h3 className="feature-title">{feature.title}</h3>
                    </div>
                    <ul className="feature-details-list">
                        {feature.details.map((detail, i) => (
                            <li key={i}>
                                <Check size={14} className="check-icon" />
                                <span>{detail}</span>
                            </li>
                        ))}
                    </ul>
                    <span className="flip-hint-back">Click to go back ←</span>
                </div>
            </div>
        </div>
    );
}

export default function LandingPage() {
    const router = useRouter();

    const features = [
        {
            icon: <FileText size={24} />,
            title: "AI Resume Analysis",
            description:
                "Get instant ATS scores and optimization suggestions powered by advanced AI.",
            details: [
                "ATS compatibility scoring",
                "Keyword optimization tips",
                "Format & structure analysis",
                "Industry-specific recommendations",
                "One-click improvements",
            ],
        },
        {
            icon: <Brain size={24} />,
            title: "Smart Shortlisting",
            description:
                "AI-powered candidate filtering that matches skills to job requirements.",
            details: [
                "Skill-to-job matching",
                "Experience level filtering",
                "Cultural fit assessment",
                "Automated ranking system",
                "Customizable criteria",
            ],
        },
        {
            icon: <Video size={24} />,
            title: "AI Interviews",
            description:
                "Conduct text, voice, or video interviews with our intelligent AI system.",
            details: [
                "Text-based Q&A interviews",
                "Voice conversation mode",
                "Video interview recording",
                "Real-time transcription",
                "Multi-language support",
            ],
        },
        {
            icon: <Target size={24} />,
            title: "Evidence-Based Evaluation",
            description:
                "Get detailed skill assessments with evidence-backed recommendations.",
            details: [
                "Skill proficiency scores",
                "Behavioral analysis",
                "Strengths & weaknesses report",
                "Hire/Hold recommendations",
                "Comparison benchmarks",
            ],
        },
        {
            icon: <Clock size={24} />,
            title: "Auto Scheduling",
            description:
                "Automatic interview scheduling with calendar sync and email invites.",
            details: [
                "Calendar integration",
                "Timezone auto-detection",
                "Automated reminders",
                "Rescheduling options",
                "Email notifications",
            ],
        },
        {
            icon: <Shield size={24} />,
            title: "Practice Zone",
            description:
                "Candidates can practice with mock interviews and get instant feedback.",
            details: [
                "Mock interview sessions",
                "Topic-based practice",
                "Instant AI feedback",
                "Progress tracking",
                "Difficulty levels",
            ],
        },
    ];

    const stats = [
        { value: "95%", label: "Hiring Accuracy" },
        { value: "70%", label: "Time Saved" },
        { value: "10K+", label: "Interviews Conducted" },
        { value: "500+", label: "Companies Trust Us" },
    ];

    const testimonials = [
        {
            quote:
                "This platform has transformed our hiring process. The AI interviews saved us countless hours.",
            author: "Sarah Chen",
            role: "HR Director, TechCorp",
        },
        {
            quote:
                "The resume analysis feature helped me land my dream job. Highly recommended!",
            author: "Michael Park",
            role: "Software Engineer",
        },
        {
            quote:
                "Best hiring tool we've ever used. The candidate shortlisting is incredibly accurate.",
            author: "Emily Rodriguez",
            role: "Talent Acquisition, StartupXYZ",
        },
    ];

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="nav-container">
                    <Link href="/" className="nav-logo">
                        <div className="logo-icon">
                            <Sparkles size={24} />
                        </div>
                        <span>HireIQ</span>
                    </Link>

                    <div className="nav-links hide-mobile">
                        <a href="#features">Features</a>
                        <a href="#testimonials">Testimonials</a>
                        <a href="#pricing">Pricing</a>
                    </div>

                    <div className="nav-actions">
                        <ThemeToggle />
                        <button className="btn btn-ghost" onClick={() => router.push("/login")}>
                            Sign In
                        </button>
                        <button className="btn btn-primary" onClick={() => router.push("/signup")}>
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg">
                    <div className="hero-glow-1"></div>
                    <div className="hero-glow-2"></div>
                    <div className="hero-grid"></div>
                </div>

                <div className="hero-content">
                    <div className="hero-badge animate-slide-up">
                        <Zap size={14} />
                        <span>Powered by Advanced AI</span>
                    </div>

                    <h1 className="hero-title animate-slide-up stagger-1">
                        The Future of
                        <span className="gradient-text"> Intelligent Hiring</span>
                    </h1>

                    <p className="hero-subtitle animate-slide-up stagger-2">
                        Revolutionize your recruitment with AI-powered interviews, resume
                        analysis, and evidence-based candidate evaluation. Hire smarter,
                        faster, better.
                    </p>

                    <div className="hero-cta animate-slide-up stagger-3">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => router.push("/signup")}
                        >
                            Start Free Trial
                            <ArrowRight size={18} />
                        </button>
                        <button
                            className="btn btn-secondary btn-lg"
                            onClick={() => router.push("/signup?role=candidate")}
                        >
                            I&apos;m a Candidate
                        </button>
                    </div>

                    <div className="hero-trust animate-slide-up stagger-4">
                        <div className="trust-avatars">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="trust-avatar"
                                    style={{ "--index": i } as React.CSSProperties}
                                >
                                    <Users size={14} />
                                </div>
                            ))}
                        </div>
                        <div className="trust-text">
                            <div className="trust-stars">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={14} fill="currentColor" />
                                ))}
                            </div>
                            <span>Loved by 10,000+ hiring professionals</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual animate-scale-in stagger-3">
                    <div className="hero-card glass-strong">
                        <div className="hero-card-header">
                            <div className="avatar">JD</div>
                            <div>
                                <div className="hero-card-name">John Doe</div>
                                <div className="hero-card-role">Senior Developer</div>
                            </div>
                            <div className="badge badge-success">94% Match</div>
                        </div>
                        <div className="hero-card-skills">
                            <span className="tag">React</span>
                            <span className="tag">TypeScript</span>
                            <span className="tag">Node.js</span>
                        </div>
                        <div className="hero-card-score">
                            <div className="score-label">AI Score</div>
                            <div className="score-bar">
                                <div className="score-fill" style={{ width: "92%" }}></div>
                            </div>
                            <div className="score-value">92/100</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-container">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="stat-item animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">
                            Everything you need for{" "}
                            <span className="gradient-text">smarter hiring</span>
                        </h2>
                        <p className="section-subtitle">
                            Our AI-powered platform handles the entire recruitment pipeline,
                            from resume screening to final evaluation.
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <FlipCard key={index} feature={feature} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="how-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">
                            How it <span className="gradient-text">works</span>
                        </h2>
                        <p className="section-subtitle">
                            Get started in minutes with our simple three-step process.
                        </p>
                    </div>

                    <div className="steps-container">
                        <div className="step-item">
                            <div className="step-number">01</div>
                            <div className="step-content">
                                <h3>Post Your Job</h3>
                                <p>
                                    Create detailed job postings with skills and requirements.
                                    Our AI helps optimize for better candidates.
                                </p>
                            </div>
                        </div>
                        <div className="step-connector">
                            <ChevronRight size={24} />
                        </div>
                        <div className="step-item">
                            <div className="step-number">02</div>
                            <div className="step-content">
                                <h3>AI Screens Candidates</h3>
                                <p>
                                    Our AI analyzes resumes, scores candidates, and shortlists
                                    the best matches automatically.
                                </p>
                            </div>
                        </div>
                        <div className="step-connector">
                            <ChevronRight size={24} />
                        </div>
                        <div className="step-item">
                            <div className="step-number">03</div>
                            <div className="step-content">
                                <h3>Conduct AI Interviews</h3>
                                <p>
                                    Let our AI conduct preliminary interviews and provide
                                    detailed evaluations with recommendations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="testimonials-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">
                            What our <span className="gradient-text">users say</span>
                        </h2>
                        <p className="section-subtitle">
                            Join thousands of satisfied recruiters and candidates.
                        </p>
                    </div>

                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="testimonial-card glass-strong animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="testimonial-stars">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>
                                <p className="testimonial-quote">&quot;{testimonial.quote}&quot;</p>
                                <div className="testimonial-author">
                                    <div className="avatar avatar-sm">{testimonial.author[0]}</div>
                                    <div>
                                        <div className="testimonial-name">{testimonial.author}</div>
                                        <div className="testimonial-role">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container glass-strong">
                    <div className="cta-glow"></div>
                    <h2 className="cta-title">Ready to transform your hiring?</h2>
                    <p className="cta-subtitle">
                        Join thousands of companies using AI to find the perfect candidates.
                    </p>
                    <div className="cta-buttons">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => router.push("/signup")}
                        >
                            Get Started Free
                            <ArrowRight size={18} />
                        </button>
                    </div>
                    <div className="cta-features">
                        <div className="cta-feature">
                            <Check size={16} />
                            <span>14-day free trial</span>
                        </div>
                        <div className="cta-feature">
                            <Check size={16} />
                            <span>No credit card required</span>
                        </div>
                        <div className="cta-feature">
                            <Check size={16} />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-main">
                        <div className="footer-brand">
                            <Link href="/" className="nav-logo">
                                <div className="logo-icon">
                                    <Sparkles size={24} />
                                </div>
                                <span>HireIQ</span>
                            </Link>
                            <p>The future of intelligent hiring. Powered by AI.</p>
                        </div>

                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Product</h4>
                                <a href="#features">Features</a>
                                <a href="#pricing">Pricing</a>
                                <a href="#testimonials">Testimonials</a>
                            </div>
                            <div className="footer-column">
                                <h4>Company</h4>
                                <Link href="/about">About</Link>
                                <Link href="/careers">Careers</Link>
                                <Link href="/contact">Contact</Link>
                            </div>
                            <div className="footer-column">
                                <h4>Legal</h4>
                                <Link href="/privacy">Privacy</Link>
                                <Link href="/terms">Terms</Link>
                                <Link href="/security">Security</Link>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2025 HireIQ. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
