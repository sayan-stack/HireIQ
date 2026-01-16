"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Users, Briefcase, ArrowRight, Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import "../login/login.css";

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultRole = searchParams.get("role") as "candidate" | "recruiter" | null;
    const { signUp, error: authError, clearError, loading: authLoading } = useFirebaseAuth();

    const [selectedRole, setSelectedRole] = useState<"candidate" | "recruiter" | null>(defaultRole);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) return;
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        setError(null);
        clearError();

        try {
            // Sign up with Firebase
            await signUp(formData.email, formData.password, formData.name, selectedRole);

            // Navigate to dashboard on success
            router.push("/dashboard");
        } catch (err: any) {
            // Error is handled by the auth context
            setIsLoading(false);
        }
    };

    return (
        <div className="login-card glass-strong">
            <div className="login-header">
                <h1>Create your account</h1>
                <p>Join thousands of professionals on HireIQ</p>
            </div>

            {/* Role Selection */}
            <div className="role-selection">
                <p className="role-label">I want to join as:</p>
                <div className="role-buttons">
                    <button
                        type="button"
                        className={`role-btn ${selectedRole === "candidate" ? "active candidate" : ""}`}
                        onClick={() => setSelectedRole("candidate")}
                    >
                        <Users size={20} />
                        <span>Candidate</span>
                    </button>
                    <button
                        type="button"
                        className={`role-btn ${selectedRole === "recruiter" ? "active recruiter" : ""}`}
                        onClick={() => setSelectedRole("recruiter")}
                    >
                        <Briefcase size={20} />
                        <span>Recruiter</span>
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {(error || authError) && (
                <div className="error-message" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    fontSize: '14px',
                    marginBottom: '16px'
                }}>
                    <AlertCircle size={18} />
                    <span>{error || authError}</span>
                </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <div className="input-wrapper">
                        <User size={18} className="input-icon" />
                        <input
                            type="text"
                            className="input input-with-icon"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Email</label>
                    <div className="input-wrapper">
                        <Mail size={18} className="input-icon" />
                        <input
                            type="email"
                            className="input input-with-icon"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Password</label>
                    <div className="input-wrapper">
                        <Lock size={18} className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="input input-with-icon"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Confirm Password</label>
                    <div className="input-wrapper">
                        <Lock size={18} className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="input input-with-icon"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="form-options">
                    <label className="checkbox-label">
                        <input type="checkbox" required />
                        <span>I agree to the Terms of Service and Privacy Policy</span>
                    </label>
                </div>

                <button
                    type="submit"
                    className={`btn btn-primary btn-lg btn-full ${!selectedRole ? "btn-disabled" : ""}`}
                    disabled={!selectedRole || isLoading}
                >
                    {isLoading ? "Creating account..." : (
                        <>
                            Create Account
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="login-divider">
                <span>or</span>
            </div>

            <div className="social-login">
                <button type="button" className="btn btn-secondary btn-full">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Sign up with Google</span>
                </button>
            </div>

            <p className="login-footer">
                Already have an account?{" "}
                <Link href="/login">Sign in</Link>
            </p>
        </div>
    );
}

export default function SignupPage() {
    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="login-glow-1"></div>
                <div className="login-glow-2"></div>
            </div>

            {/* Theme Toggle - Fixed Position */}
            <div className="theme-toggle-fixed">
                <ThemeToggle />
            </div>

            <div className="login-container">
                {/* Logo */}
                <Link href="/" className="login-logo">
                    <div className="logo-icon">
                        <Sparkles size={24} />
                    </div>
                    <span>HireIQ</span>
                </Link>

                <Suspense fallback={<div>Loading...</div>}>
                    <SignupForm />
                </Suspense>
            </div>
        </div>
    );
}
