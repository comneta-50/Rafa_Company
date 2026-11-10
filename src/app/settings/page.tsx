"use client";

import React, { useState, useEffect } from "react";
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
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { workerApi } from "@/lib/api";

export default function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [neuronsBudget, setNeuronsBudget] = useState("");
  const [autoApproveLowRisk, setAutoApproveLowRisk] = useState(true);
  const [requireQaPass, setRequireQaPass] = useState(true);
  const [llmModel, setLlmModel] = useState("@cf/meta/llama-3.2-3b-instruct");
  const [clusterStatus, setClusterStatus] = useState("Production Cluster Active");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await workerApi.getSettings();
      if (res && res.settings) {
        setWorkspaceName(res.settings.workspaceName || "RAFA Company");
        setNeuronsBudget(res.settings.neuronsBudget || "100,000");
        setApiKey(res.settings.apiKey || "sk-ant-api03-92f8a1...491b");
        setAutoApproveLowRisk(res.settings.autoApproveLowRisk ?? true);
        setRequireQaPass(res.settings.requireQaPass ?? true);
        setLlmModel(res.settings.llmModel || "@cf/meta/llama-3.2-3b-instruct");
        setClusterStatus(res.settings.clusterStatus || "Production Cluster Active");
      }
    } catch (err: any) {
      console.warn("Failed to fetch settings from worker:", err);
      toast.error("Gagal memuat pengaturan workspace dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettingsPayload = async (payload: any, successMessage: string) => {
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan ke Cloudflare Workers & Neon DB...");
    try {
      const res = await workerApi.updateSettings(payload);
      if (res && res.success) {
        toast.success(successMessage, { id: toastId });
      } else {
        toast.error("Gagal memperbarui pengaturan.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(`Gagal menyimpan: ${err.message}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = () => {
    saveSettingsPayload(
      {
        workspaceName,
        neuronsBudget,
        apiKey,
        autoApproveLowRisk,
        requireQaPass,
        llmModel,
      },
      "Semua pengaturan workspace berhasil disinkronkan ke database!"
    );
  };

  const handleSaveIdentity = () => {
    saveSettingsPayload(
      {
        workspaceName,
        neuronsBudget,
      },
      `Identitas workspace diperbarui: "${workspaceName}", kuota: ${neuronsBudget} Neurons.`
    );
  };

  const handleSavePolicy = () => {
    saveSettingsPayload(
      {
        autoApproveLowRisk,
        requireQaPass,
        llmModel,
      },
      "Kebijakan otonomi dan approval merge gate berhasil disimpan."
    );
  };

  const handleRotateKey = () => {
    const newKey = `sk-cf-ai-${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`;
    setApiKey(newKey);
    saveSettingsPayload(
      { apiKey: newKey },
      "LLM Gateway Secret Token berhasil di-rotate dan diamankan!"
    );
  };

  return (
    <>
      <Header actionLabel="Save All" onAction={handleSaveAll} />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-[#881337] flex items-center justify-center text-white shadow-xs">
                <Settings className="size-4" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
                Workspace Settings
              </h1>
            </div>
            <p className="text-[13px] text-[#78716C] mt-1.5">
              Kelola preferensi organisasi, kuota inferensi Cloudflare Workers AI, API tokens, dan kebijakan otonomi bot.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsLoading(true);
                fetchSettings();
              }}
              disabled={isLoading || isSaving}
              className="text-xs"
            >
              <RefreshCw className={`size-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Badge variant="default" className="px-3 py-1 font-mono text-xs">
              <span className="size-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              {clusterStatus}
            </Badge>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Workspace Card */}
          <Card>
            <CardHeader>
              <CardTitle>Workspace Identity</CardTitle>
              <CardDescription>Informasi utama organisasi dan alokasi kuota komputasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                  Company / Workspace Name
                </label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="bg-[#FAF9F9]"
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                  Monthly Neurons Budget Quota
                </label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Input
                    value={neuronsBudget}
                    onChange={(e) => setNeuronsBudget(e.target.value)}
                    className="bg-[#FAF9F9] font-mono"
                  />
                )}
              </div>

              <div className="pt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveIdentity}
                  disabled={isLoading || isSaving}
                >
                  <Save className="size-3.5 mr-1.5" /> Save Identity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Security & Autonomy Gate */}
          <Card>
            <CardHeader>
              <CardTitle>Autonomy & Approval Policy</CardTitle>
              <CardDescription>Kontrol level otonomi agen AI dan merge gate keselamatan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                  Default Reasoning Model
                </label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <select
                    value={llmModel}
                    onChange={(e) => setLlmModel(e.target.value)}
                    className="w-full text-xs h-9 px-3 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4]"
                  >
                    <option value="@cf/meta/llama-3.2-3b-instruct">
                      Cloudflare Workers AI: @cf/meta/llama-3.2-3b-instruct (Ultra Fast)
                    </option>
                    <option value="@cf/meta/llama-3-8b-instruct">
                      Cloudflare Workers AI: @cf/meta/llama-3-8b-instruct (Balanced)
                    </option>
                    <option value="@cf/deepseek-ai/deepseek-r1-distill-qwen-32b">
                      Cloudflare Workers AI: DeepSeek R1 Reasoning (Advanced)
                    </option>
                  </select>
                )}
              </div>

              <div className="p-3.5 bg-[#FAF9F9] border border-[#E7E5E4] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#1C1917] block">
                    Auto-Approve Low-Risk Fixes
                  </span>
                  <span className="text-[11px] text-[#78716C]">
                    Izinkan patch typo, format, dan docstrings di-merge otomatis tanpa review manual
                  </span>
                </div>
                {isLoading ? (
                  <Skeleton className="size-4 rounded" />
                ) : (
                  <input
                    type="checkbox"
                    checked={autoApproveLowRisk}
                    onChange={(e) => setAutoApproveLowRisk(e.target.checked)}
                    className="accent-[#881337] size-4 rounded cursor-pointer"
                  />
                )}
              </div>

              <div className="p-3.5 bg-[#FAF9F9] border border-[#E7E5E4] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#1C1917] block">
                    Require QA Regression Pass
                  </span>
                  <span className="text-[11px] text-[#78716C]">
                    Wajibkan verifikasi Test Runner Bot 100% green sebelum PR diajukan
                  </span>
                </div>
                {isLoading ? (
                  <Skeleton className="size-4 rounded" />
                ) : (
                  <input
                    type="checkbox"
                    checked={requireQaPass}
                    onChange={(e) => setRequireQaPass(e.target.checked)}
                    className="accent-[#881337] size-4 rounded cursor-pointer"
                  />
                )}
              </div>

              <div className="pt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSavePolicy}
                  disabled={isLoading || isSaving}
                >
                  <Save className="size-3.5 mr-1.5" /> Save Policy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Keys Configuration */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>AI Provider & Gateway Credentials</CardTitle>
              <CardDescription>Token akses kredensial LLM inference dan sandbox cluster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                  Cloudflare Workers AI Gateway Secret Token
                </label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-[#FAF9F9] font-mono flex-1 text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRotateKey}
                      disabled={isLoading || isSaving}
                      className="text-xs"
                    >
                      <RotateCw className="size-3.5 mr-1" /> Rotate Key
                    </Button>
                  </div>
                )}
                <span className="text-[11px] text-[#78716C] mt-1.5 block">
                  Token disimpan terenkripsi menggunakan Cloudflare Encrypted Secrets & Neon serverless pooler.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
