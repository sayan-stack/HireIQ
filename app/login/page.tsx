'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Users, Briefcase, ArrowRight, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import './login.css';

type Step = 'role' | 'email' | 'otp' | 'password' | 'complete';
type Mode = 'signin' | 'signup';

export default function AuthPage() {
    const router = useRouter();
    const { signIn, signUp, error: authError, clearError } = useFirebaseAuth();

    // Form state
    const [mode, setMode] = useState<Mode>('signin');
    const [step, setStep] = useState<Step>('role');
    const [selectedRole, setSelectedRole] = useState<'candidate' | 'recruiter' | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // OTP state
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpTimer, setOtpTimer] = useState(0);
    const [otpVerified, setOtpVerified] = useState(false);
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Timer countdown
    useEffect(() => {
        if (otpTimer > 0) {
            const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpTimer]);

    // Validate email format
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    // Check if email domain is valid (not temporary/disposable)
    const isValidEmailDomain = (email: string): boolean => {
        const disposableDomains = ['tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com'];
        const domain = email.split('@')[1]?.toLowerCase();
        return domain !== undefined && !disposableDomains.includes(domain);
    };

    // Handle role selection and proceed
    const handleRoleSelect = (role: 'candidate' | 'recruiter') => {
        setSelectedRole(role);
        setError(null);
    };

    const proceedFromRole = () => {
        if (!selectedRole) {
            setError('Please select your role');
            return;
        }
        setStep('email');
        setError(null);
    };

    // Handle email submission and send OTP
    const handleSendOTP = async () => {
        if (!email) {
            setError('Email is required');
            return;
        }
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (!isValidEmailDomain(email)) {
            setError('Please use a valid email domain (no temporary emails)');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setStep('otp');
                setOtpTimer(300); // 5 minutes
                setSuccessMessage(data.message);
                setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
            } else {
                setError(data.message);
            }
        } catch {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP input
    const handleOTPChange = (index: number, value: string) => {
        if (value.length > 1) {
            // Handle paste
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newOtp = [...otp];
            digits.forEach((digit, i) => {
                if (index + i < 6) newOtp[index + i] = digit;
            });
            setOtp(newOtp);
            otpInputRefs.current[Math.min(index + digits.length, 5)]?.focus();
        } else {
            const newOtp = [...otp];
            newOtp[index] = value.replace(/\D/g, '');
            setOtp(newOtp);
            if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    // Verify OTP
    const handleVerifyOTP = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpString })
            });

            const data = await response.json();

            if (data.success) {
                setOtpVerified(true);
                setSuccessMessage('Email verified successfully!');

                if (mode === 'signin') {
                    // For sign in, go to password step
                    setStep('password');
                } else {
                    // For sign up, go to password creation
                    setStep('password');
                }
            } else {
                setError(data.message);
            }
        } catch {
            setError('Failed to verify OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle final authentication
    const handleAuthenticate = async (e: FormEvent) => {
        e.preventDefault();

        if (!password) {
            setError('Password is required');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (mode === 'signup' && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError(null);
        clearError();

        try {
            if (mode === 'signup') {
                // Create new account - signUp expects (email, password, name, accountType)
                const displayName = fullName || email.split('@')[0];
                await signUp(email, password, displayName, selectedRole!);

                // Store user data
                localStorage.setItem('hireiq_user', JSON.stringify({
                    email,
                    name: fullName || email.split('@')[0],
                    accountType: selectedRole,
                    isNewUser: true,
                    emailVerified: true
                }));

                router.push('/dashboard');
            } else {
                // Sign in
                await signIn(email, password);

                // Update stored user data with role
                const stored = localStorage.getItem('hireiq_user');
                if (stored) {
                    const userData = JSON.parse(stored);
                    userData.accountType = selectedRole;
                    userData.emailVerified = true;
                    localStorage.setItem('hireiq_user', JSON.stringify(userData));
                }

                router.push('/dashboard');
            }
        } catch {
            setError(authError || 'Authentication failed. Please try again.');
            setIsLoading(false);
        }
    };

    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const resetFlow = () => {
        setStep('role');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setOtp(['', '', '', '', '', '']);
        setOtpTimer(0);
        setOtpVerified(false);
        setError(null);
        setSuccessMessage(null);
    };

    const switchMode = (newMode: Mode) => {
        setMode(newMode);
        resetFlow();
    };

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="login-glow-1"></div>
                <div className="login-glow-2"></div>
            </div>

            <div className="theme-toggle-fixed">
                <ThemeToggle />
            </div>

            <div className="login-container">
                <Link href="/" className="login-logo">
                    <div className="logo-icon">
                        <Sparkles size={24} />
                    </div>
                    <span>HireIQ</span>
                </Link>

                <div className="login-card glass-strong">
                    {/* Header */}
                    <div className="login-header">
                        <h1>{mode === 'signin' ? 'Welcome back' : 'Create account'}</h1>
                        <p>{mode === 'signin' ? 'Sign in with email verification' : 'Sign up with email verification'}</p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="mode-toggle">
                        <button
                            type="button"
                            className={`mode-btn ${mode === 'signin' ? 'active' : ''}`}
                            onClick={() => switchMode('signin')}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={`mode-btn ${mode === 'signup' ? 'active' : ''}`}
                            onClick={() => switchMode('signup')}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="progress-steps">
                        <div className={`progress-step ${step === 'role' ? 'active' : ''} ${['email', 'otp', 'password', 'complete'].includes(step) ? 'completed' : ''}`}>
                            <span>1</span>
                            <p>Role</p>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${step === 'email' ? 'active' : ''} ${['otp', 'password', 'complete'].includes(step) ? 'completed' : ''}`}>
                            <span>2</span>
                            <p>Email</p>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${step === 'otp' ? 'active' : ''} ${['password', 'complete'].includes(step) ? 'completed' : ''}`}>
                            <span>3</span>
                            <p>Verify</p>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${step === 'password' ? 'active' : ''} ${step === 'complete' ? 'completed' : ''}`}>
                            <span>4</span>
                            <p>{mode === 'signin' ? 'Login' : 'Create'}</p>
                        </div>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="message error-message">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="message success-message">
                            <CheckCircle size={18} />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Step 1: Role Selection */}
                    {step === 'role' && (
                        <div className="step-content">
                            <p className="role-label">I am a:</p>
                            <div className="role-buttons">
                                <button
                                    type="button"
                                    className={`role-btn ${selectedRole === 'candidate' ? 'active candidate' : ''}`}
                                    onClick={() => handleRoleSelect('candidate')}
                                >
                                    <Users size={20} />
                                    <span>Candidate</span>
                                </button>
                                <button
                                    type="button"
                                    className={`role-btn ${selectedRole === 'recruiter' ? 'active recruiter' : ''}`}
                                    onClick={() => handleRoleSelect('recruiter')}
                                >
                                    <Briefcase size={20} />
                                    <span>Recruiter</span>
                                </button>
                            </div>
                            <button
                                type="button"
                                className={`btn btn-primary btn-lg btn-full ${!selectedRole ? 'btn-disabled' : ''}`}
                                onClick={proceedFromRole}
                                disabled={!selectedRole}
                            >
                                Continue
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Email Input */}
                    {step === 'email' && (
                        <div className="step-content">
                            {mode === 'signup' && (
                                <div className="input-group">
                                    <label className="input-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Enter your full name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        type="email"
                                        className="input input-with-icon"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                    />
                                </div>
                            </div>
                            <p className="info-text">
                                We&apos;ll send a 6-digit verification code to this email
                            </p>
                            <button
                                type="button"
                                className="btn btn-primary btn-lg btn-full"
                                onClick={handleSendOTP}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send Verification Code'}
                                <ArrowRight size={18} />
                            </button>
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => setStep('role')}
                            >
                                ← Back to role selection
                            </button>
                        </div>
                    )}

                    {/* Step 3: OTP Verification */}
                    {step === 'otp' && (
                        <div className="step-content">
                            <div className="otp-info">
                                <p>Enter the 6-digit code sent to</p>
                                <p className="email-highlight">{email}</p>
                                {otpTimer > 0 && (
                                    <p className="timer">Code expires in {formatTimer(otpTimer)}</p>
                                )}
                            </div>

                            <div className="otp-inputs">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { otpInputRefs.current[index] = el; }}
                                        type="text"
                                        maxLength={6}
                                        className="otp-input"
                                        value={digit}
                                        onChange={(e) => handleOTPChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary btn-lg btn-full"
                                onClick={handleVerifyOTP}
                                disabled={isLoading || otp.join('').length !== 6}
                            >
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </button>

                            <div className="otp-actions">
                                <button
                                    type="button"
                                    className="btn-link"
                                    onClick={handleSendOTP}
                                    disabled={isLoading || otpTimer > 270}
                                >
                                    Resend Code
                                </button>
                                <button
                                    type="button"
                                    className="btn-link"
                                    onClick={() => setStep('email')}
                                >
                                    Change Email
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Password */}
                    {step === 'password' && (
                        <form className="step-content" onSubmit={handleAuthenticate}>
                            <div className="verified-badge">
                                <CheckCircle size={16} />
                                <span>Email verified: {email}</span>
                            </div>

                            <div className="input-group">
                                <label className="input-label">
                                    {mode === 'signin' ? 'Password' : 'Create Password'}
                                </label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="input input-with-icon"
                                        placeholder={mode === 'signin' ? 'Enter your password' : 'Create a strong password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
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

                            {mode === 'signup' && (
                                <div className="input-group">
                                    <label className="input-label">Confirm Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={18} className="input-icon" />
                                        <input
                                            type="password"
                                            className="input input-with-icon"
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg btn-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    )}

                    {/* Footer */}
                    <p className="login-footer">
                        {mode === 'signin' ? (
                            <>Don&apos;t have an account? <button type="button" className="btn-link-inline" onClick={() => switchMode('signup')}>Sign up</button></>
                        ) : (
                            <>Already have an account? <button type="button" className="btn-link-inline" onClick={() => switchMode('signin')}>Sign in</button></>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
