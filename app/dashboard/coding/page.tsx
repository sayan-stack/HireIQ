'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useQuestions } from '@/contexts/QuestionContext';
import { CodingQuestion, Question } from '@/types';
import {
    Play, RotateCcw, ChevronRight, ChevronLeft, Clock, CheckCircle,
    XCircle, Code, Terminal, Lightbulb, AlertCircle, Send, Timer,
    Maximize2, Minimize2, Settings, Eye, EyeOff
} from 'lucide-react';

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', extension: 'js' },
    { id: 'python', name: 'Python', extension: 'py' },
    { id: 'java', name: 'Java', extension: 'java' },
    { id: 'cpp', name: 'C++', extension: 'cpp' },
];

// Wrapper component to handle Suspense boundary for useSearchParams
export default function CodingWorkspacePage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg-primary)' }}><div className="text-white">Loading...</div></div>}>
            <CodingWorkspaceContent />
        </Suspense>
    );
}

function CodingWorkspaceContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const questionId = searchParams.get('id');
    const { questions, getQuestionById } = useQuestions();

    const [selectedQuestion, setSelectedQuestion] = useState<CodingQuestion | null>(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState<{ passed: boolean; input: string; expected: string; actual: string }[]>([]);
    const [activeTab, setActiveTab] = useState<'problem' | 'submissions'>('problem');
    const [showHints, setShowHints] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showOutput, setShowOutput] = useState(true);

    // Get coding questions only
    const codingQuestions = questions.filter(q => q.type === 'coding') as CodingQuestion[];

    useEffect(() => {
        if (questionId) {
            const q = getQuestionById(questionId);
            if (q && q.type === 'coding') {
                setSelectedQuestion(q as CodingQuestion);
            }
        } else if (codingQuestions.length > 0 && !selectedQuestion) {
            setSelectedQuestion(codingQuestions[0]);
        }
    }, [questionId, codingQuestions, getQuestionById, selectedQuestion]);

    // Set starter code when question or language changes
    useEffect(() => {
        if (selectedQuestion) {
            const starter = selectedQuestion.starterCode.find(s => s.language === language);
            if (starter) {
                setCode(starter.code);
            } else {
                setCode('// Write your solution here\n');
            }
            // Reset timer
            setTimeRemaining(selectedQuestion.timeLimit * 60);
            setIsTimerActive(false);
            setTestResults([]);
            setOutput('');
        }
    }, [selectedQuestion, language]);

    // Timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && timeRemaining !== null && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => (prev !== null ? prev - 1 : null));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timeRemaining]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRun = async () => {
        if (!selectedQuestion) return;
        setIsRunning(true);
        setOutput('Running tests...\n');

        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check if user has written actual code (not just starter template)
        const hasActualCode = code.length > 50 &&
            !code.includes('// Your code here') &&
            !code.includes('# Your code here') &&
            (code.includes('return') || code.includes('print') || code.includes('console.log'));

        // Generate test results based on whether actual code was written
        const results = selectedQuestion.testCases
            .filter(tc => !tc.isHidden)
            .map((tc, idx) => {
                const passed = hasActualCode;
                return {
                    passed,
                    input: tc.input,
                    expected: tc.expectedOutput,
                    actual: passed ? tc.expectedOutput : 'undefined'
                };
            });

        setTestResults(results);
        const passed = results.filter(r => r.passed).length;

        if (!hasActualCode) {
            setOutput(`Test Results: ${passed}/${results.length} passed\n\n` +
                results.map((r, i) => `Test ${i + 1}: ${r.passed ? '✓ Passed' : '✗ Failed'}`).join('\n') +
                '\n\n⚠️ Tip: Write your solution code to pass the tests!');
        } else {
            setOutput(`Test Results: ${passed}/${results.length} passed\n\n` +
                results.map((r, i) => `Test ${i + 1}: ${r.passed ? '✓ Passed' : '✗ Failed'}`).join('\n'));
        }
        setIsRunning(false);
    };

    const handleSubmit = async () => {
        if (!selectedQuestion) return;
        setIsRunning(true);
        setOutput('Submitting solution...\n');

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check if user has written actual code
        const hasActualCode = code.length > 50 &&
            !code.includes('// Your code here') &&
            !code.includes('# Your code here') &&
            (code.includes('return') || code.includes('print') || code.includes('console.log'));

        const totalTests = selectedQuestion.testCases.length;
        const passedTests = hasActualCode ? totalTests : 0;

        setOutput(`Submission Complete!\n\n` +
            `Test Cases: ${passedTests}/${totalTests} passed\n` +
            `Score: ${Math.round((passedTests / totalTests) * selectedQuestion.points)} / ${selectedQuestion.points} points\n\n` +
            (passedTests === totalTests ? '🎉 All test cases passed!' : '⚠️ Write your solution code to pass the tests!'));
        setIsRunning(false);
    };

    const handleReset = () => {
        if (selectedQuestion) {
            const starter = selectedQuestion.starterCode.find(s => s.language === language);
            setCode(starter?.code || '// Write your solution here\n');
            setOutput('');
            setTestResults([]);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' };
            case 'medium': return { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
            case 'hard': return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
            default: return { bg: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af' };
        }
    };

    if (!selectedQuestion) {
        return (
            <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
                <Sidebar />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <div className="text-center">
                        <Code size={64} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-4" />
                        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>No coding questions available</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Check back later for new challenges!</p>
                    </div>
                </main>
            </div>
        );
    }

    const diffStyle = getDifficultyColor(selectedQuestion.difficulty);

    return (
        <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
            {!isFullscreen && <Sidebar />}

            <main className="flex-1 flex flex-col overflow-hidden">
                {!isFullscreen && <div className="p-4 pb-0"><TopBar /></div>}

                {/* Header Bar */}
                <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex items-center gap-4">
                        <select
                            value={selectedQuestion.id}
                            onChange={(e) => {
                                const q = codingQuestions.find(cq => cq.id === e.target.value);
                                if (q) setSelectedQuestion(q);
                            }}
                            className="px-3 py-2 rounded-lg text-sm font-medium"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-subtle)'
                            }}
                        >
                            {codingQuestions.map(q => (
                                <option key={q.id} value={q.id}>{q.title}</option>
                            ))}
                        </select>
                        <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: diffStyle.bg, color: diffStyle.color }}>
                            {selectedQuestion.difficulty.toUpperCase()}
                        </span>
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {selectedQuestion.points} pts
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Timer */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                            <Timer size={16} style={{ color: isTimerActive ? '#f59e0b' : 'var(--text-muted)' }} />
                            <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                                {timeRemaining !== null ? formatTime(timeRemaining) : '--:--'}
                            </span>
                            <button
                                onClick={() => setIsTimerActive(!isTimerActive)}
                                className="px-2 py-1 rounded text-xs"
                                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                            >
                                {isTimerActive ? 'Pause' : 'Start'}
                            </button>
                        </div>

                        {/* Language Selector */}
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-3 py-2 rounded-lg text-sm"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-subtle)'
                            }}
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.id} value={lang.id}>{lang.name}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: 'var(--bg-secondary)' }}
                        >
                            {isFullscreen ? <Minimize2 size={18} style={{ color: 'var(--text-secondary)' }} /> : <Maximize2 size={18} style={{ color: 'var(--text-secondary)' }} />}
                        </button>
                    </div>
                </div>

                {/* Main Content - Split View */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel - Problem Description */}
                    <div className="w-1/2 border-r overflow-y-auto p-6" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
                        {/* Tabs */}
                        <div className="flex gap-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                            <button
                                onClick={() => setActiveTab('problem')}
                                className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === 'problem' ? 'border-b-2' : ''}`}
                                style={{
                                    color: activeTab === 'problem' ? 'var(--accent-primary)' : 'var(--text-muted)',
                                    borderColor: activeTab === 'problem' ? 'var(--accent-primary)' : 'transparent'
                                }}
                            >
                                Problem
                            </button>
                            <button
                                onClick={() => setActiveTab('submissions')}
                                className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === 'submissions' ? 'border-b-2' : ''}`}
                                style={{
                                    color: activeTab === 'submissions' ? 'var(--accent-primary)' : 'var(--text-muted)',
                                    borderColor: activeTab === 'submissions' ? 'var(--accent-primary)' : 'transparent'
                                }}
                            >
                                Submissions
                            </button>
                        </div>

                        {activeTab === 'problem' && (
                            <>
                                {/* Title */}
                                <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                                    {selectedQuestion.title}
                                </h1>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedQuestion.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Description */}
                                <div className="prose prose-invert max-w-none mb-6">
                                    <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        {selectedQuestion.description}
                                    </p>
                                </div>

                                {/* Examples */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Examples</h3>
                                    {selectedQuestion.examples.map((example, idx) => (
                                        <div key={idx} className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                            <p className="text-sm mb-2">
                                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Input:</span>
                                                <code className="ml-2 px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent-primary)' }}>
                                                    {example.input}
                                                </code>
                                            </p>
                                            <p className="text-sm mb-2">
                                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Output:</span>
                                                <code className="ml-2 px-2 py-1 rounded" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent-primary)' }}>
                                                    {example.output}
                                                </code>
                                            </p>
                                            {example.explanation && (
                                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                                    <span className="font-medium">Explanation:</span> {example.explanation}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Constraints */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Constraints</h3>
                                    <ul className="space-y-2">
                                        {selectedQuestion.constraints.map((constraint, idx) => (
                                            <li key={idx} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                                                <span style={{ color: 'var(--accent-primary)' }}>•</span>
                                                <code className="px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                                    {constraint}
                                                </code>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Hints Toggle */}
                                <div className="border-t pt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                                    <button
                                        onClick={() => setShowHints(!showHints)}
                                        className="flex items-center gap-2 text-sm"
                                        style={{ color: 'var(--accent-primary)' }}
                                    >
                                        <Lightbulb size={16} />
                                        {showHints ? 'Hide Hints' : 'Show Hints'}
                                        {showHints ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    {showHints && (
                                        <div className="mt-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                            <p className="text-sm" style={{ color: '#f59e0b' }}>
                                                💡 Hint: Consider using a hash map to store values and their indices for O(1) lookup.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === 'submissions' && (
                            <div className="text-center py-12">
                                <AlertCircle size={48} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-4" />
                                <p style={{ color: 'var(--text-secondary)' }}>No submissions yet</p>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Submit your solution to see results here</p>
                            </div>
                        )}
                    </div>

                    {/* Right Panel - Code Editor & Output */}
                    <div className="w-1/2 flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        {/* Code Editor */}
                        <div className={`flex-1 ${showOutput ? 'h-3/5' : 'h-full'} flex flex-col`}>
                            <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
                                <div className="flex items-center gap-2">
                                    <Code size={16} style={{ color: 'var(--accent-primary)' }} />
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Code Editor</span>
                                </div>
                                <button onClick={handleReset} className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                                    <RotateCcw size={14} /> Reset
                                </button>
                            </div>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none"
                                style={{
                                    backgroundColor: '#1e1e1e',
                                    color: '#d4d4d4',
                                    lineHeight: '1.6'
                                }}
                                spellCheck={false}
                            />
                        </div>

                        {/* Output Panel */}
                        {showOutput && (
                            <div className="h-2/5 border-t flex flex-col" style={{ borderColor: 'var(--border-subtle)' }}>
                                <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
                                    <div className="flex items-center gap-2">
                                        <Terminal size={16} style={{ color: 'var(--accent-secondary)' }} />
                                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Output</span>
                                    </div>
                                    <button onClick={() => setShowOutput(false)}>
                                        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: '#1e1e1e' }}>
                                    {/* Test Results */}
                                    {testResults.length > 0 && (
                                        <div className="mb-4 space-y-2">
                                            {testResults.map((result, idx) => (
                                                <div key={idx} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: result.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                                                    {result.passed ?
                                                        <CheckCircle size={16} style={{ color: '#10b981' }} /> :
                                                        <XCircle size={16} style={{ color: '#ef4444' }} />
                                                    }
                                                    <span className="text-sm font-mono" style={{ color: result.passed ? '#10b981' : '#ef4444' }}>
                                                        Test {idx + 1}: {result.passed ? 'Passed' : 'Failed'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <pre className="text-sm font-mono whitespace-pre-wrap" style={{ color: '#d4d4d4' }}>
                                        {output || 'Click "Run" to test your code'}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
                            <button
                                onClick={() => setShowOutput(!showOutput)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                            >
                                <Terminal size={16} />
                                {showOutput ? 'Hide Console' : 'Show Console'}
                            </button>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleRun}
                                    disabled={isRunning}
                                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium transition-all disabled:opacity-50"
                                    style={{ backgroundColor: '#3b82f6' }}
                                >
                                    <Play size={16} />
                                    {isRunning ? 'Running...' : 'Run'}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isRunning}
                                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium transition-all disabled:opacity-50"
                                    style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}
                                >
                                    <Send size={16} />
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
