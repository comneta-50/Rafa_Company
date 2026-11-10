"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { workerApi } from "@/lib/api";
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
  Eye,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DashboardMetric {
  activeJobsCount: number;
  inProgressCount: number;
  onlineAgentsCount: number;
  totalAgentsCount: number;
  successRate: string;
  successRateSubtitle: string;
  avgResolutionTime: string;
  resolutionDelta: string;
  clusterHealth: string;
  latency: string;
}

export default function DashboardPage() {
  const [promptInput, setPromptInput] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetric | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inspectJob, setInspectJob] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    workerApi
      .getDashboardData()
      .then((data) => {
        setJobs(data.recentJobs || []);
        setAgents(data.agentsFleet || []);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      })
      .catch((err) => {
        console.warn("Failed to load dashboard data from worker:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleRunAgentFix = async () => {
    if (!promptInput.trim()) {
      toast.error("Silakan ketik instruksi tugas atau perbaikan bug.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Mengirim tugas ke Workers AI cluster...");

    try {
      const res = await workerApi.createJob({
        title: promptInput,
        repo: "comneta-50/site-ai-company",
        agent: "AutoFix Engineer",
      });

      if (res && res.job) {
        setJobs((prev) => [res.job, ...prev]);
        toast.success(`Agent Fix berhasil dijalankan: "${promptInput}"`, { id: toastId });
      } else {
        toast.success(`Agent Fix berhasil dijadwalkan!`, { id: toastId });
      }

      setPromptInput("");
    } catch (err: any) {
      toast.error(`Gagal menghubungkan ke backend: ${err.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInspect = (job: any) => {
    setInspectJob(job);
  };

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
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </>
            ) : (
              <>
                <Badge variant="default" className="px-3 py-1">
                  <span className="size-1.5 rounded-full bg-[#881337] animate-pulse" />
                  {metrics?.clusterHealth || "Cluster Healthy"}
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 font-mono">
                  Lat: {metrics?.latency || "24ms"}
                </Badge>
              </>
            )}
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
              onKeyDown={(e) => e.key === "Enter" && handleRunAgentFix()}
              placeholder="Give an instruction, e.g: 'Analyze branch feat/billing and fix memory leaks'..."
              className="bg-white border-[#E7E5E4] text-xs h-9.5 rounded-[6px] flex-1 text-[#1C1917] placeholder:text-[#A8A29E]"
            />
            <Button
              variant="default"
              size="sm"
              disabled={isSubmitting}
              onClick={handleRunAgentFix}
              className="shrink-0"
            >
              <Play className="size-3.5 mr-1 fill-white" /> {isSubmitting ? "Dispatching..." : "Run Agent Fix"}
            </Button>
          </CardContent>
        </Card>

        {/* Metric Statistics Cards (Shimmer Loading atau Real Data) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Jobs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium">Active Jobs</CardDescription>
              <Terminal className="size-4 text-[#78716C]" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold font-mono tracking-tight text-[#1C1917]">
                    {metrics?.activeJobsCount ?? jobs.length}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#881337] mt-1 font-medium">
                    <ArrowUpRight className="size-3" />
                    <span>{metrics?.inProgressCount ?? 0} in-progress execution</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Card 2: AI Agents Online */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium">AI Agents Online</CardDescription>
              <Bot className="size-4 text-[#881337]" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-28" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold font-mono tracking-tight text-[#1C1917]">
                    {metrics ? `${metrics.onlineAgentsCount} / ${metrics.totalAgentsCount}` : `${agents.length} / ${agents.length}`}
                  </div>
                  <div className="text-xs text-[#78716C] mt-1">
                    {agents.length > 0 ? "Ready for task allocation" : "Cluster idle"}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Success Rate */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium">Success Rate</CardDescription>
              <CheckCircle2 className="size-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold font-mono tracking-tight text-[#1C1917]">
                    {metrics?.successRate || "100%"}
                  </div>
                  <div className="text-xs text-[#78716C] mt-1">
                    {metrics?.successRateSubtitle || "Verified pipelines"}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Card 4: Avg Resolution Time */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-medium">Avg Resolution Time</CardDescription>
              <Clock className="size-4 text-[#78716C]" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-28" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold font-mono tracking-tight text-[#1C1917]">
                    {metrics?.avgResolutionTime || "0m 00s"}
                  </div>
                  <div className="text-xs text-[#881337] mt-1 font-medium">
                    {metrics?.resolutionDelta || "Normal load"}
                  </div>
                </>
              )}
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
              {isLoading ? (
                // Shimmer Skeleton Rows
                [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-14 rounded-full" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                      <Skeleton className="h-4 w-4/5" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Skeleton className="h-8 w-16 rounded-[6px]" />
                      <Skeleton className="h-8 w-20 rounded-[6px]" />
                    </div>
                  </div>
                ))
              ) : jobs.length === 0 ? (
                // Empty State jika belum ada jobs
                <div className="py-12 px-4 text-center rounded-[6px] bg-[#FAF9F9] border border-dashed border-[#E7E5E4] space-y-3">
                  <div className="size-10 rounded-full bg-white border border-[#E7E5E4] flex items-center justify-center mx-auto text-[#78716C] shadow-2xs">
                    <Inbox className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1C1917]">Belum ada active jobs</h3>
                    <p className="text-xs text-[#78716C] max-w-sm mx-auto mt-1">
                      Ketik instruksi perbaikan bug pada kolom AI Dispatch di atas untuk memulai eksekusi agen.
                    </p>
                  </div>
                </div>
              ) : (
                jobs.map((job) => (
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
                          {job.statusLabel || job.status}
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
                      <Link href="/jobs">
                        <Button variant="secondary" size="sm" className="text-xs">
                          Details
                        </Button>
                      </Link>
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleInspect(job)}
                      >
                        <Eye className="size-3 mr-1" /> Inspect
                      </Button>
                    </div>
                  </div>
                ))
              )}
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
                {isLoading ? (
                  // Shimmer Skeleton Agents
                  [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-3 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-8 rounded-[6px]" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-24" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                  ))
                ) : agents.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#78716C] bg-[#FAF9F9] rounded-[6px] border border-dashed border-[#E7E5E4]">
                    Belum ada AI agent yang ter-deploy.
                  </div>
                ) : (
                  agents.map((agent) => (
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
                  ))
                )}

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
                  Automated pull requests generated by AI agents require explicit human sign-off before merging into main.
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

      {/* Modal Dialog Inspeksi Job */}
      <Dialog open={!!inspectJob} onOpenChange={(open) => !open && setInspectJob(null)}>
        {inspectJob && (
          <DialogContent className="max-w-lg rounded-[8px] p-6 bg-white border border-[#E7E5E4]">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="default">{inspectJob.id}</Badge>
                <span className="text-xs text-[#78716C] font-mono">{inspectJob.repo}</span>
              </div>
              <DialogTitle className="text-base font-semibold text-[#1C1917]">
                {inspectJob.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#78716C]">
                Agent bertugas: {inspectJob.agent} • Branch: {inspectJob.branch}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-3 text-xs">
              <div className="p-3 bg-[#FAF9F9] rounded-[6px] border border-[#E7E5E4] space-y-1.5 font-mono">
                <div className="text-[11px] text-[#78716C]">$ git fetch origin && ast-analyzer --target .</div>
                <div className="text-emerald-700">✓ Parsed 24 AST nodes successfully</div>
                <div className="text-[#1C1917]">✓ Generated differential patch in src/middleware.ts</div>
                <div className="text-[#881337]">... Running test suite regression tests ({inspectJob.progress}%)</div>
              </div>
            </div>

            <DialogFooter className="pt-3 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectJob(null)}
              >
                Tutup
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  toast.success(`Job ${inspectJob.id} berhasil di-trigger ulang!`);
                  setInspectJob(null);
                }}
              >
                Trigger Ulang
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
