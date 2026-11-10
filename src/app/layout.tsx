import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
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
        <div className="flex h-screen overflow-hidden bg-[#F5F5F6] text-[#1C1917]">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
            {children}
          </main>
        </div>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
