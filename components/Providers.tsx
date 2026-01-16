"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { QuestionProvider } from "@/contexts/QuestionContext";
import { FirebaseAuthProvider } from "@/contexts/FirebaseAuthContext";
import { ApplicationProvider } from "@/contexts/ApplicationContext";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { JobsProvider } from "@/app/jobs/new/context/JobContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <FirebaseAuthProvider>
                <JobsProvider>
                    <QuestionProvider>
                        <ApplicationProvider>
                            <ResumeProvider>
                                {children}
                            </ResumeProvider>
                        </ApplicationProvider>
                    </QuestionProvider>
                </JobsProvider>
            </FirebaseAuthProvider>
        </ThemeProvider>
    );
}
