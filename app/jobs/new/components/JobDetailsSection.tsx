"use client";

import { useJobForm } from "../context/ContextJobForm";

export default function JobDetailsSection() {
  const { form, setForm } = useJobForm();

  return (
    <section className="rounded-xl border border-white/10 p-8 bg-gradient-to-br from-[#111827] to-[#020617]">
      <h2 className="text-xl font-semibold mb-6">2. Job Details</h2>

      <label className="text-sm text-slate-400">Job Description</label>

      <div className="mt-3 border border-white/10 rounded-lg">
        {/* Toolbar (visual only – unchanged) */}
        <div className="flex gap-4 px-4 py-2 border-b border-white/10 text-sm text-slate-400">
          <span>B</span>
          <span>I</span>
          <span>• List</span>
        </div>

        <textarea
          value={form.description}
          onChange={(e) => {
            console.log("Job Description:", e.target.value);
            setForm((prev) => ({
              ...prev,
              description: e.target.value,
            }));
          }}
          rows={6}
          placeholder="Describe the role, responsibilities, and requirements..."
          className="w-full bg-[#020617] px-4 py-3 rounded-b-lg outline-none resize-none"
        />
      </div>
    </section>
  );
}
