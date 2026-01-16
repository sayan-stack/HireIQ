"use client";

import React, { createContext, useContext, useState } from "react";

/* =========================
   Types
========================= */

export type QuestionType = "yesno" | "numeric" | "text";

export interface ScreeningQuestion {
  id: number;
  text: string;
  type: QuestionType;
  mandatory: boolean;
}

export interface QuestionModalState {
  open: boolean;
  editingId: number | null;
  text: string;
  type: QuestionType;
  mandatory: boolean;
}

export interface JobFormData {
  // Basics
  jobTitle: string;
  employmentType: string;
  location: string;

  // Job Details
  description: string;

  // Targeting
  experienceLevel: string;
  department: string;
  workAuthorization: string;
  remotePolicy: string;

  // Submission Requirements
  resumeRequired: boolean;
  coverLetterRequired: boolean;
  linkedinImport: boolean;

  // Screening Questions
  screeningQuestions: ScreeningQuestion[];
  questionModal: QuestionModalState;

  // Logistics
  deadline: Date | undefined;
  confirmationEmail: string;
}

/* =========================
   Default Values
========================= */

const defaultJobFormData: JobFormData = {
  jobTitle: "",
  employmentType: "Full-time",
  location: "",

  description: "",

  experienceLevel: "Junior",
  department: "",
  workAuthorization: "Any",
  remotePolicy: "Remote",

  resumeRequired: true,
  coverLetterRequired: false,
  linkedinImport: true,

  screeningQuestions: [],
  questionModal: {
    open: false,
    editingId: null,
    text: "",
    type: "yesno",
    mandatory: true,
  },

  deadline: new Date(2025, 11, 31),
  confirmationEmail: "Application Received",
};

/* =========================
   Context
========================= */

interface JobFormContextType {
  // NEW (for preview)
  data: JobFormData;
  setData: React.Dispatch<React.SetStateAction<JobFormData>>;

  // EXISTING (for forms)
  form: JobFormData;
  setForm: React.Dispatch<React.SetStateAction<JobFormData>>;
}

const JobFormContext = createContext<JobFormContextType | null>(null);

/* =========================
   Provider
========================= */

export function JobFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [form, setForm] = useState<JobFormData>(defaultJobFormData);

  return (
    <JobFormContext.Provider
      value={{
        form,
        setForm,
        data: form,       // ✅ alias
        setData: setForm, // ✅ alias
      }}
    >
      {children}
    </JobFormContext.Provider>
  );
}

/* =========================
   Hook
========================= */

export function useJobForm() {
  const context = useContext(JobFormContext);
  if (!context) {
    throw new Error(
      "useJobForm must be used within a JobFormProvider"
    );
  }
  return context;
}
