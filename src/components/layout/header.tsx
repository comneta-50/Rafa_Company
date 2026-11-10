"use client";

import React, { useState } from "react";
import { Search, Bell, RefreshCw, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreateJobModal } from "@/components/jobs/create-job-modal";

interface HeaderProps {
  actionLabel?: string;
  onAction?: () => void;
}

export function Header({ actionLabel = "Create Job", onAction }: HeaderProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSync = () => {
    setIsSyncing(true);
    toast.loading("Menyinkronkan repositori dengan GitHub...", { id: "sync" });
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Repositori berhasil disinkronkan!", { id: "sync" });
    }, 1200);
  };

  const handleNotifications = () => {
    toast.info("Notifikasi: Tidak ada alert mendesak saat ini. Sistem berjalan normal.");
  };

  const handleActionButtonClick = () => {
    if (onAction) {
      onAction();
      return;
    }
    setIsJobModalOpen(true);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      toast.info(`Mencari "${searchQuery}" di seluruh sistem...`);
    }
  };

  return (
    <>
      <header className="h-[60px] border-b border-[#E7E5E4] bg-white/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-7 shrink-0">
        <div className="flex items-center gap-3 w-80">
          <div className="relative w-full">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search jobs, repos, commands (Tekan Enter)..."
              className="pl-8 bg-[#FAF9F9] border-[#E7E5E4] text-xs h-8.5 placeholder:text-[#A8A29E] rounded-[6px] text-[#1C1917] focus-visible:ring-[#881337]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleNotifications}
            className="text-[#78716C] hover:text-[#1C1917]"
            title="Lihat notifikasi"
          >
            <Bell className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="text-xs"
          >
            <RefreshCw className={`size-3.5 mr-1 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync Repos"}
          </Button>
          <Button variant="default" size="sm" onClick={handleActionButtonClick} className="text-xs">
            <Plus className="size-3.5 mr-1" /> {actionLabel}
          </Button>
        </div>
      </header>

      {/* Modal Form Sesuai Gambar Referensi */}
      <CreateJobModal
        open={isJobModalOpen}
        onOpenChange={setIsJobModalOpen}
      />
    </>
  );
}
