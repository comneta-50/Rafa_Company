"use client";

import React, { useState, useEffect } from "react";
import { workerApi } from "@/lib/api";
import {
  ShoppingCart,
  Plus,
  GitBranch,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Clock,
  Download,
  ExternalLink,
  Bot,
  FileCode,
  ArrowRight,
  Archive,
  RefreshCw,
  FolderGit2,
  Lock,
  DollarSign,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { CreateOrderModal, ClientOrderFormData } from "@/components/orders/create-order-modal";

export interface LifecycleOrder {
  id: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  feeAmount: string;
  bugDescription: string;
  repoUrl: string;
  branchName: string;
  status:
    | "order_created"
    | "repo_connected"
    | "ai_fixing"
    | "client_review"
    | "job_closed";
  aiStage?: "Analyzer" | "Approval" | "Developer" | "QA" | "Ready";
  retentionExpires: string;
  prUrl?: string;
  zipDownloaded?: boolean;
  workspaceDestroyed?: boolean;
}

const initialOrders: LifecycleOrder[] = [];

export default function OrdersPage() {
  const [orders, setOrders] = useState<LifecycleOrder[]>(initialOrders);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [activeOrderAction, setActiveOrderAction] = useState<LifecycleOrder | null>(null);

  useEffect(() => {
    workerApi
      .getOrders()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
        }
      })
      .catch((err) => console.warn("Failed to fetch orders from worker:", err));
  }, []);

  const handleOrderCreated = async (data: ClientOrderFormData) => {
    const toastId = toast.loading("Mendaftarkan order ke sistem backend...");
    try {
      const res = await workerApi.createOrder({
        clientRef: data.clientRef,
        clientName: data.clientRef,
        clientEmail: "client@contact.com",
        packageType: `${data.platform} (${data.contractType})`,
        feeAmount: data.feeAmount,
        bugDescription: data.bugDescription,
        repoUrl: data.repoUrl.replace("https://github.com/", ""),
      });

      if (res && res.order) {
        setOrders((prev) => [res.order, ...prev]);
        toast.success(`Order ${res.order.id} berhasil dibuat!`, { id: toastId });
      } else {
        toast.success("Order berhasil dibuat!", { id: toastId });
      }
    } catch (err: any) {
      toast.error(`Gagal membuat order: ${err.message}`, { id: toastId });
    }
  };

  // 1. Hubungkan Repo Sementara & Spawn Isolated Workspace
  const handleConnectTemporaryRepo = async (orderId: string) => {
    toast.loading("Mengotorisasi GitHub App sementara & meng-clone ke isolated workspace...", {
      id: orderId,
    });
    try {
      const res = await workerApi.connectOrderRepo(orderId);
      if (res && res.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order : o)));
      }
      toast.success(
        "Repository dihubungkan sementara! Source code di-ingest ke isolated runner.",
        { id: orderId }
      );
    } catch (err: any) {
      toast.error(`Gagal menghubungkan repository: ${err.message}`, { id: orderId });
    }
  };

  // 2. Jalankan AI Pipeline (Analyzer -> Approval -> Developer -> QA)
  const handleStartAIFixing = async (orderId: string) => {
    toast.loading("Memulai AI Pipeline: Analyzer Agent mengaudit AST...", { id: orderId });
    try {
      const res = await workerApi.startOrderFixing(orderId);
      if (res && res.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order : o)));
      }
      toast.success("AI Bug fixing pipeline aktif! Developer Agent sedang bekerja.", {
        id: orderId,
      });
    } catch (err: any) {
      toast.error(`Gagal menjalankan pipeline: ${err.message}`, { id: orderId });
    }
  };

  // 3. Download Bundle Patch ZIP
  const handleDownloadPatchZip = (order: LifecycleOrder) => {
    toast.success(`Bundle Patch ZIP (${order.id}-patch.zip) berhasil di-download!`);
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, zipDownloaded: true } : o))
    );
  };

  // 4. Job Ditutup: Cabut Akses GitHub & Hancurkan Workspace
  const handleCloseJobAndPurge = async (orderId: string) => {
    toast.loading("Mencabut akses token GitHub & membersihkan storage isolated workspace...", {
      id: orderId,
    });
    try {
      const res = await workerApi.closeOrder(orderId);
      if (res && res.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order : o)));
      }
      toast.success(
        "Siklus Selesai: Akses repository telah dicabut & workspace dihapus permanen (Zero Retention).",
        { id: orderId }
      );
    } catch (err: any) {
      toast.error(`Gagal menutup order: ${err.message}`, { id: orderId });
    } finally {
      setActiveOrderAction(null);
    }
  };

  return (
    <>
      <Header
        actionLabel="Order Baru Client"
        onAction={() => setIsNewOrderModalOpen(true)}
      />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Title & Explanation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
              Client Orders & Ephemeral Repo Lifecycle
            </h1>
            <p className="text-[13px] text-[#78716C] mt-1">
              Alur kerja aman pay-per-bug: Repository dihubungkan sementara, diperbaiki AI di sandbox terisolasi, diserahkan, lalu akses dicabut otomatis.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="px-3 py-1">
              <Lock className="size-3 mr-1 text-[#881337]" />
              Zero-Retention Policy Active
            </Badge>
          </div>
        </div>

        {/* 5-Step Visual Lifecycle Stepper */}
        <Card className="bg-gradient-to-r from-stone-50 via-white to-rose-50/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold tracking-wider uppercase text-[#78716C]">
              Arsitektur Siklus Hidup Repository Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-white border border-[#E7E5E4] rounded-[6px] shadow-2xs">
                <span className="font-mono text-[10px] text-[#881337] font-semibold block mb-1">
                  FASE 1
                </span>
                <span className="font-semibold text-[#1C1917] block">Client Order</span>
                <span className="text-[11px] text-[#78716C] mt-0.5 block">
                  Client mendaftar bug & menyetujui fee pembayaran.
                </span>
              </div>

              <div className="p-3 bg-white border border-[#E7E5E4] rounded-[6px] shadow-2xs">
                <span className="font-mono text-[10px] text-[#881337] font-semibold block mb-1">
                  FASE 2
                </span>
                <span className="font-semibold text-[#1C1917] block">Koneksi Sementara</span>
                <span className="text-[11px] text-[#78716C] mt-0.5 block">
                  GitHub App diotorisasi sementara ke isolated sandbox.
                </span>
              </div>

              <div className="p-3 bg-white border border-[#E7E5E4] rounded-[6px] shadow-2xs">
                <span className="font-mono text-[10px] text-[#881337] font-semibold block mb-1">
                  FASE 3
                </span>
                <span className="font-semibold text-[#1C1917] block">AI Bug Fixing</span>
                <span className="text-[11px] text-[#78716C] mt-0.5 block">
                  Analyzer → Approval Gate → Developer → QA Tests.
                </span>
              </div>

              <div className="p-3 bg-white border border-[#E7E5E4] rounded-[6px] shadow-2xs">
                <span className="font-mono text-[10px] text-[#881337] font-semibold block mb-1">
                  FASE 4
                </span>
                <span className="font-semibold text-[#1C1917] block">Serah Terima</span>
                <span className="text-[11px] text-[#78716C] mt-0.5 block">
                  PR siap di-merge client atau di-download sebagai ZIP patch.
                </span>
              </div>

              <div className="p-3 bg-white border border-[#E7E5E4] rounded-[6px] shadow-2xs">
                <span className="font-mono text-[10px] text-[#881337] font-semibold block mb-1">
                  FASE 5
                </span>
                <span className="font-semibold text-[#1C1917] block">Job Closed & Purge</span>
                <span className="text-[11px] text-[#78716C] mt-0.5 block">
                  Akses dicabut & disk workspace dimusnahkan.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Listing Container */}
        <div className="space-y-4">
          {orders.map((order) => {
            const isClosed = order.status === "job_closed";
            const isReview = order.status === "client_review";
            const isFixing = order.status === "ai_fixing";
            const isConnected = order.status === "repo_connected";
            const isCreated = order.status === "order_created";

            return (
              <Card
                key={order.id}
                className={`transition-all ${
                  isClosed
                    ? "opacity-75 bg-[#FAF9F9]"
                    : "hover:border-[#D6D3D1] hover:shadow-2xs"
                }`}
              >
                <CardHeader className="bg-[#FAF9F9] border-b border-[#E7E5E4] pb-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#881337]">
                          {order.id}
                        </span>
                        <span className="text-sm font-semibold text-[#1C1917]">
                          {order.clientName}
                        </span>
                        <span className="px-2 py-0.5 rounded-[4px] bg-rose-50 text-[#881337] font-mono font-bold text-xs border border-[#FECDD3]">
                          {order.feeAmount}
                        </span>
                        <Badge
                          variant={
                            isClosed
                              ? "secondary"
                              : isReview
                              ? "completed"
                              : isFixing
                              ? "fixing"
                              : isConnected
                              ? "testing"
                              : "outline"
                          }
                          className="text-[10px]"
                        >
                          {isClosed
                            ? "JOB DITUTUP (PURGED)"
                            : isReview
                            ? "MENUNGGU REVIEW CLIENT"
                            : isFixing
                            ? `AI FIXING (${order.aiStage})`
                            : isConnected
                            ? "REPO TERHUBUNG SEMENTARA"
                            : "ORDER BARU"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#78716C] font-mono">
                        <span className="flex items-center gap-1">
                          <FolderGit2 className="size-3" /> {order.repoUrl}
                        </span>
                        <span>•</span>
                        <span>{order.packageType}</span>
                        <span>•</span>
                        <span>{order.clientEmail}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono text-[#78716C] flex items-center gap-1">
                        <Clock className="size-3" /> Retensi: {order.retentionExpires}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  <div>
                    <span className="text-[11px] uppercase font-semibold text-[#78716C] tracking-wider block mb-1">
                      Deskripsi Masalah / Bug Report:
                    </span>
                    <p className="text-xs text-[#1C1917] font-medium leading-relaxed bg-[#FAF9F9] p-3 rounded-[6px] border border-[#E7E5E4]">
                      {order.bugDescription}
                    </p>
                  </div>

                  {/* Flow Action Buttons */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-[#E7E5E4]">
                    <div className="text-xs text-[#78716C] flex items-center gap-2">
                      {isClosed ? (
                        <span className="text-stone-500 font-mono text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-stone-400" /> Akses GitHub telah dicabut. Zero source code tersisa.
                        </span>
                      ) : isReview ? (
                        <span className="text-emerald-700 font-medium text-xs flex items-center gap-1">
                          <CheckCircle2 className="size-3.5" /> Patch siap diserahkan melalui PR atau ZIP.
                        </span>
                      ) : (
                        <span className="text-[#78716C] text-xs">
                          Isolated Workspace: {order.branchName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Step 1: Hubungkan Repo */}
                      {isCreated && (
                        <Button
                          variant="default"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleConnectTemporaryRepo(order.id)}
                        >
                          <GitBranch className="size-3.5 mr-1" /> Hubungkan Repo Sementara
                        </Button>
                      )}

                      {/* Step 2: Jalankan AI Pipeline */}
                      {isConnected && (
                        <Button
                          variant="default"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleStartAIFixing(order.id)}
                        >
                          <Bot className="size-3.5 mr-1" /> Jalankan AI Fixing (4 Stage)
                        </Button>
                      )}

                      {/* Step 3: Hasil & Review Client */}
                      {isReview && (
                        <>
                          {order.prUrl && (
                            <a href={order.prUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="text-xs">
                                <ExternalLink className="size-3.5 mr-1" /> Buka Pull Request
                              </Button>
                            </a>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleDownloadPatchZip(order)}
                          >
                            <Download className="size-3.5 mr-1" /> Unduh Patch ZIP
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="text-xs bg-stone-900 text-white hover:bg-black"
                            onClick={() => setActiveOrderAction(order)}
                          >
                            <Trash2 className="size-3.5 mr-1 text-rose-400" /> Tutup Job & Cabut Akses
                          </Button>
                        </>
                      )}

                      {/* Step 4: Closed */}
                      {isClosed && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs opacity-60"
                          disabled
                        >
                          <Archive className="size-3.5 mr-1" /> Arsip Selesai
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal Dialog Order Baru dengan Fee Amount */}
      <CreateOrderModal
        open={isNewOrderModalOpen}
        onOpenChange={setIsNewOrderModalOpen}
        onOrderCreated={handleOrderCreated}
      />

      {/* Modal Konfirmasi Tutup Job & Purge Repository */}
      <Dialog open={!!activeOrderAction} onOpenChange={(open) => !open && setActiveOrderAction(null)}>
        {activeOrderAction && (
          <DialogContent className="max-w-md rounded-[8px] p-6 bg-white border border-[#E7E5E4]">
            <DialogHeader>
              <div className="size-10 rounded-[6px] bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 mb-2">
                <ShieldAlert className="size-5" />
              </div>
              <DialogTitle className="text-base font-semibold text-[#1C1917]">
                Tutup Job & Cabut Akses Repositori?
              </DialogTitle>
              <DialogDescription className="text-xs text-[#78716C] leading-relaxed">
                Tindakan ini akan:
                <br />1. **Mencabut akses GitHub App / token** ke <span className="font-mono text-[#1C1917]">{activeOrderAction.repoUrl}</span>
                <br />2. **Menghapus seluruh file** di isolated workspace runner
                <br />3. **Menandai order selesai** sesuai kebijakan retensi zero-data.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-3 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveOrderAction(null)}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCloseJobAndPurge(activeOrderAction.id)}
              >
                Ya, Cabut Akses & Hapus Workspace
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
