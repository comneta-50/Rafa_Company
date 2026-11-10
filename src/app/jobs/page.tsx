"use client";

import React, { useState, useEffect } from "react";
import { workerApi } from "@/lib/api";
import {
  Terminal,
  FolderGit2,
  Cpu,
  Eye,
  FileText,
  RotateCw,
  Link2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

interface JobItem {
  id: string;
  orderId?: string;
  repo: string;
  branch?: string;
  title: string;
  agent: string;
  status: string;
  statusLabel?: string;
  time?: string;
  progress: number;
  logs?: string[];
}

export default function JobsPage() {
  const [filter, setFilter] = useState("all");
  const [jobsList, setJobsList] = useState<JobItem[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [agentsList, setAgentsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [inspectJob, setInspectJob] = useState<JobItem | null>(null);
  const [logModalJob, setLogModalJob] = useState<JobItem | null>(null);

  const fetchData = async () => {
    try {
      const [jobsData, ordersData, agentsData] = await Promise.all([
        workerApi.getJobs().catch(() => []),
        workerApi.getOrders().catch(() => []),
        workerApi.getAgents().catch(() => []),
      ]);

      if (Array.isArray(jobsData)) setJobsList(jobsData);
      if (Array.isArray(ordersData)) {
        setOrdersList(
          ordersData.map((o: any) => ({
            id: o.id,
            clientName: o.clientName || o.clientRef || "Client",
            title: o.bugDescription || "Bug fix task",
            repoUrl: o.repoUrl || "org/repo",
            feeAmount: o.feeAmount || "$250.00",
          }))
        );
      }
      if (Array.isArray(agentsData)) setAgentsList(agentsData);
    } catch (err: any) {
      console.warn("Failed to fetch jobs data:", err);
      toast.error("Gagal memuat antrean jobs dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = jobsList.filter((j) => {
    if (filter === "all") return true;
    return j.status === filter;
  });

  const handleJobAttached = async (orderId: string, agentName: string) => {
    const orderData = ordersList.find((o) => o.id === orderId);
    if (!orderData) return;

    const toastId = toast.loading("Meng-attach job ke antrean backend...");
    try {
      const res = await workerApi.createJob({
        orderId,
        repo: orderData.repoUrl,
        title: orderData.title,
        agent: agentName,
      });

      if (res && res.job) {
        setJobsList((prev) => [res.job, ...prev]);
        toast.success(`Job berhasil di-attach dan dialokasikan ke ${agentName}!`, { id: toastId });
      } else {
        await fetchData();
        toast.success(`Job berhasil di-attach!`, { id: toastId });
      }
    } catch (err: any) {
      toast.error(`Gagal meng-attach job: ${err.message}`, { id: toastId });
    }
  };

  const handleRetryJob = async (jobId: string) => {
    const toastId = toast.loading(`Memicu ulang eksekusi job ${jobId}...`);
    try {
      const res = await workerApi.retryJob(jobId);
      if (res && res.job) {
        setJobsList((prev) => prev.map((j) => (j.id === jobId ? res.job : j)));
      } else {
        await fetchData();
      }
      toast.success(`Job ${jobId} di-trigger ulang dan kembali masuk ke antrean eksekusi.`, {
        id: toastId,
      });
      setInspectJob(null);
    } catch (err: any) {
      toast.error(`Gagal me-retry job: ${err.message}`, { id: toastId });
    }
  };

  const activeFixingCount = jobsList.filter((j) => j.status === "fixing").length;
  const testingCount = jobsList.filter((j) => j.status === "testing").length;
  const completedCount = jobsList.filter((j) => j.status === "completed").length;
  const failedCount = jobsList.filter((j) => j.status === "failed").length;

  return (
    <>
      <Header
        actionLabel="Attach Job"
        onAction={() => setIsAttachModalOpen(true)}
      />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-[#881337] flex items-center justify-center text-white shadow-xs">
                <Terminal className="size-4" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
                Jobs & Execution Pipelines
              </h1>
            </div>
            <p className="text-[13px] text-[#78716C] mt-1.5">
              Hubungkan order client ke agen AI autonomous dan pantau eksekusi antrean pipeline secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsLoading(true);
                fetchData();
              }}
              disabled={isLoading}
              className="text-xs"
            >
              <RefreshCw className={`size-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
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

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider block">
                  Total Jobs
                </span>
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mt-1" />
                ) : (
                  <span className="text-xl font-bold font-mono text-[#1C1917] mt-0.5 block">
                    {jobsList.length}
                  </span>
                )}
              </div>
              <div className="size-9 rounded-md bg-[#FAF9F9] border border-[#E7E5E4] flex items-center justify-center text-[#881337]">
                <Terminal className="size-4" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider block">
                  Active Fixing
                </span>
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mt-1" />
                ) : (
                  <span className="text-xl font-bold font-mono text-amber-700 mt-0.5 block">
                    {activeFixingCount}
                  </span>
                )}
              </div>
              <div className="size-9 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <PlayCircle className="size-4 animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider block">
                  Completed & Verified
                </span>
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mt-1" />
                ) : (
                  <span className="text-xl font-bold font-mono text-emerald-700 mt-0.5 block">
                    {completedCount}
                  </span>
                )}
              </div>
              <div className="size-9 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="size-4" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider block">
                  Failed Pipeline
                </span>
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mt-1" />
                ) : (
                  <span className="text-xl font-bold font-mono text-rose-700 mt-0.5 block">
                    {failedCount}
                  </span>
                )}
              </div>
              <div className="size-9 rounded-md bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <AlertTriangle className="size-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Jobs ({jobsList.length})
          </Button>
          <Button
            variant={filter === "fixing" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("fixing")}
          >
            Fixing ({activeFixingCount})
          </Button>
          <Button
            variant={filter === "testing" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("testing")}
          >
            Testing ({testingCount})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed ({completedCount})
          </Button>
        </div>

        {/* Shimmer Loading List */}
        {isLoading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-64 mt-1" />
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-24 rounded-[6px]" />
                    <Skeleton className="h-8 w-20 rounded-[6px]" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
          <div className="border border-dashed border-[#E7E5E4] rounded-xl p-12 bg-white flex flex-col items-center justify-center text-center space-y-3">
            <div className="size-12 rounded-xl bg-[#FAF9F9] border border-[#E7E5E4] flex items-center justify-center text-[#78716C]">
              <Terminal className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1C1917]">
                {filter === "all" ? "Belum ada job yang berjalan" : `Tidak ada job dengan status "${filter}"`}
              </h3>
              <p className="text-xs text-[#78716C] max-w-sm mt-1">
                Attach order client ke AI Agent untuk memulai pipeline otomatisasi perbaikan kode dan pembuatan test.
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAttachModalOpen(true)}
              className="mt-2 text-xs"
            >
              <Link2 className="size-3.5 mr-1.5" /> Attach Job Sekarang
            </Button>
          </div>
        )}

        {/* Real Dynamic Jobs List */}
        {!isLoading && filtered.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Execution Queue</CardTitle>
              <CardDescription>
                Menampilkan {filtered.length} tasks dalam antrean eksekusi
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
                        {job.statusLabel || job.status}
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
                      {job.branch && (
                        <>
                          <span>•</span>
                          <span className="font-mono">{job.branch}</span>
                        </>
                      )}
                      {job.time && (
                        <>
                          <span>•</span>
                          <span>{job.time}</span>
                        </>
                      )}
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
        )}
      </div>

      {/* Modal Attach Job (Pilih Order + Pilih AI) */}
      <AttachJobModal
        open={isAttachModalOpen}
        onOpenChange={setIsAttachModalOpen}
        orders={ordersList}
        agents={agentsList}
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
                {inspectJob.repo} {inspectJob.branch ? `• Branch: ${inspectJob.branch}` : ""}
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
              {logModalJob.logs && logModalJob.logs.length > 0 ? (
                logModalJob.logs.map((line, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-[#78716C] select-none">{idx + 1}</span>
                    <span className={idx === (logModalJob.logs?.length || 1) - 1 ? "text-emerald-400" : "text-stone-300"}>
                      {line}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-stone-400 py-3 text-center">
                  Tidak ada output logs yang tersimpan untuk job ini.
                </div>
              )}
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
