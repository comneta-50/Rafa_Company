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
    }>("/api/metrics"),

  // Jobs
  getJobs: () => fetchJson<any[]>("/api/jobs"),
  createJob: (jobData: { title: string; repo?: string; agent?: string; orderId?: string }) =>
    fetchJson<{ success: boolean; job: any }>("/api/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    }),
  updateJob: (id: string, updateData: any) =>
    fetchJson<{ success: boolean; job: any }>(`/api/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    }),

  // Orders
  getOrders: () => fetchJson<any[]>("/api/orders"),
  createOrder: (orderData: any) =>
    fetchJson<{ success: boolean; order: any }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
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
  createAgent: (agentData: { name: string; role: string }) =>
    fetchJson<{ success: boolean; agent: any }>("/api/agents", {
      method: "POST",
      body: JSON.stringify(agentData),
    }),

  // Reviews
  getReviews: () => fetchJson<any[]>("/api/reviews"),
  deleteReview: (id: string) =>
    fetchJson<{ success: boolean }>(`/api/reviews/${id}`, {
      method: "DELETE",
    }),

  // Repos
  getRepos: () => fetchJson<any[]>("/api/repos"),
  createRepo: (repoData: { name: string; description?: string; autoFix?: boolean }) =>
    fetchJson<{ success: boolean; repo: any }>("/api/repos", {
      method: "POST",
      body: JSON.stringify(repoData),
    }),

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
};
