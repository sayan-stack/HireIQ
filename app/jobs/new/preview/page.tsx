"use client";

import { useState } from "react";
import { useJobForm } from "../context/ContextJobForm";
import { useJobs } from "../context/JobContext";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/* ======================================
   Helper: ONLY formats description
   (no data mutation, no UI change)
====================================== */
function renderDescription(text: string) {
  if (!text) {
    return (
      <p className="text-sm text-slate-400">
        No description provided.
      </p>
    );
  }

  const lines = text.split("\n");

  return lines.map((line, index) => {
    const trimmed = line.trim();

    if (trimmed.endsWith(":")) {
      return (
        <h3
          key={index}
          className="mt-4 mb-2 text-sm font-semibold text-white"
        >
          {trimmed.replace(":", "")}
        </h3>
      );
    }

    if (
      trimmed.startsWith("-") ||
      trimmed.startsWith("•") ||
      trimmed.startsWith("*")
    ) {
      return (
        <li
          key={index}
          className="ml-5 list-disc text-sm text-slate-300"
        >
          {trimmed.replace(/^[-•*]\s*/, "")}
        </li>
      );
    }

    if (trimmed === "") {
      return <div key={index} className="h-2" />;
    }

    return (
      <p
        key={index}
        className="text-sm text-slate-300 leading-relaxed"
      >
        {trimmed}
      </p>
    );
  });
}

export default function JobPreviewPage() {
  const { form } = useJobForm();
  const { addJob } = useJobs();
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const jobId = await addJob({
        jobTitle: form.jobTitle || "Untitled Role",
        employmentType: form.employmentType || "Full-time",
        location: form.location || "Remote",
        department: form.department,
        description: form.description,
        status: "Active"
      });

      if (jobId) {
        alert("Job published successfully!");
        router.push("/jobs");
      } else {
        alert("Failed to publish job. Please try again.");
      }
    } catch (error) {
      console.error("Error publishing job:", error);
      alert("An error occurred while publishing the job.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white px-12 py-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div>
            <p className="text-sm text-blue-400">
              Preview Mode
            </p>
            <p className="text-xs text-slate-400">
              This is how candidates will see your job posting.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.replace("/jobs/new")}
            className="px-4 py-2 rounded-md border border-white/20 text-sm hover:bg-white/5 cursor-pointer"
          >
            Edit Listing
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-2 rounded-md bg-blue-600 text-sm hover:bg-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? "Publishing..." : "Publish Now"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="col-span-2 space-y-8">
          <section className="rounded-xl border border-white/10 p-6 bg-gradient-to-br from-[#111827] to-[#020617]">
            <h1 className="text-2xl font-semibold">
              {form.jobTitle || "Untitled Role"}
            </h1>

            <div className="mt-2 flex gap-4 text-sm text-slate-400">
              <span>{form.employmentType}</span>
              <span>{form.location || "Location not specified"}</span>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 p-6 bg-gradient-to-br from-[#111827] to-[#020617]">
            <h2 className="text-lg font-semibold mb-4">
              About the Role
            </h2>

            <div className="space-y-1">
              {renderDescription(form.description)}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <section className="rounded-xl border border-white/10 p-5 bg-gradient-to-br from-[#111827] to-[#020617]">
            <h3 className="text-sm font-semibold mb-3">
              Job Details
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">
                  Experience Level
                </span>
                <span>{form.experienceLevel}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Remote Policy
                </span>
                <span>{form.remotePolicy}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Application Deadline
                </span>
                <span>
                  {form.deadline
                    ? form.deadline.toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 p-5 bg-gradient-to-br from-[#111827] to-[#020617]">
            <h3 className="text-sm font-semibold mb-3">
              Submission Requirements
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                Resume Upload:{" "}
                <span className="text-slate-300">
                  {form.resumeRequired ? "Enabled" : "Disabled"}
                </span>
              </li>
              <li>
                Cover Letter:{" "}
                <span className="text-slate-300">
                  {form.coverLetterRequired ? "Required" : "Optional"}
                </span>
              </li>
              <li>
                LinkedIn Import:{" "}
                <span className="text-slate-300">
                  {form.linkedinImport ? "Allowed" : "Disabled"}
                </span>
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-white/10 p-5 bg-gradient-to-br from-[#111827] to-[#020617]">
            <h3 className="text-sm font-semibold mb-3">
              Screening Questions
            </h3>

            {form.screeningQuestions.length === 0 ? (
              <p className="text-sm text-slate-400">
                No screening questions added.
              </p>
            ) : (
              <div className="space-y-3">
                {form.screeningQuestions.map((q, i) => (
                  <div
                    key={q.id}
                    className="rounded-lg border border-white/10 p-3 bg-[#020617]"
                  >
                    <p className="text-sm">
                      {i + 1}. {q.text}
                    </p>
                    <div className="mt-1 flex gap-3 text-xs text-slate-400">
                      <span>{q.type}</span>
                      {q.mandatory && <span>Mandatory</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-white/10 p-5 bg-gradient-to-br from-[#111827] to-[#020617]">
            <h3 className="text-sm font-semibold mb-3">
              Logistics
            </h3>

            <p className="text-sm">
              <span className="text-slate-400">
                Confirmation Email:
              </span>{" "}
              {form.confirmationEmail}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
