"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateJobSidebar from "./components/CreateJobSidebar";
import CreateJobHeader from "./components/CreateJobHeader";
import BasicSection from "./components/BasicSection";
import JobDetailsSection from "./components/JobDetailsSection";
import TargetingSection from "./components/TargetingSection";
import SettingsSection from "./components/SettingsSection";
import { Eye, EyeOff, ArrowLeft, MapPin, Briefcase, Clock, Building2, Users, FileText, CheckCircle } from "lucide-react";
import { useJobForm } from "./context/ContextJobForm";

// Inline Preview Component
function JobPreview() {
  const { form } = useJobForm();

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
        <Eye size={18} className="text-blue-400" />
        <h3 className="font-semibold text-lg">Live Preview</h3>
      </div>

      {/* Job Header Preview */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {form.jobTitle || "Job Title"}
        </h2>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {form.location || "Location"}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={14} />
            {form.employmentType || "Full-time"}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {form.remotePolicy || "Remote"}
          </span>
          <span className="flex items-center gap-1">
            <Building2 size={14} />
            {form.department || "Department"}
          </span>
        </div>
      </div>

      {/* Experience Level Badge */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
          <Users size={12} />
          {form.experienceLevel || "Junior"} Level
        </span>
      </div>

      {/* Description Preview */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Job Description</h4>
        <div className="text-sm text-slate-400 leading-relaxed">
          {form.description ? (
            <p className="whitespace-pre-wrap">{form.description.slice(0, 300)}{form.description.length > 300 && '...'}</p>
          ) : (
            <p className="italic text-slate-500">No description yet...</p>
          )}
        </div>
      </div>

      {/* Requirements Preview */}
      <div className="mb-6 p-4 rounded-lg bg-slate-900/50">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">Application Requirements</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={14} className={form.resumeRequired ? "text-green-400" : "text-slate-600"} />
            <span className={form.resumeRequired ? "text-slate-300" : "text-slate-500"}>
              Resume {form.resumeRequired ? "Required" : "Optional"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={14} className={form.coverLetterRequired ? "text-green-400" : "text-slate-600"} />
            <span className={form.coverLetterRequired ? "text-slate-300" : "text-slate-500"}>
              Cover Letter {form.coverLetterRequired ? "Required" : "Optional"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={14} className={form.linkedinImport ? "text-green-400" : "text-slate-600"} />
            <span className={form.linkedinImport ? "text-slate-300" : "text-slate-500"}>
              LinkedIn Import {form.linkedinImport ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>

      {/* Screening Questions Preview */}
      {form.screeningQuestions.length > 0 && (
        <div className="p-4 rounded-lg bg-slate-900/50">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">
            Screening Questions ({form.screeningQuestions.length})
          </h4>
          <ul className="space-y-2">
            {form.screeningQuestions.slice(0, 3).map((q, i) => (
              <li key={q.id} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="text-blue-400">{i + 1}.</span>
                <span>{q.text}</span>
                {q.mandatory && <span className="text-red-400 text-xs">*</span>}
              </li>
            ))}
            {form.screeningQuestions.length > 3 && (
              <li className="text-xs text-slate-500">
                +{form.screeningQuestions.length - 3} more questions
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Deadline */}
      {form.deadline && (
        <div className="mt-4 text-xs text-slate-500">
          Application Deadline: {form.deadline.toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

export default function CreateJobPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('hireiq_user');
    if (userData) {
      const user = JSON.parse(userData);
      const recruiter = user.accountType !== 'candidate';
      setIsRecruiter(recruiter);
      if (!recruiter) {
        router.push('/dashboard');
      }
    } else {
      setIsRecruiter(true);
    }
  }, [router]);

  // Loading state while checking role
  if (isRecruiter === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020617] text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-[#020617] text-white">
      <CreateJobSidebar
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />

      <main className="relative flex-1 px-12 py-10">
        <CreateJobHeader />

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Create New Job</h1>
            <p className="text-slate-400 mt-1">
              Fill in the details below to post your new opening.
            </p>
          </div>

          {/* Preview Toggle Button */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${showPreview
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        <div className={`grid gap-8 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {/* Form Section */}
          <div>
            {activeStep === 1 && <BasicSection />}
            {activeStep === 2 && <JobDetailsSection />}
            {activeStep === 3 && <TargetingSection />}
            {activeStep === 4 && <SettingsSection />}
          </div>

          {/* Preview Section */}
          {showPreview && <JobPreview />}
        </div>

        <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-6">
          <button
            onClick={() => router.push('/jobs')}
            className="text-slate-400 hover:text-white cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Cancel
          </button>

          <div className="flex gap-4">
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-6 py-2 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer"
              >
                Previous
              </button>
            )}

            {activeStep < 4 && (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 cursor-pointer"
              >
                Next
              </button>
            )}

            {activeStep === 4 && (
              <>
                <button
                  onClick={() => router.push("/jobs/new/preview")}
                  className="px-6 py-2 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer flex items-center gap-2"
                >
                  <Eye size={16} />
                  Full Preview
                </button>

                <button className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 cursor-pointer">
                  Publish Job
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
