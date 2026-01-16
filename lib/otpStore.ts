// Shared OTP store module
// In production, use Redis or database for persistence across serverless functions

interface OTPData {
    otp: string;
    expiresAt: number;
}

// Global store that persists across API calls in development
// In production, replace with Redis/database
declare global {
    // eslint-disable-next-line no-var
    var otpStore: Map<string, OTPData> | undefined;
}

// Use global store in development to persist across hot reloads
export const otpStore: Map<string, OTPData> = global.otpStore || new Map();

if (process.env.NODE_ENV !== 'production') {
    global.otpStore = otpStore;
}

// Generate 6-digit OTP
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP with expiry
export function storeOTP(email: string, otp: string, expiryMinutes: number = 5): void {
    const normalizedEmail = email.toLowerCase();
    const expiresAt = Date.now() + expiryMinutes * 60 * 1000;
    otpStore.set(normalizedEmail, { otp, expiresAt });
}

// Verify OTP
export function verifyOTP(email: string, otp: string): { valid: boolean; message: string } {
    const normalizedEmail = email.toLowerCase();
    const storedData = otpStore.get(normalizedEmail);

    if (!storedData) {
        return { valid: false, message: 'No OTP found. Please request a new one.' };
    }

    if (Date.now() > storedData.expiresAt) {
        otpStore.delete(normalizedEmail);
        return { valid: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (storedData.otp !== otp) {
        return { valid: false, message: 'Invalid OTP. Please try again.' };
    }

    // OTP verified successfully - clear it
    otpStore.delete(normalizedEmail);
    return { valid: true, message: 'OTP verified successfully' };
}

// Clear expired OTPs (cleanup function)
export function cleanupExpiredOTPs(): void {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(email);
        }
    }
}
