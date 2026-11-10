"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Bot,
  Terminal,
  Activity,
  GitBranch,
  ShieldCheck,
  Settings,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Search,
  Bell,
  Cpu,
  RefreshCw,
  FolderGit2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "jobs", label: "Jobs", icon: Terminal, count: 4 },
  { id: "agents", label: "AI Agents", icon: Bot },
  { id: "activity", label: "Activity Logs", icon: Activity },
  { id: "github", label: "GitHub Integration", icon: GitBranch },
  { id: "review", label: "Code Review", icon: ShieldCheck, badge: "2 New" },
  { id: "settings", label: "Settings", icon: Settings },
];

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

const mockAgents = [
  {
    name: "AI Code Reviewer",
    role: "Static analysis & AST audit",
    status: "Online",
    activeJobs: 3,
    efficiency: "99.4%",
    avatar: "CR",
  },
  {
    name: "AutoFix Engineer",
    role: "Automated patch generation",
    status: "Busy",
    activeJobs: 5,
    efficiency: "96.8%",
    avatar: "AF",
  },
  {
    name: "Test Runner Bot",
    role: "End-to-End & regression suite",
    status: "Online",
    activeJobs: 1,
    efficiency: "99.9%",
    avatar: "TR",
  },
];

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [promptInput, setPromptInput] = useState("");

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F6] text-[#1C1917]">
      {/* Sidebar - Maroon Palette: White background, border #E7E5E4 */}
      <aside className="w-60 shrink-0 border-r border-[#E7E5E4] bg-white flex flex-col h-screen overflow-y-auto p-3.5 scrollbar-thin shadow-2xs">
        <div className="space-y-6 flex-1">
          {/* Workspace Brand / Header */}
          <div className="flex items-center gap-2.5 px-2.5 py-2 sticky top-0 bg-white z-10 pb-2">
            <div className="flex size-7 items-center justify-center rounded-[6px] bg-[#881337] text-white font-bold text-sm tracking-wider shadow-xs">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-[#1C1917] leading-none">
                RAFA Company
              </span>
              <span className="text-[11px] text-[#78716C] mt-1 font-mono">
                AI Workspace v1.0
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-2.5 pb-2 text-[11px] font-medium uppercase tracking-wider text-[#A8A29E]">
              Platform
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex w-full items-center justify-between px-3 py-2 rounded-[6px] text-[13px] font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-[#FFE4E6] text-[#881337] font-semibold border border-[#FECDD3]"
                      : "text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F6]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`size-4 ${isActive ? "text-[#881337]" : "text-[#78716C]"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="default" className="text-[10px] py-0 px-1.5 h-4">
                      {item.badge}
                    </Badge>
                  )}
                  {item.count !== undefined && (
                    <span className="text-[11px] text-[#78716C] font-mono tabular-nums">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account & Status Footer */}
        <div className="border-t border-[#E7E5E4] pt-3.5 px-1 space-y-3 mt-4 shrink-0">
          <div className="rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#78716C] font-medium">Neurons Quota</span>
              <span className="text-[#881337] font-mono font-medium">84,200</span>
            </div>
            <div className="w-full bg-[#E7E5E4] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#881337] h-full rounded-full" style={{ width: "68%" }} />
            </div>
          </div>

          <div className="flex items-center justify-between px-1.5">
            <div className="flex items-center gap-2.5">
              <Avatar className="size-8 rounded-[6px] border border-[#E7E5E4]">
                <AvatarFallback className="rounded-[6px] bg-[#F5F5F6] text-xs font-semibold text-[#1C1917]">
                  RC
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-xs font-medium text-[#1C1917]">Smurfish</span>
                <span className="text-[11px] text-[#78716C]">Admin</span>
              </div>
            </div>
            <div className="size-2 rounded-full bg-[#881337]" title="System operational" />
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Topbar (60px high) */}
        <header className="h-[60px] border-b border-[#E7E5E4] bg-white/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-7">
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
            <Button variant="default" size="sm">
              <Plus className="size-3.5 mr-1" /> Create Job
            </Button>
          </div>
        </header>

        {/* Content Container */}
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
                <Button variant="ghost" size="sm" className="text-xs text-[#78716C] hover:text-[#1C1917]">
                  View all <ChevronRight className="size-3 ml-1" />
                </Button>
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
                              : job.status === "review"
                              ? "review"
                              : "completed"
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
                      <Button variant="secondary" size="sm" className="text-xs">
                        Details
                      </Button>
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

                  <Button variant="outline" className="w-full text-xs mt-2" size="sm">
                    <Plus className="size-3.5 mr-1" /> Deploy Custom Agent
                  </Button>
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
                    <Button variant="default" size="sm" className="w-full text-xs">
                      Review Pull Requests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
