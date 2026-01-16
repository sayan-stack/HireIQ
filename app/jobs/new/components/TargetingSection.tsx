"use client";

import { useJobForm } from "../context/ContextJobForm";

export default function TargetingSection() {
  const { form, setForm } = useJobForm();

  return (
    <section className="rounded-xl border border-white/10 p-8 bg-gradient-to-br from-[#111827] to-[#020617]">
      <h2 className="text-xl font-semibold mb-6">3. Targeting</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Experience Level */}
        <div>
          <label className="text-sm text-slate-400">
            Experience Level
          </label>
          <select
            value={form.experienceLevel}
            onChange={(e) => {
              console.log("Experience Level:", e.target.value);
              setForm((prev) => ({
                ...prev,
                experienceLevel: e.target.value,
              }));
            }}
            className="mt-2 w-full bg-[#020617] border border-white/10 px-4 py-3 rounded-lg"
          >
            <option value="Junior">Junior (0–2)</option>
            <option value="Mid">Mid (2–4)</option>
            <option value="Senior">Senior (4–6)</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="text-sm text-slate-400">
            Department
          </label>
          <input
            value={form.department}
            onChange={(e) => {
              console.log("Department:", e.target.value);
              setForm((prev) => ({
                ...prev,
                department: e.target.value,
              }));
            }}
            placeholder="Design, Engineering, HR"
            className="mt-2 w-full bg-[#020617] border border-white/10 px-4 py-3 rounded-lg"
          />
        </div>

        {/* Work Authorization */}
        <div>
          <label className="text-sm text-slate-400">
            Work Authorization
          </label>
          <select
            value={form.workAuthorization}
            onChange={(e) => {
              console.log("Work Authorization:", e.target.value);
              setForm((prev) => ({
                ...prev,
                workAuthorization: e.target.value,
              }));
            }}
            className="mt-2 w-full bg-[#020617] border border-white/10 px-4 py-3 rounded-lg"
          >
            <option value="Any">Any</option>
            <option value="India">India</option>
            <option value="US">US</option>
          </select>
        </div>

        {/* Remote Policy */}
        <div>
          <label className="text-sm text-slate-400">
            Remote Policy
          </label>
          <select
            value={form.remotePolicy}
            onChange={(e) => {
              console.log("Remote Policy:", e.target.value);
              setForm((prev) => ({
                ...prev,
                remotePolicy: e.target.value,
              }));
            }}
            className="mt-2 w-full bg-[#020617] border border-white/10 px-4 py-3 rounded-lg"
          >
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>
      </div>
    </section>
  );
}
