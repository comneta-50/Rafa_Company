"use client";

import React, { useState, useEffect } from "react";
import {
  Workflow,
  Plus,
  RotateCcw,
  Save,
  Bot,
  Play,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Wrench,
  ShieldAlert,
  Sparkles,
  Layers,
  Bug,
  Globe,
  FileCode,
  Zap,
  Search,
  Check,
  ChevronRight,
  Sliders,
  FileText,
  AlertCircle,
  GitFork,
  ListOrdered,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  JobWorkflow,
  WorkflowStep,
  DEFAULT_WORKFLOWS,
  getStoredWorkflows,
  saveStoredWorkflows,
  resetWorkflowsToDefault,
} from "@/lib/workflow-data";
import { EditStepModal } from "@/components/workflows/edit-step-modal";
import { AddJobTypeModal } from "@/components/workflows/add-job-type-modal";
import { AgentSOPModal } from "@/components/workflows/agent-sop-modal";
import { N8nFlowchartModal } from "@/components/workflows/n8n-flowchart-modal";
import { N8nFlowchartCanvas } from "@/components/workflows/n8n-flowchart-canvas";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Bug: Bug,
  Globe: Globe,
  Sparkles: Sparkles,
  FileCode: FileCode,
  Layers: Layers,
  Zap: Zap,
};

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<JobWorkflow[]>(DEFAULT_WORKFLOWS);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>("fixing-bug");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Modals state
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isEditStepModalOpen, setIsEditStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [isNewStep, setIsNewStep] = useState(false);
  const [isSOPModalOpen, setIsSOPModalOpen] = useState(false);
  const [isFlowchartModalOpen, setIsFlowchartModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "flowchart">("list");

  useEffect(() => {
    setIsMounted(true);
    const loaded = getStoredWorkflows();
    setWorkflows(loaded);
    if (loaded.length > 0 && !loaded.some((w) => w.id === activeWorkflowId)) {
      setActiveWorkflowId(loaded[0].id);
    }
  }, []);

  const activeWorkflow =
    workflows.find((w) => w.id === activeWorkflowId) || workflows[0] || DEFAULT_WORKFLOWS[0];

  const filteredWorkflows = workflows.filter((w) => {
    const q = searchQuery.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q)
    );
  });

  const totalStepsCount = workflows.reduce((acc, w) => acc + w.steps.length, 0);
  const reviewPointsCount = workflows.reduce(
    (acc, w) => acc + w.steps.filter((s) => s.requiresHumanReview).length,
    0
  );

  // Workflow update handlers
  const handleUpdateActiveWorkflow = (updates: Partial<JobWorkflow>) => {
    const updatedList = workflows.map((w) =>
      w.id === activeWorkflow.id
        ? { ...w, ...updates, updatedAt: new Date().toISOString() }
        : w
    );
    setWorkflows(updatedList);
    saveStoredWorkflows(updatedList);
  };

  const handleSaveAll = () => {
    saveStoredWorkflows(workflows);
    toast.success(`Workflow "${activeWorkflow.name}" berhasil disimpan ke sistem!`);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin mengembalikan seluruh preset workflow ke konfigurasi awal? Perubahan kustom akan hilang."
      )
    ) {
      const reset = resetWorkflowsToDefault();
      setWorkflows(reset);
      setActiveWorkflowId("fixing-bug");
      toast.info("Seluruh workflow telah dikembalikan ke pengaturan default.");
    }
  };

  const handleAddJobType = (newJob: JobWorkflow) => {
    const updated = [...workflows, newJob];
    setWorkflows(updated);
    saveStoredWorkflows(updated);
    setActiveWorkflowId(newJob.id);
  };

  const handleDeleteActiveJobType = () => {
    if (!activeWorkflow.isCustom) {
      toast.error("Preset bawaan sistem tidak dapat dihapus!");
      return;
    }
    if (
      window.confirm(
        `Hapus jenis job "${activeWorkflow.name}" dari sistem secara permanen?`
      )
    ) {
      const remaining = workflows.filter((w) => w.id !== activeWorkflow.id);
      setWorkflows(remaining);
      saveStoredWorkflows(remaining);
      setActiveWorkflowId(remaining[0]?.id || "fixing-bug");
      toast.success(`Jenis job "${activeWorkflow.name}" berhasil dihapus.`);
    }
  };

  // Step manipulation handlers
  const handleMoveStep = (stepIndex: number, direction: "up" | "down") => {
    const newSteps = [...activeWorkflow.steps];
    const targetIndex = direction === "up" ? stepIndex - 1 : stepIndex + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;

    const temp = newSteps[stepIndex];
    newSteps[stepIndex] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;

    // re-order numbers
    newSteps.forEach((s, idx) => {
      s.order = idx + 1;
    });

    handleUpdateActiveWorkflow({ steps: newSteps });
    toast.success("Urutan langkah diperbarui.");
  };

  const handleDeleteStep = (stepId: string) => {
    if (activeWorkflow.steps.length <= 1) {
      toast.error("Workflow minimal harus memiliki setidaknya 1 langkah!");
      return;
    }
    const newSteps = activeWorkflow.steps
      .filter((s) => s.id !== stepId)
      .map((s, idx) => ({ ...s, order: idx + 1 }));

    handleUpdateActiveWorkflow({ steps: newSteps });
    toast.success("Langkah berhasil dihapus dari pipeline.");
  };

  const handleOpenAddStep = () => {
    setIsNewStep(true);
    setEditingStep(null);
    setIsEditStepModalOpen(true);
  };

  const handleOpenEditStep = (step: WorkflowStep) => {
    setIsNewStep(false);
    setEditingStep(step);
    setIsEditStepModalOpen(true);
  };

  const handleSaveStep = (step: WorkflowStep) => {
    let newSteps = [...activeWorkflow.steps];
    if (isNewStep) {
      step.order = newSteps.length + 1;
      newSteps.push(step);
    } else {
      newSteps = newSteps.map((s) => (s.id === step.id ? step : s));
    }
    handleUpdateActiveWorkflow({ steps: newSteps });
  };

  const ActiveIcon = ICON_MAP[activeWorkflow.iconName] || Workflow;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F5F5F6]">
      <Header
        actionLabel="Tambah Jenis Job"
        onAction={() => setIsAddJobModalOpen(true)}
      />

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Banner Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E7E5E4] shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-2 rounded-lg bg-[#881337]/10 text-[#881337]">
                <Workflow className="size-5" />
              </span>
              <h1 className="text-xl font-bold text-[#1C1917]">
                AI Agent Workflow Manager
              </h1>
              <Badge className="bg-[#881337] text-white hover:bg-[#881337] text-xs">
                Acuan SOP Agent
              </Badge>
            </div>
            <p className="text-xs text-[#78716C] max-w-2xl leading-relaxed">
              Atur alur kerja (workflow) dan instruksi standar (SOP) yang menjadi acuan utama bagi AI Agent saat mengeksekusi request client. Anda dapat mengedit tahapan, menentukan peran agent, serta menambah jenis job baru.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="text-xs h-8 text-[#78716C] hover:text-[#1C1917]"
              title="Kembalikan semua preset ke konfigurasi awal"
            >
              <RotateCcw className="size-3.5 mr-1.5" />
              Reset Default
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSOPModalOpen(true)}
              className="text-xs h-8 border-[#881337]/30 text-[#881337] hover:bg-[#881337]/5 font-medium"
            >
              <Bot className="size-3.5 mr-1.5" />
              Lihat Acuan Agent (SOP)
            </Button>
            <Button
              size="sm"
              onClick={() => setIsAddJobModalOpen(true)}
              className="text-xs h-8 bg-[#881337] hover:bg-[#70102e] text-white"
            >
              <Plus className="size-3.5 mr-1.5" />
              Tambah Jenis Job
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-[#E7E5E4] shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider">
                  Total Jenis Job
                </p>
                <p className="text-2xl font-bold text-[#1C1917] mt-0.5">
                  {workflows.length}
                </p>
                <p className="text-[10px] text-[#A8A29E] mt-0.5">
                  {workflows.filter((w) => w.isCustom).length} Kustom dibuat
                </p>
              </div>
              <div className="p-2.5 bg-[#FAF9F9] rounded-lg border border-[#E7E5E4] text-[#881337]">
                <Layers className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E7E5E4] shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider">
                  Total Tahapan Pipeline
                </p>
                <p className="text-2xl font-bold text-[#1C1917] mt-0.5">
                  {totalStepsCount}
                </p>
                <p className="text-[10px] text-emerald-600 mt-0.5 font-medium">
                  Rata-rata {(totalStepsCount / Math.max(1, workflows.length)).toFixed(1)} step/job
                </p>
              </div>
              <div className="p-2.5 bg-[#FAF9F9] rounded-lg border border-[#E7E5E4] text-blue-600">
                <Sliders className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E7E5E4] shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider">
                  Human Review Gates
                </p>
                <p className="text-2xl font-bold text-[#1C1917] mt-0.5">
                  {reviewPointsCount}
                </p>
                <p className="text-[10px] text-amber-600 mt-0.5">
                  Checkpoint konfirmasi operator
                </p>
              </div>
              <div className="p-2.5 bg-[#FAF9F9] rounded-lg border border-[#E7E5E4] text-amber-600">
                <ShieldAlert className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E7E5E4] shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider">
                  Active Preset
                </p>
                <p className="text-sm font-bold text-[#881337] mt-1.5 truncate max-w-[130px]">
                  {activeWorkflow.name}
                </p>
                <p className="text-[10px] text-[#78716C] mt-0.5">
                  {activeWorkflow.steps.length} langkah terkonfigurasi
                </p>
              </div>
              <div className="p-2.5 bg-[#FAF9F9] rounded-lg border border-[#E7E5E4] text-[#881337]">
                <Bot className="size-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Layout: Sidebar Selector (Left) + Workflow Editor (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Job Type Selector */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-3.5 rounded-xl border border-[#E7E5E4] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                  Pilih Jenis Job
                </h2>
                <span className="text-[10px] text-[#78716C] bg-[#FAF9F9] px-2 py-0.5 rounded-full border border-[#E7E5E4]">
                  {filteredWorkflows.length} Tersedia
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari jenis job..."
                  className="pl-8 text-xs h-8 bg-[#FAF9F9] border-[#E7E5E4] rounded-md text-[#1C1917]"
                />
              </div>

              {/* Job List Cards */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-0.5">
                {filteredWorkflows.map((w) => {
                  const IconComp = ICON_MAP[w.iconName] || Workflow;
                  const isActive = w.id === activeWorkflow.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => setActiveWorkflowId(w.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 relative ${
                        isActive
                          ? "bg-[#881337]/5 border-[#881337] shadow-xs"
                          : "bg-white border-[#E7E5E4] hover:border-[#D6D3D1] hover:bg-[#FAF9F9]"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-md shrink-0 ${
                          isActive
                            ? "bg-[#881337] text-white"
                            : "bg-[#F5F5F6] text-[#78716C]"
                        }`}
                      >
                        <IconComp className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`text-xs font-semibold truncate ${
                              isActive ? "text-[#881337]" : "text-[#1C1917]"
                            }`}
                          >
                            {w.name}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              w.isCustom
                                ? "bg-purple-100 text-purple-700"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {w.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#78716C] line-clamp-1 mb-1.5">
                          {w.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-[#A8A29E]">
                          <span className="flex items-center gap-1">
                            <Sliders className="size-3" />
                            {w.steps.length} Steps
                          </span>
                          <span>•</span>
                          <span className="truncate">{w.category}</span>
                        </div>
                      </div>
                      {isActive && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <ChevronRight className="size-4 text-[#881337]" />
                        </div>
                      )}
                    </button>
                  );
                })}

                {filteredWorkflows.length === 0 && (
                  <div className="p-4 text-center text-xs text-[#78716C]">
                    Tidak ada jenis job yang cocok dengan "{searchQuery}".
                  </div>
                )}
              </div>

              {/* Add New Job Type Button at bottom of left column */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddJobModalOpen(true)}
                className="w-full text-xs h-8.5 border-dashed border-[#881337]/40 text-[#881337] hover:bg-[#881337]/5 flex items-center justify-center gap-1.5"
              >
                <Plus className="size-3.5" />
                Tambah Jenis Job Baru...
              </Button>
            </div>
          </div>

          {/* Right Column: Workflow Editor & Pipeline */}
          <div className="lg:col-span-8 space-y-4">
            {/* Header of Active Workflow */}
            <div className="bg-white p-5 rounded-xl border border-[#E7E5E4] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E5E4]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#881337] text-white shrink-0">
                    <ActiveIcon className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-[#1C1917]">
                        {activeWorkflow.name}
                      </h2>
                      <Badge className="bg-[#881337]/10 text-[#881337] border-[#881337]/20 text-[10px]">
                        {activeWorkflow.badge}
                      </Badge>
                      {activeWorkflow.isCustom && (
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[10px]">
                          Custom Job
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#78716C] mt-0.5">
                      Kategori: <span className="font-medium text-[#1C1917]">{activeWorkflow.category}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSOPModalOpen(true)}
                    className="text-xs h-8 text-[#881337] border-[#881337]/30 hover:bg-[#881337]/5 font-medium flex items-center gap-1.5"
                  >
                    <FileText className="size-3.5" />
                    Acuan SOP
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFlowchartModalOpen(true)}
                    className="text-xs h-8 bg-white border-[#881337] text-[#881337] hover:bg-[#881337]/10 font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                    title="Buka kanvas diagram alur interaktif berbasis n8n"
                  >
                    <GitFork className="size-3.5 text-[#881337]" />
                    Flowchart
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveAll}
                    className="text-xs h-8 bg-[#881337] hover:bg-[#70102e] text-white flex items-center gap-1.5"
                  >
                    <Save className="size-3.5" />
                    Simpan Perubahan
                  </Button>
                  {activeWorkflow.isCustom && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteActiveJobType}
                      className="text-xs h-8 text-red-600 hover:bg-red-50 border-red-200"
                      title="Hapus jenis job kustom ini"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* General Settings for this Workflow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1C1917] mb-1">
                    Nama Workflow / Job
                  </label>
                  <Input
                    value={activeWorkflow.name}
                    onChange={(e) => handleUpdateActiveWorkflow({ name: e.target.value })}
                    className="text-xs h-8 bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1C1917] mb-1">
                    Default AI Model
                  </label>
                  <select
                    value={activeWorkflow.defaultModel}
                    onChange={(e) => handleUpdateActiveWorkflow({ defaultModel: e.target.value })}
                    className="w-full text-xs h-8 bg-[#FAF9F9] border border-[#E7E5E4] rounded-md px-2.5 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#881337]"
                  >
                    <option value="Gemini 2.5 Pro (Deep Reason)">Gemini 2.5 Pro (Deep Reason)</option>
                    <option value="Gemini 2.5 Flash (Speed)">Gemini 2.5 Flash (Speed)</option>
                    <option value="Claude 3.7 Sonnet (Hybrid)">Claude 3.7 Sonnet (Hybrid)</option>
                    <option value="GPT-4o (Omni)">GPT-4o (Omni)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1C1917] mb-1">
                    Max Autonomous Steps
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={activeWorkflow.maxAutonomousSteps}
                    onChange={(e) =>
                      handleUpdateActiveWorkflow({ maxAutonomousSteps: Number(e.target.value) || 5 })
                    }
                    className="text-xs h-8 bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917]"
                  />
                </div>
              </div>

              {/* Master System Prompt Directive */}
              <div>
                <label className="block text-[11px] font-semibold text-[#1C1917] mb-1 flex items-center gap-1.5">
                  <Bot className="size-3.5 text-[#881337]" />
                  Master System Directive (Acuan Induk Agent untuk Job Ini)
                </label>
                <Textarea
                  value={activeWorkflow.systemPromptTemplate}
                  onChange={(e) =>
                    handleUpdateActiveWorkflow({ systemPromptTemplate: e.target.value })
                  }
                  rows={2}
                  className="text-xs bg-[#FAF9F9] border-[#E7E5E4] text-[#1C1917] resize-y"
                  placeholder="Instruksi SOP global yang selalu disuntikkan ke dalam agent..."
                />
              </div>
            </div>

            {/* Pipeline Steps Section */}
            <div className="bg-white p-5 rounded-xl border border-[#E7E5E4] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
                    <Sliders className="size-4 text-[#881337]" />
                    Rangkaian Pipeline Eksekusi ({activeWorkflow.steps.length} Langkah)
                  </h3>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Urutan tahapan kerja yang akan dieksekusi oleh AI Agent secara berurutan.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode Toggle: List vs Flowchart */}
                  <div className="flex items-center bg-[#FAF9F9] p-0.5 rounded-lg border border-[#E7E5E4]">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                        viewMode === "list"
                          ? "bg-white text-[#881337] shadow-xs"
                          : "text-[#78716C] hover:text-[#1C1917]"
                      }`}
                    >
                      <ListOrdered className="size-3" />
                      List View
                    </button>
                    <button
                      onClick={() => setViewMode("flowchart")}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                        viewMode === "flowchart"
                          ? "bg-white text-[#881337] shadow-xs"
                          : "text-[#78716C] hover:text-[#1C1917]"
                      }`}
                    >
                      <GitFork className="size-3" />
                      Flowchart (n8n)
                    </button>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleOpenAddStep}
                    className="text-xs h-7.5 bg-[#FAF9F9] hover:bg-[#881337] text-[#1C1917] hover:text-white border border-[#E7E5E4] transition-colors"
                  >
                    <Plus className="size-3.5 mr-1" />
                    Tambah Langkah
                  </Button>
                </div>
              </div>

              {/* Conditional View: List View vs Flowchart Canvas */}
              {viewMode === "flowchart" ? (
                <div className="pt-2">
                  <N8nFlowchartCanvas
                    workflow={activeWorkflow}
                    onEditStep={handleOpenEditStep}
                    onAddStep={handleOpenAddStep}
                    onDeleteStep={handleDeleteStep}
                    onSaveWorkflow={handleSaveAll}
                    onToggleFullScreen={() => setIsFlowchartModalOpen(true)}
                  />
                </div>
              ) : (
                <>
                  {/* Steps List */}
                  <div className="space-y-3">
                {activeWorkflow.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="p-4 rounded-xl border border-[#E7E5E4] bg-[#FAF9F9]/70 hover:bg-[#FAF9F9] hover:border-[#D6D3D1] transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="size-6 rounded-full bg-[#881337] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-[#1C1917] flex items-center gap-2">
                            {step.title}
                            {step.requiresHumanReview && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-medium flex items-center gap-1">
                                <ShieldAlert className="size-3" />
                                Wajib Review Manusia
                              </Badge>
                            )}
                          </h4>
                          <p className="text-[11px] text-[#78716C] mt-0.5">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Controls: Move Up/Down, Edit, Delete */}
                      <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={index === 0}
                          onClick={() => handleMoveStep(index, "up")}
                          className="size-7 p-0 text-[#78716C] hover:text-[#1C1917]"
                          title="Geser ke atas"
                        >
                          <ArrowUp className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={index === activeWorkflow.steps.length - 1}
                          onClick={() => handleMoveStep(index, "down")}
                          className="size-7 p-0 text-[#78716C] hover:text-[#1C1917]"
                          title="Geser ke bawah"
                        >
                          <ArrowDown className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditStep(step)}
                          className="size-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Edit parameter langkah"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteStep(step.id)}
                          className="size-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Hapus langkah"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Step Attributes & System Guidance */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs pt-1">
                      <div className="p-2 rounded bg-white border border-[#E7E5E4]">
                        <span className="text-[10px] font-semibold text-[#78716C] uppercase block">
                          Agent Ditugaskan
                        </span>
                        <span className="text-xs font-semibold text-[#881337] flex items-center gap-1 mt-0.5">
                          <Bot className="size-3 text-[#881337]" />
                          {step.agentRole}
                        </span>
                      </div>

                      <div className="p-2 rounded bg-white border border-[#E7E5E4]">
                        <span className="text-[10px] font-semibold text-[#78716C] uppercase block">
                          Tools & Waktu
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[11px] text-[#1C1917] font-medium flex items-center gap-1">
                            <Clock className="size-3 text-[#78716C]" />
                            {step.estimatedDuration}
                          </span>
                          <span className="text-[#A8A29E]">•</span>
                          <div className="flex flex-wrap gap-1">
                            {step.requiredTools.map((t) => (
                              <span
                                key={t}
                                className="px-1.5 py-0.2 bg-[#FAF9F9] border border-[#E7E5E4] rounded text-[10px] font-mono text-[#57534E]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded bg-white border border-[#E7E5E4]">
                        <span className="text-[10px] font-semibold text-[#78716C] uppercase block">
                          Target Artifact
                        </span>
                        <span className="text-xs text-[#1C1917] font-medium block truncate mt-0.5">
                          {step.outputArtifact}
                        </span>
                      </div>
                    </div>

                    {/* Guidance Prompt Box */}
                    <div className="p-2.5 rounded bg-white border border-[#E7E5E4] text-[11px] text-[#44403C] leading-relaxed">
                      <span className="font-semibold text-[#881337] mr-1">
                        Instruksi SOP Langkah:
                      </span>
                      {step.systemGuidance}
                    </div>
                  </div>
                ))}
              </div>

                  {/* Bottom Add Step Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenAddStep}
                    className="w-full text-xs h-9 border-dashed border-[#881337]/40 text-[#881337] hover:bg-[#881337]/5 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="size-3.5" />
                    Tambah Langkah Pipeline Berikutnya...
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditStepModal
        open={isEditStepModalOpen}
        onOpenChange={setIsEditStepModalOpen}
        step={editingStep}
        onSave={handleSaveStep}
        isNew={isNewStep}
      />

      <AddJobTypeModal
        open={isAddJobModalOpen}
        onOpenChange={setIsAddJobModalOpen}
        onAddJobType={handleAddJobType}
      />

      <AgentSOPModal
        open={isSOPModalOpen}
        onOpenChange={setIsSOPModalOpen}
        workflow={activeWorkflow}
      />

      <N8nFlowchartModal
        open={isFlowchartModalOpen}
        onOpenChange={setIsFlowchartModalOpen}
        workflow={activeWorkflow}
        onEditStep={handleOpenEditStep}
        onAddStep={handleOpenAddStep}
        onDeleteStep={handleDeleteStep}
        onSaveWorkflow={handleSaveAll}
        onOpenSOP={() => setIsSOPModalOpen(true)}
      />
    </div>
  );
}
