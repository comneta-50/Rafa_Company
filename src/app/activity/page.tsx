"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Inbox,
  FolderGit2,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { workerApi } from "@/lib/api";
import { toast } from "sonner";

export interface LogItem {
  id: string;
  timestamp: string;
  level: "success" | "info" | "warn" | "failed";
  agent: string;
  repo: string;
  message: string;
  duration?: string;
}

export default function ActivityPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    workerApi
      .getActivity(selectedFilter)
      .then((data) => {
        if (Array.isArray(data)) {
          setLogs(data);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch activity logs:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedFilter]);

  const handleExport = () => {
    if (logs.length === 0) {
      toast.info("Belum ada log yang dapat diekspor.");
      return;
    }
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Berhasil mengekspor ${logs.length} records telemetry ke JSON.`);
  };

  return (
    <>
      <Header actionLabel="Export Logs" onAction={handleExport} />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Title & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
              Activity Logs
            </h1>
            <p className="text-[13px] text-[#78716C] mt-1">
              Real-time audit trail of all AI agent decisions, jobs dispatched, and CI verifications.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
            >
              All Events
            </Button>
            <Button
              variant={selectedFilter === "success" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("success")}
            >
              Success
            </Button>
            <Button
              variant={selectedFilter === "warn" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("warn")}
            >
              Warnings
            </Button>
            <Button
              variant={selectedFilter === "info" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("info")}
            >
              Info
            </Button>
          </div>
        </div>

        {/* Logs Feed Container */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>System & Agent Telemetry</CardTitle>
              <CardDescription>Live streaming log stream from connected agent workers</CardDescription>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-24 rounded-full" />
            ) : (
              <Badge variant="secondary" className="font-mono">
                {logs.length} Records
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-2.5 pt-2">
            {isLoading ? (
              // Shimmer Skeleton Loading Rows
              [1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Skeleton className="size-4 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-20 shrink-0 font-mono" />
                    <Skeleton className="h-4 w-32 shrink-0" />
                    <Skeleton className="h-4 w-2/5" />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3.5 w-12" />
                  </div>
                </div>
              ))
            ) : logs.length === 0 ? (
              // Empty State
              <div className="py-16 px-4 text-center rounded-[6px] bg-[#FAF9F9] border border-dashed border-[#E7E5E4] space-y-2">
                <div className="size-10 rounded-full bg-white border border-[#E7E5E4] flex items-center justify-center mx-auto text-[#78716C] shadow-2xs">
                  <Inbox className="size-5" />
                </div>
                <h3 className="text-sm font-semibold text-[#1C1917]">Belum ada activity logs</h3>
                <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                  Log aktivitas akan otomatis terekam setiap kali AI agent menjalankan task, order dibuat, atau pipeline di-trigger.
                </p>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] hover:bg-white hover:border-[#D6D3D1] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
                    {log.level === "success" ? (
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5 md:mt-0" />
                    ) : log.level === "warn" ? (
                      <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5 md:mt-0" />
                    ) : (
                      <Info className="size-4 text-rose-700 shrink-0 mt-0.5 md:mt-0" />
                    )}

                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 flex-1 min-w-0">
                      <span className="font-mono text-[11px] text-[#78716C] shrink-0">
                        [{log.timestamp}]
                      </span>
                      <span className="font-semibold text-[#881337] shrink-0">
                        {log.agent}
                      </span>
                      <span className="text-[#1C1917] truncate">{log.message}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-[#78716C] font-mono text-[11px] self-end md:self-auto">
                    <span>{log.repo}</span>
                    {log.duration && (
                      <>
                        <span>•</span>
                        <span>{log.duration}</span>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
