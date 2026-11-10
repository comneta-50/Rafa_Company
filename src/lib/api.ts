/**
 * API Client for Rafa Company Platform Backend (Cloudflare Workers)
 *
 * Menggunakan Next.js API Route Proxy (/api/worker/...) saat di browser
 * sehingga tidak mengekspos environment variable dan aman dari isu CORS.
 */

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const isBrowser = typeof window !== "undefined";
  const proxyEndpoint = endpoint.startsWith("/api/")
    ? `/api/worker/${endpoint.replace("/api/", "")}`
    : `/api/worker${endpoint}`;

  const url = isBrowser
    ? proxyEndpoint
    : `https://rafa-backend-worker.rafa-ai.workers.dev${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const workerApi = {
  // Dashboard Aggregate
  getDashboardData: () =>
    fetchJson<{
      metrics: {
        activeJobsCount: number;
        inProgressCount: number;
        onlineAgentsCount: number;
        totalAgentsCount: number;
        successRate: string;
        successRateSubtitle: string;
        avgResolutionTime: string;
        resolutionDelta: string;
        clusterHealth: string;
        latency: string;
      };
      recentJobs: any[];
      agentsFleet: any[];
      recentActivity: any[];
      pendingReviewsCount: number;
    }>("/api/dashboard"),

  // Authentication
  login: (credentials: { email: string; password: string }) =>
    fetchJson<{
      success: boolean;
      message: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
        avatar: string;
      };
      token: string;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (userData: { name: string; email: string; password: string }) =>
    fetchJson<{
      success: boolean;
      message: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
        avatar: string;
      };
      token: string;
    }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Analytics
  getAnalytics: (timeRange = "7d") =>
    fetchJson<{
      summary: {
        totalIncoming: number;
        totalCompleted: number;
        totalFailed: number;
        completionRate: string;
        failureRate: string;
        timeRange: string;
      };
      lineChart: {
        labels: string[];
        incoming: number[];
        completed: number[];
        failed: number[];
      };
      barChart: {
        labels: string[];
        completed: number[];
        failed: number[];
      };
      doughnut: {
        labels: string[];
        data: number[];
      };
      recentLogs: {
        id: string;
        timestamp: string;
        agent: string;
        repo: string;
        action: string;
        type: string;
      }[];
    }>(`/api/analytics?timeRange=${timeRange}`),

  // Metrics
  getMetrics: () =>
    fetchJson<{
      activeAgents: number;
      totalJobs: number;
      runningJobs: number;
      completedJobs: number;
      pendingReviews: number;
      totalOrders: number;
      clusterHealth: string;
      latency: string;
      neurons?: {
        limit: number;
        formattedLimit?: string;
        used: number;
        formattedUsed?: string;
        remaining: number;
        formattedRemaining: string;
        percentage: number;
      };
    }>("/api/metrics"),

  // Jobs
  getJobs: (status?: string) =>
    fetchJson<any[]>(`/api/jobs${status && status !== "all" ? `?status=${status}` : ""}`),
  getJobById: (id: string) => fetchJson<any>(`/api/jobs/${id}`),
  createJob: (jobData: { title: string; repo?: string; agent?: string; orderId?: string }) =>
    fetchJson<{ success: boolean; job: any }>("/api/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    }),
  retryJob: (id: string) =>
    fetchJson<{ success: boolean; job: any }>(`/api/jobs/${id}/retry`, {
      method: "POST",
    }),
  updateJob: (id: string, updateData: any) =>
    fetchJson<{ success: boolean; job: any }>(`/api/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    }),
  deleteJob: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/jobs/${id}`, {
      method: "DELETE",
    }),

  // Orders
  getOrders: () => fetchJson<any[]>("/api/orders"),
  createOrder: (orderData: any) =>
    fetchJson<{ success: boolean; order: any }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),
  connectOrderRepo: (id: string) =>
    fetchJson<{ success: boolean; order: any }>(`/api/orders/${id}/connect-repo`, {
      method: "POST",
    }),
  startOrderFixing: (id: string) =>
    fetchJson<{ success: boolean; order: any; job: any }>(`/api/orders/${id}/start-fixing`, {
      method: "POST",
    }),
  closeOrder: (id: string) =>
    fetchJson<{ success: boolean; order: any }>(`/api/orders/${id}/close`, {
      method: "POST",
    }),
  updateOrder: (id: string, updateData: any) =>
    fetchJson<{ success: boolean; order: any }>(`/api/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    }),
  deleteOrder: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/orders/${id}`, {
      method: "DELETE",
    }),

  // Agents
  getAgents: () => fetchJson<any[]>("/api/agents"),
  getAgentStats: () =>
    fetchJson<{
      totalAgents: number;
      onlineAgents: number;
      busyAgents: number;
      offlineAgents: number;
      totalActiveJobs: number;
      avgEfficiency: string;
      agents: any[];
    }>("/api/agents/stats"),
  createAgent: (agentData: { name: string; role: string; status?: string; efficiency?: string }) =>
    fetchJson<{ success: boolean; agent: any }>("/api/agents", {
      method: "POST",
      body: JSON.stringify(agentData),
    }),
  updateAgent: (agentName: string, updateData: { role?: string; status?: string; efficiency?: string } | any) =>
    fetchJson<{ success: boolean; message: string }>(
      `/api/agents/${encodeURIComponent(agentName)}`,
      {
        method: "PATCH",
        body: JSON.stringify(updateData),
      }
    ),
  deleteAgent: (agentName: string) =>
    fetchJson<{ success: boolean; message: string }>(
      `/api/agents/${encodeURIComponent(agentName)}`,
      {
        method: "DELETE",
      }
    ),
  dispatchAgentJob: (agentName: string) =>
    fetchJson<{ success: boolean; agent: any; job: any }>(
      `/api/agents/${encodeURIComponent(agentName)}/dispatch`,
      {
        method: "POST",
      }
    ),

  // Reviews
  getReviews: () => fetchJson<any[]>("/api/reviews"),
  createReview: (reviewData: any) =>
    fetchJson<{ success: boolean; review: any }>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),
  deleteReview: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/reviews/${id}`, {
      method: "DELETE",
    }),

  // Repos
  getRepos: () => fetchJson<any[]>("/api/repos"),
  createRepo: (repoData: { name: string; description?: string; autoFix?: boolean; defaultBranch?: string }) =>
    fetchJson<{ success: boolean; repo: any }>("/api/repos", {
      method: "POST",
      body: JSON.stringify(repoData),
    }),
  deleteRepo: (repoName: string) =>
    fetchJson<{ success: boolean; message: string }>(
      `/api/repos/${encodeURIComponent(repoName)}`,
      {
        method: "DELETE",
      }
    ),

  // Activity Logs
  getActivity: (level?: string) =>
    fetchJson<any[]>(`/api/activity${level && level !== "all" ? `?level=${level}` : ""}`),

  // Workers AI - Analyze / Chat
  askAi: (prompt: string, code?: string) =>
    fetchJson<{ success: boolean; prompt: string; result: { response: string } }>(
      "/api/ai/analyze",
      {
        method: "POST",
        body: JSON.stringify({ prompt, code }),
      }
    ),

  // Workspace Settings
  getSettings: () =>
    fetchJson<{
      success: boolean;
      settings: {
        workspaceName: string;
        neuronsBudget: string;
        apiKey: string;
        autoApproveLowRisk: boolean;
        requireQaPass: boolean;
        llmModel: string;
        clusterStatus: string;
      };
    }>("/api/settings"),
  updateSettings: (settingsData: Partial<{
    workspaceName: string;
    neuronsBudget: string;
    apiKey: string;
    autoApproveLowRisk: boolean;
    requireQaPass: boolean;
    llmModel: string;
  }>) =>
    fetchJson<{
      success: boolean;
      message: string;
      settings: any;
    }>("/api/settings", {
      method: "POST",
      body: JSON.stringify(settingsData),
    }),
};
