"use client";

// Force dynamic rendering to prevent SSR issues with recharts
export const dynamic = 'force-dynamic';

import Sidebar from "@/app/dashboard/components/Sidebar";
import TopBar from "@/app/dashboard/components/TopBar";
import ChartCard from "@/app/dashboard/components/analytics/ChartCard";
import StatCard from "@/app/dashboard/components/analytics/Statcard";


export default function AnalyticsPage() {
  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <TopBar />

        {/* Header */}
        <div className="rounded-xl p-6" style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)'
        }}>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Performance Overview
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Track your job postings, candidate applications, and hiring metrics
            in real-time.
          </p>
        </div>

        {/* Chart */}
        <ChartCard />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Conversion Rate"
            value="12.5%"
            subtitle="Views → Applications"
            change="+2.4%"
            color="text-green-400"
          />
          <StatCard
            title="Application Success"
            value="45%"
            subtitle="Shortlisted"
            change="+5.1%"
            color="text-green-400"
          />
          <StatCard
            title="Interview Completion"
            value="88%"
            subtitle="Completed"
            change="+3.2%"
            color="text-green-400"
          />
          <StatCard
            title="Drop-off Rate"
            value="15%"
            subtitle="Candidates dropped"
            change="-1.2%"
            color="text-red-400"
          />
        </div>
      </main>
    </div>
  );
}
