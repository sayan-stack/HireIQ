"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  BarChart,
  Settings,
  LogOut,
  Sparkles,
  Home,
  FileText,
  Video,
  BookOpen,
  ClipboardList,
  PlusCircle,
  Bell,
  Code,
  Database,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";

interface UserData {
  name?: string;
  email?: string;
  accountType?: 'candidate' | 'recruiter';
  profile?: {
    firstName?: string;
    lastName?: string;
  };
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useFirebaseAuth();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('hireiq_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isCandidate = user?.accountType === 'candidate';
  const userName = user?.profile?.firstName
    ? `${user.profile.firstName} ${user.profile.lastName || ''}`
    : user?.name || 'Guest User';

  // Define menu based on user role
  const recruiterMenu = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Create Job", icon: PlusCircle, href: "/jobs/new" },
    { label: "Jobs", icon: Briefcase, href: "/jobs" },
    { label: "Candidates", icon: Users, href: "/candidates" },
    { label: "Question Bank", icon: Database, href: "/dashboard/question-bank" },
    { label: "Messages", icon: MessageSquare, href: "/messages" },
    { label: "Analytics", icon: BarChart, href: "/analytics" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  const candidateMenu = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", exact: true },
    { label: "My Resume", icon: FileText, href: "/dashboard/profile" },
    { label: "Job Applications", icon: Briefcase, href: "/dashboard/applications" },
    { label: "Interviews", icon: Video, href: "/mock-interview" },
    { label: "Coding Workspace", icon: Code, href: "/dashboard/coding" },
    { label: "Practice Zone", icon: BookOpen, href: "/dashboard/practice" },
    { label: "Reports & Feedback", icon: ClipboardList, href: "/dashboard/feedback" },
    { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  const menu = isCandidate ? candidateMenu : recruiterMenu;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('hireiq_user');
    router.push("/");
  };

  return (
    <aside className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] px-5 py-6 flex flex-col h-screen transition-colors duration-300">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg">
          <Sparkles size={20} className="text-white" />
        </div>
        <span className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-cyan-500 transition-colors">
          HireIQ
        </span>
      </Link>

      {/* Home Link */}
      <Link
        href="/"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] mb-2 transition"
      >
        <Home size={18} />
        <span>Home</span>
      </Link>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {menu.map((item) => {
          const isActive = (item as any).exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <div
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`
                flex items-center gap-3
                px-4 py-3 rounded-lg
                cursor-pointer transition
                ${isActive
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg"
                  : "text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="pt-4 border-t border-[var(--border-subtle)]">
        <div
          onClick={() => router.push('/dashboard/account')}
          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] cursor-pointer mb-2"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-[var(--text-primary)] font-medium">{userName}</p>
              <p className="text-xs text-[var(--text-tertiary)]">
                {isCandidate ? 'Candidate' : 'Recruiter'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-[var(--text-tertiary)] hover:bg-red-500/10 hover:text-red-500 transition"
        >
          <LogOut size={16} />
          <span className="text-sm">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
