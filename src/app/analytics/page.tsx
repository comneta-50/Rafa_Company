"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Clock,
  Layers,
  Inbox,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { workerApi } from "@/lib/api";
import { toast } from "sonner";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    workerApi
      .getAnalytics(timeRange)
      .then((data) => {
        setAnalyticsData(data);
      })
      .catch((err) => {
        console.warn("Failed to fetch analytics:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [timeRange]);

  // Chart 1: Line Chart - Task Masuk vs Selesai vs Gagal over time
  const lineChartData = {
    labels: analyticsData?.lineChart?.labels || ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    datasets: [
      {
        label: "Task Masuk",
        data: analyticsData?.lineChart?.incoming || [0, 0, 0, 0, 0, 0, 0],
        borderColor: "#78716C",
        backgroundColor: "rgba(120, 113, 108, 0.1)",
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Task Selesai",
        data: analyticsData?.lineChart?.completed || [0, 0, 0, 0, 0, 0, 0],
        borderColor: "#881337", // Maroon accent
        backgroundColor: "rgba(136, 19, 55, 0.12)",
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Task Gagal",
        data: analyticsData?.lineChart?.failed || [0, 0, 0, 0, 0, 0, 0],
        borderColor: "#DC2626", // Red
        backgroundColor: "rgba(220, 38, 38, 0.1)",
        tension: 0.35,
        fill: false,
        borderDash: [5, 5],
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          boxWidth: 12,
          font: { family: "Geist, sans-serif", size: 12 },
          color: "#78716C",
        },
      },
      tooltip: {
        backgroundColor: "#1C1917",
        titleFont: { family: "Geist, sans-serif", size: 12 },
        bodyFont: { family: "Geist, sans-serif", size: 11 },
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: { color: "#E7E5E4" },
        ticks: { color: "#78716C", font: { family: "Geist, sans-serif", size: 11 } },
      },
      y: {
        grid: { color: "#E7E5E4" },
        ticks: { color: "#78716C", font: { family: "Geist, sans-serif", size: 11 } },
        min: 0,
      },
    },
  };

  // Chart 2: Bar Chart - Distribusi Task Berdasarkan Kategori Status
  const barChartData = {
    labels: analyticsData?.barChart?.labels || ["Auth & Sec", "Database", "SSR Frontend", "API Worker", "Billing", "CI Pipeline"],
    datasets: [
      {
        label: "Selesai",
        data: analyticsData?.barChart?.completed || [0, 0, 0, 0, 0, 0],
        backgroundColor: "#881337",
        borderRadius: 4,
      },
      {
        label: "Gagal",
        data: analyticsData?.barChart?.failed || [0, 0, 0, 0, 0, 0],
        backgroundColor: "#DC2626",
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          boxWidth: 12,
          font: { family: "Geist, sans-serif", size: 12 },
          color: "#78716C",
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#78716C", font: { family: "Geist, sans-serif", size: 11 } },
      },
      y: {
        grid: { color: "#E7E5E4" },
        ticks: { color: "#78716C", font: { family: "Geist, sans-serif", size: 11 } },
      },
    },
  };

  // Chart 3: Doughnut Chart - Rasio Keseluruhan
  const doughnutData = {
    labels: analyticsData?.doughnut?.labels || ["Selesai", "Gagal", "Masuk (Queued)"],
    datasets: [
      {
        data: analyticsData?.doughnut?.data || [0, 0, 0],
        backgroundColor: ["#881337", "#DC2626", "#78716C"],
        borderWidth: 2,
        borderColor: "#FFFFFF",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 10,
          font: { family: "Geist, sans-serif", size: 11 },
          color: "#78716C",
        },
      },
    },
    cutout: "70%",
  };

  const handleGenerateReport = () => {
    toast.success("Laporan telemetri analitik berhasil diexport!");
  };

  return (
    <>
      <Header actionLabel="Generate Report" onAction={handleGenerateReport} />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
              Task Analytic & System Health
            </h1>
            <p className="text-[13px] text-[#78716C] mt-1">
              Visualisasi metrik pemantauan task masuk, selesai, dan yang gagal dengan analitik interaktif live.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === "24h" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("24h")}
            >
              24 Jam
            </Button>
            <Button
              variant={timeRange === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("7d")}
            >
              7 Hari Terakhir
            </Button>
            <Button
              variant={timeRange === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("30d")}
            >
              30 Hari
            </Button>
          </div>
        </div>

        {/* 3 Main Stat Metric Cards (Shimmer vs Real Data) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-[#78716C]">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">Total Task Masuk</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold font-mono tracking-tight text-[#1C1917]">
                    {analyticsData?.summary?.totalIncoming ?? 0}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#78716C] mt-1">
                    <ArrowUpRight className="size-3 text-[#881337]" />
                    <span>Rentang waktu: {timeRange}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#881337]">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">Task Selesai (Success)</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold font-mono tracking-tight text-[#881337]">
                    {analyticsData?.summary?.totalCompleted ?? 0}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1 font-medium">
                    <CheckCircle2 className="size-3" />
                    <span>{analyticsData?.summary?.completionRate || "100%"} completion rate</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-600">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">Task Gagal (Failed)</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold font-mono tracking-tight text-red-600">
                    {analyticsData?.summary?.totalFailed ?? 0}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-red-700 mt-1 font-medium">
                    <XCircle className="size-3" />
                    <span>{analyticsData?.summary?.failureRate || "0%"} failure rate</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chart Section 1: Main Trend Line Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="size-4 text-[#881337]" /> Tren Eksekusi Task (Masuk vs Selesai vs Gagal)
              </CardTitle>
              <CardDescription>
                Fluktuasi volume task harian yang ditangani oleh autonomous worker cluster
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              Live Feed
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[280px] w-full flex items-center justify-center bg-[#FAF9F9] rounded-[6px]">
                <Skeleton className="h-[240px] w-full mx-4 rounded-[6px]" />
              </div>
            ) : (
              <div className="h-[280px] w-full">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart Section 2: Bar & Doughnut Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart: Kategori Domain Bug */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="size-4 text-[#881337]" /> Distribusi Task Berdasarkan Domain Sistem
              </CardTitle>
              <CardDescription>
                Frekuensi penyelesaian bug berdasarkan microservice atau modul aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[240px] w-full flex items-center justify-center bg-[#FAF9F9] rounded-[6px]">
                  <Skeleton className="h-[200px] w-full mx-4 rounded-[6px]" />
                </div>
              ) : (
                <div className="h-[240px] w-full">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Doughnut Chart: Overall Task Ratio */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Layers className="size-4 text-[#881337]" /> Rasio Status Task
              </CardTitle>
              <CardDescription>Proporsi keberhasilan cluster autonomous</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[240px] w-full flex items-center justify-center bg-[#FAF9F9] rounded-[6px]">
                  <Skeleton className="size-36 rounded-full" />
                </div>
              ) : (
                <div className="h-[240px] w-full flex items-center justify-center">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Real-time Task Telemetry Log */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">Activity Logs Pemantauan Task</CardTitle>
              <CardDescription>
                Log kronologis pergantian status task (masuk, selesai, gagal) secara live
              </CardDescription>
            </div>
            <Link href="/activity">
              <Button variant="ghost" size="sm" className="text-xs text-[#78716C] hover:text-[#1C1917]">
                Lihat Semua Logs
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="size-6 rounded-[4px]" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            ) : !analyticsData?.recentLogs || analyticsData.recentLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#78716C] bg-[#FAF9F9] rounded-[6px] border border-dashed border-[#E7E5E4] space-y-1">
                <Inbox className="size-5 mx-auto text-[#78716C]" />
                <p>Belum ada telemetri aktivitas task terbaru.</p>
              </div>
            ) : (
              analyticsData.recentLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] hover:bg-white hover:border-[#D6D3D1] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {log.type === "Completed" ? (
                      <span className="p-1.5 rounded-[4px] bg-[#FFE4E6] text-[#881337]">
                        <CheckCircle2 className="size-3.5" />
                      </span>
                    ) : log.type === "Failed" ? (
                      <span className="p-1.5 rounded-[4px] bg-red-100 text-red-700">
                        <XCircle className="size-3.5" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-[4px] bg-stone-200 text-stone-700">
                        <Clock className="size-3.5" />
                      </span>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 flex-1 min-w-0">
                      <span className="font-mono text-[11px] text-[#78716C]">[{log.timestamp}]</span>
                      <span className="font-semibold text-[#881337]">{log.agent}</span>
                      <span className="text-[#1C1917] truncate">{log.action}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0 font-mono text-[11px] text-[#78716C]">
                    <Badge
                      variant={
                        log.type === "Completed"
                          ? "completed"
                          : log.type === "Failed"
                          ? "failed"
                          : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {log.type}
                    </Badge>
                    <span>{log.repo}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
