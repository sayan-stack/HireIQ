'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    User as FirebaseUser,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// User profile stored in Firestore
export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    accountType: 'recruiter' | 'candidate';
    profile?: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        dob?: string;
    };
    createdAt: Date;
}

interface AuthContextType {
    user: FirebaseUser | null;
    userProfile: UserProfile | null;
    loading: boolean;
    error: string | null;
    signUp: (email: string, password: string, name: string, accountType: 'recruiter' | 'candidate') => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch user profile from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserProfile({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            name: data.name || firebaseUser.displayName || '',
                            accountType: data.accountType || 'candidate',
                            profile: data.profile || {},
                            createdAt: data.createdAt?.toDate() || new Date()
                        });

                        // Also store in localStorage for components that use it
                        localStorage.setItem('hireiq_user', JSON.stringify({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            name: data.name || firebaseUser.displayName,
                            accountType: data.accountType || 'candidate',
                            profile: data.profile || {}
                        }));
                    }
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                }
            } else {
                setUserProfile(null);
                localStorage.removeItem('hireiq_user');
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Check if Firebase is properly configured
    const isFirebaseConfigured = () => {
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        return apiKey && !apiKey.includes('YOUR_API_KEY') && apiKey !== 'YOUR_API_KEY_HERE';
    };

    const signUp = async (email: string, password: string, name: string, accountType: 'recruiter' | 'candidate') => {
        setError(null);
        setLoading(true);

        try {
            // If Firebase is not configured, use demo mode
            if (!isFirebaseConfigured()) {
                console.log('Firebase not configured - using demo mode');

                // Create a demo user profile
                const demoUser = {
                    uid: 'demo_' + Date.now(),
                    email: email,
                    name: name,
                    accountType: accountType,
                    profile: {
                        firstName: name.split(' ')[0] || '',
                        lastName: name.split(' ').slice(1).join(' ') || ''
                    },
                    createdAt: new Date()
                };

                // Store in localStorage
                localStorage.setItem('hireiq_user', JSON.stringify(demoUser));
                localStorage.setItem('hireiq_demo_mode', 'true');

                // Set the user profile state
                setUserProfile(demoUser as UserProfile);
                setLoading(false);
                return;
            }

            // Create auth user with Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Update display name
            await updateProfile(firebaseUser, { displayName: name });

            // Create user profile in Firestore
            const userProfile: Omit<UserProfile, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
                uid: firebaseUser.uid,
                email: email,
                name: name,
                accountType: accountType,
                profile: {
                    firstName: name.split(' ')[0] || '',
                    lastName: name.split(' ').slice(1).join(' ') || ''
                },
                createdAt: serverTimestamp()
            };

            await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);

            // Store in localStorage for immediate access
            localStorage.setItem('hireiq_user', JSON.stringify({
                uid: firebaseUser.uid,
                email: email,
                name: name,
                accountType: accountType,
                profile: userProfile.profile
            }));

        } catch (err: any) {
            console.error('Signup error:', err);
            setError(getErrorMessage(err.code));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        setError(null);
        setLoading(true);

        try {
            // If Firebase is not configured, use demo mode
            if (!isFirebaseConfigured()) {
                console.log('Firebase not configured - using demo mode for login');

                // Check if we have a stored demo user with this email
                const storedUser = localStorage.getItem('hireiq_user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    if (userData.email === email) {
                        setUserProfile(userData as UserProfile);
                        localStorage.setItem('hireiq_demo_mode', 'true');
                        setLoading(false);
                        return;
                    }
                }

                // Create demo login for any email (demo mode)
                const demoUser = {
                    uid: 'demo_' + Date.now(),
                    email: email,
                    name: email.split('@')[0],
                    accountType: 'candidate' as const,
                    profile: {
                        firstName: email.split('@')[0],
                        lastName: ''
                    },
                    createdAt: new Date()
                };

                localStorage.setItem('hireiq_user', JSON.stringify(demoUser));
                localStorage.setItem('hireiq_demo_mode', 'true');
                setUserProfile(demoUser as UserProfile);
                setLoading(false);
                return;
            }

            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            console.error('Login error:', err);
            setError(getErrorMessage(err.code));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setError(null);
        try {
            await firebaseSignOut(auth);
            localStorage.removeItem('hireiq_user');
            setUserProfile(null);
        } catch (err: any) {
            console.error('Logout error:', err);
            setError(getErrorMessage(err.code));
            throw err;
        }
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{
            user,
            userProfile,
            loading,
            error,
            signUp,
            signIn,
            signOut,
            clearError
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useFirebaseAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
    }
    return context;
}

// Helper function to get user-friendly error messages
function getErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please sign in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/operation-not-allowed':
            return 'Email/password sign up is not enabled. Please contact support.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters long.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please sign up first.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please check your credentials or sign up for a new account.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        default:
            return 'An error occurred. Please try again.';
    }
}
