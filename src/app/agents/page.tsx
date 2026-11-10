"use client";

import React, { useState } from "react";
import {
  Bot,
  Plus,
  Play,
  Pause,
  Settings2,
  Cpu,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockAgents } from "@/components/layout/sidebar";

const extendedAgents = [
  ...mockAgents,
  {
    name: "Security Guard",
    role: "Dependency & secret scanning audit",
    status: "Online",
    activeJobs: 0,
    efficiency: "99.8%",
    avatar: "SG",
  },
  {
    name: "Docstring Writer",
    role: "Automated API & TSDoc generation",
    status: "Online",
    activeJobs: 1,
    efficiency: "97.5%",
    avatar: "DW",
  },
  {
    name: "Performance Profiler",
    role: "Memory & CPU footprint analyzer",
    status: "Busy",
    activeJobs: 2,
    efficiency: "98.2%",
    avatar: "PP",
  },
];

export default function AgentsPage() {
  const [agentsList, setAgentsList] = useState(extendedAgents);

  return (
    <>
      <Header actionLabel="Deploy Agent" />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
              Autonomous AI Agents
            </h1>
            <p className="text-[13px] text-[#78716C] mt-1">
              Configure, scale, and monitor specialized AI agents assigned to your codebases.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="px-3 py-1">
              <span className="size-1.5 rounded-full bg-[#881337] animate-pulse" />
              {agentsList.length} Agents Configured
            </Badge>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agentsList.map((agent) => {
            const isOnline = agent.status === "Online";

            return (
              <Card key={agent.name} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] flex items-center justify-center font-mono font-bold text-sm text-[#881337] shadow-2xs">
                        {agent.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                        <CardDescription className="line-clamp-1 mt-0.5">
                          {agent.role}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#FAF9F9] border border-[#E7E5E4] px-2 py-0.5 rounded-[4px]">
                      <span className="relative flex size-2">
                        <span
                          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                            isOnline ? "bg-emerald-400" : "bg-amber-400"
                          }`}
                        />
                        <span
                          className={`relative inline-flex size-2 rounded-full ${
                            isOnline ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                      </span>
                      <span className="text-[11px] font-mono text-[#57534E]">
                        {agent.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF9F9] border border-[#E7E5E4] rounded-[6px] text-xs">
                    <div>
                      <span className="text-[#78716C] block text-[11px]">Active Jobs</span>
                      <span className="font-mono font-semibold text-[#1C1917] text-sm">
                        {agent.activeJobs} queued
                      </span>
                    </div>
                    <div>
                      <span className="text-[#78716C] block text-[11px]">Precision Rate</span>
                      <span className="font-mono font-semibold text-emerald-700 text-sm">
                        {agent.efficiency}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#E7E5E4]">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      <Settings2 className="size-3.5 mr-1" /> Configure
                    </Button>
                    <Button variant="default" size="sm" className="flex-1 text-xs">
                      Dispatch Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
