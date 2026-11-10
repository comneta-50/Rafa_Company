"use client";

import React, { useState } from "react";
import {
  Bot,
  Plus,
  Play,
  Settings2,
  Check,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockAgents } from "@/components/layout/sidebar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const initialAgents = [
  ...mockAgents,
  {
    name: "Security Guard",
    role: "Dependency & secret scanning audit",
    status: "Online",
    activeJobs: 0,
    efficiency: "99.8%",
    avatar: "SG",
  },
  {
    name: "Docstring Writer",
    role: "Automated API & TSDoc generation",
    status: "Online",
    activeJobs: 1,
    efficiency: "97.5%",
    avatar: "DW",
  },
  {
    name: "Performance Profiler",
    role: "Memory & CPU footprint analyzer",
    status: "Busy",
    activeJobs: 2,
    efficiency: "98.2%",
    avatar: "PP",
  },
];

export default function AgentsPage() {
  const [agentsList, setAgentsList] = useState(initialAgents);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentRole, setNewAgentRole] = useState("");
  const [activeConfigAgent, setActiveConfigAgent] = useState<(typeof initialAgents)[0] | null>(null);

  const handleDeployAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim() || !newAgentRole.trim()) {
      toast.error("Silakan isi nama dan peran agen.");
      return;
    }
    const initials = newAgentName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const created = {
      name: newAgentName,
      role: newAgentRole,
      status: "Online",
      activeJobs: 0,
      efficiency: "99.9%",
      avatar: initials || "AI",
    };

    setAgentsList([...agentsList, created]);
    toast.success(`Agent "${newAgentName}" berhasil di-deploy ke cluster!`);
    setNewAgentName("");
    setNewAgentRole("");
    setIsDeployModalOpen(false);
  };

  const handleDispatchJob = (agentName: string) => {
    toast.success(`Job instan dikirim ke ${agentName}. Agent sedang menganalisis pipeline...`);
  };

  return (
    <>
      <Header actionLabel="Deploy Agent" onAction={() => setIsDeployModalOpen(true)} />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
              Autonomous AI Agents
            </h1>
            <p className="text-[13px] text-[#78716C] mt-1">
              Configure, scale, and monitor specialized AI agents assigned to your codebases.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="px-3 py-1">
              <span className="size-1.5 rounded-full bg-[#881337] animate-pulse" />
              {agentsList.length} Agents Configured
            </Badge>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agentsList.map((agent) => {
            const isOnline = agent.status === "Online";

            return (
              <Card key={agent.name} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] flex items-center justify-center font-mono font-bold text-sm text-[#881337] shadow-2xs">
                        {agent.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                        <CardDescription className="line-clamp-1 mt-0.5">
                          {agent.role}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#FAF9F9] border border-[#E7E5E4] px-2 py-0.5 rounded-[4px]">
                      <span className="relative flex size-2">
                        <span
                          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                            isOnline ? "bg-emerald-400" : "bg-amber-400"
                          }`}
                        />
                        <span
                          className={`relative inline-flex size-2 rounded-full ${
                            isOnline ? "bg-emerald-500" : "bg-amber-500"
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
                        {agent.activeJobs} queued
                      </span>
                    </div>
                    <div>
                      <span className="text-[#78716C] block text-[11px]">Precision Rate</span>
                      <span className="font-mono font-semibold text-emerald-700 text-sm">
                        {agent.efficiency}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#E7E5E4]">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setActiveConfigAgent(agent)}
                    >
                      <Settings2 className="size-3.5 mr-1" /> Configure
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleDispatchJob(agent.name)}
                    >
                      Dispatch Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal Deploy Agent Baru */}
      <Dialog open={isDeployModalOpen} onOpenChange={setIsDeployModalOpen}>
        <DialogContent className="max-w-md rounded-[8px] p-6 bg-white border border-[#E7E5E4]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#1C1917]">
              Deploy Custom AI Agent
            </DialogTitle>
            <DialogDescription className="text-xs text-[#78716C]">
              Inisialisasi bot agen baru dengan persona khusus untuk codebase Anda.
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
      <Dialog open={!!activeConfigAgent} onOpenChange={(open) => !open && setActiveConfigAgent(null)}>
        {activeConfigAgent && (
          <DialogContent className="max-w-md rounded-[8px] p-6 bg-white border border-[#E7E5E4]">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-[#1C1917]">
                Konfigurasi {activeConfigAgent.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#78716C]">
                Sesuaikan parameter inferensi LLM dan level otonomi agen.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                  LLM Model Base
                </label>
                <select className="w-full text-xs h-9 px-3 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4]">
                  <option>Claude 3.7 Sonnet (Reasoning)</option>
                  <option>Gemini 2.5 Pro</option>
                  <option>GPT-4o Developer Edition</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                  Max Output Token per Patch
                </label>
                <Input defaultValue="8192" className="bg-[#FAF9F9] font-mono h-9 text-xs" />
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
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  toast.success(`Konfigurasi untuk ${activeConfigAgent.name} disimpan!`);
                  setActiveConfigAgent(null);
                }}
              >
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
