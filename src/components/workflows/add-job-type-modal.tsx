"use client";

import React, { useState } from "react";
import { JobWorkflow, DEFAULT_WORKFLOWS, WorkflowStep } from "@/lib/workflow-data";
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
import { PlusCircle, Layers, Cpu, Zap, Copy } from "lucide-react";

interface AddJobTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddJobType: (newJob: JobWorkflow) => void;
}

const AVAILABLE_MODELS = [
  "Gemini 2.5 Pro (Deep Reason)",
  "Gemini 2.5 Flash (Speed)",
  "Claude 3.7 Sonnet (Hybrid)",
  "GPT-4o (Omni)",
  "DeepSeek R1 (Reasoning)",
];

const AVAILABLE_CATEGORIES = [
  "Core Maintenance & Debugging",
  "Full-Stack Development",
  "Marketing & Conversion",
  "Lightweight UI Page",
  "UI/UX Elevation & Refinement",
  "API & Database Integration",
  "Mobile & Responsive",
  "Custom Automation",
];

export function AddJobTypeModal({
  open,
  onOpenChange,
  onAddJobType,
}: AddJobTypeModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(AVAILABLE_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("Custom Workflow");
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [defaultModel, setDefaultModel] = useState(AVAILABLE_MODELS[0]);
  const [maxSteps, setMaxSteps] = useState(8);
  const [autoTrigger, setAutoTrigger] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState(
    "Anda adalah AI Agent Specialist. Lakukan pekerjaan dengan terstruktur, patuhi aturan kode proyek, dan selalu uji hasil sebelum menyerahkan ke operator."
  );

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId === "blank") {
      setSystemPrompt(
        "Anda adalah AI Agent Specialist. Lakukan pekerjaan dengan terstruktur, patuhi aturan kode proyek, dan selalu uji hasil sebelum menyerahkan ke operator."
      );
      return;
    }

    const found = DEFAULT_WORKFLOWS.find((w) => w.id === templateId);
    if (found) {
      setDescription(`Workflow kustom berbasis ${found.name}: ${found.description}`);
      setSystemPrompt(found.systemPromptTemplate);
      setDefaultModel(found.defaultModel);
      setMaxSteps(found.maxAutonomousSteps);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama jenis job tidak boleh kosong!");
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let initialSteps: WorkflowStep[] = [];
    if (selectedTemplate !== "blank") {
      const template = DEFAULT_WORKFLOWS.find((w) => w.id === selectedTemplate);
      if (template) {
        initialSteps = template.steps.map((s, idx) => ({
          ...s,
          id: `step-${slug}-${idx + 1}-${Date.now()}`,
          order: idx + 1,
        }));
      }
    } else {
      initialSteps = [
        {
          id: `step-${slug}-1-${Date.now()}`,
          order: 1,
          title: "Inisialisasi & Analisis Request",
          description: "Menganalisis parameter order dan mempersiapkan dependensi target.",
          agentRole: "AI Code Reviewer",
          estimatedDuration: "5m",
          requiredTools: ["code_search", "git_checkout"],
          systemGuidance: "Pelajari requirement order secara seksama sebelum memulai perubahan.",
          requiresHumanReview: false,
          outputArtifact: "Work Plan & Scope Definition",
        },
        {
          id: `step-${slug}-2-${Date.now()}`,
          order: 2,
          title: "Eksekusi Pengerjaan Inti",
          description: "Mengimplementasikan fitur atau perubahan sesuai spesifikasi job.",
          agentRole: "AutoFix Engineer",
          estimatedDuration: "15m",
          requiredTools: ["git_patch", "typescript_compiler"],
          systemGuidance: "Tulis kode yang modular, bersih, dan sesuai panduan in-code rules.",
          requiresHumanReview: false,
          outputArtifact: "Core Implementation Files",
        },
        {
          id: `step-${slug}-3-${Date.now()}`,
          order: 3,
          title: "Verifikasi & Final Review",
          description: "Menjalankan testing, audit sintaks, dan mengajukan approval.",
          agentRole: "Delivery Bot",
          estimatedDuration: "5m",
          requiredTools: ["pnpm_test", "eslint_run"],
          systemGuidance: "Pastikan seluruh build sukses tanpa error sebelum menyerahkan hasil.",
          requiresHumanReview: true,
          outputArtifact: "Production Build & QA Approval",
        },
      ];
    }

    const newWorkflow: JobWorkflow = {
      id: `${slug}-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      category,
      description: description.trim() || `Workflow otomatisasi untuk kategori ${category}.`,
      badge: badge.trim() || "Custom Job",
      iconName: "Zap",
      isCustom: true,
      defaultModel,
      maxAutonomousSteps: Number(maxSteps) || 6,
      autoTriggerOnOrder: autoTrigger,
      systemPromptTemplate: systemPrompt.trim(),
      steps: initialSteps,
      updatedAt: new Date().toISOString(),
    };

    onAddJobType(newWorkflow);
    onOpenChange(false);
    toast.success(`Jenis job "${name}" berhasil ditambahkan ke daftar workflow!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white border border-[#E7E5E4] rounded-xl shadow-xl">
        <DialogHeader className="pb-3 border-b border-[#E7E5E4]">
          <DialogTitle className="text-base font-semibold text-[#1C1917] flex items-center gap-2">
            <PlusCircle className="size-4 text-[#881337]" />
            Tambah Jenis Job Baru ke Workflow Agent
          </DialogTitle>
          <DialogDescription className="text-xs text-[#78716C]">
            Tambahkan jenis pekerjaan baru yang dapat diproses oleh AI Agent dengan urutan tahapan (pipeline) tersendiri.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          {/* Template Dasar */}
          <div className="p-3 rounded-lg border border-[#E7E5E4] bg-[#FAF9F9]">
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
              <Copy className="size-3.5 text-[#881337]" />
              Duplikasi dari Template Preset (Opsional)
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full text-xs bg-white border border-[#E7E5E4] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#881337]"
            >
              <option value="blank">Kosong (Mulai dari 3 langkah standar)</option>
              {DEFAULT_WORKFLOWS.map((w) => (
                <option key={w.id} value={w.id}>
                  Salin langkah dari: {w.name} ({w.steps.length} langkah)
                </option>
              ))}
            </select>
          </div>

          {/* Nama Jenis Job & Badge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Nama Jenis Job <span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: API Gateway Migration, E-Commerce Checkout"
                className="text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Badge Label
              </label>
              <Input
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Custom, VIP, Fast"
                className="text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917]"
              />
            </div>
          </div>

          {/* Kategori & Default Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
                <Layers className="size-3.5 text-[#78716C]" />
                Kategori Pekerjaan
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs bg-[#FAF9F9] border border-[#E7E5E4] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#881337]"
              >
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
                <Cpu className="size-3.5 text-[#881337]" />
                Default AI Model
              </label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full text-xs bg-[#FAF9F9] border border-[#E7E5E4] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#881337]"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Deskripsi Singkat Job
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan tujuan dan output dari jenis job ini..."
              className="text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917]"
            />
          </div>

          {/* Batas Maksimal Step & Auto Trigger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Batas Maksimal Langkah Otonom (Max Steps)
              </label>
              <Input
                type="number"
                min={2}
                max={25}
                value={maxSteps}
                onChange={(e) => setMaxSteps(Number(e.target.value))}
                className="text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917]"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="autoTrigger"
                checked={autoTrigger}
                onChange={(e) => setAutoTrigger(e.target.checked)}
                className="size-4 rounded border-gray-300 text-[#881337] focus:ring-[#881337] cursor-pointer"
              />
              <label htmlFor="autoTrigger" className="text-xs font-medium text-[#1C1917] cursor-pointer">
                Auto-start saat ada order jenis ini masuk
              </label>
            </div>
          </div>

          {/* Master System Prompt Directive */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Master System Prompt Directive (Acuan Induk Agent)
            </label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Instruksi dan batas keamanan utama yang memandu agen..."
              rows={3}
              className="text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917] resize-y"
            />
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
              Simpan & Buat Jenis Job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
