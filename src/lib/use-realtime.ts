"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface RealtimeMessage {
  type: "CONNECTED" | "JOB_CREATED" | "JOB_DELETED" | "METRICS_UPDATE";
  job?: any;
  jobId?: string;
  agent?: any;
  message?: string;
  metrics?: any;
  timestamp?: string;
}

export function useRealtime(onMessageReceived?: (msg: RealtimeMessage) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // URL WebSocket langsung ke backend Cloudflare Workers
    const wsUrl = "wss://rafa-backend-worker.rafa-ai.workers.dev/ws";

    let ws: WebSocket;
    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const parsed: RealtimeMessage = JSON.parse(event.data);
          if (parsed.type === "JOB_CREATED") {
            toast.info(`[Real-time] Job baru masuk: ${parsed.job?.id || "Baru"}`);
          }
          if (onMessageReceived) {
            onMessageReceived(parsed);
          }
        } catch (e) {
          console.warn("Failed to parse WebSocket message:", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      ws.onerror = (err) => {
        console.warn("WebSocket connection error:", err);
        setIsConnected(false);
      };
    } catch (e) {
      console.warn("WebSocket initialization skipped:", e);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onMessageReceived]);

  return { isConnected };
}
