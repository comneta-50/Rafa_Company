"use client";

import React, { useState } from "react";
import { JobWorkflow, WorkflowStep } from "@/lib/workflow-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { N8nFlowchartCanvas } from "./n8n-flowchart-canvas";
import { GitFork, Save, Plus, FileText, Bot, X } from "lucide-react";
import { toast } from "sonner";

interface N8nFlowchartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: JobWorkflow;
  onEditStep: (step: WorkflowStep) => void;
  onAddStep: () => void;
  onDeleteStep: (stepId: string) => void;
  onSaveWorkflow: () => void;
  onOpenSOP: () => void;
}

export function N8nFlowchartModal({
  open,
  onOpenChange,
  workflow,
  onEditStep,
  onAddStep,
  onDeleteStep,
  onSaveWorkflow,
  onOpenSOP,
}: N8nFlowchartModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[96vw] w-[1400px] h-[92vh] flex flex-col p-5 bg-white border border-[#E7E5E4] rounded-2xl shadow-2xl">
        <DialogHeader className="pb-3 border-b border-[#E7E5E4] shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#881337] text-white">
                <GitFork className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-[#1C1917] flex items-center gap-2">
                  <span>Visual Flowchart Editor (n8n Mode)</span>
                  <Badge className="bg-[#881337]/10 text-[#881337] border-[#881337]/20 text-[10px]">
                    {workflow.name}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-[#78716C] mt-0.5">
                  Kanvas interaktif diagram alur agen AI berbasis n8n. Anda dapat menggeser posisi node, menguji simulasi alur, dan mengedit parameter langkah.
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenSOP}
                className="text-xs h-8 text-[#881337] border-[#881337]/30 hover:bg-[#881337]/5"
              >
                <FileText className="size-3.5 mr-1.5" />
                Acuan SOP
              </Button>
              <Button
                size="sm"
                onClick={onAddStep}
                className="text-xs h-8 bg-[#FAF9F9] hover:bg-[#881337] text-[#1C1917] hover:text-white border border-[#E7E5E4] transition-colors"
              >
                <Plus className="size-3.5 mr-1" />
                Tambah Node
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onSaveWorkflow();
                  toast.success("Konfigurasi flowchart berhasil disimpan!");
                }}
                className="text-xs h-8 bg-[#881337] hover:bg-[#70102e] text-white flex items-center gap-1.5"
              >
                <Save className="size-3.5" />
                Simpan Alur
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Full Interactive Canvas Body */}
        <div className="flex-1 min-h-0 pt-3">
          <N8nFlowchartCanvas
            workflow={workflow}
            onEditStep={onEditStep}
            onAddStep={onAddStep}
            onDeleteStep={onDeleteStep}
            onSaveWorkflow={onSaveWorkflow}
            isFullScreenMode={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
