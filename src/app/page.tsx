"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Bot,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Cpu,
  FolderGit2,
  ChevronRight,
  Play,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { mockAgents } from "@/components/layout/sidebar";

const mockJobs = [
  {
    id: "JOB-4092",
    repo: "comneta-50/site-ai-company",
    branch: "feat/auth-middleware",
    title: "Fix Token Expiration & Race Condition in Auth Guard",
    agent: "Analyzer Agent #04",
    status: "fixing",
    statusLabel: "Fixing",
    time: "2m ago",
    progress: "68%",
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
    progress: "92%",
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
    progress: "100%",
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
    progress: "100%",
  },
];

export default function DashboardPage() {
  const [promptInput, setPromptInput] = useState("");

  return (
    <>
      <Header />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Welcome & Command Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
              Workspace Overview
            </h1>
            <p className="text-[13px] text-[#78716C] mt-1">
              Monitor autonomous agents, review code fixes, and orchestrate CI/CD pipelines.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="px-3 py-1">
              <span className="size-1.5 rounded-full bg-[#881337] animate-pulse" />
              Cluster Healthy
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 font-mono">
              Lat: 24ms
            </Badge>
          </div>
        </div>

        {/* AI Interactive Prompt / Dispatch Bar */}
        <Card className="border-[#FECDD3] bg-gradient-to-r from-rose-50/70 to-white">
          <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-[#881337] shrink-0 font-medium text-xs px-3 py-1.5 bg-white border border-[#FECDD3] rounded-[4px] shadow-2xs">
              <Sparkles className="size-3.5 text-[#881337]" />
              <span>AI Dispatch</span>
            </div>
            <Input
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Give an instruction, e.g: 'Analyze branch feat/billing and fix memory leaks'..."
              className="bg-white border-[#E7E5E4] text-xs h-9.5 rounded-[6px] flex-1 text-[#1C1917] placeholder:text-[#A8A29E]"
            />
            <Button variant="default" size="sm" className="shrink-0">
              <Play className="size-3.5 mr-1 fill-white" /> Run Agent Fix
            </Button>
          </CardContent>
        </Card>

        {/* Metric Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium">Active Jobs</CardDescription>
              <Terminal className="size-4 text-[#78716C]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#1C1917]">12</div>
              <div className="flex items-center gap-1.5 text-xs text-[#881337] mt-1 font-medium">
                <ArrowUpRight className="size-3" />
                <span>4 in-progress execution</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium">AI Agents Online</CardDescription>
              <Bot className="size-4 text-[#881337]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#1C1917]">8 / 8</div>
              <div className="text-xs text-[#78716C] mt-1">100% capacity ready</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium">Success Rate</CardDescription>
              <CheckCircle2 className="size-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#1C1917]">98.6%</div>
              <div className="text-xs text-[#78716C] mt-1">Over past 140 PRs</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium">Avg Resolution Time</CardDescription>
              <Clock className="size-4 text-[#78716C]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#1C1917]">4m 12s</div>
              <div className="text-xs text-[#881337] mt-1 font-medium">-35s vs last week</div>
            </CardContent>
          </Card>
        </div>

        {/* Main 2-Column Split: Active Jobs Table & Agent Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Active Jobs Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Active Jobs & Inspections</CardTitle>
                <CardDescription>Real-time autonomous tasks executing across connected repositories</CardDescription>
              </div>
              <Link href="/jobs">
                <Button variant="ghost" size="sm" className="text-xs text-[#78716C] hover:text-[#1C1917]">
                  View all <ChevronRight className="size-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {mockJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] hover:border-[#D6D3D1] hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-[#1C1917]">{job.id}</span>
                      <Badge
                        variant={
                          job.status === "fixing"
                            ? "fixing"
                            : job.status === "testing"
                            ? "testing"
                            : "default"
                        }
                      >
                        {job.statusLabel}
                      </Badge>
                      <span className="text-[11px] text-[#78716C] flex items-center gap-1 font-mono">
                        <FolderGit2 className="size-3" /> {job.repo}
                      </span>
                    </div>
                    <p className="text-xs text-[#1C1917] font-medium truncate">{job.title}</p>
                    <div className="flex items-center gap-3 text-[11px] text-[#78716C]">
                      <span className="flex items-center gap-1">
                        <Cpu className="size-3 text-[#881337]" /> {job.agent}
                      </span>
                      <span>•</span>
                      <span className="font-mono">{job.branch}</span>
                      <span>•</span>
                      <span>{job.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <Link href={`/jobs`}>
                      <Button variant="secondary" size="sm" className="text-xs">
                        Details
                      </Button>
                    </Link>
                    <Button variant="default" size="sm" className="text-xs">
                      Inspect
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right Column: AI Agents Fleet */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Autonomous Agents Fleet</CardTitle>
                <CardDescription>Live health and workload distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-1">
                {mockAgents.map((agent) => (
                  <div
                    key={agent.name}
                    className="p-3 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-[6px] bg-white border border-[#E7E5E4] flex items-center justify-center font-mono text-xs font-semibold text-[#881337] shadow-2xs">
                        {agent.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#1C1917]">{agent.name}</span>
                        <span className="text-[11px] text-[#78716C]">{agent.role}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={agent.status === "Online" ? "completed" : "testing"}
                        className="text-[10px]"
                      >
                        {agent.status}
                      </Badge>
                      <div className="text-[11px] text-[#78716C] mt-1 font-mono">
                        {agent.activeJobs} jobs
                      </div>
                    </div>
                  </div>
                ))}

                <Link href="/agents" className="block pt-1">
                  <Button variant="outline" className="w-full text-xs" size="sm">
                    Manage Agents Fleet
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Security & Code Review Approval Box */}
            <Card className="border-[#FECDD3] bg-rose-50/60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-[#881337]">
                  <ShieldCheck className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Human Review Gate
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-[#57534E] leading-relaxed">
                  2 high-impact changes generated by <span className="font-semibold text-[#1C1917]">AutoFix Engineer</span> require explicit human sign-off before merging into main.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Link href="/review" className="w-full">
                    <Button variant="default" size="sm" className="w-full text-xs">
                      Review Pull Requests
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
