"use client";

import Sidebar from "@/app/dashboard/components/Sidebar";
import TopBar from "@/app/dashboard/components/TopBar";

export default function MessagesPage() {
  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <TopBar />

        <div className="rounded-xl p-6" style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)'
        }}>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Messages
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            Communicate with candidates and recruiters.
          </p>
        </div>
      </main>
    </div>
  );
}
