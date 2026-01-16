export interface User {
    id: string;
    email: string;
    name: string;
    role: 'recruiter' | 'candidate';
    avatar?: string;
    createdAt: Date;
}

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'remote';
    salary: { min: number; max: number };
    description: string;
    requirements: string[];
    skills: string[];
    postedAt: Date;
    status: 'active' | 'closed' | 'draft';
    applicants: number;
}

export interface Application {
    id: string;
    jobId: string;
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    resumeUrl: string;
    atsScore: number;
    matchScore: number;
    status: 'pending' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
    appliedAt: Date;
    skills: string[];
}

export interface Interview {
    id: string;
    applicationId: string;
    candidateName: string;
    jobTitle: string;
    type: 'text' | 'voice' | 'video';
    scheduledAt: Date;
    duration: number;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    meetingLink?: string;
}

export interface ResumeAnalysis {
    overallScore: number;
    atsScore: number;
    sections: {
        name: string;
        score: number;
        feedback: string;
        suggestions: string[];
    }[];
    keywords: {
        found: string[];
        missing: string[];
    };
    improvements: string[];
}

export interface InterviewResult {
    id: string;
    interviewId: string;
    overallScore: number;
    recommendation: 'hire' | 'hold' | 'reject';
    skills: {
        name: string;
        score: number;
        evidence: string;
    }[];
    feedback: string;
    strengths: string[];
    improvements: string[];
}

export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
}

// Question Management Types
export type QuestionType = 'coding' | 'mcq' | 'aptitude' | 'short-answer' | 'true-false';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface TestCase {
    id: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    explanation?: string;
}

export interface MCQOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface StarterCode {
    language: string;
    code: string;
}

export interface BaseQuestion {
    id: string;
    type: QuestionType;
    title: string;
    description: string;
    difficulty: DifficultyLevel;
    tags: string[];
    timeLimit: number; // in minutes
    points: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CodingQuestion extends BaseQuestion {
    type: 'coding';
    testCases: TestCase[];
    starterCode: StarterCode[];
    solutionCode: string;
    constraints: string[];
    examples: { input: string; output: string; explanation?: string }[];
}

export interface MCQQuestion extends BaseQuestion {
    type: 'mcq' | 'aptitude';
    options: MCQOption[];
    allowMultiple: boolean;
    explanation?: string;
}

export interface ShortAnswerQuestion extends BaseQuestion {
    type: 'short-answer';
    acceptedAnswers: string[];
    caseSensitive: boolean;
    keywords?: string[];
}

export interface TrueFalseQuestion extends BaseQuestion {
    type: 'true-false';
    correctAnswer: boolean;
    explanation?: string;
}

export type Question = CodingQuestion | MCQQuestion | ShortAnswerQuestion | TrueFalseQuestion;

export interface Assessment {
    id: string;
    title: string;
    description: string;
    questions: string[]; // Question IDs
    totalPoints: number;
    timeLimit: number; // in minutes
    createdBy: string;
    createdAt: Date;
    jobId?: string; // Linked job posting
}

export interface Submission {
    id: string;
    questionId: string;
    candidateId: string;
    answer: string;
    isCorrect?: boolean;
    score: number;
    submittedAt: Date;
    executionTime?: number; // For coding questions (ms)
    testCasesPassed?: number;
    testCasesTotal?: number;
}
