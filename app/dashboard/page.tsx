'use client';

// Force dynamic rendering to prevent SSR issues with recharts
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import {
  Upload, AlertTriangle, ChevronRight, Clock, Video,
  Lock, Star, CheckCircle, Users, Briefcase, TrendingUp,
  Calendar, Eye, MessageSquare, PlusCircle, BarChart3
} from 'lucide-react';

interface JobApplication {
  id: string;
  position: string;
  company: string;
  status: 'shortlisted' | 'applied' | 'interview' | 'rejected';
  atsScore: number;
  cutoff: string;
  lastUpdated: string;
}

interface UpcomingInterview {
  id: string;
  company: string;
  position: string;
  focus: string;
  type: 'technical' | 'hr';
  expiresIn?: string;
  date?: string;
  mode: 'video' | 'voice';
}

interface JobPosting {
  id: string;
  title: string;
  applicants: number;
  newApplicants: number;
  status: 'active' | 'paused' | 'closed';
  postedDate: string;
}

interface CandidatePipeline {
  stage: string;
  count: number;
  color: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Alex');
  const [upcomingInterviews, setUpcomingInterviews] = useState(2);
  const [isCandidate, setIsCandidate] = useState(true);

  const [stats] = useState({
    profileCompletion: 85,
    interviewReadiness: 72,
    atsScore: 88,
    jobMatch: 92,
    targetRole: 'Senior Product Designer'
  });

  const [mismatch] = useState({
    resumeClaim: '"Expert proficiency in React & State Management"',
    interviewEvidence: 'Answered basic Redux questions with low confidence and partial accuracy.'
  });

  const [applications] = useState<JobApplication[]>([
    { id: '1', position: 'Senior Product Designer', company: 'TechFlow Inc.', status: 'shortlisted', atsScore: 92, cutoff: 'Premium', lastUpdated: 'Today, 9:41 AM' },
    { id: '2', position: 'UX Researcher', company: 'Global Systems', status: 'applied', atsScore: 78, cutoff: 'Premium', lastUpdated: 'Yesterday' }
  ]);

  const [interviews] = useState<UpcomingInterview[]>([
    { id: '1', company: 'TechFlow', position: 'Senior Designer', focus: 'Design Systems & Figma', type: 'technical', expiresIn: '2h', mode: 'video' },
    { id: '2', company: 'Global Sys', position: 'Culture Fit', focus: 'Leadership & Values', type: 'hr', date: 'Oct 28, 2:00 PM', mode: 'voice' }
  ]);

  // Recruiter-specific data
  const [recruiterStats] = useState({
    activeJobs: 12,
    totalApplicants: 248,
    interviewsScheduled: 18,
    hiredThisMonth: 5
  });

  const [jobPostings] = useState<JobPosting[]>([
    { id: '1', title: 'Senior Product Designer', applicants: 45, newApplicants: 8, status: 'active', postedDate: '3 days ago' },
    { id: '2', title: 'Frontend Developer', applicants: 67, newApplicants: 12, status: 'active', postedDate: '1 week ago' },
    { id: '3', title: 'UX Researcher', applicants: 28, newApplicants: 3, status: 'active', postedDate: '2 weeks ago' }
  ]);

  const [pipeline] = useState<CandidatePipeline[]>([
    { stage: 'Applied', count: 156, color: '#9ca3af' },
    { stage: 'Screening', count: 48, color: '#3b82f6' },
    { stage: 'Interview', count: 24, color: '#8b5cf6' },
    { stage: 'Offer', count: 12, color: '#f59e0b' },
    { stage: 'Hired', count: 8, color: '#10b981' }
  ]);

  const [scheduledInterviews] = useState([
    { id: '1', candidate: 'Sarah Johnson', position: 'Senior Designer', time: 'Today, 2:00 PM', type: 'Technical' },
    { id: '2', candidate: 'Michael Chen', position: 'Frontend Developer', time: 'Today, 4:30 PM', type: 'HR Round' },
    { id: '3', candidate: 'Emily Davis', position: 'UX Researcher', time: 'Tomorrow, 10:00 AM', type: 'Final' }
  ]);

  const missingSkills = ['GraphQL', 'Next.js', 'AWS'];

  useEffect(() => {
    const userData = localStorage.getItem('hireiq_user');
    if (userData) {
      const user = JSON.parse(userData);
      const name = user.profile?.firstName || user.name?.split(' ')[0] || 'Alex';
      setUserName(name);
      setIsCandidate(user.accountType === 'candidate');
    }
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'shortlisted': return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', text: 'Shortlisted' };
      case 'applied': return { bg: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', text: 'Applied' };
      case 'interview': return { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', text: 'Interview' };
      case 'rejected': return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', text: 'Rejected' };
      case 'active': return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', text: 'Active' };
      case 'paused': return { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', text: 'Paused' };
      case 'closed': return { bg: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', text: 'Closed' };
      default: return { bg: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', text: status };
    }
  };

  // Candidate Dashboard
  const CandidateDashboard = () => (
    <>
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {userName}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            You have <span className="font-semibold" style={{ color: '#3b82f6' }}>{upcomingInterviews} upcoming interviews</span> this week. Keep up the momentum.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-3 rounded-lg text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
          onClick={() => router.push('/dashboard/profile')}
        >
          <Upload size={18} /> Upload / Update Resume
        </button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center gap-4 rounded-xl p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="#14b8a6" strokeWidth="6"
                strokeDasharray={`${(stats.profileCompletion / 100) * 176} 176`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats.profileCompletion}%
            </span>
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Profile Completion</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Complete your bio to reach 100%</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="#8b5cf6" strokeWidth="6"
                strokeDasharray={`${(stats.interviewReadiness / 100) * 176} 176`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats.interviewReadiness}%
            </span>
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Interview Readiness</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Based on mock performance</p>
          </div>
        </div>
      </div>

      {/* Resume & ATS Overview */}
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Resume & ATS Overview</h3>
                <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>Optimized</span>
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Target Role: {stats.targetRole}</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>ATS Score</p>
              <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {stats.atsScore}<span className="text-lg" style={{ color: 'var(--text-muted)' }}>/100</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Job Match</p>
              <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.jobMatch}%</p>
            </div>
            <div>
              <p className="text-xs uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Missing Skills</p>
              <div className="flex gap-2">
                {missingSkills.map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-1 rounded text-xs cursor-pointer hover:opacity-80 transition"
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                    onClick={() => router.push('/dashboard/skills')}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
              onClick={() => router.push('/dashboard/feedback')}
            >
              View Feedback
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
              onClick={() => router.push('/dashboard/profile')}
            >
              Upload New Version
            </button>
          </div>
        </div>
      </div>

      {/* Mismatch Alert */}
      <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle size={24} style={{ color: '#f59e0b' }} />
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Resume ↔ Interview Consistency Mismatch</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                We found discrepancies between your resume claims and your interview answers.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <p className="text-xs uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Resume Claim</p>
                  <p style={{ color: 'var(--text-primary)' }}>{mismatch.resumeClaim}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Interview Evidence</p>
                    <span className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: '#ef4444', color: 'white' }}>MISMATCH</span>
                  </div>
                  <p style={{ color: 'var(--text-primary)' }}>{mismatch.interviewEvidence}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: '#10b981' }}
              onClick={() => router.push('/dashboard/feedback')}
            >
              View Detailed Insight
            </button>
            <button className="text-sm" style={{ color: 'var(--text-muted)' }}>Dismiss</button>
          </div>
        </div>
      </div>

      {/* Job Tracker & Interviews */}
      <div className="grid grid-cols-3 gap-6">
        {/* Job Applications Tracker */}
        <div className="col-span-2 rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Job Applications Tracker</h3>
            <button
              className="flex items-center gap-1 text-sm"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => router.push('/dashboard/applications')}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>
                <th className="text-left pb-3">Job Title & Company</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">ATS Score</th>
                <th className="text-left pb-3">Recruiter Cut-off</th>
                <th className="text-left pb-3">Last Updated</th>
                <th className="text-left pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => {
                const statusStyle = getStatusStyle(app.status);
                return (
                  <tr key={app.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <td className="py-4">
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{app.position}</p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{app.company}</p>
                    </td>
                    <td>
                      <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                        {statusStyle.text}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-primary)' }}>{app.atsScore}</td>
                    <td>
                      <span className="flex items-center gap-1" style={{ color: '#f59e0b' }}>
                        <Lock size={12} /> {app.cutoff}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{app.lastUpdated}</td>
                    <td>
                      <button
                        className="text-sm"
                        style={{ color: '#3b82f6' }}
                        onClick={() => router.push('/dashboard/applications')}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Upcoming Interviews */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Upcoming Interviews</h3>
          <div className="space-y-4">
            {interviews.map(interview => (
              <div key={interview.id} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs uppercase"
                    style={{
                      backgroundColor: interview.type === 'technical' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                      color: interview.type === 'technical' ? '#3b82f6' : '#8b5cf6'
                    }}
                  >
                    {interview.type === 'technical' ? 'Technical' : 'HR Round'}
                  </span>
                  <div className="flex items-center gap-1 text-xs" style={{ color: interview.expiresIn ? '#ef4444' : 'var(--text-muted)' }}>
                    {interview.expiresIn ? (
                      <>Expires in {interview.expiresIn}</>
                    ) : (
                      interview.date
                    )}
                  </div>
                </div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {interview.position} @ {interview.company}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Focus: {interview.focus}</p>
                <button
                  className="w-full mt-3 py-2 rounded-lg flex items-center justify-center gap-2 text-white"
                  style={{ backgroundColor: '#10b981' }}
                  onClick={() => router.push(`/dashboard/interview-session?type=${interview.type}`)}
                >
                  Start Interview
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Card */}
      <div className="rounded-xl p-6 flex items-center justify-between" style={{
        background: 'linear-gradient(135deg, #f59e0b, #f97316)',
        color: 'white'
      }}>
        <div className="flex items-center gap-4">
          <Star size={32} fill="white" />
          <div>
            <h3 className="font-bold text-lg">PREMIUM</h3>
            <p className="text-sm opacity-90">Unlock recruiter cut-off scores & advanced analytics.</p>
          </div>
        </div>
        <button
          className="px-6 py-3 rounded-lg font-semibold"
          style={{ backgroundColor: 'white', color: '#f97316' }}
          onClick={() => router.push('/premium')}
        >
          Upgrade Now
        </button>
      </div>
    </>
  );

  // Recruiter Dashboard
  const RecruiterDashboard = () => (
    <>
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {userName}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            You have <span className="font-semibold" style={{ color: '#3b82f6' }}>{recruiterStats.interviewsScheduled} interviews</span> scheduled this week.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-3 rounded-lg text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
          onClick={() => router.push('/jobs/new')}
        >
          <PlusCircle size={18} /> Create New Job
        </button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <Briefcase size={24} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Active Jobs</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{recruiterStats.activeJobs}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
              <Users size={24} style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Applicants</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{recruiterStats.totalApplicants}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
              <Calendar size={24} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Interviews</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{recruiterStats.interviewsScheduled}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
              <TrendingUp size={24} style={{ color: '#10b981' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Hired This Month</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{recruiterStats.hiredThisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hiring Pipeline */}
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Hiring Pipeline</h3>
          <button
            className="flex items-center gap-1 text-sm"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => router.push('/candidates')}
          >
            View All Candidates <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex items-end justify-between gap-4">
          {pipeline.map((stage, index) => (
            <div key={stage.stage} className="flex-1 text-center">
              <div
                className="mx-auto mb-3 rounded-lg flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: stage.color + '20',
                  width: '100%',
                  height: `${Math.max(60, stage.count * 1.5)}px`,
                  maxHeight: '200px'
                }}
                onClick={() => router.push('/candidates')}
              >
                <span className="text-2xl font-bold" style={{ color: stage.color }}>{stage.count}</span>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stage.stage}</p>
              {index < pipeline.length - 1 && (
                <ChevronRight
                  size={16}
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Job Postings & Scheduled Interviews */}
      <div className="grid grid-cols-3 gap-6">
        {/* Active Job Postings */}
        <div className="col-span-2 rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Active Job Postings</h3>
            <button
              className="flex items-center gap-1 text-sm"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => router.push('/jobs')}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>
                <th className="text-left pb-3">Position</th>
                <th className="text-left pb-3">Applicants</th>
                <th className="text-left pb-3">New</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">Posted</th>
                <th className="text-left pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {jobPostings.map(job => {
                const statusStyle = getStatusStyle(job.status);
                return (
                  <tr key={job.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <td className="py-4">
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{job.title}</p>
                    </td>
                    <td style={{ color: 'var(--text-primary)' }}>{job.applicants}</td>
                    <td>
                      {job.newApplicants > 0 && (
                        <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                          +{job.newApplicants} new
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                        {statusStyle.text}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{job.postedDate}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition"
                          onClick={() => router.push(`/candidates?job=${job.id}`)}
                        >
                          <Eye size={16} style={{ color: 'var(--text-secondary)' }} />
                        </button>
                        <button
                          className="text-sm"
                          style={{ color: '#3b82f6' }}
                          onClick={() => router.push(`/jobs/${job.id}`)}
                        >
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Scheduled Interviews */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Scheduled Interviews</h3>
          <div className="space-y-4">
            {scheduledInterviews.map(interview => (
              <div key={interview.id} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs uppercase"
                    style={{
                      backgroundColor: interview.type === 'Technical' ? 'rgba(59, 130, 246, 0.2)' :
                        interview.type === 'Final' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                      color: interview.type === 'Technical' ? '#3b82f6' :
                        interview.type === 'Final' ? '#10b981' : '#8b5cf6'
                    }}
                  >
                    {interview.type}
                  </span>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    {interview.time}
                  </div>
                </div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{interview.candidate}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{interview.position}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-white text-sm"
                    style={{ backgroundColor: '#10b981' }}
                  >
                    <Video size={14} /> Join
                  </button>
                  <button
                    className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <MessageSquare size={14} /> Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            className="p-4 rounded-lg flex flex-col items-center gap-2 hover:bg-[var(--bg-tertiary)] transition"
            onClick={() => router.push('/candidates')}
          >
            <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
              <Users size={24} style={{ color: '#8b5cf6' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Review Candidates</span>
          </button>
          <button
            className="p-4 rounded-lg flex flex-col items-center gap-2 hover:bg-[var(--bg-tertiary)] transition"
            onClick={() => router.push('/messages')}
          >
            <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
              <MessageSquare size={24} style={{ color: '#10b981' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Messages</span>
          </button>
          <button
            className="p-4 rounded-lg flex flex-col items-center gap-2 hover:bg-[var(--bg-tertiary)] transition"
            onClick={() => router.push('/analytics')}
          >
            <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
              <BarChart3 size={24} style={{ color: '#f59e0b' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>View Analytics</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <TopBar />

        {isCandidate ? <CandidateDashboard /> : <RecruiterDashboard />}
      </main>
    </div>
  );
}
