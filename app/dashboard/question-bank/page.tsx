'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useQuestions } from '@/contexts/QuestionContext';
import { Question, QuestionType, DifficultyLevel, CodingQuestion, MCQQuestion, TestCase, MCQOption, StarterCode } from '@/types';
import {
    Plus, Search, Filter, Code, HelpCircle, CheckSquare, Type,
    ToggleLeft, Edit, Trash2, Eye, ChevronDown, ChevronUp, X,
    Save, Clock, Award, Tag, AlertCircle, FileText, BookOpen
} from 'lucide-react';

const QUESTION_TYPES: { id: QuestionType; label: string; icon: typeof Code; color: string }[] = [
    { id: 'coding', label: 'Coding', icon: Code, color: '#3b82f6' },
    { id: 'mcq', label: 'MCQ', icon: CheckSquare, color: '#8b5cf6' },
    { id: 'aptitude', label: 'Aptitude', icon: BookOpen, color: '#f59e0b' },
    { id: 'short-answer', label: 'Short Answer', icon: Type, color: '#10b981' },
    { id: 'true-false', label: 'True/False', icon: ToggleLeft, color: '#ec4899' },
];

const DIFFICULTY_LEVELS: { id: DifficultyLevel; label: string; color: string }[] = [
    { id: 'easy', label: 'Easy', color: '#10b981' },
    { id: 'medium', label: 'Medium', color: '#f59e0b' },
    { id: 'hard', label: 'Hard', color: '#ef4444' },
];

export default function QuestionBankPage() {
    const router = useRouter();
    const { questions, addQuestion, deleteQuestion } = useQuestions();
    const [isRecruiter, setIsRecruiter] = useState<boolean | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<QuestionType | 'all'>('all');
    const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

    // New question form state
    const [newQuestion, setNewQuestion] = useState({
        type: 'mcq' as QuestionType,
        title: '',
        description: '',
        difficulty: 'medium' as DifficultyLevel,
        tags: '',
        timeLimit: 10,
        points: 50,
        // MCQ specific
        options: [
            { id: '1', text: '', isCorrect: false },
            { id: '2', text: '', isCorrect: false },
            { id: '3', text: '', isCorrect: false },
            { id: '4', text: '', isCorrect: false },
        ] as MCQOption[],
        explanation: '',
        // Coding specific
        testCases: [{ id: '1', input: '', expectedOutput: '', isHidden: false }] as TestCase[],
        starterCode: [
            { language: 'javascript', code: 'function solution() {\n    // Your code here\n}' },
            { language: 'python', code: 'def solution():\n    # Your code here\n    pass' }
        ] as StarterCode[],
        constraints: [''],
        examples: [{ input: '', output: '', explanation: '' }],
        solutionCode: '',
        // Short answer
        acceptedAnswers: [''],
        caseSensitive: false,
        // True/False
        correctAnswer: true,
    });

    useEffect(() => {
        const userData = localStorage.getItem('hireiq_user');
        if (userData) {
            const user = JSON.parse(userData);
            const recruiter = user.accountType !== 'candidate';
            setIsRecruiter(recruiter);
            if (!recruiter) {
                router.push('/dashboard');
            }
        } else {
            setIsRecruiter(true);
        }
    }, [router]);

    // Filter questions
    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = filterType === 'all' || q.type === filterType;
        const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
        return matchesSearch && matchesType && matchesDifficulty;
    });

    const handleCreateQuestion = () => {
        const baseQuestion = {
            id: `q_${Date.now()}`,
            title: newQuestion.title,
            description: newQuestion.description,
            difficulty: newQuestion.difficulty,
            tags: newQuestion.tags.split(',').map(t => t.trim()).filter(Boolean),
            timeLimit: newQuestion.timeLimit,
            points: newQuestion.points,
            createdBy: 'recruiter',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        let finalQuestion: Question;

        if (newQuestion.type === 'coding') {
            finalQuestion = {
                ...baseQuestion,
                type: 'coding',
                testCases: newQuestion.testCases,
                starterCode: newQuestion.starterCode,
                solutionCode: newQuestion.solutionCode,
                constraints: newQuestion.constraints.filter(Boolean),
                examples: newQuestion.examples.filter(e => e.input || e.output),
            } as CodingQuestion;
        } else if (newQuestion.type === 'mcq' || newQuestion.type === 'aptitude') {
            finalQuestion = {
                ...baseQuestion,
                type: newQuestion.type as 'mcq' | 'aptitude',
                options: newQuestion.options.filter(o => o.text),
                allowMultiple: false,
                explanation: newQuestion.explanation,
            } as MCQQuestion;
        } else if (newQuestion.type === 'short-answer') {
            finalQuestion = {
                ...baseQuestion,
                type: 'short-answer',
                acceptedAnswers: newQuestion.acceptedAnswers.filter(Boolean),
                caseSensitive: newQuestion.caseSensitive,
            } as Question;
        } else {
            finalQuestion = {
                ...baseQuestion,
                type: 'true-false',
                correctAnswer: newQuestion.correctAnswer,
                explanation: newQuestion.explanation,
            } as Question;
        }

        addQuestion(finalQuestion);
        setShowCreateModal(false);
        resetForm();
    };

    const resetForm = () => {
        setNewQuestion({
            type: 'mcq',
            title: '',
            description: '',
            difficulty: 'medium',
            tags: '',
            timeLimit: 10,
            points: 50,
            options: [
                { id: '1', text: '', isCorrect: false },
                { id: '2', text: '', isCorrect: false },
                { id: '3', text: '', isCorrect: false },
                { id: '4', text: '', isCorrect: false },
            ],
            explanation: '',
            testCases: [{ id: '1', input: '', expectedOutput: '', isHidden: false }],
            starterCode: [
                { language: 'javascript', code: 'function solution() {\n    // Your code here\n}' },
                { language: 'python', code: 'def solution():\n    # Your code here\n    pass' }
            ],
            constraints: [''],
            examples: [{ input: '', output: '', explanation: '' }],
            solutionCode: '',
            acceptedAnswers: [''],
            caseSensitive: false,
            correctAnswer: true,
        });
    };

    const getTypeConfig = (type: QuestionType) => {
        return QUESTION_TYPES.find(t => t.id === type) || QUESTION_TYPES[0];
    };

    const getDifficultyConfig = (difficulty: DifficultyLevel) => {
        return DIFFICULTY_LEVELS.find(d => d.id === difficulty) || DIFFICULTY_LEVELS[1];
    };

    if (isRecruiter === null) {
        return (
            <div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />

            <main className="flex-1 p-8 space-y-6 overflow-y-auto">
                <TopBar />

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Question Bank 📚
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Create and manage assessment questions for candidates
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-5 py-3 rounded-lg text-white font-medium transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
                    >
                        <Plus size={20} />
                        Create Question
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-5 gap-4">
                    {QUESTION_TYPES.map(type => {
                        const count = questions.filter(q => q.type === type.id).length;
                        return (
                            <div
                                key={type.id}
                                className="rounded-xl p-4 cursor-pointer transition-all hover:scale-105"
                                style={{ backgroundColor: 'var(--bg-secondary)', border: filterType === type.id ? `2px solid ${type.color}` : '1px solid var(--border-subtle)' }}
                                onClick={() => setFilterType(filterType === type.id ? 'all' : type.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${type.color}20` }}>
                                        <type.icon size={20} style={{ color: type.color }} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{count}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{type.label}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Search & Filters */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search questions by title, description, or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg"
                        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
                    >
                        <Filter size={18} />
                        Filters
                        {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Difficulty:</span>
                        {DIFFICULTY_LEVELS.map(level => (
                            <button
                                key={level.id}
                                onClick={() => setFilterDifficulty(filterDifficulty === level.id ? 'all' : level.id)}
                                className="px-3 py-1 rounded-full text-sm transition-all"
                                style={{
                                    backgroundColor: filterDifficulty === level.id ? level.color : 'var(--bg-tertiary)',
                                    color: filterDifficulty === level.id ? 'white' : 'var(--text-secondary)'
                                }}
                            >
                                {level.label}
                            </button>
                        ))}
                        {(filterType !== 'all' || filterDifficulty !== 'all') && (
                            <button
                                onClick={() => { setFilterType('all'); setFilterDifficulty('all'); }}
                                className="ml-auto text-sm flex items-center gap-1"
                                style={{ color: 'var(--accent-primary)' }}
                            >
                                <X size={14} /> Clear filters
                            </button>
                        )}
                    </div>
                )}

                {/* Questions List */}
                <div className="space-y-4">
                    {filteredQuestions.length === 0 ? (
                        <div className="text-center py-12 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                            <HelpCircle size={48} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-4" />
                            <p style={{ color: 'var(--text-secondary)' }}>No questions found</p>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or create a new question</p>
                        </div>
                    ) : (
                        filteredQuestions.map(question => {
                            const typeConfig = getTypeConfig(question.type);
                            const diffConfig = getDifficultyConfig(question.difficulty);
                            return (
                                <div
                                    key={question.id}
                                    className="rounded-xl p-5 transition-all hover:shadow-lg"
                                    style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-lg" style={{ backgroundColor: `${typeConfig.color}20` }}>
                                                <typeConfig.icon size={24} style={{ color: typeConfig.color }} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                                                    {question.title}
                                                </h3>
                                                <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                                                    {question.description.substring(0, 150)}...
                                                </p>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: `${diffConfig.color}20`, color: diffConfig.color }}>
                                                        {diffConfig.label}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                        <Clock size={12} /> {question.timeLimit} min
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                        <Award size={12} /> {question.points} pts
                                                    </span>
                                                    {question.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setPreviewQuestion(question)}
                                                className="p-2 rounded-lg transition-all hover:bg-[var(--bg-tertiary)]"
                                            >
                                                <Eye size={18} style={{ color: 'var(--text-secondary)' }} />
                                            </button>
                                            <button className="p-2 rounded-lg transition-all hover:bg-[var(--bg-tertiary)]">
                                                <Edit size={18} style={{ color: 'var(--text-secondary)' }} />
                                            </button>
                                            <button
                                                onClick={() => deleteQuestion(question.id)}
                                                className="p-2 rounded-lg transition-all hover:bg-red-500/10"
                                            >
                                                <Trash2 size={18} style={{ color: '#ef4444' }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Create Question Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Create New Question</h2>
                                <button onClick={() => { setShowCreateModal(false); resetForm(); }}>
                                    <X size={24} style={{ color: 'var(--text-muted)' }} />
                                </button>
                            </div>

                            {/* Question Type Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Question Type</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {QUESTION_TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setNewQuestion({ ...newQuestion, type: type.id })}
                                            className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all"
                                            style={{
                                                backgroundColor: newQuestion.type === type.id ? `${type.color}20` : 'var(--bg-tertiary)',
                                                border: newQuestion.type === type.id ? `2px solid ${type.color}` : '2px solid transparent'
                                            }}
                                        >
                                            <type.icon size={24} style={{ color: type.color }} />
                                            <span className="text-xs" style={{ color: newQuestion.type === type.id ? type.color : 'var(--text-secondary)' }}>
                                                {type.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Title</label>
                                    <input
                                        type="text"
                                        value={newQuestion.title}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                                        placeholder="Enter question title..."
                                        className="w-full px-4 py-3 rounded-lg"
                                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
                                    <textarea
                                        value={newQuestion.description}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                                        placeholder="Enter question description..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg resize-none"
                                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Difficulty</label>
                                    <select
                                        value={newQuestion.difficulty}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as DifficultyLevel })}
                                        className="w-full px-4 py-3 rounded-lg"
                                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                                    >
                                        {DIFFICULTY_LEVELS.map(level => (
                                            <option key={level.id} value={level.id}>{level.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={newQuestion.tags}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                                        placeholder="e.g., arrays, loops, algorithms"
                                        className="w-full px-4 py-3 rounded-lg"
                                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Time Limit (minutes)</label>
                                    <input
                                        type="number"
                                        value={newQuestion.timeLimit}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, timeLimit: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 rounded-lg"
                                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Points</label>
                                    <input
                                        type="number"
                                        value={newQuestion.points}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 rounded-lg"
                                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                                    />
                                </div>
                            </div>

                            {/* Type-specific fields */}
                            {(newQuestion.type === 'mcq' || newQuestion.type === 'aptitude') && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Options (mark correct answer)</label>
                                    <div className="space-y-3">
                                        {newQuestion.options.map((option, idx) => (
                                            <div key={option.id} className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="correctOption"
                                                    checked={option.isCorrect}
                                                    onChange={() => {
                                                        const newOptions = newQuestion.options.map((o, i) => ({ ...o, isCorrect: i === idx }));
                                                        setNewQuestion({ ...newQuestion, options: newOptions });
                                                    }}
                                                    className="w-5 h-5 accent-green-500"
                                                />
                                                <input
                                                    type="text"
                                                    value={option.text}
                                                    onChange={(e) => {
                                                        const newOptions = [...newQuestion.options];
                                                        newOptions[idx].text = e.target.value;
                                                        setNewQuestion({ ...newQuestion, options: newOptions });
                                                    }}
                                                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                                    className="flex-1 px-4 py-2 rounded-lg"
                                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Explanation (optional)</label>
                                        <textarea
                                            value={newQuestion.explanation}
                                            onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                                            placeholder="Explain why the correct answer is correct..."
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-lg resize-none"
                                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                                        />
                                    </div>
                                </div>
                            )}

                            {newQuestion.type === 'coding' && (
                                <div className="mb-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Test Cases</label>
                                        {newQuestion.testCases.map((tc, idx) => (
                                            <div key={tc.id} className="grid grid-cols-2 gap-3 mb-2">
                                                <input
                                                    type="text"
                                                    value={tc.input}
                                                    onChange={(e) => {
                                                        const newTestCases = [...newQuestion.testCases];
                                                        newTestCases[idx].input = e.target.value;
                                                        setNewQuestion({ ...newQuestion, testCases: newTestCases });
                                                    }}
                                                    placeholder="Input"
                                                    className="px-4 py-2 rounded-lg"
                                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                                                />
                                                <input
                                                    type="text"
                                                    value={tc.expectedOutput}
                                                    onChange={(e) => {
                                                        const newTestCases = [...newQuestion.testCases];
                                                        newTestCases[idx].expectedOutput = e.target.value;
                                                        setNewQuestion({ ...newQuestion, testCases: newTestCases });
                                                    }}
                                                    placeholder="Expected Output"
                                                    className="px-4 py-2 rounded-lg"
                                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setNewQuestion({
                                                ...newQuestion,
                                                testCases: [...newQuestion.testCases, { id: `${Date.now()}`, input: '', expectedOutput: '', isHidden: false }]
                                            })}
                                            className="text-sm mt-2 flex items-center gap-1"
                                            style={{ color: 'var(--accent-primary)' }}
                                        >
                                            <Plus size={14} /> Add Test Case
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Solution Code</label>
                                        <textarea
                                            value={newQuestion.solutionCode}
                                            onChange={(e) => setNewQuestion({ ...newQuestion, solutionCode: e.target.value })}
                                            placeholder="Enter the solution code..."
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-lg font-mono text-sm resize-none"
                                            style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', border: '1px solid var(--border-subtle)' }}
                                        />
                                    </div>
                                </div>
                            )}

                            {newQuestion.type === 'true-false' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Correct Answer</label>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: true })}
                                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${newQuestion.correctAnswer ? 'text-white' : ''}`}
                                            style={{
                                                backgroundColor: newQuestion.correctAnswer ? '#10b981' : 'var(--bg-tertiary)',
                                                color: newQuestion.correctAnswer ? 'white' : 'var(--text-secondary)'
                                            }}
                                        >
                                            True
                                        </button>
                                        <button
                                            onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: false })}
                                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${!newQuestion.correctAnswer ? 'text-white' : ''}`}
                                            style={{
                                                backgroundColor: !newQuestion.correctAnswer ? '#ef4444' : 'var(--bg-tertiary)',
                                                color: !newQuestion.correctAnswer ? 'white' : 'var(--text-secondary)'
                                            }}
                                        >
                                            False
                                        </button>
                                    </div>
                                </div>
                            )}

                            {newQuestion.type === 'short-answer' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Accepted Answers</label>
                                    {newQuestion.acceptedAnswers.map((answer, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            value={answer}
                                            onChange={(e) => {
                                                const newAnswers = [...newQuestion.acceptedAnswers];
                                                newAnswers[idx] = e.target.value;
                                                setNewQuestion({ ...newQuestion, acceptedAnswers: newAnswers });
                                            }}
                                            placeholder={`Accepted answer ${idx + 1}`}
                                            className="w-full px-4 py-2 rounded-lg mb-2"
                                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                                        />
                                    ))}
                                    <button
                                        onClick={() => setNewQuestion({ ...newQuestion, acceptedAnswers: [...newQuestion.acceptedAnswers, ''] })}
                                        className="text-sm flex items-center gap-1"
                                        style={{ color: 'var(--accent-primary)' }}
                                    >
                                        <Plus size={14} /> Add Answer
                                    </button>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                                <button
                                    onClick={() => { setShowCreateModal(false); resetForm(); }}
                                    className="px-5 py-2 rounded-lg"
                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateQuestion}
                                    disabled={!newQuestion.title || !newQuestion.description}
                                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium disabled:opacity-50"
                                    style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
                                >
                                    <Save size={18} />
                                    Create Question
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview Modal */}
                {previewQuestion && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const config = getTypeConfig(previewQuestion.type);
                                        return (
                                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${config.color}20` }}>
                                                <config.icon size={24} style={{ color: config.color }} />
                                            </div>
                                        );
                                    })()}
                                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{previewQuestion.title}</h2>
                                </div>
                                <button onClick={() => setPreviewQuestion(null)}>
                                    <X size={24} style={{ color: 'var(--text-muted)' }} />
                                </button>
                            </div>
                            <p className="whitespace-pre-wrap mb-4" style={{ color: 'var(--text-secondary)' }}>{previewQuestion.description}</p>

                            {previewQuestion.type === 'coding' && (
                                <div>
                                    <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Test Cases</h4>
                                    {(previewQuestion as CodingQuestion).testCases.filter(tc => !tc.isHidden).map((tc, idx) => (
                                        <div key={tc.id} className="p-3 rounded-lg mb-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                            <p className="text-sm"><span className="font-medium">Input:</span> {tc.input}</p>
                                            <p className="text-sm"><span className="font-medium">Output:</span> {tc.expectedOutput}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {(previewQuestion.type === 'mcq' || previewQuestion.type === 'aptitude') && (
                                <div>
                                    <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Options</h4>
                                    {(previewQuestion as MCQQuestion).options.map((opt, idx) => (
                                        <div key={opt.id} className={`p-3 rounded-lg mb-2 flex items-center gap-2 ${opt.isCorrect ? 'border-2' : ''}`} style={{
                                            backgroundColor: 'var(--bg-tertiary)',
                                            borderColor: opt.isCorrect ? '#10b981' : 'transparent'
                                        }}>
                                            <span className="font-medium">{String.fromCharCode(65 + idx)}.</span>
                                            <span>{opt.text}</span>
                                            {opt.isCorrect && <span className="ml-auto text-sm" style={{ color: '#10b981' }}>✓ Correct</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
