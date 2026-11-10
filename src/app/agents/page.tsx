"use client";

import React, { useState, useEffect } from "react";
import { workerApi } from "@/lib/api";
import {
  Bot,
  Plus,
  Play,
  Settings2,
  Check,
  Cpu,
  Activity,
  Layers,
  Sparkles,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface AgentItem {
  name: string;
  role: string;
  status: string;
  activeJobs: number;
  efficiency: string;
  avatar: string;
}

export default function AgentsPage() {
  const [agentsList, setAgentsList] = useState<AgentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentRole, setNewAgentRole] = useState("");
  const [activeConfigAgent, setActiveConfigAgent] = useState<AgentItem | null>(null);
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("Online");

  const fetchAgents = async () => {
    try {
      const data = await workerApi.getAgents();
      if (Array.isArray(data)) {
        setAgentsList(data);
      }
    } catch (err: any) {
      console.warn("Failed to fetch agents from worker:", err);
      toast.error("Gagal memuat daftar AI Agents dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDeployAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim() || !newAgentRole.trim()) {
      toast.error("Silakan isi nama dan peran agen.");
      return;
    }

    const toastId = toast.loading("Mendeploy agent ke cluster backend...");
    try {
      const res = await workerApi.createAgent({
        name: newAgentName.trim(),
        role: newAgentRole.trim(),
      });

      if (res && res.agent) {
        setAgentsList((prev) => [res.agent, ...prev]);
      } else {
        await fetchAgents();
      }
      toast.success(`Agent "${newAgentName}" berhasil di-deploy ke cluster!`, { id: toastId });
      setNewAgentName("");
      setNewAgentRole("");
      setIsDeployModalOpen(false);
    } catch (err: any) {
      toast.error(`Gagal mendeploy agent: ${err.message}`, { id: toastId });
    }
  };

  const handleDispatchJob = async (agentName: string) => {
    const toastId = toast.loading(`Mengirim instant task ke ${agentName}...`);
    try {
      const res = await workerApi.dispatchAgentJob(agentName);
      if (res && res.agent) {
        setAgentsList((prev) =>
          prev.map((a) => (a.name.toLowerCase() === agentName.toLowerCase() ? res.agent : a))
        );
      } else {
        await fetchAgents();
      }
      toast.success(`Job instan terkirim! ${agentName} sedang menganalisis pipeline.`, {
        id: toastId,
      });
    } catch (err: any) {
      toast.error(`Gagal mengirim task: ${err.message}`, { id: toastId });
    }
  };

  const handleSaveConfig = async () => {
    if (!activeConfigAgent) return;
    const toastId = toast.loading(`Menyimpan konfigurasi ${activeConfigAgent.name}...`);
    try {
      await workerApi.updateAgent(activeConfigAgent.name, {
        role: editRole.trim() || activeConfigAgent.role,
        status: editStatus,
      });
      setAgentsList((prev) =>
        prev.map((a) =>
          a.name === activeConfigAgent.name
            ? { ...a, role: editRole.trim() || a.role, status: editStatus }
            : a
        )
      );
      toast.success(`Konfigurasi untuk ${activeConfigAgent.name} disimpan!`, { id: toastId });
      setActiveConfigAgent(null);
    } catch (err: any) {
      toast.error(`Gagal menyimpan konfigurasi: ${err.message}`, { id: toastId });
    }
  };

  const handleDeleteAgent = async (agentName: string) => {
    if (!confirm(`Hapus agen "${agentName}" dari cluster?`)) return;
    const toastId = toast.loading(`Menonaktifkan agen ${agentName}...`);
    try {
      await workerApi.deleteAgent(agentName);
      setAgentsList((prev) => prev.filter((a) => a.name !== agentName));
      toast.success(`Agent ${agentName} dinonaktifkan dari cluster.`, { id: toastId });
      setActiveConfigAgent(null);
    } catch (err: any) {
      toast.error(`Gagal menghapus agent: ${err.message}`, { id: toastId });
    }
  };

  const onlineCount = agentsList.filter((a) => a.status === "Online").length;
  const busyCount = agentsList.filter((a) => a.status === "Busy").length;
  const queuedJobsTotal = agentsList.reduce((acc, a) => acc + (a.activeJobs || 0), 0);

  return (
    <>
      <Header
        actionLabel="Deploy Agent"
        onAction={() => {
          setNewAgentName("");
          setNewAgentRole("");
          setIsDeployModalOpen(true);
        }}
      />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-[#881337] flex items-center justify-center text-white shadow-xs">
                <Bot className="size-4" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
                Autonomous AI Agents Fleet
              </h1>
            </div>
            <p className="text-[13px] text-[#78716C] mt-1.5">
              Kelola, monitor performa inferensi, dan jadwalkan armada autonomous AI agents di cluster produksi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsLoading(true);
                fetchAgents();
              }}
              disabled={isLoading}
              className="text-xs"
            >
              <RefreshCw className={`size-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Badge variant="default" className="px-3 py-1 font-mono text-xs">
              <span className="size-1.5 rounded-full bg-[#881337] animate-pulse mr-1.5" />
              {isLoading ? "Loading..." : `${agentsList.length} Active Agents`}
            </Badge>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider block">
                  Total Fleet
                </span>
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mt-1" />
                ) : (
                  <span className="text-xl font-bold font-mono text-[#1C1917] mt-0.5 block">
                    {agentsList.length}
                  </span>
                )}
              </div>
              <div className="size-9 rounded-md bg-[#FAF9F9] border border-[#E7E5E4] flex items-center justify-center text-[#881337]">
                <Layers className="size-4" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider block">
                  Online Standby
                </span>
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mt-1" />
                ) : (
                  <span className="text-xl font-bold font-mono text-emerald-700 mt-0.5 block">
                    {onlineCount}
                  </span>
                )}
              </div>
              <div className="size-9 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider block">
                  Executing Pipeline
                </span>
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mt-1" />
                ) : (
                  <span className="text-xl font-bold font-mono text-amber-700 mt-0.5 block">
                    {busyCount}
                  </span>
                )}
              </div>
              <div className="size-9 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Activity className="size-4" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider block">
                  Dispatched Tasks
                </span>
                {isLoading ? (
                  <Skeleton className="h-7 w-12 mt-1" />
                ) : (
                  <span className="text-xl font-bold font-mono text-[#881337] mt-0.5 block">
                    {queuedJobsTotal}
                  </span>
                )}
              </div>
              <div className="size-9 rounded-md bg-[#FFE4E6] border border-[#FECDD3] flex items-center justify-center text-[#881337]">
                <Cpu className="size-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shimmer Loading Grid */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-[6px]" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-44" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16 rounded-[4px]" />
                </div>
                <Skeleton className="h-14 w-full rounded-[6px]" />
                <div className="flex gap-2 pt-2 border-t border-[#E7E5E4]">
                  <Skeleton className="h-8 flex-1 rounded-[6px]" />
                  <Skeleton className="h-8 flex-1 rounded-[6px]" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && agentsList.length === 0 && (
          <div className="border border-dashed border-[#E7E5E4] rounded-xl p-12 bg-white flex flex-col items-center justify-center text-center space-y-3">
            <div className="size-12 rounded-xl bg-[#FAF9F9] border border-[#E7E5E4] flex items-center justify-center text-[#78716C]">
              <Bot className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1C1917]">Belum ada AI Agent terdaftar</h3>
              <p className="text-xs text-[#78716C] max-w-sm mt-1">
                Deploy agen AI spesialis pertama Anda untuk mulai mengotomatiskan analisis bug, code review, dan fixing pipeline.
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setNewAgentName("");
                setNewAgentRole("");
                setIsDeployModalOpen(true);
              }}
              className="mt-2 text-xs"
            >
              <Plus className="size-3.5 mr-1.5" /> Deploy Agent Sekarang
            </Button>
          </div>
        )}

        {/* Real Dynamic Agents Grid */}
        {!isLoading && agentsList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agentsList.map((agent) => {
              const isOnline = agent.status === "Online";
              const isBusy = agent.status === "Busy";

              return (
                <Card key={agent.name} className="flex flex-col justify-between hover:shadow-xs transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-10 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] flex items-center justify-center font-mono font-bold text-sm text-[#881337] shadow-2xs shrink-0">
                          {agent.avatar || "AI"}
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-base truncate">{agent.name}</CardTitle>
                          <CardDescription className="line-clamp-1 mt-0.5 text-xs text-[#78716C]">
                            {agent.role}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#FAF9F9] border border-[#E7E5E4] px-2 py-0.5 rounded-[4px] shrink-0">
                        <span className="relative flex size-2">
                          <span
                            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                              isBusy
                                ? "bg-amber-400 animate-ping"
                                : isOnline
                                ? "bg-emerald-400 animate-ping"
                                : "bg-neutral-300"
                            }`}
                          />
                          <span
                            className={`relative inline-flex size-2 rounded-full ${
                              isBusy
                                ? "bg-amber-500"
                                : isOnline
                                ? "bg-emerald-500"
                                : "bg-neutral-400"
                            }`}
                          />
                        </span>
                        <span className="text-[11px] font-mono text-[#57534E]">
                          {agent.status}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF9F9] border border-[#E7E5E4] rounded-[6px] text-xs">
                      <div>
                        <span className="text-[#78716C] block text-[11px]">Active Jobs</span>
                        <span className="font-mono font-semibold text-[#1C1917] text-sm">
                          {agent.activeJobs || 0} queued
                        </span>
                      </div>
                      <div>
                        <span className="text-[#78716C] block text-[11px]">Precision Rate</span>
                        <span className="font-mono font-semibold text-emerald-700 text-sm">
                          {agent.efficiency || "99.4%"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#E7E5E4]">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => {
                          setActiveConfigAgent(agent);
                          setEditRole(agent.role);
                          setEditStatus(agent.status);
                        }}
                      >
                        <Settings2 className="size-3.5 mr-1" /> Configure
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => handleDispatchJob(agent.name)}
                      >
                        <Play className="size-3 mr-1" /> Dispatch Job
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Deploy Agent Baru */}
      <Dialog open={isDeployModalOpen} onOpenChange={setIsDeployModalOpen}>
        <DialogContent className="max-w-md rounded-[8px] p-6 bg-white border border-[#E7E5E4]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#1C1917]">
              Deploy Custom AI Agent
            </DialogTitle>
            <DialogDescription className="text-xs text-[#78716C]">
              Inisialisasi bot agen baru dengan persona khusus untuk cluster Anda.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDeployAgent} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                Nama Agent
              </label>
              <Input
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                placeholder="Contoh: Database Migration Auditor"
                className="bg-[#FAF9F9] text-xs h-9 rounded-[6px]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                Peran & Spesialisasi
              </label>
              <Input
                value={newAgentRole}
                onChange={(e) => setNewAgentRole(e.target.value)}
                placeholder="Contoh: Prisma schema validation & SQL performance"
                className="bg-[#FAF9F9] text-xs h-9 rounded-[6px]"
              />
            </div>

            <DialogFooter className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDeployModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="default" size="sm">
                Deploy Agent
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Konfigurasi Agent */}
      <Dialog
        open={!!activeConfigAgent}
        onOpenChange={(open) => !open && setActiveConfigAgent(null)}
      >
        {activeConfigAgent && (
          <DialogContent className="max-w-md rounded-[8px] p-6 bg-white border border-[#E7E5E4]">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-[#1C1917]">
                Konfigurasi {activeConfigAgent.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#78716C]">
                Sesuaikan spesialisasi, status cluster, atau hapus agen dari armada.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                  Peran & Spesialisasi
                </label>
                <Input
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="bg-[#FAF9F9] text-xs h-9 rounded-[6px]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                  Status Operasional
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full text-xs h-9 px-3 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4]"
                >
                  <option value="Online">Online (Ready for tasks)</option>
                  <option value="Busy">Busy (Running pipelines)</option>
                  <option value="Offline">Offline (Paused)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-[#E7E5E4]">
                <button
                  type="button"
                  onClick={() => handleDeleteAgent(activeConfigAgent.name)}
                  className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <Trash2 className="size-3.5" /> Hapus agen dari cluster
                </button>
              </div>
            </div>

            <DialogFooter className="pt-3 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveConfigAgent(null)}
              >
                Tutup
              </Button>
              <Button variant="default" size="sm" onClick={handleSaveConfig}>
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
