"use client";

import { useRouter } from "next/navigation";
import { useJobs } from "./new/context/JobContext";
import Sidebar from "@/app/dashboard/components/Sidebar";
import TopBar from "@/app/dashboard/components/TopBar";

export default function JobsPage() {
  const { jobs } = useJobs();
  const router = useRouter();

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <TopBar />

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Active Job Posts</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Manage and view all your published jobs
            </p>
          </div>

          <button
            onClick={() => router.push("/jobs/new")}
            className="px-5 py-2 rounded-lg cursor-pointer transition-colors"
            style={{ background: 'var(--accent-primary)', color: 'white' }}
          >
            + Create Job
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl p-6" style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Table Head */}
          <div className="grid grid-cols-5 text-xs pb-3" style={{
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <span>JOB TITLE</span>
            <span>DEPARTMENT</span>
            <span>TYPE</span>
            <span>STATUS</span>
            <span className="text-right">ACTIONS</span>
          </div>

          {/* Empty State */}
          {jobs.length === 0 && (
            <p className="text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
              No active jobs yet. Create your first job.
            </p>
          )}

          {/* Rows */}
          {jobs.map((job, index) => (
            <div
              key={index}
              onClick={() => router.push("/jobs/new/preview")}
              className="grid grid-cols-5 items-center py-4 text-sm cursor-pointer hover:opacity-80 transition"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <div>
                <p style={{ color: 'var(--text-primary)' }}>
                  {job.jobTitle || "Untitled Role"}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {job.location || "Remote"}
                </p>
              </div>

              <span style={{ color: 'var(--text-secondary)' }}>
                {job.department || "General"}
              </span>

              <span style={{ color: 'var(--text-secondary)' }}>
                {job.employmentType}
              </span>

              <span style={{ color: 'var(--accent-success)' }}>● Active</span>

              <div className="text-right" style={{ color: 'var(--text-secondary)' }}>•••</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
