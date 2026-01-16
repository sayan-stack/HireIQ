"use client";

import { JobFormProvider } from "./ContextJobForm";

export default function JobFormClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <JobFormProvider>{children}</JobFormProvider>;
}
