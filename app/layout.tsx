import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "HireIQ - AI-Powered Interview Platform",
  description: "Revolutionize your recruitment with AI-powered interviews, resume analysis, and evidence-based candidate evaluation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
