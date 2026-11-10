"use client";

import React, { useState } from "react";
import {
  Terminal,
  Plus,
  Play,
  RotateCw,
  FolderGit2,
  Clock,
  Cpu,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const allJobs = [
  {
    id: "JOB-4092",
    repo: "comneta-50/site-ai-company",
    branch: "feat/auth-middleware",
    title: "Fix Token Expiration & Race Condition in Auth Guard",
    agent: "Analyzer Agent #04",
    status: "fixing",
    statusLabel: "Fixing",
    time: "2m ago",
    progress: 68,
  },
  {
    id: "JOB-4089",
    repo: "comneta-50/core-api-service",
    branch: "main",
    title: "Optimize PostgreSQL connection pooling under heavy load",
    agent: "Optimizer Bot",
    status: "testing",
    statusLabel: "Testing",
    time: "14m ago",
    progress: 92,
  },
  {
    id: "JOB-4085",
    repo: "comneta-50/web-frontend",
    branch: "fix/hydration-error",
    title: "Resolve SSR hydration mismatch on localized landing route",
    agent: "CodeReviewer v2",
    status: "review",
    statusLabel: "Review",
    time: "48m ago",
    progress: 100,
  },
  {
    id: "JOB-4081",
    repo: "comneta-50/analytics-worker",
    branch: "release/v1.2",
    title: "Patch Redis pipeline buffer overflow in batch consumer",
    agent: "Security Guard",
    status: "completed",
    statusLabel: "Completed",
    time: "2h ago",
    progress: 100,
  },
  {
    id: "JOB-4078",
    repo: "comneta-50/notification-service",
    branch: "fix/mailgun-webhook",
    title: "Replay failed webhook delivery events and patch signature verifier",
    agent: "AutoFix Engineer",
    status: "completed",
    statusLabel: "Completed",
    time: "4h ago",
    progress: 100,
  },
  {
    id: "JOB-4075",
    repo: "comneta-50/billing-service",
    branch: "hotfix/stripe-tax-calc",
    title: "Update tax calculation logic for EU customer transactions",
    agent: "Security Guard",
    status: "failed",
    statusLabel: "Failed",
    time: "6h ago",
    progress: 45,
  },
];

export default function JobsPage() {
  const [filter, setFilter] = useState("all");

  const filtered = allJobs.filter((j) => {
    if (filter === "all") return true;
    return j.status === filter;
  });

  return (
    <>
      <Header actionLabel="New Job" />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
              Jobs & Pipelines
            </h1>
            <p className="text-[13px] text-[#78716C] mt-1">
              Active, queued, and historical automated jobs processed by AI agents.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All Jobs
            </Button>
            <Button
              variant={filter === "fixing" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("fixing")}
            >
              Fixing
            </Button>
            <Button
              variant={filter === "testing" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("testing")}
            >
              Testing
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
          </div>
        </div>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Execution Queue</CardTitle>
            <CardDescription>
              Showing {filtered.length} tasks matching current selection criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {filtered.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] hover:bg-white hover:border-[#D6D3D1] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-[#1C1917]">
                      {job.id}
                    </span>
                    <Badge
                      variant={
                        job.status === "fixing"
                          ? "fixing"
                          : job.status === "testing"
                          ? "testing"
                          : job.status === "review"
                          ? "review"
                          : job.status === "completed"
                          ? "completed"
                          : "failed"
                      }
                    >
                      {job.statusLabel}
                    </Badge>
                    <span className="text-[11px] text-[#78716C] flex items-center gap-1 font-mono">
                      <FolderGit2 className="size-3" /> {job.repo}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-[#1C1917]">{job.title}</p>

                  <div className="flex items-center gap-3 text-[11px] text-[#78716C] flex-wrap">
                    <span className="flex items-center gap-1 text-[#881337] font-medium">
                      <Cpu className="size-3" /> {job.agent}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{job.branch}</span>
                    <span>•</span>
                    <span>{job.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                  <div className="w-28 text-right hidden sm:block">
                    <div className="text-[11px] font-mono text-[#78716C] mb-1">
                      {job.progress}%
                    </div>
                    <div className="w-full bg-[#E7E5E4] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#881337] h-full rounded-full"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>

                  <Button variant="secondary" size="sm" className="text-xs">
                    Inspect
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    Logs
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
