"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  Key,
  Shield,
  Bell,
  Cpu,
  Sliders,
  Check,
  RotateCw,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("RAFA Company");
  const [apiKey, setApiKey] = useState("sk-ant-api03-92f8a1...491b");
  const [neuronsBudget, setNeuronsBudget] = useState("100,000");
  const [autoApproveLowRisk, setAutoApproveLowRisk] = useState(true);
  const [requireQaPass, setRequireQaPass] = useState(true);

  const handleSaveAll = () => {
    toast.success("Semua pengaturan workspace berhasil diperbarui dan disimpan!");
  };

  const handleSaveIdentity = () => {
    toast.success(`Identitas workspace diperbarui: "${workspaceName}", kuota: ${neuronsBudget} Neurons.`);
  };

  const handleSavePolicy = () => {
    toast.success("Kebijakan otonomi dan approval merge gate berhasil disimpan.");
  };

  const handleRotateKey = () => {
    const newKey = `sk-ant-api03-${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`;
    setApiKey(newKey);
    toast.success("LLM Gateway Secret Token berhasil di-rotate!");
  };

  return (
    <>
      <Header actionLabel="Save All" onAction={handleSaveAll} />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
              Workspace Settings
            </h1>
            <p className="text-[13px] text-[#78716C] mt-1">
              Manage organization preferences, AI agent models, API tokens, and approval thresholds.
            </p>
          </div>
          <Badge variant="default" className="px-3 py-1">
            Production Cluster Active
          </Badge>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Workspace Card */}
          <Card>
            <CardHeader>
              <CardTitle>Workspace Identity</CardTitle>
              <CardDescription>Primary organization information & branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                  Company / Workspace Name
                </label>
                <Input
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="bg-[#FAF9F9]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                  Monthly Neurons Budget Quota
                </label>
                <Input
                  value={neuronsBudget}
                  onChange={(e) => setNeuronsBudget(e.target.value)}
                  className="bg-[#FAF9F9] font-mono"
                />
              </div>

              <div className="pt-2">
                <Button variant="default" size="sm" onClick={handleSaveIdentity}>
                  Save Identity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Security & Autonomy Gate */}
          <Card>
            <CardHeader>
              <CardTitle>Autonomy & Approval Policy</CardTitle>
              <CardDescription>Control human-in-the-loop merge requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3.5 bg-[#FAF9F9] border border-[#E7E5E4] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#1C1917] block">
                    Auto-Approve Low-Risk Fixes
                  </span>
                  <span className="text-[11px] text-[#78716C]">
                    Allow typo and docstring patches to merge without human review
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoApproveLowRisk}
                  onChange={(e) => setAutoApproveLowRisk(e.target.checked)}
                  className="accent-[#881337] size-4 rounded cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-[#FAF9F9] border border-[#E7E5E4] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#1C1917] block">
                    Require QA Regression Pass
                  </span>
                  <span className="text-[11px] text-[#78716C]">
                    Enforce Test Runner Bot 100% green status before merge PR
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={requireQaPass}
                  onChange={(e) => setRequireQaPass(e.target.checked)}
                  className="accent-[#881337] size-4 rounded cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <Button variant="default" size="sm" onClick={handleSavePolicy}>
                  Save Policy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Keys Configuration */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>AI Provider Credentials</CardTitle>
              <CardDescription>API Keys for LLM inference and agent reasoning engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                  LLM Gateway Secret Token
                </label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-[#FAF9F9] font-mono flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={handleRotateKey}>
                    <RotateCw className="size-3.5 mr-1" /> Rotate Key
                  </Button>
                </div>
                <span className="text-[11px] text-[#78716C] mt-1 block">
                  Keys are stored encrypted with hardware security modules (HSM).
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
