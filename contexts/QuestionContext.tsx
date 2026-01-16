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
import { db } from '@/lib/firebase';
import { Question, CodingQuestion, MCQQuestion, QuestionType, DifficultyLevel } from '@/types';

interface QuestionContextType {
    questions: Question[];
    addQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
    updateQuestion: (id: string, question: Partial<Question>) => Promise<void>;
    deleteQuestion: (id: string) => Promise<void>;
    getQuestionById: (id: string) => Question | undefined;
    getQuestionsByType: (type: QuestionType) => Question[];
    getQuestionsByDifficulty: (difficulty: DifficultyLevel) => Question[];
    searchQuestions: (query: string) => Question[];
    loading: boolean;
    error: string | null;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

// Sample questions for when Firestore is not configured
const sampleQuestions: Question[] = [
    {
        id: 'sample_q1',
        type: 'coding',
        title: 'Two Sum',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
        difficulty: 'easy',
        tags: ['arrays', 'hash-table'],
        timeLimit: 15,
        points: 100,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        testCases: [
            { id: 't1', input: '[2,7,11,15], 9', expectedOutput: '[0,1]', isHidden: false, explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
            { id: 't2', input: '[3,2,4], 6', expectedOutput: '[1,2]', isHidden: false },
            { id: 't3', input: '[3,3], 6', expectedOutput: '[0,1]', isHidden: true }
        ],
        starterCode: [
            { language: 'javascript', code: 'function twoSum(nums, target) {\n    // Your code here\n    \n}' },
            { language: 'python', code: 'def two_sum(nums, target):\n    # Your code here\n    pass' }
        ],
        solutionCode: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}',
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
        examples: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9' }
        ]
    } as CodingQuestion,
    {
        id: 'sample_q2',
        type: 'mcq',
        title: 'Time Complexity of Binary Search',
        description: 'What is the time complexity of binary search algorithm?',
        difficulty: 'easy',
        tags: ['algorithms', 'complexity'],
        timeLimit: 2,
        points: 10,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        options: [
            { id: 'o1', text: 'O(n)', isCorrect: false },
            { id: 'o2', text: 'O(log n)', isCorrect: true },
            { id: 'o3', text: 'O(n²)', isCorrect: false },
            { id: 'o4', text: 'O(1)', isCorrect: false }
        ],
        allowMultiple: false,
        explanation: 'Binary search divides the search space in half with each comparison.'
    } as MCQQuestion
];

export function QuestionProvider({ children }: { children: ReactNode }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [useFirestore, setUseFirestore] = useState(true);

    // Subscribe to Firestore questions collection
    useEffect(() => {
        let unsubscribe: () => void = () => { };

        const loadFromLocalStorage = () => {
            const stored = localStorage.getItem('hireiq_questions');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (parsed.length > 0) {
                        setQuestions(parsed.map((q: Question) => ({
                            ...q,
                            createdAt: new Date(q.createdAt),
                            updatedAt: new Date(q.updatedAt)
                        })));
                    } else {
                        setQuestions(sampleQuestions);
                    }
                } catch {
                    setQuestions(sampleQuestions);
                }
            } else {
                setQuestions(sampleQuestions);
            }
            setLoading(false);
        };

        const setupFirestore = async () => {
            try {
                const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));

                unsubscribe = onSnapshot(q,
                    (snapshot) => {
                        const questionsData: Question[] = [];
                        snapshot.forEach((doc) => {
                            const data = doc.data();
                            questionsData.push({
                                ...data,
                                id: doc.id,
                                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
                                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
                            } as Question);
                        });

                        // If no questions in Firestore, check localStorage first before using samples
                        if (questionsData.length === 0) {
                            loadFromLocalStorage();
                        } else {
                            setQuestions(questionsData);
                            setLoading(false);
                        }
                        setError(null);
                    },
                    (err) => {
                        console.error('Firestore subscription error:', err);
                        // Fallback to localStorage/samples if Firestore fails
                        setUseFirestore(false);
                        loadFromLocalStorage();
                    }
                );
            } catch (err) {
                console.error('Firestore setup error:', err);
                setUseFirestore(false);
                loadFromLocalStorage();
            }
        };

        // Check if Firebase is properly configured (not using placeholder values)
        const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
            !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.includes('YOUR_');

        if (isFirebaseConfigured) {
            setupFirestore();
        } else {
            // Firebase not configured, use localStorage directly
            console.log('Firebase not configured, using localStorage');
            setUseFirestore(false);
            loadFromLocalStorage();
        }

        return () => unsubscribe();
    }, []);

    // Save to localStorage as backup
    useEffect(() => {
        if (!loading && questions.length > 0) {
            localStorage.setItem('hireiq_questions', JSON.stringify(questions));
        }
    }, [questions, loading]);

    const addQuestion = async (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
        if (useFirestore) {
            try {
                const docRef = await addDoc(collection(db, 'questions'), {
                    ...question,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                return docRef.id;
            } catch (err) {
                console.error('Error adding question to Firestore:', err);
                // Fallback to local
                const newQuestion = {
                    ...question,
                    id: `local_${Date.now()}`,
                    createdAt: new Date(),
                    updatedAt: new Date()
                } as Question;
                setQuestions(prev => [newQuestion, ...prev]);
                return newQuestion.id;
            }
        } else {
            const newQuestion = {
                ...question,
                id: `local_${Date.now()}`,
                createdAt: new Date(),
                updatedAt: new Date()
            } as Question;
            setQuestions(prev => [newQuestion, ...prev]);
            return newQuestion.id;
        }
    };

    const updateQuestion = async (id: string, updates: Partial<Question>): Promise<void> => {
        if (useFirestore && !id.startsWith('local_') && !id.startsWith('sample_')) {
            try {
                await updateDoc(doc(db, 'questions', id), {
                    ...updates,
                    updatedAt: serverTimestamp()
                });
            } catch (err) {
                console.error('Error updating question in Firestore:', err);
                // Fallback to local update
                setQuestions(prev => prev.map(q =>
                    q.id === id ? { ...q, ...updates, updatedAt: new Date() } as Question : q
                ));
            }
        } else {
            setQuestions(prev => prev.map(q =>
                q.id === id ? { ...q, ...updates, updatedAt: new Date() } as Question : q
            ));
        }
    };

    const deleteQuestion = async (id: string): Promise<void> => {
        if (useFirestore && !id.startsWith('local_') && !id.startsWith('sample_')) {
            try {
                await deleteDoc(doc(db, 'questions', id));
            } catch (err) {
                console.error('Error deleting question from Firestore:', err);
                setQuestions(prev => prev.filter(q => q.id !== id));
            }
        } else {
            setQuestions(prev => prev.filter(q => q.id !== id));
        }
    };

    const getQuestionById = (id: string) => questions.find(q => q.id === id);

    const getQuestionsByType = (type: QuestionType) => questions.filter(q => q.type === type);

    const getQuestionsByDifficulty = (difficulty: DifficultyLevel) => questions.filter(q => q.difficulty === difficulty);

    const searchQuestions = (queryStr: string) => {
        const lower = queryStr.toLowerCase();
        return questions.filter(q =>
            q.title.toLowerCase().includes(lower) ||
            q.description.toLowerCase().includes(lower) ||
            q.tags.some(tag => tag.toLowerCase().includes(lower))
        );
    };

    return (
        <QuestionContext.Provider value={{
            questions,
            addQuestion,
            updateQuestion,
            deleteQuestion,
            getQuestionById,
            getQuestionsByType,
            getQuestionsByDifficulty,
            searchQuestions,
            loading,
            error
        }}>
            {children}
        </QuestionContext.Provider>
    );
}

export function useQuestions() {
    const context = useContext(QuestionContext);
    if (context === undefined) {
        throw new Error('useQuestions must be used within a QuestionProvider');
    }
    return context;
}
