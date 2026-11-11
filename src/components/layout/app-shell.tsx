"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F6] text-[#1C1917]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
