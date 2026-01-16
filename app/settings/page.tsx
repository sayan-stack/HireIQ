"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/dashboard/components/Sidebar";
import TopBar from "@/app/dashboard/components/TopBar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Bell, Shield, Eye, Moon, Globe, CreditCard,
  User, Briefcase, FileText, Video, BookOpen
} from "lucide-react";

// Candidate notification settings
type CandidateNotifications = {
  jobAlerts: boolean;
  applicationUpdates: boolean;
  interviewReminders: boolean;
  resumeTips: boolean;
  mockInterviewSuggestions: boolean;
  weeklyProgress: boolean;
};

// Recruiter notification settings
type RecruiterNotifications = {
  newCandidate: boolean;
  interviewReminders: boolean;
  candidateMessages: boolean;
  weeklyAnalytics: boolean;
  teamUpdates: boolean;
  hiringGoals: boolean;
};

export default function SettingsPage() {
  const router = useRouter();
  const [isCandidate, setIsCandidate] = useState(true);
  const [userName, setUserName] = useState('User');

  // Candidate settings
  const [candidateNotifications, setCandidateNotifications] = useState<CandidateNotifications>({
    jobAlerts: true,
    applicationUpdates: true,
    interviewReminders: true,
    resumeTips: false,
    mockInterviewSuggestions: true,
    weeklyProgress: false,
  });

  // Recruiter settings
  const [recruiterNotifications, setRecruiterNotifications] = useState<RecruiterNotifications>({
    newCandidate: true,
    interviewReminders: true,
    candidateMessages: false,
    weeklyAnalytics: false,
    teamUpdates: true,
    hiringGoals: false,
  });

  // Privacy settings (shared)
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showOnlineStatus: false,
    allowMessages: true,
  });

  // Appearance settings (shared)
  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: true,
    compactView: false,
  });

  /* ---------------- Load user data and settings ---------------- */
  useEffect(() => {
    const userData = localStorage.getItem('hireiq_user');
    if (userData) {
      const user = JSON.parse(userData);
      setIsCandidate(user.accountType === 'candidate');
      setUserName(user.profile?.firstName || user.name?.split(' ')[0] || 'User');
    }

    // Load saved settings
    const savedCandidateSettings = localStorage.getItem("hireiq_candidate_notifications");
    if (savedCandidateSettings) {
      setCandidateNotifications(JSON.parse(savedCandidateSettings));
    }

    const savedRecruiterSettings = localStorage.getItem("hireiq_recruiter_notifications");
    if (savedRecruiterSettings) {
      setRecruiterNotifications(JSON.parse(savedRecruiterSettings));
    }

    const savedPrivacy = localStorage.getItem("hireiq_privacy_settings");
    if (savedPrivacy) {
      setPrivacySettings(JSON.parse(savedPrivacy));
    }

    const savedAppearance = localStorage.getItem("hireiq_appearance_settings");
    if (savedAppearance) {
      setAppearanceSettings(JSON.parse(savedAppearance));
    }
  }, []);

  /* ---------------- Save settings to localStorage ---------------- */
  useEffect(() => {
    if (isCandidate) {
      localStorage.setItem("hireiq_candidate_notifications", JSON.stringify(candidateNotifications));
    }
  }, [candidateNotifications, isCandidate]);

  useEffect(() => {
    if (!isCandidate) {
      localStorage.setItem("hireiq_recruiter_notifications", JSON.stringify(recruiterNotifications));
    }
  }, [recruiterNotifications, isCandidate]);

  useEffect(() => {
    localStorage.setItem("hireiq_privacy_settings", JSON.stringify(privacySettings));
  }, [privacySettings]);

  useEffect(() => {
    localStorage.setItem("hireiq_appearance_settings", JSON.stringify(appearanceSettings));
  }, [appearanceSettings]);

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <TopBar />

        {/* Header */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            {isCandidate
              ? 'Manage your job search preferences and account settings.'
              : 'Manage your recruiting preferences and team settings.'}
          </p>
        </div>

        {/* Main Settings Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Notifications Section */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <Bell size={20} style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {isCandidate ? 'Job alerts & updates' : 'Candidate & team alerts'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {isCandidate ? (
                // Candidate Notification Settings
                <>
                  <ToggleRow
                    label="Job alerts matching my profile"
                    description="Get notified about new job opportunities"
                    checked={candidateNotifications.jobAlerts}
                    onChange={(v) => setCandidateNotifications({ ...candidateNotifications, jobAlerts: v })}
                  />
                  <ToggleRow
                    label="Application status updates"
                    description="Track your application progress"
                    checked={candidateNotifications.applicationUpdates}
                    onChange={(v) => setCandidateNotifications({ ...candidateNotifications, applicationUpdates: v })}
                  />
                  <ToggleRow
                    label="Interview reminders"
                    description="Get reminders before scheduled interviews"
                    checked={candidateNotifications.interviewReminders}
                    onChange={(v) => setCandidateNotifications({ ...candidateNotifications, interviewReminders: v })}
                  />
                  <ToggleRow
                    label="Resume improvement tips"
                    description="Suggestions to improve your resume"
                    checked={candidateNotifications.resumeTips}
                    onChange={(v) => setCandidateNotifications({ ...candidateNotifications, resumeTips: v })}
                  />
                  <ToggleRow
                    label="Mock interview suggestions"
                    description="Practice recommendations based on applications"
                    checked={candidateNotifications.mockInterviewSuggestions}
                    onChange={(v) => setCandidateNotifications({ ...candidateNotifications, mockInterviewSuggestions: v })}
                  />
                  <ToggleRow
                    label="Weekly progress summary"
                    description="Your job search progress report"
                    checked={candidateNotifications.weeklyProgress}
                    onChange={(v) => setCandidateNotifications({ ...candidateNotifications, weeklyProgress: v })}
                  />
                </>
              ) : (
                // Recruiter Notification Settings
                <>
                  <ToggleRow
                    label="New candidate applications"
                    description="Get notified when candidates apply"
                    checked={recruiterNotifications.newCandidate}
                    onChange={(v) => setRecruiterNotifications({ ...recruiterNotifications, newCandidate: v })}
                  />
                  <ToggleRow
                    label="Interview reminders"
                    description="Reminders for scheduled interviews"
                    checked={recruiterNotifications.interviewReminders}
                    onChange={(v) => setRecruiterNotifications({ ...recruiterNotifications, interviewReminders: v })}
                  />
                  <ToggleRow
                    label="Candidate messages"
                    description="New messages from candidates"
                    checked={recruiterNotifications.candidateMessages}
                    onChange={(v) => setRecruiterNotifications({ ...recruiterNotifications, candidateMessages: v })}
                  />
                  <ToggleRow
                    label="Weekly analytics summary"
                    description="Hiring metrics and performance"
                    checked={recruiterNotifications.weeklyAnalytics}
                    onChange={(v) => setRecruiterNotifications({ ...recruiterNotifications, weeklyAnalytics: v })}
                  />
                  <ToggleRow
                    label="Team activity updates"
                    description="Updates from your hiring team"
                    checked={recruiterNotifications.teamUpdates}
                    onChange={(v) => setRecruiterNotifications({ ...recruiterNotifications, teamUpdates: v })}
                  />
                  <ToggleRow
                    label="Hiring goal reminders"
                    description="Track progress towards hiring targets"
                    checked={recruiterNotifications.hiringGoals}
                    onChange={(v) => setRecruiterNotifications({ ...recruiterNotifications, hiringGoals: v })}
                  />
                </>
              )}
            </div>
          </div>

          {/* Privacy Section */}
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                <Shield size={20} style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Privacy</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Control your visibility
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleRow
                label={isCandidate ? "Profile visible to recruiters" : "Profile visible to candidates"}
                description={isCandidate ? "Let recruiters discover your profile" : "Show your profile on job postings"}
                checked={privacySettings.profileVisibility}
                onChange={(v) => setPrivacySettings({ ...privacySettings, profileVisibility: v })}
              />
              <ToggleRow
                label="Show online status"
                description="Let others see when you're online"
                checked={privacySettings.showOnlineStatus}
                onChange={(v) => setPrivacySettings({ ...privacySettings, showOnlineStatus: v })}
              />
              <ToggleRow
                label="Allow direct messages"
                description={isCandidate ? "Receive messages from recruiters" : "Receive messages from candidates"}
                checked={privacySettings.allowMessages}
                onChange={(v) => setPrivacySettings({ ...privacySettings, allowMessages: v })}
              />
            </div>

            {/* Appearance Section */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                  <Moon size={20} style={{ color: '#f59e0b' }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Customize your experience
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <ToggleRow
                  label="Dark mode"
                  description="Use dark theme"
                  checked={appearanceSettings.darkMode}
                  onChange={(v) => setAppearanceSettings({ ...appearanceSettings, darkMode: v })}
                />
                <ToggleRow
                  label="Compact view"
                  description="Show more content with less spacing"
                  checked={appearanceSettings.compactView}
                  onChange={(v) => setAppearanceSettings({ ...appearanceSettings, compactView: v })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific Quick Actions */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {isCandidate ? 'Job Search Settings' : 'Hiring Preferences'}
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {isCandidate ? (
              // Candidate Quick Links
              <>
                <button
                  className="p-4 rounded-lg flex items-center gap-3 hover:bg-[var(--bg-tertiary)] transition text-left"
                  onClick={() => router.push('/dashboard/profile')}
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
                    <FileText size={20} style={{ color: '#14b8a6' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Manage Resume</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Update your resume & skills</p>
                  </div>
                </button>
                <button
                  className="p-4 rounded-lg flex items-center gap-3 hover:bg-[var(--bg-tertiary)] transition text-left"
                  onClick={() => router.push('/mock-interview')}
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                    <Video size={20} style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Interview Prep</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Practice mock interviews</p>
                  </div>
                </button>
                <button
                  className="p-4 rounded-lg flex items-center gap-3 hover:bg-[var(--bg-tertiary)] transition text-left"
                  onClick={() => router.push('/dashboard/skills')}
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                    <BookOpen size={20} style={{ color: '#8b5cf6' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Skills & Learning</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Develop new skills</p>
                  </div>
                </button>
              </>
            ) : (
              // Recruiter Quick Links
              <>
                <button
                  className="p-4 rounded-lg flex items-center gap-3 hover:bg-[var(--bg-tertiary)] transition text-left"
                  onClick={() => router.push('/jobs')}
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
                    <Briefcase size={20} style={{ color: '#14b8a6' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Manage Jobs</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>View and edit job postings</p>
                  </div>
                </button>
                <button
                  className="p-4 rounded-lg flex items-center gap-3 hover:bg-[var(--bg-tertiary)] transition text-left"
                  onClick={() => router.push('/candidates')}
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                    <User size={20} style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Candidate Pipeline</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Review applicants</p>
                  </div>
                </button>
                <button
                  className="p-4 rounded-lg flex items-center gap-3 hover:bg-[var(--bg-tertiary)] transition text-left"
                  onClick={() => router.push('/analytics')}
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                    <Globe size={20} style={{ color: '#8b5cf6' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Hiring Analytics</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>View hiring metrics</p>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Billing */}
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
              <CreditCard size={20} style={{ color: '#10b981' }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Billing & Plan</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Manage subscription and invoices
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Current Plan</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {isCandidate ? 'Free Plan – Basic features' : 'Pro Plan – ₹999 / month'}
              </p>
            </div>

            <Button
              className="text-white"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #3b82f6)' }}
              onClick={() => router.push('/dashboard/billing')}
            >
              {isCandidate ? 'Upgrade to Premium' : 'Manage Plan'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- Toggle Row Component ---------------- */

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
        {description && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{description}</p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
}

