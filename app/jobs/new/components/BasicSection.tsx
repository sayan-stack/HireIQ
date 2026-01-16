"use client";

import { useJobForm } from "../context/ContextJobForm";

export default function BasicSection() {
  const { form, setForm } = useJobForm();

  return (
    <section className="rounded-xl border border-white/10 p-8 bg-gradient-to-br from-[#111827] to-[#020617]">
      <h2 className="text-xl font-semibold mb-6">1. The Basics</h2>

      <div className="space-y-6">
        {/* Job Title */}
        <div>
          <label className="text-sm text-slate-400">Job Title *</label>
          <input
            value={form.jobTitle}
            onChange={(e) => {
              console.log("Job Title:", e.target.value);
              setForm((prev) => ({
                ...prev,
                jobTitle: e.target.value,
              }));
            }}
            placeholder="e.g. Senior Product Designer"
            className="mt-2 w-full bg-[#020617] border border-white/10 px-4 py-3 rounded-lg"
          />
        </div>

        {/* Employment + Location */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-slate-400">
              Employment Type
            </label>
            <select
              value={form.employmentType}
              onChange={(e) => {
                console.log("Employment Type:", e.target.value);
                setForm((prev) => ({
                  ...prev,
                  employmentType: e.target.value,
                }));
              }}
              className="mt-2 w-full bg-[#020617] border border-white/10 px-4 py-3 rounded-lg"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-400">Location</label>
            <input
              value={form.location}
              onChange={(e) => {
                console.log("Location:", e.target.value);
                setForm((prev) => ({
                  ...prev,
                  location: e.target.value,
                }));
              }}
              placeholder="e.g. Remote, San Francisco, CA"
              className="mt-2 w-full bg-[#020617] border border-white/10 px-4 py-3 rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
