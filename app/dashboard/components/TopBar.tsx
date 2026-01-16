"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

interface UserData {
  name?: string;
  accountType?: 'candidate' | 'recruiter';
  profile?: {
    firstName?: string;
  };
}

export default function TopBar() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('hireiq_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isCandidate = user?.accountType === 'candidate';
  const firstName = user?.profile?.firstName || user?.name?.split(' ')[0] || 'there';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{getGreeting()}, {firstName}</h2>
        <p className="text-sm text-[var(--text-tertiary)]">
          {isCandidate
            ? "Track your applications and prepare for interviews"
            : "Here's what's happening with your pipeline today"
          }
        </p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={() => router.push('/dashboard/notifications')}
          className="relative p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition"
          title="Notifications"
        >
          <Bell className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* CREATE NEW JOB - Only for Recruiters */}
        {!isCandidate && (
          <button
            onClick={() => router.push("/jobs/new")}
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 rounded-lg text-white font-medium cursor-pointer hover:from-cyan-600 hover:to-indigo-600 transition shadow-lg"
          >
            + Create New Job
          </button>
        )}
      </div>
    </div>
  );
}
