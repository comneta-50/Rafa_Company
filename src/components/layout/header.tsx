"use client";

import React from "react";
import { Search, Bell, RefreshCw, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  actionLabel?: string;
  onAction?: () => void;
}

export function Header({ actionLabel = "Create Job", onAction }: HeaderProps) {
  return (
    <header className="h-[60px] border-b border-[#E7E5E4] bg-white/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-7 shrink-0">
      <div className="flex items-center gap-3 w-80">
        <div className="relative w-full">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
          <Input
            placeholder="Search jobs, repositories, or AI commands..."
            className="pl-8 bg-[#FAF9F9] border-[#E7E5E4] text-xs h-8.5 placeholder:text-[#A8A29E] rounded-[6px] text-[#1C1917] focus-visible:ring-[#881337]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" className="text-[#78716C] hover:text-[#1C1917]">
          <Bell className="size-4" />
        </Button>
        <Button variant="outline" size="sm">
          <RefreshCw className="size-3.5 mr-1" /> Sync Repos
        </Button>
        <Button variant="default" size="sm" onClick={onAction}>
          <Plus className="size-3.5 mr-1" /> {actionLabel}
        </Button>
      </div>
    </header>
  );
}
