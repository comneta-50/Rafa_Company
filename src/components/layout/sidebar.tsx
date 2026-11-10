"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

export const mockAgents = [
  {
    name: "AI Code Reviewer",
    role: "Static analysis & AST audit",
    status: "Online",
    activeJobs: 3,
    efficiency: "99.4%",
    avatar: "CR",
  },
  {
    name: "AutoFix Engineer",
    role: "Automated patch generation",
    status: "Busy",
    activeJobs: 5,
    efficiency: "96.8%",
    avatar: "AF",
  },
  {
    name: "Test Runner Bot",
    role: "End-to-End & regression suite",
    status: "Online",
    activeJobs: 1,
    efficiency: "99.9%",
    avatar: "TR",
  },
];

export const navCategories: NavCategory[] = [
  {
    category: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard },
      { id: "analytics", label: "Analytic", href: "/analytics", icon: BarChart3 },
      { id: "activity", label: "Activity Logs", href: "/activity", icon: Activity },
    ],
  },
  {
    category: "AI & Execution",
    items: [
      { id: "agents", label: "AI Agents", href: "/agents", icon: Bot, isDropdown: true },
      { id: "jobs", label: "Jobs", href: "/jobs", icon: Terminal, count: 4 },
    ],
  },
  {
    category: "Code & Quality",
    items: [
      { id: "review", label: "Code Review", href: "/review", icon: ShieldCheck, badge: "2 New" },
      { id: "github", label: "GitHub Integration", href: "/github", icon: GitBranch },
    ],
  },
  {
    category: "System",
    items: [
      { id: "settings", label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isAgentsOpen, setIsAgentsOpen] = useState(true);

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
                          <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 bg-[#F5F5F6] border border-[#E7E5E4] rounded-[4px] text-[#78716C]">
                            {mockAgents.length}
                          </span>
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
                          {mockAgents.map((agent) => {
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
                          })}
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
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8 rounded-[6px] border border-[#E7E5E4]">
              <AvatarFallback className="rounded-[6px] bg-[#F5F5F6] text-xs font-semibold text-[#1C1917]">
                RC
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="text-xs font-medium text-[#1C1917]">Smurfish</span>
              <span className="text-[11px] text-[#78716C]">Admin</span>
            </div>
          </div>
          <div className="size-2 rounded-full bg-[#881337]" title="System operational" />
        </div>
      </div>
    </aside>
  );
}
