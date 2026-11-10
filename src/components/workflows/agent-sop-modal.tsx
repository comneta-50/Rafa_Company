"use client";

import React, { useState } from "react";
import { JobWorkflow, generateAgentSOPMarkdown } from "@/lib/workflow-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Bot,
  Copy,
  Download,
  Check,
  FileText,
  Code2,
  Workflow,
  Sparkles,
} from "lucide-react";

interface AgentSOPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: JobWorkflow;
}

const SAMPLE_ORDERS = [
  {
    orderId: "ORD-781",
    clientName: "PT Fintek Nusantara",
    title: "Fix Token Expiration & Race Condition in Auth Guard",
    repoUrl: "client-fintek/auth-service",
  },
  {
    orderId: "ORD-780",
    clientName: "Karya Studio Global",
    title: "Optimize PostgreSQL connection pooling under heavy load",
    repoUrl: "karya-studio/core-api",
  },
  {
    orderId: "ORD-779",
    clientName: "Logistik Pintar ID",
    title: "Hydration mismatch & buffer overflow pada batch consumer worker",
    repoUrl: "logistik-id/tracking-worker",
  },
  {
    orderId: "ORD-778",
    clientName: "Solusi Cerdas AI",
    title: "Landing Page SaaS AI Coding Assistant & Checkout Integration",
    repoUrl: "solusicerdas/saas-landing",
  },
];

export function AgentSOPModal({
  open,
  onOpenChange,
  workflow,
}: AgentSOPModalProps) {
  const [selectedOrderIdx, setSelectedOrderIdx] = useState<number | "none">("none");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "raw" | "json">("preview");

  const activeJobContext =
    selectedOrderIdx === "none" ? undefined : SAMPLE_ORDERS[selectedOrderIdx];

  const sopMarkdown = generateAgentSOPMarkdown(workflow, activeJobContext);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      activeTab === "json" ? JSON.stringify(workflow, null, 2) : sopMarkdown
    );
    setCopied(true);
    toast.success("Acuan SOP AI Agent berhasil disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `AI_AGENT_SOP_${workflow.id.toUpperCase()}.md`;
    const blob = new Blob([sopMarkdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`File ${filename} berhasil diunduh!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-6 bg-white border border-[#E7E5E4] rounded-xl shadow-2xl">
        <DialogHeader className="pb-3 border-b border-[#E7E5E4] shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-base font-semibold text-[#1C1917] flex items-center gap-2">
                <Bot className="size-4 text-[#881337]" />
                Acuan Eksekusi AI Agent (System Prompt & SOP)
              </DialogTitle>
              <DialogDescription className="text-xs text-[#78716C] mt-0.5">
                Spesifikasi prompt dan alur kerja yang diberikan ke AI Agent saat mengerjakan tugas jenis{" "}
                <span className="font-semibold text-[#881337]">{workflow.name}</span>.
              </DialogDescription>
            </div>
            <Badge className="bg-[#881337]/10 text-[#881337] border-[#881337]/20 font-mono text-[10px]">
              {workflow.defaultModel}
            </Badge>
          </div>
        </DialogHeader>

        {/* Controls: Context Selector & Format Tabs */}
        <div className="pt-3 pb-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78716C] font-medium flex items-center gap-1">
              <Sparkles className="size-3 text-[#881337]" />
              Simulasi Order:
            </span>
            <select
              value={selectedOrderIdx}
              onChange={(e) =>
                setSelectedOrderIdx(
                  e.target.value === "none" ? "none" : Number(e.target.value)
                )
              }
              className="text-xs bg-[#FAF9F9] border border-[#E7E5E4] rounded-md px-2.5 py-1 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#881337]"
            >
              <option value="none">Template Umum (Tanpa Spesifik Order)</option>
              {SAMPLE_ORDERS.map((ord, idx) => (
                <option key={ord.orderId} value={idx}>
                  {ord.orderId}: {ord.clientName} ({ord.title.slice(0, 32)}...)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[#FAF9F9] p-1 rounded-md border border-[#E7E5E4]">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === "preview"
                  ? "bg-white text-[#881337] shadow-xs"
                  : "text-[#78716C] hover:text-[#1C1917]"
              }`}
            >
              <FileText className="size-3" />
              SOP View
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === "raw"
                  ? "bg-white text-[#881337] shadow-xs"
                  : "text-[#78716C] hover:text-[#1C1917]"
              }`}
            >
              <Code2 className="size-3" />
              Raw Markdown
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === "json"
                  ? "bg-white text-[#881337] shadow-xs"
                  : "text-[#78716C] hover:text-[#1C1917]"
              }`}
            >
              <Workflow className="size-3" />
              JSON Schema
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[50vh] p-4 bg-[#FAF9F9] border border-[#E7E5E4] rounded-lg font-mono text-xs text-[#1C1917] leading-relaxed select-text">
          {activeTab === "preview" && (
            <div className="space-y-4 font-sans text-xs">
              <div className="p-3 bg-white rounded-md border border-[#E7E5E4] shadow-2xs">
                <h3 className="font-semibold text-sm text-[#881337] flex items-center gap-1.5 mb-1">
                  <Bot className="size-4" />
                  Directive Master AI Agent
                </h3>
                <p className="text-[#44403C] leading-relaxed italic">
                  "{workflow.systemPromptTemplate}"
                </p>
              </div>

              {activeJobContext && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-md">
                  <span className="font-semibold text-amber-900 block text-xs">
                    Target Order yang Dihubungkan:
                  </span>
                  <div className="mt-1 grid grid-cols-2 gap-1 text-[11px] text-amber-800">
                    <div>Order: {activeJobContext.orderId} - {activeJobContext.clientName}</div>
                    <div>Repo: {activeJobContext.repoUrl}</div>
                    <div className="col-span-2 font-medium">Job: {activeJobContext.title}</div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-xs text-[#1C1917] mb-2 uppercase tracking-wider text-[11px]">
                  Rangkaian Tahapan Eksekusi ({workflow.steps.length} Langkah)
                </h4>
                <div className="space-y-2.5">
                  {workflow.steps.map((st, i) => (
                    <div
                      key={st.id}
                      className="p-3 bg-white border border-[#E7E5E4] rounded-md shadow-2xs hover:border-[#881337]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-xs text-[#1C1917]">
                          {i + 1}. {st.title}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {st.requiresHumanReview && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                              Wajib Review
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#FAF9F9] text-[#78716C] border border-[#E7E5E4]">
                            {st.estimatedDuration}
                          </span>
                        </div>
                      </div>
                      <p className="text-[#57534E] text-[11px] mb-2">{st.description}</p>
                      <div className="p-2 bg-[#F5F5F6] rounded text-[11px] text-[#292524] mb-2">
                        <span className="font-semibold text-[#881337]">SOP: </span>
                        {st.systemGuidance}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#78716C]">
                        <span>Agent: <strong className="text-[#1C1917]">{st.agentRole}</strong></span>
                        <span>•</span>
                        <span>Artifact: <strong className="text-[#1C1917]">{st.outputArtifact}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "raw" && (
            <pre className="whitespace-pre-wrap font-mono text-[11px] text-[#292524]">
              {sopMarkdown}
            </pre>
          )}

          {activeTab === "json" && (
            <pre className="whitespace-pre-wrap font-mono text-[11px] text-[#0f766e]">
              {JSON.stringify(workflow, null, 2)}
            </pre>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="pt-3 border-t border-[#E7E5E4] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#78716C]">
            * Digunakan secara runtime oleh worker saat memproses job
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-xs h-8 flex items-center gap-1.5"
            >
              <Download className="size-3.5" />
              Unduh .MD
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleCopy}
              className="text-xs h-8 bg-[#881337] hover:bg-[#70102e] text-white flex items-center gap-1.5"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Tersalin!" : "Salin Acuan Prompt"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
