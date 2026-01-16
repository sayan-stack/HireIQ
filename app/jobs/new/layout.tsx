"use client";

import { JobFormProvider } from "./context/ContextJobForm";

export default function JobNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <JobFormProvider>{children}</JobFormProvider>;
}
