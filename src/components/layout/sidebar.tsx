"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Terminal,
  Activity,
  GitBranch,
  ShieldCheck,
  Settings,
  ChevronDown,
  BarChart3,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { workerApi } from "@/lib/api";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badge?: string;
  isDropdown?: boolean;
}

export interface NavCategory {
  category: string;
  items: NavItem[];
}

export const mockAgents: any[] = [];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [isAgentsOpen, setIsAgentsOpen] = useState(true);
  const [agents, setAgents] = useState<any[]>([]);
  const [counts, setCounts] = useState({
    orders: 0,
    jobs: 0,
    reviews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    toast.success("Berhasil keluar.");
    router.replace("/login");
  };

  useEffect(() => {
    setIsLoading(true);
    // Mengambil data real-time untuk sidebar badges & agent dropdown
    Promise.all([
      workerApi.getAgents().catch(() => []),
      workerApi.getOrders().catch(() => []),
      workerApi.getJobs().catch(() => []),
      workerApi.getReviews().catch(() => []),
    ])
      .then(([agentsData, ordersData, jobsData, reviewsData]) => {
        if (Array.isArray(agentsData)) setAgents(agentsData);
        setCounts({
          orders: Array.isArray(ordersData) ? ordersData.length : 0,
          jobs: Array.isArray(jobsData) ? jobsData.length : 0,
          reviews: Array.isArray(reviewsData) ? reviewsData.length : 0,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const navCategories: NavCategory[] = [
    {
      category: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard },
        {
          id: "orders",
          label: "Client Orders",
          href: "/orders",
          icon: ShoppingCart,
          badge: counts.orders > 0 ? `${counts.orders} Active` : undefined,
        },
        { id: "analytics", label: "Analytic", href: "/analytics", icon: BarChart3 },
        { id: "activity", label: "Activity Logs", href: "/activity", icon: Activity },
      ],
    },
    {
      category: "AI & Execution",
      items: [
        { id: "agents", label: "AI Agents", href: "/agents", icon: Bot, isDropdown: true },
        {
          id: "jobs",
          label: "Jobs",
          href: "/jobs",
          icon: Terminal,
          count: counts.jobs > 0 ? counts.jobs : undefined,
        },
      ],
    },
    {
      category: "Code & Quality",
      items: [
        {
          id: "review",
          label: "Code Review",
          href: "/review",
          icon: ShieldCheck,
          badge: counts.reviews > 0 ? `${counts.reviews} New` : undefined,
        },
        { id: "github", label: "GitHub Integration", href: "/github", icon: GitBranch },
      ],
    },
    {
      category: "System",
      items: [{ id: "settings", label: "Settings", href: "/settings", icon: Settings }],
    },
  ];

  return (
    <aside className="w-60 shrink-0 border-r border-[#E7E5E4] bg-white flex flex-col h-screen overflow-y-auto p-3.5 scrollbar-thin shadow-2xs">
      <div className="space-y-6 flex-1">
        {/* Workspace Brand / Header */}
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2.5 py-2 sticky top-0 bg-white z-10 pb-2 transition-opacity hover:opacity-90"
        >
          <div className="flex size-7 items-center justify-center rounded-[6px] bg-[#881337] text-white font-bold text-sm tracking-wider shadow-xs">
            R
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-[#1C1917] leading-none">
              RAFA Company
            </span>
            <span className="text-[11px] text-[#78716C] mt-1 font-mono">
              AI Workspace v1.0
            </span>
          </div>
        </Link>

        {/* Categorized Navigation Links */}
        <nav className="space-y-4">
          {navCategories.map((group) => (
            <div key={group.category} className="space-y-1">
              <div className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E]/90">
                {group.category}
              </div>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                // Khusus untuk AI Agents: collapsible dropdown
                if (item.isDropdown && item.id === "agents") {
                  return (
                    <div key={item.id} className="space-y-1">
                      <div
                        className={`flex w-full items-center justify-between px-3 py-2 rounded-[6px] text-[13px] font-medium transition-colors duration-150 ${
                          isActive
                            ? "bg-[#FFE4E6] text-[#881337] font-semibold border border-[#FECDD3]"
                            : "text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F6]"
                        }`}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2.5 flex-1 min-w-0"
                        >
                          <Icon
                            className={`size-4 ${
                              isActive ? "text-[#881337]" : "text-[#78716C]"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsAgentsOpen(!isAgentsOpen);
                          }}
                          className="flex items-center gap-1.5 p-0.5 hover:bg-[#F5F5F6] rounded"
                        >
                          {isLoading ? (
                            <Skeleton className="h-4 w-5 rounded-[4px]" />
                          ) : (
                            <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 bg-[#F5F5F6] border border-[#E7E5E4] rounded-[4px] text-[#78716C]">
                              {agents.length}
                            </span>
                          )}
                          <ChevronDown
                            className={`size-3.5 text-[#78716C] transition-transform duration-200 ${
                              isAgentsOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Dropdown Items dengan status ping */}
                      {isAgentsOpen && (
                        <div className="ml-3 pl-2.5 border-l border-[#E7E5E4] space-y-1 py-0.5">
                          {isLoading ? (
                            <div className="space-y-2 py-1">
                              <Skeleton className="h-4 w-4/5" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                          ) : agents.length === 0 ? (
                            <div className="px-2.5 py-1 text-[11px] text-[#A8A29E] italic">
                              Belum ada agent
                            </div>
                          ) : (
                            agents.map((agent) => {
                              const isOnline = agent.status === "Online";
                              const isBusy = agent.status === "Busy";

                              return (
                                <Link
                                  key={agent.name}
                                  href={`/agents?name=${encodeURIComponent(agent.name)}`}
                                  className="flex w-full items-center justify-between px-2.5 py-1.5 rounded-[4px] text-xs transition-colors duration-150 text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F6]"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {/* Ping Status Indicator */}
                                    <span className="relative flex size-2 shrink-0">
                                      <span
                                        className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                                          isOnline
                                            ? "bg-emerald-400"
                                            : isBusy
                                            ? "bg-amber-400"
                                            : "bg-stone-400"
                                        }`}
                                      />
                                      <span
                                        className={`relative inline-flex size-2 rounded-full ${
                                          isOnline
                                            ? "bg-emerald-500"
                                            : isBusy
                                            ? "bg-amber-500"
                                            : "bg-stone-400"
                                        }`}
                                      />
                                    </span>
                                    <span className="truncate">{agent.name}</span>
                                  </div>

                                  <span
                                    className={`text-[10px] font-mono shrink-0 ml-1 ${
                                      isOnline
                                        ? "text-emerald-700"
                                        : isBusy
                                        ? "text-amber-700"
                                        : "text-[#78716C]"
                                    }`}
                                  >
                                    {agent.status}
                                  </span>
                                </Link>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex w-full items-center justify-between px-3 py-2 rounded-[6px] text-[13px] font-medium transition-colors duration-150 ${
                      isActive
                        ? "bg-[#FFE4E6] text-[#881337] font-semibold border border-[#FECDD3]"
                        : "text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F5F6]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`size-4 ${
                          isActive ? "text-[#881337]" : "text-[#78716C]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {isLoading ? (
                      (item.id === "orders" || item.id === "jobs" || item.id === "review") && (
                        <Skeleton className="h-3.5 w-6 rounded-full" />
                      )
                    ) : (
                      <>
                        {item.badge && (
                          <Badge variant="default" className="text-[10px] py-0 px-1.5 h-4">
                            {item.badge}
                          </Badge>
                        )}
                        {item.count !== undefined && (
                          <span className="text-[11px] text-[#78716C] font-mono tabular-nums">
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* User Account & Status Footer */}
      <div className="border-t border-[#E7E5E4] pt-3.5 px-1 space-y-3 mt-4 shrink-0">
        <div className="rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] p-3 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#78716C] font-medium">Neurons Quota</span>
            <span className="text-[#881337] font-mono font-medium">84,200</span>
          </div>
          <div className="w-full bg-[#E7E5E4] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#881337] h-full rounded-full" style={{ width: "68%" }} />
          </div>
        </div>

        <div className="flex items-center justify-between px-1.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-8 rounded-[6px] border border-[#E7E5E4] shrink-0">
              <AvatarFallback className="rounded-[6px] bg-[#F5F5F6] text-xs font-semibold text-[#1C1917]">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "RC"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left truncate">
              <span className="text-xs font-medium text-[#1C1917] truncate">
                {currentUser?.name || "Smurfish"}
              </span>
              <span className="text-[11px] text-[#78716C] capitalize truncate">
                {currentUser?.role || "Admin"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar / Logout"
            className="p-1.5 text-[#A8A29E] hover:text-[#881337] hover:bg-[#F5F5F6] rounded-[6px] transition-colors"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
