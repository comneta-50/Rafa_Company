import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAFA Company — AI Developer Workspace",
  description: "Modern AI Workspace for Autonomous Code Inspection & Developer Agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F5F5F6] text-[#1C1917] flex flex-col font-sans">
        <AppShell>{children}</AppShell>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
