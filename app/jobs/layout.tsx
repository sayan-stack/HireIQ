"use client";

import { JobsProvider } from "./new/context/JobContext";

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <JobsProvider>{children}</JobsProvider>;
}
