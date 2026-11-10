"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Activity,
  Layers,
  Calendar,
  Filter,
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

const recentAnalyticsLogs = [
  {
    id: "LOG-9821",
    timestamp: "19:34:12",
    level: "success",
    agent: "AI Code Reviewer",
    repo: "comneta-50/site-ai-company",
    action: "Task Selesai: Validated zero memory leaks on auth middleware.",
    type: "Completed",
  },
  {
    id: "LOG-9820",
    timestamp: "19:33:04",
    level: "info",
    agent: "AutoFix Engineer",
    repo: "comneta-50/site-ai-company",
    action: "Task Masuk: Ingested PR-104 token expiration sync.",
    type: "Incoming",
  },
  {
    id: "LOG-9819",
    timestamp: "19:30:45",
    level: "failed",
    agent: "Test Runner Bot",
    repo: "comneta-50/billing-service",
    action: "Task Gagal: Stripe test container timeout 184ms.",
    type: "Failed",
  },
  {
    id: "LOG-9818",
    timestamp: "19:28:11",
    level: "success",
    agent: "Security Guard",
    repo: "comneta-50/web-frontend",
    action: "Task Selesai: Vulnerability scan resolved with clean report.",
    type: "Completed",
  },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  // Chart 1: Line Chart - Task Masuk vs Selesai vs Gagal over time
  const lineChartData = {
    labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    datasets: [
      {
        label: "Task Masuk",
        data: [28, 45, 38, 62, 54, 30, 48],
        borderColor: "#78716C",
        backgroundColor: "rgba(120, 113, 108, 0.1)",
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Task Selesai",
        data: [26, 42, 36, 58, 52, 29, 46],
        borderColor: "#881337", // Maroon accent
        backgroundColor: "rgba(136, 19, 55, 0.12)",
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Task Gagal",
        data: [2, 3, 2, 4, 2, 1, 2],
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
    labels: ["Auth & Sec", "Database", "SSR Frontend", "API Worker", "Billing", "CI Pipeline"],
    datasets: [
      {
        label: "Selesai",
        data: [42, 38, 28, 50, 22, 45],
        backgroundColor: "#881337",
        borderRadius: 4,
      },
      {
        label: "Gagal",
        data: [2, 4, 1, 3, 5, 1],
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
    labels: ["Selesai", "Gagal", "Masuk (Queued)"],
    datasets: [
      {
        data: [289, 16, 24],
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

  return (
    <>
      <Header actionLabel="Generate Report" />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
              Task Analytic & System Health
            </h1>
            <p className="text-[13px] text-[#78716C] mt-1">
              Visualisasi metrik pemantauan task masuk, selesai, dan yang gagal dengan analitik interaktif Chart.js.
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

        {/* 3 Main Stat Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-[#78716C]">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">Total Task Masuk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#1C1917]">329</div>
              <div className="flex items-center gap-1.5 text-xs text-[#78716C] mt-1">
                <ArrowUpRight className="size-3 text-[#881337]" />
                <span>+14.2% volume minggu ini</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#881337]">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">Task Selesai (Success)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#881337]">289</div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1 font-medium">
                <CheckCircle2 className="size-3" />
                <span>94.8% completion rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-600">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium">Task Gagal (Failed)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight text-red-600">16</div>
              <div className="flex items-center gap-1.5 text-xs text-red-700 mt-1 font-medium">
                <XCircle className="size-3" />
                <span>5.2% failure rate (investigating)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section 1: Main Trend Line Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Tren Task Masuk vs Selesai vs Gagal
              </CardTitle>
              <CardDescription>
                Pemantauan fluktuasi ritme throughput pengerjaan task oleh agen AI
              </CardDescription>
            </div>
            <Badge variant="default" className="text-[10px]">
              Chart.js Active
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Chart Section 2: Split 2 Cols (Bar Breakdown + Doughnut Ratio) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Distribusi Task Berdasarkan Komponen Sistem
              </CardTitle>
              <CardDescription>
                Perbandingan task selesai vs gagal per domain repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] w-full">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Rasio Status Eksekusi</CardTitle>
              <CardDescription>Komposisi keseluruhan output pipeline</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="h-[210px] w-full relative">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
              <div className="text-center mt-2 text-xs text-[#78716C]">
                Total volume dianalisis: <span className="font-mono font-semibold text-[#1C1917]">329 task</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Activity Logs Pemantauan Task */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
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
            {recentAnalyticsLogs.map((log) => (
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
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
