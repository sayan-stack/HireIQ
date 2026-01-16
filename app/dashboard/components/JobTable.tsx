"use client";

export default function JobTable() {
  return (
    <div
      className="
        rounded-xl p-6
        bg-[var(--bg-card)]
        border border-[var(--border-subtle)]
        shadow-[var(--shadow-sm)]
        transition-colors duration-300
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-[var(--text-primary)]">Recent Job Postings</h3>
        <span className="text-cyan-500 text-sm cursor-pointer hover:underline font-medium">
          View All Jobs
        </span>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 text-xs text-[var(--text-tertiary)] font-medium uppercase border-b border-[var(--border-subtle)] pb-3">
        <span>JOB TITLE</span>
        <span>DATE POSTED</span>
        <span>STATUS</span>
        <span>APPLICANTS</span>
        <span className="text-right">ACTIONS</span>
      </div>

      {/* Row 1 */}
      <div
        className="
          grid grid-cols-5 items-center
          py-4 text-sm
          border-b border-[var(--border-subtle)]
          cursor-pointer
          hover:bg-[var(--bg-tertiary)]
          transition
        "
        onClick={() => { }}
      >
        <div>
          <p className="text-[var(--text-primary)] font-medium">Senior Product Designer</p>
          <p className="text-xs text-[var(--text-tertiary)]">Design Dept · Remote</p>
        </div>

        <span className="text-[var(--text-tertiary)]">2 days ago</span>

        <span className="text-green-500 font-medium">● Active</span>

        <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
          <div className="h-6 w-6 rounded-full bg-[var(--bg-tertiary)]" />
          <div className="h-6 w-6 rounded-full bg-[var(--bg-tertiary)]" />
          <div className="h-6 w-6 rounded-full bg-[var(--bg-tertiary)]" />
          <span className="text-xs font-medium">+42</span>
        </div>

        <div className="text-right text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)]">•••</div>
      </div>

      {/* Row 2 */}
      <div
        className="
          grid grid-cols-5 items-center
          py-4 text-sm
          cursor-pointer
          hover:bg-[var(--bg-tertiary)]
          transition
        "
        onClick={() => { }}
      >
        <div>
          <p className="text-[var(--text-primary)] font-medium">Frontend Developer</p>
          <p className="text-xs text-[var(--text-tertiary)]">Engineering · Hybrid</p>
        </div>

        <span className="text-[var(--text-tertiary)]">1 week ago</span>

        <span className="text-green-500 font-medium">● Active</span>

        <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
          <div className="h-6 w-6 rounded-full bg-[var(--bg-tertiary)]" />
          <span className="text-xs font-medium">+11</span>
        </div>

        <div className="text-right text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)]">•••</div>
      </div>
    </div>
  );
}
