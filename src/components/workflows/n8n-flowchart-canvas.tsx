"use client";

import React, { useState, useRef, useEffect } from "react";
import { JobWorkflow, WorkflowStep } from "@/lib/workflow-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Plus,
  Edit2,
  Trash2,
  Bot,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  Send,
  Boxes,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

interface N8nFlowchartCanvasProps {
  workflow: JobWorkflow;
  onEditStep: (step: WorkflowStep) => void;
  onAddStep: () => void;
  onDeleteStep: (stepId: string) => void;
  onSaveWorkflow?: () => void;
  isFullScreenMode?: boolean;
  onToggleFullScreen?: () => void;
}

interface NodePosition {
  x: number;
  y: number;
}

export function N8nFlowchartCanvas({
  workflow,
  onEditStep,
  onAddStep,
  onDeleteStep,
  onSaveWorkflow,
  isFullScreenMode = false,
  onToggleFullScreen,
}: N8nFlowchartCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas zoom & pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 50 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Node simulation execution state
  const [activeSimStep, setActiveSimStep] = useState<number | null>(null);
  const [simStatus, setSimStatus] = useState<"idle" | "running" | "paused_review" | "completed">("idle");

  // Node positions map: key = stepId or 'trigger' or 'end'
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Calculate default auto-layout positions for nodes
  useEffect(() => {
    const positions: Record<string, NodePosition> = {};
    const nodeWidth = 270;
    const gapX = 90;
    let currentX = 40;
    const startY = 120;

    // Trigger Node (n8n Webhook / Order Intake style)
    positions["trigger"] = { x: currentX, y: startY };
    currentX += nodeWidth + gapX;

    // Workflow Steps Nodes
    workflow.steps.forEach((step, idx) => {
      // Slight vertical wave for natural flowchart aesthetic
      const offsetY = idx % 2 === 1 ? startY + 25 : startY - 15;
      positions[step.id] = { x: currentX, y: offsetY };
      currentX += nodeWidth + gapX;
    });

    // Final Delivery Node
    positions["end"] = { x: currentX, y: startY };

    setNodePositions(positions);
  }, [workflow.id, workflow.steps.length]);

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.4));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 40, y: 50 });
  };

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if (draggingNodeId) return;
    if ((e.target as HTMLElement).closest(".n8n-node")) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    } else if (draggingNodeId) {
      setNodePositions((prev) => ({
        ...prev,
        [draggingNodeId]: {
          x: (e.clientX - dragOffset.x) / zoom,
          y: (e.clientY - dragOffset.y) / zoom,
        },
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleStartDragNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const current = nodePositions[nodeId] || { x: 0, y: 0 };
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: e.clientX - current.x * zoom,
      y: e.clientY - current.y * zoom,
    });
  };

  // Run Flowchart Simulation (n8n style execution test)
  const runSimulation = () => {
    if (simStatus === "running") return;
    setSimStatus("running");
    setActiveSimStep(0); // Trigger step
    toast.info("Menjalankan simulasi workflow secara berurutan...", { id: "sim" });

    const totalStages = workflow.steps.length + 1;
    let currentIdx = 0;

    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx <= workflow.steps.length) {
        const step = workflow.steps[currentIdx - 1];
        setActiveSimStep(currentIdx);

        if (step.requiresHumanReview) {
          clearInterval(interval);
          setSimStatus("paused_review");
          toast.warning(
            `Simulasi berhenti di Langkah ${currentIdx}: ${step.title}. Menunggu persetujuan manusia!`,
            { id: "sim", duration: 4000 }
          );
          return;
        }
      } else {
        // End node
        setActiveSimStep(totalStages);
        setSimStatus("completed");
        clearInterval(interval);
        toast.success("Simulasi alur workflow selesai dengan sukses 100%!", { id: "sim" });
      }
    }, 1400);
  };

  const resumeSimulationAfterReview = () => {
    setSimStatus("running");
    const currentIdx = activeSimStep || 1;
    toast.info("Review disetujui, melanjutkan eksekusi pipeline berikutnya...");

    let nextIdx = currentIdx;
    const totalStages = workflow.steps.length + 1;

    const interval = setInterval(() => {
      nextIdx++;
      if (nextIdx <= workflow.steps.length) {
        setActiveSimStep(nextIdx);
        const step = workflow.steps[nextIdx - 1];
        if (step.requiresHumanReview) {
          clearInterval(interval);
          setSimStatus("paused_review");
          toast.warning(`Berhenti di Langkah ${nextIdx}: ${step.title}. Menunggu review operator!`);
          return;
        }
      } else {
        setActiveSimStep(totalStages);
        setSimStatus("completed");
        clearInterval(interval);
        toast.success("Seluruh tahapan pipeline AI Agent telah selesai!");
      }
    }, 1400);
  };

  // Helper to draw smooth bezier connector curves
  const renderConnector = (
    fromId: string,
    toId: string,
    key: string,
    isFlowActive: boolean
  ) => {
    const fromPos = nodePositions[fromId];
    const toPos = nodePositions[toId];
    if (!fromPos || !toPos) return null;

    const nodeWidth = 270;
    const nodeHeight = 150;

    // Anchor points: Right center of fromNode to Left center of toNode
    const x1 = fromPos.x + nodeWidth;
    const y1 = fromPos.y + nodeHeight / 2;
    const x2 = toPos.x;
    const y2 = toPos.y + nodeHeight / 2;

    const dx = Math.abs(x2 - x1) * 0.55;
    const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

    return (
      <g key={key}>
        {/* Glow backdrop cable */}
        <path
          d={pathD}
          fill="none"
          stroke={isFlowActive ? "#881337" : "#CBD5E1"}
          strokeWidth={isFlowActive ? 3.5 : 2}
          strokeOpacity={isFlowActive ? 0.9 : 0.6}
          className="transition-all duration-300"
        />
        {/* Animated flow particle dots */}
        {isFlowActive && (
          <path
            d={pathD}
            fill="none"
            stroke="#fb7185"
            strokeWidth="3.5"
            strokeDasharray="8 12"
            className="animate-pulse"
            style={{
              animation: "n8nFlowDash 1.2s linear infinite",
            }}
          />
        )}
      </g>
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative w-full overflow-hidden select-none border border-[#E7E5E4] rounded-xl shadow-inner transition-all ${
        isFullScreenMode ? "h-[86vh]" : "h-[620px]"
      }`}
      style={{
        backgroundColor: "#F8FAFC",
        backgroundImage:
          "radial-gradient(#CBD5E1 1.2px, transparent 1.2px)",
        backgroundSize: "22px 22px",
        cursor: isPanning ? "grabbing" : "grab",
      }}
    >
      <style jsx global>{`
        @keyframes n8nFlowDash {
          from {
            stroke-dashoffset: 40;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Workflow Status Badge & Node Count */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#E7E5E4] shadow-xs pointer-events-auto">
          <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-[#1C1917]">
            {workflow.name} Flowchart
          </span>
          <span className="text-[10px] text-[#78716C] bg-[#FAF9F9] px-2 py-0.5 rounded border border-[#E7E5E4]">
            {workflow.steps.length + 2} Nodes Connected
          </span>
        </div>

        {/* Right: Simulation Controls, Zoom & Fullscreen */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-lg border border-[#E7E5E4] shadow-xs pointer-events-auto">
          {simStatus === "paused_review" ? (
            <Button
              size="sm"
              onClick={resumeSimulationAfterReview}
              className="text-xs h-7.5 bg-amber-600 hover:bg-amber-700 text-white font-medium flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="size-3.5" />
              Setujui Review & Lanjut
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={runSimulation}
              disabled={simStatus === "running"}
              className={`text-xs h-7.5 font-medium flex items-center gap-1.5 shadow-xs ${
                simStatus === "running"
                  ? "bg-emerald-600 text-white"
                  : "bg-[#881337] hover:bg-[#70102e] text-white"
              }`}
            >
              <Play className="size-3.5 fill-current" />
              {simStatus === "running" ? "Simulasi Berjalan..." : "Test Alur Flow"}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onAddStep}
            className="text-xs h-7.5 border-[#E7E5E4] text-[#1C1917] hover:text-[#881337] hover:bg-[#881337]/5 flex items-center gap-1"
          >
            <Plus className="size-3.5" />
            Node Baru
          </Button>

          <div className="h-4 w-px bg-[#E7E5E4] mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="size-7.5 p-0 text-[#78716C] hover:text-[#1C1917]"
            title="Perkecil Kanvas"
          >
            <ZoomOut className="size-3.5" />
          </Button>

          <span className="text-[11px] font-mono text-[#78716C] px-1 min-w-[38px] text-center">
            {Math.round(zoom * 100)}%
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="size-7.5 p-0 text-[#78716C] hover:text-[#1C1917]"
            title="Perbesar Kanvas"
          >
            <ZoomIn className="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetView}
            className="size-7.5 p-0 text-[#78716C] hover:text-[#1C1917]"
            title="Reset Posisi & Zoom"
          >
            <RotateCcw className="size-3.5" />
          </Button>

          {onToggleFullScreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullScreen}
              className="size-7.5 p-0 text-[#78716C] hover:text-[#1C1917]"
              title={isFullScreenMode ? "Tutup Layar Penuh" : "Buka Layar Penuh"}
            >
              {isFullScreenMode ? (
                <Minimize2 className="size-3.5" />
              ) : (
                <Maximize2 className="size-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Canvas Workspace Viewport (Transformed by pan & zoom) */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          position: "absolute",
          top: 0,
          left: 0,
          width: "3500px",
          height: "2000px",
        }}
      >
        {/* SVG Bezier Cable Connectors Layer */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="3500"
          height="2000"
        >
          {/* Connector 1: Trigger -> Step 1 */}
          {workflow.steps.length > 0 &&
            renderConnector(
              "trigger",
              workflow.steps[0].id,
              "conn-trigger-0",
              activeSimStep !== null && activeSimStep >= 1
            )}

          {/* Connectors between steps */}
          {workflow.steps.map((step, idx) => {
            if (idx === workflow.steps.length - 1) {
              // Last step to End node
              return renderConnector(
                step.id,
                "end",
                `conn-${step.id}-end`,
                activeSimStep !== null && activeSimStep >= workflow.steps.length + 1
              );
            }
            const nextStep = workflow.steps[idx + 1];
            return renderConnector(
              step.id,
              nextStep.id,
              `conn-${step.id}-${nextStep.id}`,
              activeSimStep !== null && activeSimStep >= idx + 2
            );
          })}
        </svg>

        {/* ======================================================== */}
        {/* NODE 1: Trigger Node (n8n Webhook / Order Listener)      */}
        {/* ======================================================== */}
        {nodePositions["trigger"] && (
          <div
            onMouseDown={(e) => handleStartDragNode(e, "trigger")}
            className="n8n-node absolute w-[270px] bg-white rounded-xl border border-[#CBD5E1] shadow-md hover:shadow-lg transition-shadow cursor-move select-none"
            style={{
              left: `${nodePositions["trigger"].x}px`,
              top: `${nodePositions["trigger"].y}px`,
            }}
          >
            {/* Node Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-3.5 py-2.5 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-white/20">
                  <Zap className="size-3.5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block opacity-90">
                    Trigger Event
                  </span>
                  <h4 className="text-xs font-bold leading-tight">
                    Incoming Order Webhook
                  </h4>
                </div>
              </div>
              <span className="size-2 rounded-full bg-emerald-300 animate-ping" />
            </div>

            {/* Node Body */}
            <div className="p-3.5 text-xs text-[#1C1917] space-y-2">
              <p className="text-[11px] text-[#57534E] leading-relaxed">
                Menerima payload permintaan dari portal klien, GitHub Issues, atau webhook internal.
              </p>
              <div className="p-2 rounded bg-[#FAF9F9] border border-[#E7E5E4] text-[10px] font-mono text-[#57534E]">
                Event: <strong className="text-emerald-700">order.received</strong>
                <br />
                Target Job: <strong className="text-[#1C1917]">{workflow.name}</strong>
              </div>
            </div>

            {/* Right Output Pin (n8n port) */}
            <div
              className="absolute -right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center shadow-xs cursor-crosshair"
              title="Output: Mengirim context data ke AI Agent"
            >
              <span className="size-2 rounded-full bg-emerald-600" />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* WORKFLOW STEP NODES (n8n Task / AI Agent Nodes)          */}
        {/* ======================================================== */}
        {workflow.steps.map((step, idx) => {
          const pos = nodePositions[step.id];
          if (!pos) return null;

          const isCurrentActive = activeSimStep === idx + 1;
          const isPassed = activeSimStep !== null && activeSimStep > idx + 1;

          return (
            <div
              key={step.id}
              onMouseDown={(e) => handleStartDragNode(e, step.id)}
              className={`n8n-node absolute w-[270px] bg-white rounded-xl border transition-all cursor-move select-none ${
                isCurrentActive
                  ? "border-[#881337] ring-2 ring-[#881337]/30 shadow-xl"
                  : isPassed
                  ? "border-emerald-500 shadow-md"
                  : "border-[#CBD5E1] shadow-md hover:shadow-lg"
              }`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
              }}
            >
              {/* Left Input Pin (n8n input connector) */}
              <div
                className="absolute -left-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-white border-2 border-[#881337] flex items-center justify-center shadow-xs"
                title="Input connector"
              >
                <span className="size-2 rounded-full bg-[#881337]" />
              </div>

              {/* Node Header */}
              <div className="bg-gradient-to-r from-[#881337] to-[#9f1239] text-white px-3.5 py-2.5 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-white/20">
                    <Bot className="size-3.5 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider block opacity-90">
                      Step {idx + 1}
                    </span>
                    <h4 className="text-xs font-bold leading-tight truncate max-w-[150px]">
                      {step.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditStep(step);
                    }}
                    className="p-1 rounded hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                    title="Edit parameter node"
                  >
                    <Edit2 className="size-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteStep(step.id);
                    }}
                    className="p-1 rounded hover:bg-red-500/80 text-white/90 hover:text-white transition-colors"
                    title="Hapus node"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>

              {/* Node Content */}
              <div className="p-3 text-xs text-[#1C1917] space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-semibold text-[#881337] flex items-center gap-1">
                    <Bot className="size-3" />
                    {step.agentRole}
                  </span>
                  <span className="text-[10px] text-[#78716C] bg-[#FAF9F9] px-1.5 py-0.2 rounded border border-[#E7E5E4] flex items-center gap-1">
                    <Clock className="size-2.5" />
                    {step.estimatedDuration}
                  </span>
                </div>

                <p className="text-[11px] text-[#57534E] line-clamp-2 leading-relaxed">
                  {step.description}
                </p>

                {/* Human Review Gate Badge */}
                {step.requiresHumanReview && (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    <ShieldAlert className="size-3 text-amber-600 shrink-0" />
                    Wajib Review Operator
                  </div>
                )}

                {/* Tools Pills */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {step.requiredTools.slice(0, 3).map((tool) => (
                    <span
                      key={tool}
                      className="text-[9px] font-mono px-1.5 py-0.5 bg-[#FAF9F9] border border-[#E7E5E4] rounded text-[#57534E]"
                    >
                      {tool}
                    </span>
                  ))}
                  {step.requiredTools.length > 3 && (
                    <span className="text-[9px] text-[#A8A29E] self-center">
                      +{step.requiredTools.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Output Pin (n8n output connector) */}
              <div
                className="absolute -right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-white border-2 border-[#881337] flex items-center justify-center shadow-xs"
                title="Output connector: Menyambungkan ke tahap berikutnya"
              >
                <span className="size-2 rounded-full bg-[#881337]" />
              </div>
            </div>
          );
        })}

        {/* ======================================================== */}
        {/* NODE END: Complete & PR Handover Node                    */}
        {/* ======================================================== */}
        {nodePositions["end"] && (
          <div
            onMouseDown={(e) => handleStartDragNode(e, "end")}
            className="n8n-node absolute w-[260px] bg-white rounded-xl border border-[#CBD5E1] shadow-md hover:shadow-lg transition-shadow cursor-move select-none"
            style={{
              left: `${nodePositions["end"].x}px`,
              top: `${nodePositions["end"].y}px`,
            }}
          >
            {/* Left Input Pin */}
            <div
              className="absolute -left-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center shadow-xs"
              title="Input connector akhir"
            >
              <span className="size-2 rounded-full bg-emerald-600" />
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-3.5 py-2.5 rounded-t-xl flex items-center gap-2">
              <div className="p-1 rounded bg-white/20">
                <CheckCircle2 className="size-3.5 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block opacity-90">
                  Delivery Node
                </span>
                <h4 className="text-xs font-bold leading-tight">
                  PR Merged & Handover
                </h4>
              </div>
            </div>

            {/* Body */}
            <div className="p-3.5 text-xs text-[#1C1917] space-y-2">
              <p className="text-[11px] text-[#57534E] leading-relaxed">
                Menyimpan hasil ke GitHub repo, menghasilkan ringkasan pengerjaan, dan menandai order selesai.
              </p>
              <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-[10px] font-medium text-emerald-800">
                Status: <strong className="font-bold">Job Completed / Ready for Client</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Canvas Instructions (Bottom Left) */}
      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E7E5E4] shadow-xs text-[11px] text-[#78716C] pointer-events-none">
        <span className="font-semibold text-[#1C1917]">💡 Tips n8n Mode:</span>
        <span>Drag node untuk reposisi • Klik icon pensil untuk edit • Scroll/klik tombol untuk zoom</span>
      </div>
    </div>
  );
}
