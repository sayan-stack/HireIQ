'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/dashboard/components/Sidebar';
import TopBar from '@/app/dashboard/components/TopBar';
import {
    FileText, Download, Upload, Sparkles, CheckCircle, AlertTriangle,
    Info, ChevronDown, Code, FileCheck, X, Eye, Loader2, FileBarChart,
    User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award
} from 'lucide-react';
import { analyzeResume, ResumeDetails, ATSScore } from '@/lib/resumeAnalyzer';
import { downloadReport } from '@/lib/reportGenerator';

interface ResumeVersion {
    id: string;
    name: string;
    date: string;
    score: number;
    status: 'active' | 'archived';
    fileData?: string;
}

interface Skill {
    name: string;
    status: 'detected' | 'missing';
}

interface ConsistencyCheck {
    id: string;
    title: string;
    description: string;
    status: 'match' | 'mismatch';
    link?: string;
}

export default function MyResumePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userName, setUserName] = useState('Alex Dev');
    const [userTitle, setUserTitle] = useState('Software Engineer');
    const [selectedJob, setSelectedJob] = useState('Senior Frontend Dev @ Google');
    const [skillFilter, setSkillFilter] = useState<'all' | 'missing' | 'detected'>('all');
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [showJobDropdown, setShowJobDropdown] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);

    // Real-time analysis results
    const [resumeDetails, setResumeDetails] = useState<ResumeDetails | null>(null);
    const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
    const [currentFile, setCurrentFile] = useState<File | null>(null);

    const [resumeData, setResumeData] = useState({
        fileName: 'Upload a resume to analyze',
        uploadDate: '-',
        fileSize: '-',
        atsScore: 0,
        profileCompleteness: 0,
        matchRate: 0,
        keywords: { score: 0, max: 100 },
        formatting: { score: 0, max: 100 },
        fileData: null as string | null
    });

    const [skills, setSkills] = useState<Skill[]>([]);

    const [consistencyChecks] = useState<ConsistencyCheck[]>([
        {
            id: '1',
            title: 'React Hooks Proficiency',
            description: 'Resume lists "Advanced React Hooks". Interview transcript confirms strong understanding of useEffect and custom hooks.',
            status: 'match'
        },
        {
            id: '2',
            title: 'AWS Deployment Experience',
            description: 'Resume claims "Expert in AWS". Interview evidence shows hesitation when explaining S3 bucket policies.',
            status: 'mismatch',
            link: 'Review Transcript'
        }
    ]);

    const [versions, setVersions] = useState<ResumeVersion[]>([]);

    const jobOptions = [
        'Senior Frontend Dev @ Google',
        'Full Stack Engineer @ Meta',
        'React Developer @ Netflix',
        'Software Engineer @ Amazon'
    ];

    useEffect(() => {
        const userData = localStorage.getItem('hireiq_user');
        if (userData) {
            const user = JSON.parse(userData);
            const name = user.profile?.firstName
                ? `${user.profile.firstName} ${user.profile.lastName || ''}`
                : user.name || 'Alex Dev';
            setUserName(name);
            setUserTitle(user.profile?.headline || 'Software Engineer');
        }

        // Load saved resume data
        const savedResume = localStorage.getItem('hireiq_resume');
        if (savedResume) {
            const parsed = JSON.parse(savedResume);
            setResumeData(prev => ({ ...prev, ...parsed }));
        }

        const savedVersions = localStorage.getItem('hireiq_resume_versions');
        if (savedVersions) {
            setVersions(JSON.parse(savedVersions));
        }

        // Load saved analysis
        const savedAnalysis = localStorage.getItem('hireiq_resume_analysis');
        if (savedAnalysis) {
            const analysis = JSON.parse(savedAnalysis);
            setResumeDetails(analysis.details);
            setAtsScore(analysis.score);

            // Populate skills from analysis
            if (analysis.details?.skills) {
                const allSkills: Skill[] = analysis.details.skills.flatMap((cat: { skills: string[] }) =>
                    cat.skills.map((s: string) => ({ name: s, status: 'detected' as const }))
                );
                setSkills(allSkills);
            }
        }
    }, []);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        setIsUploading(true);
        setIsAnalyzing(true);
        setAnalysisProgress(0);
        setCurrentFile(file);

        try {
            // Simulate progress updates
            const progressInterval = setInterval(() => {
                setAnalysisProgress(prev => Math.min(prev + 15, 90));
            }, 200);

            // Perform real analysis
            const { details, score } = await analyzeResume(file);

            clearInterval(progressInterval);
            setAnalysisProgress(100);

            // Store analysis results
            setResumeDetails(details);
            setAtsScore(score);

            // Update skills from analysis
            const allSkills: Skill[] = details.skills.flatMap(cat =>
                cat.skills.map(s => ({ name: s, status: 'detected' as const }))
            );
            setSkills(allSkills);

            // Read file as base64 for storing
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target?.result as string;

                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                // Update current resume with real analysis data
                const newResumeData = {
                    fileName: file.name,
                    uploadDate: dateStr + ', ' + now.getFullYear(),
                    fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                    atsScore: score.overall,
                    profileCompleteness: score.completenessScore,
                    matchRate: Math.round((score.keywordsScore + score.experienceScore) / 2),
                    keywords: { score: score.keywordsScore, max: 100 },
                    formatting: { score: score.formattingScore, max: 100 },
                    fileData: base64Data
                };

                setResumeData(newResumeData);

                // Archive old active version and add new one
                const updatedVersions = versions.map(v =>
                    v.status === 'active' ? { ...v, status: 'archived' as const } : v
                );

                const newVersion: ResumeVersion = {
                    id: Date.now().toString(),
                    name: file.name,
                    date: dateStr,
                    score: score.overall,
                    status: 'active',
                    fileData: base64Data
                };

                const finalVersions = [newVersion, ...updatedVersions];
                setVersions(finalVersions);

                // Save to localStorage
                localStorage.setItem('hireiq_resume', JSON.stringify(newResumeData));
                localStorage.setItem('hireiq_resume_versions', JSON.stringify(finalVersions));
                localStorage.setItem('hireiq_resume_analysis', JSON.stringify({ details, score }));

                setIsUploading(false);
                setIsAnalyzing(false);
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 3000);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error analyzing resume:', error);
            setIsUploading(false);
            setIsAnalyzing(false);
            alert('Error analyzing resume. Please try again.');
        }
    };

    const handleDownload = () => {
        const activeVersion = versions.find(v => v.status === 'active');

        if (resumeData.fileData || activeVersion?.fileData) {
            const data = resumeData.fileData || activeVersion?.fileData;
            const link = document.createElement('a');
            link.href = data as string;
            link.download = resumeData.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('No resume file available. Please upload a resume first.');
        }
    };

    const handleDownloadReport = () => {
        if (resumeDetails && atsScore) {
            downloadReport(resumeDetails, atsScore, resumeData.fileName);
        } else {
            alert('Please upload and analyze a resume first.');
        }
    };

    const handleVersionClick = (version: ResumeVersion) => {
        if (version.status === 'active') return;

        // Set clicked version as active
        const updatedVersions = versions.map(v => ({
            ...v,
            status: v.id === version.id ? 'active' as const : 'archived' as const
        }));
        setVersions(updatedVersions);

        // Update resume data
        setResumeData(prev => ({
            ...prev,
            fileName: version.name,
            atsScore: version.score,
            fileData: version.fileData || null
        }));

        localStorage.setItem('hireiq_resume_versions', JSON.stringify(updatedVersions));
    };

    const filteredSkills = skills.filter(skill => {
        if (skillFilter === 'all') return true;
        return skill.status === skillFilter;
    });

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
            <Sidebar />

            <main className="flex-1 p-8 space-y-6 overflow-y-auto">
                <TopBar />

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf"
                    className="hidden"
                />

                {/* Success Toast */}
                {uploadSuccess && (
                    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-white" style={{ backgroundColor: '#10b981' }}>
                        <CheckCircle size={20} />
                        Resume analyzed successfully!
                    </div>
                )}

                {/* Analyzing Progress Modal */}
                {isAnalyzing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--bg-secondary)', maxWidth: '400px' }}>
                            <Loader2 size={48} className="animate-spin mx-auto mb-4" style={{ color: '#14b8a6' }} />
                            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                Analyzing Resume...
                            </h3>
                            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                                Extracting skills, experience, and calculating ATS score
                            </p>
                            <div className="w-full h-2 rounded-full mb-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <div
                                    className="h-full rounded-full transition-all duration-200"
                                    style={{
                                        width: `${analysisProgress}%`,
                                        background: 'linear-gradient(90deg, #14b8a6, #3b82f6)'
                                    }}
                                />
                            </div>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{analysisProgress}% complete</p>
                        </div>
                    </div>
                )}

                {/* Resume Header Card */}
                <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ef4444' }}>
                                <FileText size={28} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    {resumeData.fileName}
                                </h2>
                                <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    <span>📅 {resumeData.uploadDate}</span>
                                    <span>💾 {resumeData.fileSize}</span>
                                    {resumeData.atsScore > 0 && (
                                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                                            Analyzed
                                        </span>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <div className="flex items-center gap-2 text-sm mb-1">
                                        <span style={{ color: 'var(--text-secondary)' }}>PROFILE COMPLETENESS</span>
                                        <span style={{ color: 'var(--text-primary)' }}>{resumeData.profileCompleteness}%</span>
                                    </div>
                                    <div className="w-80 h-2 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{ width: `${resumeData.profileCompleteness}%`, background: 'linear-gradient(90deg, #14b8a6, #3b82f6)' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <p className="text-xs uppercase" style={{ color: 'var(--text-secondary)' }}>ATS Score</p>
                                <div className="relative w-20 h-20 mt-2">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="40" cy="40" r="35" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6" />
                                        <circle
                                            cx="40" cy="40" r="35" fill="none"
                                            stroke={getScoreColor(resumeData.atsScore)}
                                            strokeWidth="6"
                                            strokeDasharray={`${(resumeData.atsScore / 100) * 220} 220`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{resumeData.atsScore}</span>
                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/100</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition hover:opacity-80"
                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                    onClick={handleDownload}
                                >
                                    <Download size={16} /> Download Resume
                                </button>
                                <button
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition hover:opacity-80"
                                    style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} /> Upload New
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Real-Time Extracted Information */}
                {resumeDetails && (
                    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <FileBarChart size={20} style={{ color: '#14b8a6' }} />
                                Extracted Resume Information
                                <span className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: '#10b981' }}>REAL-TIME</span>
                            </h3>
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition hover:opacity-80"
                                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                                onClick={handleDownloadReport}
                            >
                                <Download size={16} /> Download Full Report
                            </button>
                        </div>

                        {/* Personal Info Grid */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <User size={20} style={{ color: '#3b82f6' }} />
                                <div>
                                    <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Name</p>
                                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{resumeDetails.personalInfo.name}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <Mail size={20} style={{ color: '#10b981' }} />
                                <div>
                                    <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Email</p>
                                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{resumeDetails.personalInfo.email}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <Phone size={20} style={{ color: '#f59e0b' }} />
                                <div>
                                    <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Phone</p>
                                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{resumeDetails.personalInfo.phone}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <MapPin size={20} style={{ color: '#ef4444' }} />
                                <div>
                                    <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Location</p>
                                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{resumeDetails.personalInfo.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Experience & Education */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Experience */}
                            <div>
                                <h4 className="flex items-center gap-2 font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                                    <Briefcase size={18} style={{ color: '#8b5cf6' }} />
                                    Experience ({resumeDetails.experience.length} positions found)
                                </h4>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {resumeDetails.experience.length > 0 ? (
                                        resumeDetails.experience.map((exp, idx) => (
                                            <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', borderLeft: '3px solid #8b5cf6' }}>
                                                <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{exp.company}</p>
                                                <p className="text-xs" style={{ color: '#8b5cf6' }}>{exp.position}</p>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{exp.duration}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No experience entries detected</p>
                                    )}
                                </div>
                            </div>

                            {/* Education */}
                            <div>
                                <h4 className="flex items-center gap-2 font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                                    <GraduationCap size={18} style={{ color: '#14b8a6' }} />
                                    Education ({resumeDetails.education.length} entries found)
                                </h4>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {resumeDetails.education.length > 0 ? (
                                        resumeDetails.education.map((edu, idx) => (
                                            <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)', borderLeft: '3px solid #14b8a6' }}>
                                                <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{edu.institution}</p>
                                                <p className="text-xs" style={{ color: '#14b8a6' }}>{edu.degree}</p>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{edu.year}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No education entries detected</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Certifications */}
                        {resumeDetails.certifications.length > 0 && (
                            <div className="mt-4">
                                <h4 className="flex items-center gap-2 font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                                    <Award size={18} style={{ color: '#f59e0b' }} />
                                    Certifications
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {resumeDetails.certifications.map((cert, idx) => (
                                        <span key={idx} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                                            {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ATS Score Breakdown & Suggestions */}
                {atsScore && (
                    <div className="grid grid-cols-2 gap-6">
                        {/* Score Breakdown */}
                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>ATS Score Breakdown</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Keywords Match', score: atsScore.keywordsScore, color: '#10b981' },
                                    { label: 'Formatting', score: atsScore.formattingScore, color: '#3b82f6' },
                                    { label: 'Completeness', score: atsScore.completenessScore, color: '#8b5cf6' },
                                    { label: 'Experience', score: atsScore.experienceScore, color: '#f59e0b' },
                                    { label: 'Education', score: atsScore.educationScore, color: '#14b8a6' },
                                ].map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                                            <span style={{ color: 'var(--text-primary)' }}>{item.score}/100</span>
                                        </div>
                                        <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${item.score}%`, backgroundColor: item.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Improvement Suggestions */}
                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Improvement Suggestions</h3>
                            {atsScore.suggestions.length > 0 ? (
                                <div className="space-y-3">
                                    {atsScore.suggestions.map((suggestion, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                                            <span className="text-lg">💡</span>
                                            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                    <CheckCircle size={24} style={{ color: '#10b981' }} />
                                    <p style={{ color: 'var(--text-primary)' }}>Great job! Your resume looks well-optimized.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - ATS & Skills */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* ATS Score Analysis */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* ATS Score Analysis */}
                            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>ATS Score Analysis</h3>
                                    <Info size={16} style={{ color: 'var(--text-muted)' }} />
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="relative w-24 h-24">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="48" cy="48" r="42" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
                                            <circle
                                                cx="48" cy="48" r="42" fill="none"
                                                stroke="#3b82f6"
                                                strokeWidth="8"
                                                strokeDasharray={`${(resumeData.atsScore / 100) * 264} 264`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{resumeData.atsScore}</span>
                                            <span className="text-xs" style={{ color: getScoreColor(resumeData.atsScore) }}>
                                                {resumeData.atsScore >= 80 ? 'EXCELLENT' : resumeData.atsScore >= 60 ? 'GOOD' : 'NEEDS WORK'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span style={{ color: 'var(--text-secondary)' }}>Keywords</span>
                                                <span style={{ color: 'var(--text-primary)' }}>{resumeData.keywords.score}/100</span>
                                            </div>
                                            <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                                <div className="h-full rounded-full" style={{ width: `${resumeData.keywords.score}%`, backgroundColor: '#10b981' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span style={{ color: 'var(--text-secondary)' }}>Formatting</span>
                                                <span style={{ color: 'var(--text-primary)' }}>{resumeData.formatting.score}/100</span>
                                            </div>
                                            <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                                <div className="h-full rounded-full" style={{ width: `${resumeData.formatting.score}%`, backgroundColor: '#f59e0b' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Job Match */}
                            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Job Match</h3>
                                    <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                                        {resumeData.matchRate >= 80 ? 'High Match' : resumeData.matchRate >= 50 ? 'Medium' : 'Low'}
                                    </span>
                                </div>
                                <div className="relative mb-4">
                                    <button
                                        className="w-full flex items-center justify-between p-2 rounded-lg"
                                        style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                        onClick={() => setShowJobDropdown(!showJobDropdown)}
                                    >
                                        <span style={{ color: 'var(--text-primary)' }}>{selectedJob}</span>
                                        <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                                    </button>
                                    {showJobDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-10" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                                            {jobOptions.map(job => (
                                                <button
                                                    key={job}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-tertiary)] transition"
                                                    style={{ color: 'var(--text-primary)' }}
                                                    onClick={() => {
                                                        setSelectedJob(job);
                                                        setShowJobDropdown(false);
                                                    }}
                                                >
                                                    {job}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <span className="text-xs uppercase" style={{ color: 'var(--text-secondary)' }}>Match Rate</span>
                                    <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{resumeData.matchRate}%</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skills.slice(0, 3).map(skill => (
                                        <span
                                            key={skill.name}
                                            className="px-3 py-1 rounded-full text-xs cursor-pointer hover:opacity-80 transition"
                                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                            onClick={() => router.push('/dashboard/skills')}
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Skills Analysis */}
                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Skills Detected ({skills.length} total)
                                </h3>
                                <div className="flex gap-2">
                                    {(['all', 'detected'] as const).map(filter => (
                                        <button
                                            key={filter}
                                            onClick={() => setSkillFilter(filter)}
                                            className="px-3 py-1 rounded-lg text-xs capitalize transition"
                                            style={{
                                                backgroundColor: skillFilter === filter ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                                color: skillFilter === filter ? 'white' : 'var(--text-secondary)'
                                            }}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {filteredSkills.map(skill => (
                                        <span
                                            key={skill.name}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer hover:opacity-80 transition"
                                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                            onClick={() => router.push('/dashboard/skills')}
                                        >
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: skill.status === 'detected' ? '#10b981' : '#ef4444' }}
                                            />
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                    Upload a resume to see detected skills
                                </p>
                            )}
                        </div>

                        {/* Interview Consistency Check */}
                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Interview Consistency Check</h3>
                                <span className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: '#3b82f6' }}>BETA</span>
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Compared to "Frontend Interview #2"</span>
                            </div>
                            <div className="space-y-4">
                                {consistencyChecks.map(check => (
                                    <div key={check.id} className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                        {check.status === 'match' ? (
                                            <CheckCircle size={20} className="mt-0.5" style={{ color: '#10b981' }} />
                                        ) : (
                                            <AlertTriangle size={20} className="mt-0.5" style={{ color: '#f59e0b' }} />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>{check.title}</h4>
                                            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{check.description}</p>
                                        </div>
                                        {check.link && (
                                            <button
                                                className="text-sm hover:underline"
                                                style={{ color: '#3b82f6' }}
                                                onClick={() => router.push('/dashboard/feedback')}
                                            >
                                                {check.link}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Actions & History */}
                    <div className="space-y-6">
                        {/* Optimization Actions */}
                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Actions</h3>
                            <div className="space-y-3">
                                <button
                                    className="w-full flex items-center gap-3 p-4 rounded-lg text-left text-white transition hover:opacity-90"
                                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
                                    onClick={handleDownloadReport}
                                    disabled={!resumeDetails}
                                >
                                    <Download size={20} />
                                    <div>
                                        <p className="font-medium">Download Full Report</p>
                                        <p className="text-xs opacity-80">Get detailed analysis PDF</p>
                                    </div>
                                </button>
                                <button
                                    className="w-full flex items-center gap-3 p-4 rounded-lg text-left transition hover:opacity-80"
                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                    onClick={() => alert('AI is optimizing your resume for the selected job...\n\nThis feature would auto-tailor keywords & summary in a real implementation.')}
                                >
                                    <Sparkles size={20} />
                                    <div>
                                        <p className="font-medium">Improve for this Job</p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Auto-tailor keywords & summary</p>
                                    </div>
                                </button>
                                <button
                                    className="w-full flex items-center gap-3 p-4 rounded-lg text-left transition hover:opacity-80"
                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                                    onClick={() => router.push('/dashboard/interview-session?type=technical')}
                                >
                                    <Code size={20} />
                                    <div>
                                        <p className="font-medium">Practice Interview</p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Based on resume gaps</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Version History */}
                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Version History</h3>
                                <button className="text-sm hover:underline" style={{ color: '#3b82f6' }}>View All</button>
                            </div>
                            {versions.length > 0 ? (
                                <div className="space-y-3">
                                    {versions.slice(0, 4).map(version => (
                                        <div
                                            key={version.id}
                                            className="p-3 rounded-lg cursor-pointer transition hover:opacity-80"
                                            style={{
                                                backgroundColor: 'var(--bg-tertiary)',
                                                border: version.status === 'active' ? '1px solid #3b82f6' : '1px solid transparent'
                                            }}
                                            onClick={() => handleVersionClick(version)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{version.name}</p>
                                                {version.status === 'active' && (
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{version.date} • Score: {version.score}</span>
                                                <span
                                                    className="px-2 py-0.5 rounded text-xs capitalize"
                                                    style={{
                                                        backgroundColor: version.status === 'active' ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-primary)',
                                                        color: version.status === 'active' ? '#3b82f6' : 'var(--text-muted)'
                                                    }}
                                                >
                                                    {version.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                    No resume versions yet. Upload a resume to get started.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
