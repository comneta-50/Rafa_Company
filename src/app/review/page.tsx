"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  FileCode,
  GitPullRequest,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockReviews = [
  {
    id: "REV-104",
    title: "Fix Token Expiration & Race Condition in Auth Guard",
    repo: "comneta-50/site-ai-company",
    branch: "feat/auth-middleware",
    author: "AutoFix Engineer",
    risk: "High Impact",
    filesChanged: 3,
    additions: 42,
    deletions: 14,
    summary:
      "Added synchronized token lock to prevent concurrent refresh token invalidation in Next.js middleware and API routes.",
    time: "24m ago",
  },
  {
    id: "REV-103",
    title: "Optimize PostgreSQL connection pooling under heavy load",
    repo: "comneta-50/core-api-service",
    branch: "perf/pg-pool-opt",
    author: "Optimizer Bot",
    risk: "Medium Impact",
    filesChanged: 2,
    additions: 18,
    deletions: 5,
    summary:
      "Tuned max pool size from 10 to 35 with dynamic backoff retry logic for timeout resilience.",
    time: "1h ago",
  },
  {
    id: "REV-102",
    title: "Resolve SSR hydration mismatch on localized landing route",
    repo: "comneta-50/web-frontend",
    branch: "fix/hydration-error",
    author: "CodeReviewer v2",
    risk: "Low Impact",
    filesChanged: 1,
    additions: 8,
    deletions: 8,
    summary:
      "Deferred client locale detection until mounted state to ensure deterministic server HTML rendering.",
    time: "3h ago",
  },
];

export default function ReviewPage() {
  const [reviews, setReviews] = useState(mockReviews);

  const handleApprove = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <>
      <Header actionLabel="Review Batch" />
      <div className="max-w-[1440px] w-full mx-auto p-7 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
              Code Review & Approval Gate
            </h1>
            <p className="text-[13px] text-[#78716C] mt-1">
              Human-in-the-loop review for high-impact AI-generated patches before repository merge.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="px-3 py-1">
              {reviews.length} Pending Approvals
            </Badge>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <Card className="p-8 text-center">
              <Check className="size-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#1C1917]">All caught up!</p>
              <p className="text-xs text-[#78716C] mt-1">
                There are no pending code reviews requiring human approval at this moment.
              </p>
            </Card>
          ) : (
            reviews.map((rev) => (
              <Card key={rev.id} className="overflow-hidden">
                <CardHeader className="bg-[#FAF9F9] border-b border-[#E7E5E4] pb-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-semibold text-[#881337]">
                        {rev.id}
                      </span>
                      <CardTitle className="text-sm">{rev.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={rev.risk === "High Impact" ? "failed" : "testing"}
                        className="text-[10px]"
                      >
                        {rev.risk}
                      </Badge>
                      <span className="text-[11px] text-[#78716C] font-mono">{rev.time}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  <p className="text-xs text-[#57534E] leading-relaxed">{rev.summary}</p>

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-[#E7E5E4] text-xs">
                    <div className="flex items-center gap-4 text-[#78716C] font-mono text-[11px]">
                      <span>Repo: {rev.repo}</span>
                      <span>Branch: {rev.branch}</span>
                      <span className="text-emerald-700 font-semibold">+{rev.additions}</span>
                      <span className="text-rose-700 font-semibold">-{rev.deletions}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleApprove(rev.id)}
                      >
                        <X className="size-3.5 mr-1 text-rose-700" /> Reject
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleApprove(rev.id)}
                      >
                        <Check className="size-3.5 mr-1" /> Approve & Merge
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
