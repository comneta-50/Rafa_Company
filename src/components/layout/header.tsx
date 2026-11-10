"use client";

import React, { useState } from "react";
import { Search, Bell, RefreshCw, Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface HeaderProps {
  actionLabel?: string;
  onAction?: () => void;
}

export function Header({ actionLabel = "Create Job", onAction }: HeaderProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("comneta-50/site-ai-company");
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

  const handleCreateJob = () => {
    if (onAction) {
      onAction();
      return;
    }
    setIsJobModalOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) {
      toast.error("Silakan masukkan judul job / deskripsi tugas.");
      return;
    }
    toast.success(`Job "${jobTitle}" berhasil dibuat dan dialokasikan ke antrean agent!`);
    setJobTitle("");
    setIsJobModalOpen(false);
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
          <Button variant="default" size="sm" onClick={handleCreateJob} className="text-xs">
            <Plus className="size-3.5 mr-1" /> {actionLabel}
          </Button>
        </div>
      </header>

      {/* Modal Dialog Buat Job Baru */}
      <Dialog open={isJobModalOpen} onOpenChange={setIsJobModalOpen}>
        <DialogContent className="max-w-md rounded-[8px] p-6 bg-white border border-[#E7E5E4]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#1C1917]">
              Buat Job AI Baru
            </DialogTitle>
            <DialogDescription className="text-xs text-[#78716C]">
              Tugaskan AI Autonomous Agent untuk memeriksa, membuat patch, atau menguji repositori.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveJob} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                Target Repository
              </label>
              <select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="w-full text-xs h-9 px-3 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#881337]/30"
              >
                <option value="comneta-50/site-ai-company">comneta-50/site-ai-company</option>
                <option value="comneta-50/core-api-service">comneta-50/core-api-service</option>
                <option value="comneta-50/web-frontend">comneta-50/web-frontend</option>
                <option value="comneta-50/analytics-worker">comneta-50/analytics-worker</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                Instruksi Job / Bug Title
              </label>
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Contoh: Periksa memory leaks di modul auth..."
                className="bg-[#FAF9F9] text-xs h-9 rounded-[6px]"
              />
            </div>

            <DialogFooter className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsJobModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="default" size="sm">
                <Check className="size-3.5 mr-1" /> Jalankan Job
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
