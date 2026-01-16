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

export interface ResumeVersion {
    id: string;
    name: string;
    date: Date;
    score: number;
    status: 'active' | 'archived';
    fileData?: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface Skill {
    name: string;
    status: 'detected' | 'missing';
}

interface ResumeContextType {
    resumes: ResumeVersion[];
    loading: boolean;
    error: string | null;
    addResume: (resume: Omit<ResumeVersion, 'id' | 'createdAt'>) => Promise<string | null>;
    updateResume: (id: string, updates: Partial<ResumeVersion>) => Promise<void>;
    deleteResume: (id: string) => Promise<void>;
    getActiveResume: () => ResumeVersion | undefined;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Sample resume for demo
const sampleResumes: Omit<ResumeVersion, 'id'>[] = [
    {
        name: 'Resume_v3_final.pdf',
        date: new Date(),
        score: 78,
        status: 'active',
        createdAt: new Date()
    }
];

export function ResumeProvider({ children }: { children: ReactNode }) {
    const [resumes, setResumes] = useState<ResumeVersion[]>([]);
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

    // Subscribe to resumes collection for the current user
    useEffect(() => {
        if (!userId) {
            // Use sample resumes when not logged in
            setResumes(sampleResumes.map((r, idx) => ({
                ...r,
                id: `sample_${idx}`
            })));
            setLoading(false);
            return;
        }

        setLoading(true);
        const resumesRef = collection(db, 'users', userId, 'resumes');
        const q = query(resumesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const resumesData: ResumeVersion[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    resumesData.push({
                        ...data,
                        id: doc.id,
                        date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
                        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
                        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined
                    } as ResumeVersion);
                });

                if (resumesData.length === 0) {
                    setResumes(sampleResumes.map((r, idx) => ({
                        ...r,
                        id: `sample_${idx}`
                    })));
                } else {
                    setResumes(resumesData);
                }
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Resumes subscription error:', err);
                setError('Failed to load resumes');
                setResumes(sampleResumes.map((r, idx) => ({
                    ...r,
                    id: `sample_${idx}`
                })));
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    const addResume = async (resume: Omit<ResumeVersion, 'id' | 'createdAt'>): Promise<string | null> => {
        if (!userId) {
            setError('You must be logged in to add resumes');
            return null;
        }

        try {
            const resumesRef = collection(db, 'users', userId, 'resumes');
            const docRef = await addDoc(resumesRef, {
                ...resume,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return docRef.id;
        } catch (err) {
            console.error('Error adding resume:', err);
            setError('Failed to add resume');
            return null;
        }
    };

    const updateResume = async (id: string, updates: Partial<ResumeVersion>): Promise<void> => {
        if (!userId || id.startsWith('sample_')) {
            setResumes(prev => prev.map(r =>
                r.id === id ? { ...r, ...updates } as ResumeVersion : r
            ));
            return;
        }

        try {
            const resumeRef = doc(db, 'users', userId, 'resumes', id);
            await updateDoc(resumeRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
        } catch (err) {
            console.error('Error updating resume:', err);
            setError('Failed to update resume');
        }
    };

    const deleteResume = async (id: string): Promise<void> => {
        if (!userId || id.startsWith('sample_')) {
            setResumes(prev => prev.filter(r => r.id !== id));
            return;
        }

        try {
            const resumeRef = doc(db, 'users', userId, 'resumes', id);
            await deleteDoc(resumeRef);
        } catch (err) {
            console.error('Error deleting resume:', err);
            setError('Failed to delete resume');
        }
    };

    const getActiveResume = () => resumes.find(r => r.status === 'active');

    return (
        <ResumeContext.Provider value={{
            resumes,
            loading,
            error,
            addResume,
            updateResume,
            deleteResume,
            getActiveResume
        }}>
            {children}
        </ResumeContext.Provider>
    );
}

export function useResumes() {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error('useResumes must be used within a ResumeProvider');
    }
    return context;
}
