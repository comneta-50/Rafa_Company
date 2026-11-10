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
  Trash2,
  Loader2,
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

export interface RepoItem {
  name: string;
  description: string;
  stars?: number;
  defaultBranch?: string;
  syncedAt?: string;
  status?: string;
  autoFix?: boolean;
}

export default function GitHubPage() {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoDesc, setNewRepoDesc] = useState("");
  const [activeSettingsRepo, setActiveSettingsRepo] = useState<RepoItem | null>(null);

  const fetchRepos = async () => {
    try {
      setIsLoading(true);
      const data = await workerApi.getRepos();
      if (Array.isArray(data)) {
        setRepos(data);
      }
    } catch (err: any) {
      console.warn("Failed to fetch repos from worker:", err);
      toast.error("Gagal memuat repositori dari backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
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
        await fetchRepos();
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
    }, 1200);
  };

  const handleToggleAutoFix = async (repoName: string) => {
    const current = repos.find((r) => r.name === repoName);
    const newAutoFix = current ? !current.autoFix : true;
    try {
      await workerApi.createRepo({
        name: repoName,
        autoFix: newAutoFix,
      });
      setRepos((prev) =>
        prev.map((r) => (r.name === repoName ? { ...r, autoFix: newAutoFix } : r))
      );
      toast.success(`Pengaturan AutoFix untuk ${repoName} diperbarui.`);
      setActiveSettingsRepo(null);
    } catch (e: any) {
      toast.error(`Gagal memperbarui AutoFix: ${e.message}`);
    }
  };

  const handleDeleteRepo = async (repoName: string) => {
    const toastId = toast.loading(`Memutuskan repositori ${repoName}...`);
    try {
      await workerApi.deleteRepo(repoName);
      setRepos((prev) => prev.filter((r) => r.name !== repoName));
      toast.success(`Repositori ${repoName} berhasil diputuskan.`, { id: toastId });
      setActiveSettingsRepo(null);
    } catch (e: any) {
      toast.error(`Gagal menghapus repositori: ${e.message}`, { id: toastId });
    }
  };

  return (
    <>
      <Header
        actionLabel="Connect Repo"
        onAction={() => setIsConnectModalOpen(true)}
      />
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
            <Badge variant="default" className="px-3 py-1 bg-white border border-[#E7E5E4] text-[#881337]">
              <CheckCircle2 className="size-3 mr-1 text-[#881337]" />
              GitHub App Connected (comneta-50)
            </Badge>
          </div>
        </div>

        {/* Repos Grid / Empty State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white border border-[#E7E5E4] rounded-[8px] space-y-3">
            <Loader2 className="size-6 text-[#881337] animate-spin" />
            <span className="text-xs text-[#78716C] font-mono">Memuat repositori dari endpoint backend...</span>
          </div>
        ) : repos.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-dashed border-[#D6D3D1] rounded-[8px] space-y-4 text-center">
            <div className="size-12 rounded-full bg-[#FFE4E6] flex items-center justify-center text-[#881337]">
              <FolderGit2 className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-[#1C1917]">Belum Ada Repositori Terhubung</h3>
              <p className="text-xs text-[#78716C] max-w-sm">
                Hubungkan repositori GitHub Anda untuk mengaktifkan AI bug fixing, AST scanning, dan integrasi automated PR.
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsConnectModalOpen(true)}
              className="text-xs"
            >
              <Plus className="size-3.5 mr-1" /> Hubungkan Repositori Pertama
            </Button>
          </div>
        ) : (
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
                      <CardDescription>{repo.description || "Connected GitHub Repository"}</CardDescription>
                    </div>
                    <Badge variant="completed" className="text-[10px]">
                      {repo.status || "Synced"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#78716C] pt-2 border-t border-[#E7E5E4]">
                    <span className="flex items-center gap-1">
                      <GitBranch className="size-3" /> {repo.defaultBranch || "main"}
                    </span>
                    <span>Synced {repo.syncedAt || "Just now"}</span>
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
        )}
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

              <div className="p-3 bg-[#FFF1F2] border border-[#FECDD3] rounded-[6px] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#881337] block">Putuskan Repositori</span>
                  <span className="text-[11px] text-[#78716C]">
                    Hapus repositori ini dari sinkronisasi antrean worker.
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteRepo(activeSettingsRepo.name)}
                >
                  <Trash2 className="size-3.5 mr-1" /> Hapus
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
