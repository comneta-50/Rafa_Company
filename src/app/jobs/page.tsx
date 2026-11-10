"use client";

import React, { useState } from "react";
import {
  Terminal,
  FolderGit2,
  Cpu,
  Eye,
  FileText,
  RotateCw,
  Link2,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { AttachJobModal } from "@/components/jobs/attach-job-modal";
import { mockAgents } from "@/components/layout/sidebar";

const availableOrdersForAttach = [
  {
    id: "ORD-781",
    clientName: "PT Fintek Nusantara",
    title: "Fix Token Expiration & Race Condition in Auth Guard",
    repoUrl: "client-fintek/auth-service",
    feeAmount: "$450.00",
  },
  {
    id: "ORD-780",
    clientName: "Karya Studio Global",
    title: "Optimize PostgreSQL connection pooling under heavy load",
    repoUrl: "karya-studio/core-api",
    feeAmount: "$200.00",
  },
  {
    id: "ORD-779",
    clientName: "Logistik Pintar ID",
    title: "Hydration mismatch & buffer overflow pada batch consumer worker",
    repoUrl: "logistik-id/tracking-worker",
    feeAmount: "$350.00",
  },
];

const initialJobs = [
  {
    id: "JOB-4092",
    orderId: "ORD-781",
    repo: "comneta-50/site-ai-company",
    branch: "feat/auth-middleware",
    title: "Fix Token Expiration & Race Condition in Auth Guard",
    agent: "Analyzer Agent #04",
    status: "fixing",
    statusLabel: "Fixing",
    time: "2m ago",
    progress: 68,
    logs: [
      "Cloning repo: comneta-50/site-ai-company",
      "Scanning AST trees in src/middleware.ts",
      "Found potential race condition in token renewal loop",
      "Generating synchronized mutex lock patch...",
    ],
  },
  {
    id: "JOB-4089",
    orderId: "ORD-780",
    repo: "comneta-50/core-api-service",
    branch: "main",
    title: "Optimize PostgreSQL connection pooling under heavy load",
    agent: "Optimizer Bot",
    status: "testing",
    statusLabel: "Testing",
    time: "14m ago",
    progress: 92,
    logs: [
      "Analyzing slow query telemetry",
      "Tuned max pool connection from 10 to 35",
      "Running load test simulation: 2000 rps",
      "P99 latency down from 420ms to 48ms",
    ],
  },
  {
    id: "JOB-4085",
    orderId: "ORD-779",
    repo: "comneta-50/web-frontend",
    branch: "fix/hydration-error",
    title: "Resolve SSR hydration mismatch on localized landing route",
    agent: "CodeReviewer v2",
    status: "review",
    statusLabel: "Review",
    time: "48m ago",
    progress: 100,
    logs: [
      "Detected window !== undefined mismatch during SSR pass",
      "Applied useSyncExternalStore wrapper for client localization",
      "Passed all Jest unit tests",
    ],
  },
  {
    id: "JOB-4081",
    orderId: "ORD-775",
    repo: "comneta-50/analytics-worker",
    branch: "release/v1.2",
    title: "Patch Redis pipeline buffer overflow in batch consumer",
    agent: "Security Guard",
    status: "completed",
    statusLabel: "Completed",
    time: "2h ago",
    progress: 100,
    logs: [
      "Identified memory spike in batch consumer buffer",
      "Applied backpressure stream piping",
      "Stress test completed: 0 buffer overflow drops",
    ],
  },
  {
    id: "JOB-4078",
    orderId: "ORD-770",
    repo: "comneta-50/notification-service",
    branch: "fix/mailgun-webhook",
    title: "Replay failed webhook delivery events and patch signature verifier",
    agent: "AutoFix Engineer",
    status: "completed",
    statusLabel: "Completed",
    time: "4h ago",
    progress: 100,
    logs: [
      "Fetched failed event queue from DLQ",
      "Validated HMAC-SHA256 signature algorithm",
      "140 events successfully replayed",
    ],
  },
  {
    id: "JOB-4075",
    orderId: "ORD-768",
    repo: "comneta-50/billing-service",
    branch: "hotfix/stripe-tax-calc",
    title: "Update tax calculation logic for EU customer transactions",
    agent: "Security Guard",
    status: "failed",
    statusLabel: "Failed",
    time: "6h ago",
    progress: 45,
    logs: [
      "Triggering integration test against Stripe sandbox",
      "Error: API timeout 10000ms exceeded on remote endpoint",
      "Pipeline halted safely without mutating production",
    ],
  },
];

export default function JobsPage() {
  const [filter, setFilter] = useState("all");
  const [jobsList, setJobsList] = useState(initialJobs);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [inspectJob, setInspectJob] = useState<(typeof initialJobs)[0] | null>(null);
  const [logModalJob, setLogModalJob] = useState<(typeof initialJobs)[0] | null>(null);

  const filtered = jobsList.filter((j) => {
    if (filter === "all") return true;
    return j.status === filter;
  });

  const handleJobAttached = (orderId: string, agentName: string) => {
    const orderData = availableOrdersForAttach.find((o) => o.id === orderId);
    if (!orderData) return;

    const newJob = {
      id: `JOB-${Math.floor(4100 + Math.random() * 900)}`,
      orderId,
      repo: orderData.repoUrl,
      branch: `ai-fix/${orderId.toLowerCase()}`,
      title: orderData.title,
      agent: agentName,
      status: "fixing",
      statusLabel: "Fixing",
      time: "Just now",
      progress: 20,
      logs: [
        `Ingested from Client Order: ${orderId}`,
        `Assigned executor agent: ${agentName}`,
        `Initializing isolated runner environment...`,
      ],
    };

    setJobsList([newJob, ...jobsList]);
  };

  const handleRetryJob = (jobId: string) => {
    setJobsList((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: "fixing", statusLabel: "Fixing", progress: 15 }
          : j
      )
    );
    toast.success(`Job ${jobId} di-trigger ulang dan kembali masuk ke antrean eksekusi.`);
    setInspectJob(null);
  };

  return (
    <>
      {/* Tombol Header sekarang diubah ke "Attach Job" */}
      <Header
        actionLabel="Attach Job"
        onAction={() => setIsAttachModalOpen(true)}
      />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
              Jobs & Pipelines
            </h1>
            <p className="text-[13px] text-[#78716C] mt-1">
              Hubungkan order client ke agen AI autonomous dan pantau eksekusi antrean pipeline secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAttachModalOpen(true)}
              className="text-xs"
            >
              <Link2 className="size-3.5 mr-1" /> Attach Job ke AI
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter("all");
              toast.info("Menampilkan semua jobs");
            }}
          >
            All Jobs
          </Button>
          <Button
            variant={filter === "fixing" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter("fixing");
              toast.info("Filter: Status Fixing");
            }}
          >
            Fixing
          </Button>
          <Button
            variant={filter === "testing" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter("testing");
              toast.info("Filter: Status Testing");
            }}
          >
            Testing
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter("completed");
              toast.info("Filter: Status Completed");
            }}
          >
            Completed
          </Button>
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
                    {job.orderId && (
                      <span className="font-mono text-[11px] font-semibold text-[#881337] px-1.5 py-0.2 bg-[#FFE4E6] border border-[#FECDD3] rounded-[4px]">
                        {job.orderId}
                      </span>
                    )}
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

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="w-28 text-right hidden sm:block">
                    <div className="text-[11px] font-mono text-[#78716C] mb-1">
                      {job.progress}%
                    </div>
                    <div className="w-full bg-[#E7E5E4] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#881337] h-full rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                    onClick={() => setInspectJob(job)}
                  >
                    <Eye className="size-3 mr-1" /> Inspect
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setLogModalJob(job)}
                  >
                    <FileText className="size-3 mr-1" /> Logs
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Modal Attach Job (Pilih Order + Pilih AI) */}
      <AttachJobModal
        open={isAttachModalOpen}
        onOpenChange={setIsAttachModalOpen}
        orders={availableOrdersForAttach}
        agents={mockAgents}
        onAttached={handleJobAttached}
      />

      {/* Modal Dialog Inspect Job */}
      <Dialog open={!!inspectJob} onOpenChange={(open) => !open && setInspectJob(null)}>
        {inspectJob && (
          <DialogContent className="max-w-md rounded-[8px] p-6 bg-white border border-[#E7E5E4]">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-[#1C1917]">
                Detail Job {inspectJob.id}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#78716C]">
                {inspectJob.repo} • Branch: {inspectJob.branch}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-[#FAF9F9] rounded-[6px] border border-[#E7E5E4] space-y-1">
                <span className="text-[#78716C] block text-[11px]">Tugas:</span>
                <p className="font-semibold text-[#1C1917]">{inspectJob.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-[#FAF9F9] rounded-[6px] border border-[#E7E5E4]">
                  <span className="text-[#78716C] block text-[10px]">Agen Penanggung Jawab</span>
                  <span className="font-semibold text-[#881337]">{inspectJob.agent}</span>
                </div>
                <div className="p-2.5 bg-[#FAF9F9] rounded-[6px] border border-[#E7E5E4]">
                  <span className="text-[#78716C] block text-[10px]">Progress Selesai</span>
                  <span className="font-semibold text-emerald-700">{inspectJob.progress}%</span>
                </div>
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
                onClick={() => handleRetryJob(inspectJob.id)}
              >
                <RotateCw className="size-3.5 mr-1" /> Trigger Ulang
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Modal Dialog Log Output */}
      <Dialog open={!!logModalJob} onOpenChange={(open) => !open && setLogModalJob(null)}>
        {logModalJob && (
          <DialogContent className="max-w-lg rounded-[8px] p-6 bg-white border border-[#E7E5E4]">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-[#1C1917]">
                Live Terminal Logs: {logModalJob.id}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#78716C]">
                Output eksekusi container worker untuk {logModalJob.repo}
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-[#1C1917] text-white font-mono text-xs rounded-[6px] space-y-1.5 max-h-60 overflow-y-auto">
              {logModalJob.logs.map((line, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-[#78716C] select-none">{idx + 1}</span>
                  <span className={idx === logModalJob.logs.length - 1 ? "text-emerald-400" : "text-stone-300"}>
                    {line}
                  </span>
                </div>
              ))}
            </div>

            <DialogFooter className="pt-3 flex justify-end">
              <Button
                variant="default"
                size="sm"
                onClick={() => setLogModalJob(null)}
              >
                Selesai
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
