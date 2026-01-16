"use client";

type SidebarProps = {
  activeStep: number;
  setActiveStep: (step: number) => void;
};

const steps = [
  { id: 1, label: "The Basics" },
  { id: 2, label: "Job Details" },
  { id: 3, label: "Targeting" },
  { id: 4, label: "Settings" },
];

export default function CreateJobSidebar({
  activeStep,
  setActiveStep,
}: SidebarProps) {
  return (
    <aside className="w-72 bg-[#020617] border-r border-white/10 px-6 py-8">
      <h2 className="text-lg font-semibold mb-1">New Job Post</h2>
      <p className="text-xs text-slate-400 mb-8">
        Draft · Last saved 2m ago
      </p>

      <div className="space-y-2">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition cursor-pointer
              ${
                activeStep === step.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-white/5"
              }
            `}
          >
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-full border text-xs
                ${
                  activeStep === step.id
                    ? "bg-white text-blue-600 border-white"
                    : "border-slate-500"
                }
              `}
            >
              {step.id}
            </span>
            {step.label}
          </button>
        ))}
      </div>

      {/* Pro Tip */}
      <div className="mt-10 p-4 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-600/30 cursor-pointer">
        <p className="text-sm font-medium">💡 Pro Tip</p>
        <p className="text-xs text-slate-300 mt-1">
          Detailed job descriptions get 30% more qualified applicants.
        </p>
      </div>
    </aside>
  );
}
