// Server-side OTP store using Firebase Client Firestore
// Works across serverless invocations unlike in-memory Maps

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function getFirestoreDb() {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    return getFirestore(app);
}

// Generate 6-digit OTP
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in Firestore with expiry
export async function storeOTPFirestore(email: string, otp: string, expiryMinutes: number = 5): Promise<void> {
    const db = getFirestoreDb();
    const normalizedEmail = email.toLowerCase().replace(/\./g, '_dot_');
    const expiresAt = Date.now() + expiryMinutes * 60 * 1000;

    await setDoc(doc(db, 'otpVerifications', normalizedEmail), {
        otp,
        expiresAt,
        createdAt: Date.now(),
        email: email.toLowerCase()
    });
}

// Verify OTP from Firestore
export async function verifyOTPFirestore(email: string, otp: string): Promise<{ valid: boolean; message: string }> {
    const db = getFirestoreDb();
    const normalizedEmail = email.toLowerCase().replace(/\./g, '_dot_');
    const docRef = doc(db, 'otpVerifications', normalizedEmail);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return { valid: false, message: 'No OTP found. Please request a new one.' };
    }

    const data = docSnap.data();

    if (Date.now() > data.expiresAt) {
        await deleteDoc(docRef);
        return { valid: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (data.otp !== otp) {
        return { valid: false, message: 'Invalid OTP. Please try again.' };
    }

    // Valid — delete immediately so it can't be reused
    await deleteDoc(docRef);
    return { valid: true, message: 'OTP verified successfully' };
}
