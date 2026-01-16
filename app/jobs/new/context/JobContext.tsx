"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

/* =========================
   Job Type (SOURCE OF TRUTH)
========================= */

export interface Job {
  id: string;
  jobTitle: string;
  employmentType: string;
  location: string;
  department?: string;
  description?: string;
  requirements?: string[];
  salary?: string;
  status: "Active" | "Closed";
  createdAt: Date;
  updatedAt?: Date;
  // For global jobs collection
  postedBy?: string;
  postedByName?: string;
  companyName?: string;
}

/* =========================
   Context Type
========================= */

interface JobsContextType {
  jobs: Job[];
  allJobs: Job[]; // All published jobs for candidates to browse
  loading: boolean;
  error: string | null;
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<string | null>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  getJobById: (id: string) => Job | undefined;
}

/* =========================
   Context
========================= */

const JobsContext = createContext<JobsContextType | null>(null);

/* =========================
   Provider
========================= */

export function JobsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
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

  // Subscribe to user's jobs and all published jobs
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    // Subscribe to ALL jobs (simpler query - no composite index needed)
    const allJobsUnsubscribe = onSnapshot(
      collection(db, 'jobs'),
      (snapshot) => {
        const jobsData: Job[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Only include Active jobs
          if (data.status === 'Active') {
            jobsData.push({
              ...data,
              id: doc.id,
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
              updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined
            } as Job);
          }
        });
        // Sort by createdAt descending in JS
        jobsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setAllJobs(jobsData);
        console.log('All jobs loaded:', jobsData.length);
      },
      (err) => {
        console.error('All jobs subscription error:', err);
      }
    );
    unsubscribes.push(allJobsUnsubscribe);

    // Subscribe to current user's jobs (for recruiters)
    if (userId) {
      const userJobsUnsubscribe = onSnapshot(
        collection(db, 'jobs'),
        (snapshot) => {
          const jobsData: Job[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            // Only include jobs posted by this user
            if (data.postedBy === userId) {
              jobsData.push({
                ...data,
                id: doc.id,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined
              } as Job);
            }
          });
          // Sort by createdAt descending
          jobsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          setJobs(jobsData);
          setLoading(false);
          setError(null);
          console.log('User jobs loaded:', jobsData.length);
        },
        (err) => {
          console.error('User jobs subscription error:', err);
          setError('Failed to load jobs');
          setLoading(false);
        }
      );
      unsubscribes.push(userJobsUnsubscribe);
    } else {
      setJobs([]);
      setLoading(false);
    }

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [userId]);

  const addJob = async (job: Omit<Job, 'id' | 'createdAt'>): Promise<string | null> => {
    if (!userId) {
      setError('You must be logged in to create jobs');
      return null;
    }

    try {
      // Get user info for the job posting
      const userDataStr = localStorage.getItem('hireiq_user');
      const userData = userDataStr ? JSON.parse(userDataStr) : {};

      // Add to global jobs collection with user info
      const docRef = await addDoc(collection(db, 'jobs'), {
        ...job,
        postedBy: userId,
        postedByName: userData.name || 'Unknown',
        companyName: userData.companyName || 'HireIQ Company',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding job:', err);
      setError('Failed to create job');
      return null;
    }
  };

  const updateJob = async (id: string, updates: Partial<Job>): Promise<void> => {
    if (!userId) {
      setError('You must be logged in to update jobs');
      return;
    }

    try {
      const jobRef = doc(db, 'jobs', id);
      await updateDoc(jobRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to update job');
    }
  };

  const deleteJob = async (id: string): Promise<void> => {
    if (!userId) {
      setError('You must be logged in to delete jobs');
      return;
    }

    try {
      const jobRef = doc(db, 'jobs', id);
      await deleteDoc(jobRef);
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job');
    }
  };

  const getJobById = (id: string) => [...jobs, ...allJobs].find(job => job.id === id);

  return (
    <JobsContext.Provider value={{ jobs, allJobs, loading, error, addJob, updateJob, deleteJob, getJobById }}>
      {children}
    </JobsContext.Provider>
  );
}

/* =========================
   Hook
========================= */

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
}
