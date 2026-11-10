"use client";

import React, { useState } from "react";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Terminal,
  Cpu,
  ChevronDown,
  Download,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const mockLogs = [
  {
    id: "LOG-9821",
    timestamp: "19:34:12",
    level: "success",
    agent: "AI Code Reviewer",
    repo: "comneta-50/site-ai-company",
    message: "Completed AST traversal and validated zero memory leak vectors on auth middleware.",
    duration: "1.2s",
  },
  {
    id: "LOG-9820",
    timestamp: "19:33:04",
    level: "info",
    agent: "AutoFix Engineer",
    repo: "comneta-50/site-ai-company",
    message: "Generated patch diff for token expiration synchronization #PR-104.",
    duration: "4.8s",
  },
  {
    id: "LOG-9819",
    timestamp: "19:30:45",
    level: "warn",
    agent: "Test Runner Bot",
    repo: "comneta-50/core-api-service",
    message: "High latency detected on Redis cluster test container (spike to 184ms).",
    duration: "12.4s",
  },
  {
    id: "LOG-9818",
    timestamp: "19:28:11",
    level: "info",
    agent: "AI Code Reviewer",
    repo: "comneta-50/web-frontend",
    message: "Analyzing pull request #89: hydration mismatch detection on SSR root.",
    duration: "2.1s",
  },
  {
    id: "LOG-9817",
    timestamp: "19:25:00",
    level: "success",
    agent: "AutoFix Engineer",
    repo: "comneta-50/analytics-worker",
    message: "Applied batch buffer backpressure patch and verified green test suite.",
    duration: "3.7s",
  },
  {
    id: "LOG-9816",
    timestamp: "19:20:19",
    level: "info",
    agent: "Security Guard",
    repo: "comneta-50/core-api-service",
    message: "Completed vulnerability audit against CVE database. Zero vulnerabilities found.",
    duration: "8.5s",
  },
];

export default function ActivityPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredLogs = mockLogs.filter((log) => {
    if (selectedFilter === "all") return true;
    return log.level === selectedFilter;
  });

  const handleExport = () => {
    toast.success("Berhasil mengekspor 6 records telemetry ke format JSON/CSV.");
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
              onClick={() => {
                setSelectedFilter("all");
                toast.info("Menampilkan semua aktivitas event");
              }}
            >
              All Events
            </Button>
            <Button
              variant={selectedFilter === "success" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedFilter("success");
                toast.info("Filter: Menampilkan status sukses");
              }}
            >
              Success
            </Button>
            <Button
              variant={selectedFilter === "warn" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedFilter("warn");
                toast.info("Filter: Menampilkan peringatan / warnings");
              }}
            >
              Warnings
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
            <Badge variant="secondary" className="font-mono">
              {filteredLogs.length} Records
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-2">
            {filteredLogs.map((log) => (
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
                  <span>•</span>
                  <span>{log.duration}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
