'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface Application {
    id: string;
    company: string;
    position: string;
    type: string;
    location: string;
    logo: string;
    logoColor: string;
    status: 'shortlisted' | 'interview' | 'rejected' | 'applied' | 'offer';
    atsScore: number;
    cutoff: number;
    jobMatch: number;
    activity: string;
    dateApplied: Date;
    insight?: { type: 'positive' | 'negative'; message: string; link?: string };
    interview?: {
        date: string;
        time: string;
        round: string;
        duration: string;
        interviewers: number;
        alert?: string;
    };
    createdAt: Date;
    updatedAt?: Date;
}

interface ApplicationContextType {
    applications: Application[];
    loading: boolean;
    error: string | null;
    addApplication: (app: Omit<Application, 'id' | 'createdAt'>) => Promise<string | null>;
    updateApplication: (id: string, updates: Partial<Application>) => Promise<void>;
    deleteApplication: (id: string) => Promise<void>;
    getApplicationById: (id: string) => Application | undefined;
    getApplicationsByStatus: (status: Application['status']) => Application[];
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// Sample applications for demo
const sampleApplications: Omit<Application, 'id'>[] = [
    {
        company: 'TechFlow Inc.',
        position: 'Senior Product Designer',
        type: 'Full-time',
        location: 'Remote',
        logo: '🔳',
        logoColor: '#14b8a6',
        status: 'shortlisted',
        atsScore: 78,
        cutoff: 65,
        jobMatch: 82,
        activity: 'Viewed 2h ago',
        dateApplied: new Date('2024-10-20'),
        createdAt: new Date(),
        insight: {
            type: 'positive',
            message: 'Strong Match: Your portfolio and 4 years of experience align well with the Senior requirements.'
        }
    },
    {
        company: 'Uber',
        position: 'UX Researcher',
        type: 'Contract',
        location: 'Hybrid',
        logo: 'U',
        logoColor: '#000',
        status: 'interview',
        atsScore: 72,
        cutoff: 70,
        jobMatch: 75,
        activity: 'Updated today',
        dateApplied: new Date('2024-10-15'),
        createdAt: new Date(),
        interview: {
            date: 'Oct 24',
            time: '10:00 AM',
            round: 'Technical',
            duration: '1hr',
            interviewers: 3,
            alert: 'Check your email for the Google Meet link.'
        }
    },
    {
        company: 'Google',
        position: 'Software Engineer III',
        type: 'Full-time',
        location: 'Remote',
        logo: 'G',
        logoColor: '#4285f4',
        status: 'applied',
        atsScore: 85,
        cutoff: 80,
        jobMatch: 88,
        activity: 'Applied 1 week ago',
        dateApplied: new Date('2024-10-01'),
        createdAt: new Date()
    }
];

export function ApplicationProvider({ children }: { children: ReactNode }) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserId(user?.uid || null);
        });
        return () => unsubscribe();
    }, []);

    // Subscribe to applications collection for the current user
    useEffect(() => {
        if (!userId) {
            // Use sample applications when not logged in
            setApplications(sampleApplications.map((app, idx) => ({
                ...app,
                id: `sample_${idx}`
            })));
            setLoading(false);
            return;
        }

        setLoading(true);
        const appsRef = collection(db, 'users', userId, 'applications');
        const q = query(appsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const appsData: Application[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    appsData.push({
                        ...data,
                        id: doc.id,
                        dateApplied: data.dateApplied instanceof Timestamp ? data.dateApplied.toDate() : new Date(data.dateApplied),
                        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
                        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined
                    } as Application);
                });

                // If no applications in Firestore, use samples
                if (appsData.length === 0) {
                    setApplications(sampleApplications.map((app, idx) => ({
                        ...app,
                        id: `sample_${idx}`
                    })));
                } else {
                    setApplications(appsData);
                }
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Applications subscription error:', err);
                setError('Failed to load applications');
                // Fall back to samples
                setApplications(sampleApplications.map((app, idx) => ({
                    ...app,
                    id: `sample_${idx}`
                })));
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    const addApplication = async (app: Omit<Application, 'id' | 'createdAt'>): Promise<string | null> => {
        if (!userId) {
            setError('You must be logged in to add applications');
            return null;
        }

        try {
            const appsRef = collection(db, 'users', userId, 'applications');
            const docRef = await addDoc(appsRef, {
                ...app,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return docRef.id;
        } catch (err) {
            console.error('Error adding application:', err);
            setError('Failed to add application');
            return null;
        }
    };

    const updateApplication = async (id: string, updates: Partial<Application>): Promise<void> => {
        if (!userId || id.startsWith('sample_')) {
            // For sample apps, just update locally
            setApplications(prev => prev.map(app =>
                app.id === id ? { ...app, ...updates } as Application : app
            ));
            return;
        }

        try {
            const appRef = doc(db, 'users', userId, 'applications', id);
            await updateDoc(appRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
        } catch (err) {
            console.error('Error updating application:', err);
            setError('Failed to update application');
        }
    };

    const deleteApplication = async (id: string): Promise<void> => {
        if (!userId || id.startsWith('sample_')) {
            setApplications(prev => prev.filter(app => app.id !== id));
            return;
        }

        try {
            const appRef = doc(db, 'users', userId, 'applications', id);
            await deleteDoc(appRef);
        } catch (err) {
            console.error('Error deleting application:', err);
            setError('Failed to delete application');
        }
    };

    const getApplicationById = (id: string) => applications.find(app => app.id === id);

    const getApplicationsByStatus = (status: Application['status']) =>
        applications.filter(app => app.status === status);

    return (
        <ApplicationContext.Provider value={{
            applications,
            loading,
            error,
            addApplication,
            updateApplication,
            deleteApplication,
            getApplicationById,
            getApplicationsByStatus
        }}>
            {children}
        </ApplicationContext.Provider>
    );
}

export function useApplications() {
    const context = useContext(ApplicationContext);
    if (context === undefined) {
        throw new Error('useApplications must be used within an ApplicationProvider');
    }
    return context;
}
