"use client";

import React, { useState, useEffect } from "react";
import { WorkflowStep } from "@/lib/workflow-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Bot, Wrench, ShieldAlert, Sparkles, Clock, FileCheck } from "lucide-react";

interface EditStepModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: WorkflowStep | null;
  onSave: (step: WorkflowStep) => void;
  isNew?: boolean;
}

const PRESET_ROLES = [
  "AI Code Reviewer",
  "AutoFix Engineer",
  "Test Runner Bot",
  "Analyzer Agent #04",
  "System Architect Agent",
  "DevOps Agent",
  "Backend Engineer Bot",
  "Frontend Engineer Bot",
  "Design Strategist Agent",
  "Tailwind Specialist",
  "Frontend Polish Bot",
  "Performance Sentinel",
  "Logic Architect Bot",
  "React Engineer Agent",
  "Reliability Bot",
  "Design Reviewer",
  "Skeleton Auditor Bot",
  "UI Sculptor Agent",
  "Styling Master",
  "Motion Engineer Bot",
  "Visual QA Inspector",
  "Delivery Bot",
];

export function EditStepModal({
  open,
  onOpenChange,
  step,
  onSave,
  isNew = false,
}: EditStepModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [agentRole, setAgentRole] = useState(PRESET_ROLES[0]);
  const [customRole, setCustomRole] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("5m");
  const [toolsStr, setToolsStr] = useState("ast_grep, git_patch");
  const [outputArtifact, setOutputArtifact] = useState("");
  const [requiresHumanReview, setRequiresHumanReview] = useState(false);
  const [systemGuidance, setSystemGuidance] = useState("");

  useEffect(() => {
    if (step) {
      setTitle(step.title);
      setDescription(step.description);
      if (PRESET_ROLES.includes(step.agentRole)) {
        setAgentRole(step.agentRole);
        setCustomRole("");
      } else {
        setAgentRole("custom");
        setCustomRole(step.agentRole);
      }
      setEstimatedDuration(step.estimatedDuration);
      setToolsStr(step.requiredTools.join(", "));
      setOutputArtifact(step.outputArtifact);
      setRequiresHumanReview(step.requiresHumanReview);
      setSystemGuidance(step.systemGuidance);
    } else {
      setTitle("");
      setDescription("");
      setAgentRole(PRESET_ROLES[0]);
      setCustomRole("");
      setEstimatedDuration("5m");
      setToolsStr("git_patch, code_validator");
      setOutputArtifact("");
      setRequiresHumanReview(false);
      setSystemGuidance("");
    }
  }, [step, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul langkah tidak boleh kosong!");
      return;
    }

    const finalRole = agentRole === "custom" ? customRole.trim() || "Autonomous Agent" : agentRole;
    const tools = toolsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedStep: WorkflowStep = {
      id: step?.id || `step-${Date.now()}`,
      order: step?.order || 1,
      title: title.trim(),
      description: description.trim(),
      agentRole: finalRole,
      estimatedDuration: estimatedDuration.trim() || "5m",
      requiredTools: tools.length > 0 ? tools : ["default_tools"],
      outputArtifact: outputArtifact.trim() || "Artifact Output",
      requiresHumanReview,
      systemGuidance: systemGuidance.trim(),
    };

    onSave(updatedStep);
    onOpenChange(false);
    toast.success(isNew ? "Langkah pipeline berhasil ditambahkan!" : "Langkah pipeline berhasil diperbarui!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white border border-[#E7E5E4] rounded-xl shadow-xl">
        <DialogHeader className="pb-3 border-b border-[#E7E5E4]">
          <DialogTitle className="text-base font-semibold text-[#1C1917] flex items-center gap-2">
            <Sparkles className="size-4 text-[#881337]" />
            {isNew ? "Tambah Langkah Pipeline Baru" : "Edit Langkah Pipeline AI Agent"}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#78716C]">
            Atur parameter instruksi dan aturan kerja agent untuk tahapan workflow ini.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          {/* Judul Langkah */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Judul Langkah Pipeline <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Analisis AST & Validasi Root Cause"
              className="text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917]"
              required
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Deskripsi Ringkas Aktivitas
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ringkasan apa yang dieksekusi oleh agent pada tahap ini..."
              className="text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917]"
            />
          </div>

          {/* Agent Role & Estimasi Waktu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
                <Bot className="size-3.5 text-[#881337]" />
                Penanggung Jawab (Agent Role)
              </label>
              <select
                value={agentRole}
                onChange={(e) => setAgentRole(e.target.value)}
                className="w-full text-xs bg-[#FAF9F9] border border-[#E7E5E4] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#881337]"
              >
                {PRESET_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
                <option value="custom">+ Buat Peran Kustom...</option>
              </select>
              {agentRole === "custom" && (
                <Input
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Ketik nama peran kustom..."
                  className="mt-2 text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917]"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
                <Clock className="size-3.5 text-[#78716C]" />
                Estimasi Durasi
              </label>
              <Input
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="misal: 3m, 10m, 20m"
                className="text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917]"
              />
            </div>
          </div>

          {/* Tools & Artifact Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
                <Wrench className="size-3.5 text-[#78716C]" />
                Required Tools (Pisahkan dengan koma)
              </label>
              <Input
                value={toolsStr}
                onChange={(e) => setToolsStr(e.target.value)}
                placeholder="ast_grep, git_patch, pnpm_test"
                className="text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
                <FileCheck className="size-3.5 text-[#78716C]" />
                Target Artifact yang Dihasilkan
              </label>
              <Input
                value={outputArtifact}
                onChange={(e) => setOutputArtifact(e.target.value)}
                placeholder="Pull Request, Bug Diagnostics, UI Specs"
                className="text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917]"
              />
            </div>
          </div>

          {/* System Guidance Instruction */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Instruksi Detail & Acuan Agent (System Guidance)
            </label>
            <Textarea
              value={systemGuidance}
              onChange={(e) => setSystemGuidance(e.target.value)}
              placeholder="Instruksi spesifik yang disuntikkan ke dalam prompt AI agent saat menjalankan langkah ini..."
              rows={4}
              className="text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917] leading-relaxed resize-y"
            />
          </div>

          {/* Human Review Checkbox */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-[#E7E5E4] bg-[#FAF9F9]">
            <input
              type="checkbox"
              id="humanReview"
              checked={requiresHumanReview}
              onChange={(e) => setRequiresHumanReview(e.target.checked)}
              className="mt-0.5 size-4 rounded border-gray-300 text-[#881337] focus:ring-[#881337] cursor-pointer"
            />
            <label htmlFor="humanReview" className="text-xs cursor-pointer">
              <span className="font-semibold text-[#1C1917] flex items-center gap-1.5">
                <ShieldAlert className="size-3.5 text-amber-600 inline" />
                Wajibkan Review Manusia (Human-in-the-Loop)
              </span>
              <p className="text-[#78716C] mt-0.5">
                Agent akan menghentikan eksekusi sementara pada langkah ini dan menunggu konfirmasi dari Anda sebelum melanjutkan ke langkah berikutnya.
              </p>
            </label>
          </div>

          <DialogFooter className="pt-2 border-t border-[#E7E5E4] flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs h-8"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="text-xs h-8 bg-[#881337] hover:bg-[#70102e] text-white"
            >
              {isNew ? "Tambahkan ke Pipeline" : "Simpan Perubahan Langkah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
