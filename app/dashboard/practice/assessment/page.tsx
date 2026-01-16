'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';
import { useQuestions } from '@/contexts/QuestionContext';
import { Question, MCQQuestion, QuestionType, DifficultyLevel } from '@/types';
import {
    CheckCircle, XCircle, Clock, Award, ChevronRight, ChevronLeft,
    Flag, RotateCcw, Send, BookOpen, Brain, Target, Zap, Trophy,
    Filter, Search
} from 'lucide-react';

// Wrapper component to handle Suspense boundary for useSearchParams
export default function AssessmentPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg-primary)' }}><div className="text-white">Loading...</div></div>}>
            <AssessmentPageContent />
        </Suspense>
    );
}

function AssessmentPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { questions } = useQuestions();

    // Filter for MCQ and aptitude questions
    const assessmentQuestions = questions.filter(
        q => q.type === 'mcq' || q.type === 'aptitude' || q.type === 'true-false'
    ) as (MCQQuestion | Question)[];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
    const [showResults, setShowResults] = useState(false);
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
    const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'all'>('all');
    const [filterType, setFilterType] = useState<'all' | 'mcq' | 'aptitude' | 'true-false'>('all');

    // Apply filters
    const filteredQuestions = assessmentQuestions.filter(q => {
        const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
        const matchesType = filterType === 'all' || q.type === filterType;
        return matchesDifficulty && matchesType;
    });

    const currentQuestion = filteredQuestions[currentIndex];

    // Timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            setShowResults(true);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timeRemaining]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelectAnswer = (questionId: string, optionId: string) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: [optionId]
        }));
    };

    const handleTrueFalseAnswer = (questionId: string, answer: boolean) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: [answer.toString()]
        }));
    };

    const toggleFlag = (questionId: string) => {
        setFlaggedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };

    const calculateScore = () => {
        let correct = 0;
        filteredQuestions.forEach(q => {
            const selected = selectedAnswers[q.id];
            if (!selected) return;

            if (q.type === 'mcq' || q.type === 'aptitude') {
                const mcqQ = q as MCQQuestion;
                const correctOption = mcqQ.options.find(o => o.isCorrect);
                if (correctOption && selected.includes(correctOption.id)) {
                    correct++;
                }
            } else if (q.type === 'true-false') {
                const tfQ = q as any;
                if (selected[0] === tfQ.correctAnswer.toString()) {
                    correct++;
                }
            }
        });
        return { correct, total: filteredQuestions.length };
    };

    const handleSubmit = () => {
        setShowResults(true);
        setIsTimerActive(false);
    };

    const handleReset = () => {
        setSelectedAnswers({});
        setShowResults(false);
        setCurrentIndex(0);
        setFlaggedQuestions(new Set());
        setTimeRemaining(30 * 60);
        setIsTimerActive(false);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' };
            case 'medium': return { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
            case 'hard': return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
            default: return { bg: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af' };
        }
    };

    if (filteredQuestions.length === 0) {
        return (
            <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
                <Sidebar />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <div className="text-center">
                        <BookOpen size={64} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-4" />
                        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>No practice questions available</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Check back later when recruiters add more questions!</p>
                    </div>
                </main>
            </div>
        );
    }

    // Results View
    if (showResults) {
        const { correct, total } = calculateScore();
        const percentage = Math.round((correct / total) * 100);

        return (
            <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
                <Sidebar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <TopBar />

                    <div className="max-w-3xl mx-auto mt-8">
                        <div className="text-center mb-8">
                            <div className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center"
                                style={{
                                    background: percentage >= 70 ? 'linear-gradient(135deg, #10b981, #14b8a6)' :
                                        percentage >= 40 ? 'linear-gradient(135deg, #f59e0b, #f97316)' :
                                            'linear-gradient(135deg, #ef4444, #dc2626)'
                                }}>
                                <Trophy size={48} className="text-white" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                Assessment Complete!
                            </h1>
                            <p className="text-5xl font-bold mb-2" style={{
                                color: percentage >= 70 ? '#10b981' : percentage >= 40 ? '#f59e0b' : '#ef4444'
                            }}>
                                {percentage}%
                            </p>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                {correct} out of {total} questions correct
                            </p>
                        </div>

                        {/* Question Review */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Review Answers</h3>
                            {filteredQuestions.map((q, idx) => {
                                const selected = selectedAnswers[q.id];
                                let isCorrect = false;
                                let correctAnswerText = '';

                                if (q.type === 'mcq' || q.type === 'aptitude') {
                                    const mcqQ = q as MCQQuestion;
                                    const correctOption = mcqQ.options.find(o => o.isCorrect);
                                    correctAnswerText = correctOption?.text || '';
                                    isCorrect = correctOption && selected?.includes(correctOption.id) || false;
                                } else if (q.type === 'true-false') {
                                    const tfQ = q as any;
                                    correctAnswerText = tfQ.correctAnswer ? 'True' : 'False';
                                    isCorrect = selected?.[0] === tfQ.correctAnswer.toString();
                                }

                                return (
                                    <div key={q.id} className="p-4 rounded-xl" style={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        border: `2px solid ${isCorrect ? '#10b981' : '#ef4444'}`
                                    }}>
                                        <div className="flex items-start gap-3">
                                            {isCorrect ?
                                                <CheckCircle size={24} style={{ color: '#10b981' }} /> :
                                                <XCircle size={24} style={{ color: '#ef4444' }} />
                                            }
                                            <div className="flex-1">
                                                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                                    {idx + 1}. {q.title}
                                                </p>
                                                {!isCorrect && (
                                                    <p className="text-sm mt-1" style={{ color: '#10b981' }}>
                                                        Correct answer: {correctAnswerText}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={handleReset}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium"
                                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            >
                                <RotateCcw size={18} /> Try Again
                            </button>
                            <button
                                onClick={() => router.push('/dashboard/practice')}
                                className="flex-1 py-3 rounded-lg text-white font-medium"
                                style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
                            >
                                Back to Practice Zone
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const diffStyle = getDifficultyColor(currentQuestion.difficulty);

    return (
        <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 pb-0"><TopBar /></div>

                {/* Header Bar */}
                <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Practice Assessment 📝
                    </h1>
                    <div className="flex items-center gap-4">
                        {/* Filters */}
                        <select
                            value={filterType}
                            onChange={(e) => { setFilterType(e.target.value as any); setCurrentIndex(0); }}
                            className="px-3 py-2 rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                        >
                            <option value="all">All Types</option>
                            <option value="mcq">MCQ</option>
                            <option value="aptitude">Aptitude</option>
                            <option value="true-false">True/False</option>
                        </select>
                        <select
                            value={filterDifficulty}
                            onChange={(e) => { setFilterDifficulty(e.target.value as any); setCurrentIndex(0); }}
                            className="px-3 py-2 rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                        >
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        {/* Timer */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                            <Clock size={18} style={{ color: isTimerActive ? '#f59e0b' : 'var(--text-muted)' }} />
                            <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatTime(timeRemaining)}</span>
                            <button
                                onClick={() => setIsTimerActive(!isTimerActive)}
                                className="px-2 py-1 rounded text-xs"
                                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                            >
                                {isTimerActive ? 'Pause' : 'Start'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Question Navigator Sidebar */}
                    <div className="w-64 border-r overflow-y-auto p-4" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
                        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Questions</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {filteredQuestions.map((q, idx) => {
                                const isAnswered = !!selectedAnswers[q.id];
                                const isFlagged = flaggedQuestions.has(q.id);
                                const isCurrent = idx === currentIndex;

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all relative ${isCurrent ? 'ring-2 ring-offset-2 ring-cyan-500' : ''}`}
                                        style={{
                                            backgroundColor: isAnswered ? '#10b981' : 'var(--bg-tertiary)',
                                            color: isAnswered ? 'white' : 'var(--text-primary)'
                                        }}
                                    >
                                        {idx + 1}
                                        {isFlagged && (
                                            <Flag size={10} className="absolute -top-1 -right-1" style={{ color: '#f59e0b' }} fill="#f59e0b" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }} />
                                <span style={{ color: 'var(--text-secondary)' }}>Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }} />
                                <span style={{ color: 'var(--text-secondary)' }}>Not answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Flag size={14} style={{ color: '#f59e0b' }} fill="#f59e0b" />
                                <span style={{ color: 'var(--text-secondary)' }}>Flagged</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full mt-6 py-3 rounded-lg text-white font-medium"
                            style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}
                        >
                            <Send size={18} className="inline mr-2" />
                            Submit Assessment
                        </button>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Question {currentIndex + 1} of {filteredQuestions.length}
                                </span>
                                <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: diffStyle.bg, color: diffStyle.color }}>
                                    {currentQuestion.difficulty.toUpperCase()}
                                </span>
                                <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                                    <Award size={14} /> {currentQuestion.points} pts
                                </span>
                            </div>
                            <button
                                onClick={() => toggleFlag(currentQuestion.id)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                style={{
                                    backgroundColor: flaggedQuestions.has(currentQuestion.id) ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-secondary)',
                                    color: flaggedQuestions.has(currentQuestion.id) ? '#f59e0b' : 'var(--text-secondary)'
                                }}
                            >
                                <Flag size={16} fill={flaggedQuestions.has(currentQuestion.id) ? '#f59e0b' : 'none'} />
                                {flaggedQuestions.has(currentQuestion.id) ? 'Flagged' : 'Flag for review'}
                            </button>
                        </div>

                        {/* Question Title & Description */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                                {currentQuestion.title}
                            </h2>
                            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                {currentQuestion.description}
                            </p>
                        </div>

                        {/* Options for MCQ/Aptitude */}
                        {(currentQuestion.type === 'mcq' || currentQuestion.type === 'aptitude') && (
                            <div className="space-y-3">
                                {(currentQuestion as MCQQuestion).options.map((option, idx) => {
                                    const isSelected = selectedAnswers[currentQuestion.id]?.includes(option.id);
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                                            className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${isSelected ? 'ring-2 ring-cyan-500' : ''}`}
                                            style={{
                                                backgroundColor: isSelected ? 'rgba(20, 184, 166, 0.1)' : 'var(--bg-secondary)',
                                                border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`
                                            }}
                                        >
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                                                style={{
                                                    backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                                    color: isSelected ? 'white' : 'var(--text-primary)'
                                                }}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span style={{ color: 'var(--text-primary)' }}>{option.text}</span>
                                            {isSelected && <CheckCircle size={20} className="ml-auto" style={{ color: 'var(--accent-primary)' }} />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* True/False Options */}
                        {currentQuestion.type === 'true-false' && (
                            <div className="flex gap-4">
                                {[true, false].map(value => {
                                    const isSelected = selectedAnswers[currentQuestion.id]?.[0] === value.toString();
                                    return (
                                        <button
                                            key={value.toString()}
                                            onClick={() => handleTrueFalseAnswer(currentQuestion.id, value)}
                                            className={`flex-1 p-6 rounded-xl text-center transition-all ${isSelected ? 'ring-2' : ''}`}
                                            style={{
                                                backgroundColor: isSelected
                                                    ? (value ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)')
                                                    : 'var(--bg-secondary)',
                                                border: `2px solid ${isSelected ? (value ? '#10b981' : '#ef4444') : 'var(--border-subtle)'}`
                                            }}
                                        >
                                            <span className="text-xl font-bold" style={{ color: isSelected ? (value ? '#10b981' : '#ef4444') : 'var(--text-primary)' }}>
                                                {value ? 'TRUE' : 'FALSE'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                            <button
                                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                disabled={currentIndex === 0}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg disabled:opacity-50"
                                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            >
                                <ChevronLeft size={18} /> Previous
                            </button>
                            <button
                                onClick={() => setCurrentIndex(Math.min(filteredQuestions.length - 1, currentIndex + 1))}
                                disabled={currentIndex === filteredQuestions.length - 1}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg disabled:opacity-50"
                                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            >
                                Next <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
