"use client";

import React, { useState } from "react";
import {
  Link2,
  Bot,
  Terminal,
  ChevronDown,
  Sparkles,
  Cpu,
  CheckCircle2,
} from "lucide-react";
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

export interface AvailableOrderOption {
  id: string;
  clientName: string;
  title: string;
  repoUrl: string;
  feeAmount?: string;
}

export interface AvailableAgentOption {
  name: string;
  role: string;
  status: string;
}

interface AttachJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orders: AvailableOrderOption[];
  agents: AvailableAgentOption[];
  onAttached?: (orderId: string, agentName: string) => void;
}

export function AttachJobModal({
  open,
  onOpenChange,
  orders,
  agents,
  onAttached,
}: AttachJobModalProps) {
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedAgentName, setSelectedAgentName] = useState("");

  const handleAttachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Jika user belum memilih secara eksplisit, gunakan opsi pertama jika tersedia
    const effectiveOrderId = selectedOrderId || (orders.length > 0 ? orders[0].id : "");
    const effectiveAgentName = selectedAgentName || (agents.length > 0 ? agents[0].name : "");

    if (!effectiveOrderId || !effectiveAgentName) {
      toast.error("Harap pastikan minimal satu Client Order dan AI Agent tersedia.");
      return;
    }

    const orderObj = orders.find((o) => o.id === effectiveOrderId);
    if (onAttached) {
      onAttached(effectiveOrderId, effectiveAgentName);
    }

    toast.success(
      `Order ${effectiveOrderId} ("${orderObj?.title || "Bug Fix"}") berhasil di-attach ke agent ${effectiveAgentName}!`
    );
    setSelectedOrderId("");
    setSelectedAgentName("");
    onOpenChange(false);
  };

  const currentOrder = orders.find((o) => o.id === (selectedOrderId || (orders[0]?.id ?? "")));
  const currentAgent = agents.find((a) => a.name === (selectedAgentName || (agents[0]?.name ?? "")));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-xl rounded-[10px] p-0 bg-white border border-[#E7E5E4] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-7 py-5 border-b border-[#E7E5E4] bg-[#FAF9F9]">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#FFE4E6] text-[#881337]">
              <Link2 className="size-4" />
            </span>
            <DialogTitle className="text-base font-semibold tracking-tight text-[#1C1917]">
              Attach Job ke AI Agent
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#78716C]">
            Pilih Order Client yang ingin diproses, lalu tentukan Agen AI Autonomous yang akan mengeksekusi bug fixing.
          </DialogDescription>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAttachSubmit} className="p-7 space-y-5 text-xs">
          {/* Input 1: Pilih Order */}
          <div>
            <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
              1. Pilih Client Order
            </label>
            <div className="relative">
              <select
                value={selectedOrderId || (orders.length > 0 ? orders[0].id : "")}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full h-10 px-3.5 pr-8 appearance-none rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] text-xs font-medium text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#881337]/30"
              >
                {orders.length === 0 ? (
                  <option value="">(Belum ada Client Order tersedia)</option>
                ) : (
                  orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      [{o.id}] {o.clientName} — {o.title} ({o.feeAmount || "Fee N/A"})
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none" />
            </div>

            {currentOrder && (
              <div className="mt-2 p-3 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] space-y-1">
                <span className="text-[11px] text-[#78716C] font-mono block">
                  Repository: <span className="text-[#1C1917] font-semibold">{currentOrder.repoUrl}</span>
                </span>
                <span className="text-[11px] text-[#78716C] block">
                  Task: <span className="text-[#1C1917]">{currentOrder.title}</span>
                </span>
              </div>
            )}
          </div>

          {/* Input 2: Pilih AI Agent */}
          <div>
            <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
              2. Pilih AI Agent Eksekutor
            </label>
            <div className="relative">
              <select
                value={selectedAgentName || (agents.length > 0 ? agents[0].name : "")}
                onChange={(e) => setSelectedAgentName(e.target.value)}
                className="w-full h-10 px-3.5 pr-8 appearance-none rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] text-xs font-medium text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#881337]/30"
              >
                {agents.length === 0 ? (
                  <option value="">(Belum ada AI Agent tersedia)</option>
                ) : (
                  agents.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name} ({a.role}) — Status: {a.status}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none" />
            </div>

            {currentAgent && (
              <div className="mt-2 p-3 rounded-[6px] bg-rose-50/40 border border-[#FECDD3] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <Cpu className="size-3.5 text-[#881337]" />
                  <span className="text-[#881337] font-medium">{currentAgent.role}</span>
                </div>
                <span className="text-emerald-700 font-semibold font-mono">
                  {currentAgent.status}
                </span>
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex justify-end gap-2 border-t border-[#E7E5E4]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="default" size="sm">
              <Link2 className="size-3.5 mr-1" /> Attach & Inisialisasi AI
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
