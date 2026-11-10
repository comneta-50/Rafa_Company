/**
 * Application Runtime & Environment Configuration
 * Keeping backend worker URL private to avoid public frontend exposure.
 */

export const Config = {
  workerApiUrl:
    process.env.WORKER_API_URL || "https://rafa-backend-worker.rafa-ai.workers.dev",
  isProduction: process.env.NODE_ENV === "production",
} as const;
