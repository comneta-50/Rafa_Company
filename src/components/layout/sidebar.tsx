"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Bot } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-[#E7E5E4] bg-white flex flex-col h-screen p-4 shadow-2xs">
      {/* Workspace Brand */}
      <Link
        href="/"
        className="flex items-center gap-3 px-2 py-2 mb-6 rounded-lg transition-opacity hover:opacity-90"
      >
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#881337] text-white font-bold text-sm tracking-wider shadow-xs">
          R
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-tight text-[#1C1917] leading-none">
            RAFA Company
          </span>
          <span className="text-[11px] text-[#78716C] mt-1 font-mono">
            AI Assistant
          </span>
        </div>
      </Link>

      {/* Single Navigation for Chatbot */}
      <div className="space-y-1 flex-1">
        <div className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#A8A29E]">
          Assistants
        </div>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold bg-[#FFE4E6] text-[#881337] border border-[#FECDD3] transition-colors"
        >
          <MessageSquare className="size-4 shrink-0 text-[#881337]" />
          <span className="flex-1">AI Chatbot</span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
        </Link>
      </div>

      {/* Minimal Footer */}
      <div className="border-t border-[#E7E5E4] pt-3 px-2 flex items-center justify-between text-xs text-[#78716C]">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-[#FAF9F9] border border-[#E7E5E4] flex items-center justify-center text-[#881337]">
            <Bot className="size-3.5" />
          </div>
          <span className="text-[11px] font-medium text-[#1C1917]">Rafa AI</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
          Active
        </span>
      </div>
    </aside>
  );
}
