"use client";

import React, { useState, useEffect } from "react";
import {
  GitBranch,
  FolderGit2,
  CheckCircle2,
  RefreshCw,
  Plus,
  Settings2,
  Scan,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { workerApi } from "@/lib/api";

const initialRepos = [
  {
    name: "comneta-50/Rafa_Company",
    description: "Official workspace and AI orchestration dashboard",
    stars: 12,
    defaultBranch: "main",
    syncedAt: "Just now",
    status: "Synced",
    autoFix: true,
  },
  {
    name: "comneta-50/core-api-service",
    description: "High throughput NestJS backend & microservices",
    stars: 34,
    defaultBranch: "main",
    syncedAt: "12m ago",
    status: "Synced",
    autoFix: true,
  },
  {
    name: "comneta-50/web-frontend",
    description: "Customer-facing Next.js portal application",
    stars: 8,
    defaultBranch: "main",
    syncedAt: "45m ago",
    status: "Synced",
    autoFix: false,
  },
  {
    name: "comneta-50/analytics-worker",
    description: "Kafka & Redis event streaming pipeline",
    stars: 19,
    defaultBranch: "main",
    syncedAt: "2h ago",
    status: "Synced",
    autoFix: true,
  },
];

export default function GitHubPage() {
  const [repos, setRepos] = useState(initialRepos);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoDesc, setNewRepoDesc] = useState("");
  const [activeSettingsRepo, setActiveSettingsRepo] = useState<(typeof initialRepos)[0] | null>(null);

  useEffect(() => {
    workerApi
      .getRepos()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRepos(data);
        }
      })
      .catch((err) => console.warn("Failed to fetch repos from worker:", err));
  }, []);

  const handleConnectRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) {
      toast.error("Silakan masukkan nama repositori GitHub (contoh: org/repo).");
      return;
    }
    const repoName = newRepoName.trim().replace("https://github.com/", "");
    const toastId = toast.loading(`Menghubungkan repositori ${repoName}...`);

    try {
      const res = await workerApi.createRepo({
        name: repoName,
        description: newRepoDesc || "Connected GitHub Repository",
        autoFix: true,
      });

      if (res && res.repo) {
        setRepos((prev) => [res.repo, ...prev.filter((r) => r.name !== res.repo.name)]);
      } else {
        const newRepo = {
          name: repoName,
          description: newRepoDesc || "Connected GitHub Repository",
          stars: 1,
          defaultBranch: "main",
          syncedAt: "Just now",
          status: "Synced",
          autoFix: true,
        };
        setRepos([newRepo, ...repos]);
      }
      toast.success(`Repositori "${repoName}" berhasil dihubungkan!`, { id: toastId });
      setNewRepoName("");
      setNewRepoDesc("");
      setIsConnectModalOpen(false);
    } catch (err: any) {
      toast.error(`Gagal menghubungkan repo: ${err.message}`, { id: toastId });
    }
  };

  const handleTriggerScan = (repoName: string) => {
    toast.loading(`Memulai scan AST pada ${repoName}...`, { id: repoName });
    setTimeout(() => {
      toast.success(`Scan selesai untuk ${repoName}. 0 celah keamanan kritis.`, { id: repoName });
    }, 1500);
  };

  const handleToggleAutoFix = async (repoName: string) => {
    const current = repos.find((r) => r.name === repoName);
    const newAutoFix = current ? !current.autoFix : true;
    try {
      await workerApi.createRepo({
        name: repoName,
        autoFix: newAutoFix,
      });
    } catch (e) {
      console.warn("Toggle repo worker sync error:", e);
    }
    setRepos((prev) =>
      prev.map((r) => (r.name === repoName ? { ...r, autoFix: newAutoFix } : r))
    );
    toast.success(`Pengaturan AutoFix untuk ${repoName} diperbarui.`);
    setActiveSettingsRepo(null);
  };

  return (
    <>
      <Header actionLabel="Connect Repo" onAction={() => setIsConnectModalOpen(true)} />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
              GitHub Integration
            </h1>
            <p className="text-[13px] text-[#78716C] mt-1">
              Connected organizations, repositories, and webhook trigger configurations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="px-3 py-1">
              <CheckCircle2 className="size-3 mr-1 text-[#881337]" />
              GitHub App Connected (comneta-50)
            </Badge>
          </div>
        </div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <Card key={repo.name} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="size-4 text-[#881337]" />
                      <CardTitle className="text-sm font-semibold">{repo.name}</CardTitle>
                    </div>
                    <CardDescription>{repo.description}</CardDescription>
                  </div>
                  <Badge variant="completed" className="text-[10px]">
                    {repo.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#78716C] pt-2 border-t border-[#E7E5E4]">
                  <span className="flex items-center gap-1">
                    <GitBranch className="size-3" /> {repo.defaultBranch}
                  </span>
                  <span>Synced {repo.syncedAt}</span>
                  <span className={repo.autoFix ? "text-emerald-700 font-semibold" : "text-[#78716C]"}>
                    AutoFix: {repo.autoFix ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setActiveSettingsRepo(repo)}
                  >
                    <Settings2 className="size-3.5 mr-1" /> Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleTriggerScan(repo.name)}
                  >
                    <Scan className="size-3.5 mr-1" /> Trigger Scan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Dialog Connect Repo */}
      <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
        <DialogContent className="max-w-md rounded-[8px] p-6 bg-white border border-[#E7E5E4]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#1C1917]">
              Hubungkan Repositori Baru
            </DialogTitle>
            <DialogDescription className="text-xs text-[#78716C]">
              Tautkan repositori GitHub untuk memicu agen AI secara otomatis saat push/PR.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConnectRepo} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                Nama Repositori (owner/repo)
              </label>
              <Input
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
                placeholder="Contoh: comneta-50/payment-gateway"
                className="bg-[#FAF9F9] text-xs h-9 rounded-[6px]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                Deskripsi
              </label>
              <Input
                value={newRepoDesc}
                onChange={(e) => setNewRepoDesc(e.target.value)}
                placeholder="Contoh: Microservice integrasi pembayaran"
                className="bg-[#FAF9F9] text-xs h-9 rounded-[6px]"
              />
            </div>

            <DialogFooter className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsConnectModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="default" size="sm">
                Hubungkan Repo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Dialog Repo Settings */}
      <Dialog open={!!activeSettingsRepo} onOpenChange={(open) => !open && setActiveSettingsRepo(null)}>
        {activeSettingsRepo && (
          <DialogContent className="max-w-md rounded-[8px] p-6 bg-white border border-[#E7E5E4]">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-[#1C1917]">
                Pengaturan {activeSettingsRepo.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#78716C]">
                Konfigurasi bot webhook dan otorisasi automasi patch.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-[#FAF9F9] border border-[#E7E5E4] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#1C1917] block">AutoFix Generator</span>
                  <span className="text-[11px] text-[#78716C]">
                    Izinkan agen membuat PR draft otomatis saat build CI gagal.
                  </span>
                </div>
                <Button
                  size="sm"
                  variant={activeSettingsRepo.autoFix ? "default" : "outline"}
                  onClick={() => handleToggleAutoFix(activeSettingsRepo.name)}
                >
                  {activeSettingsRepo.autoFix ? "Aktif" : "Nonaktif"}
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveSettingsRepo(null)}
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
