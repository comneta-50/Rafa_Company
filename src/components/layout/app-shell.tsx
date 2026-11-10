"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isAuthPage) {
    return <main className="min-h-screen w-full bg-[#F5F5F6]">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F6] text-[#1C1917]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
