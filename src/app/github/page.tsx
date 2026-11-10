"use client";

import React, { useState } from "react";
import {
  GitBranch,
  FolderGit2,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Plus,
  GitCommit,
  GitPullRequest,
  Lock,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockRepos = [
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
  const [repos] = useState(mockRepos);

  return (
    <>
      <Header actionLabel="Connect Repo" />
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
                  <span className={repo.autoFix ? "text-emerald-700" : "text-[#78716C]"}>
                    AutoFix: {repo.autoFix ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button variant="secondary" size="sm" className="flex-1 text-xs">
                    Settings
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    Trigger Scan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
