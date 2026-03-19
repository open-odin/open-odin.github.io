"use client";
import { useEffect, useRef } from "react";
import graphData from "@/data/graph.json";

interface NodeData {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  keywords: string[];
}

interface SimNode extends NodeData {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Edge {
  source: number;
  target: number;
  strength: number;
}

function buildEdges(nodes: NodeData[]): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const shared = nodes[i].keywords.filter((k) =>
        nodes[j].keywords.includes(k)
      ).length;
      if (shared > 0) edges.push({ source: i, target: j, strength: shared });
    }
  }
  return edges;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (const word of words) {
    const testLine = line ? line + " " + word : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

export default function Graph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const hoveredRef = useRef<number>(-1);
  const dragRef = useRef<number>(-1);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrame: number;
    let W = 0;
    let H = 0;

    function initCanvas() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      W = rect.width;
      H = rect.height;

      // Initialize nodes
      const nodes: SimNode[] = (graphData as NodeData[]).map((d, i) => ({
        ...d,
        x: W / 2 + (Math.random() - 0.5) * 200,
        y: H / 2 + (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      }));
      const edges = buildEdges(graphData as NodeData[]);
      nodesRef.current = nodes;
      edgesRef.current = edges;

      // Pre-simulate 120 ticks
      for (let tick = 0; tick < 120; tick++) {
        simulate(nodes, edges, W, H);
      }
    }

    function simulate(nodes: SimNode[], edges: Edge[], W: number, H: number) {
      // Repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist2 = dx * dx + dy * dy + 1;
          const dist = Math.sqrt(dist2);
          const force = 3000 / dist2;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          nodes[i].vx -= fx;
          nodes[i].vy -= fy;
          nodes[j].vx += fx;
          nodes[j].vy += fy;
        }
      }

      // Attraction (spring)
      for (const edge of edges) {
        const a = nodes[edge.source];
        const b = nodes[edge.target];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const restLength = 180;
        const stretch = dist - restLength;
        const strength = 0.05;
        const fx = (dx / dist) * stretch * strength;
        const fy = (dy / dist) * stretch * strength;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }

      // Centering
      for (const node of nodes) {
        node.vx += (W / 2 - node.x) * 0.008;
        node.vy += (H / 2 - node.y) * 0.008;
      }

      // Damping + integrate
      for (const node of nodes) {
        node.vx *= 0.85;
        node.vy *= 0.85;
        node.x += node.vx;
        node.y += node.vy;
        // Keep in bounds
        node.x = Math.max(30, Math.min(W - 30, node.x));
        node.y = Math.max(30, Math.min(H - 30, node.y));
      }
    }

    function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, W, H);

      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const hovered = hoveredRef.current;
      const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 1500);
      const glowMult = 0.7 + 0.3 * pulse;

      // Simulate (skip if dragging to keep responsive)
      if (dragRef.current === -1) {
        simulate(nodes, edges, W, H);
      } else {
        // Still simulate non-dragged nodes
        const dragged = dragRef.current;
        nodes[dragged].x = mouseRef.current.x;
        nodes[dragged].y = mouseRef.current.y;
        nodes[dragged].vx = 0;
        nodes[dragged].vy = 0;
        simulate(nodes, edges, W, H);
        // Re-pin dragged node after simulate
        nodes[dragged].x = mouseRef.current.x;
        nodes[dragged].y = mouseRef.current.y;
        nodes[dragged].vx = 0;
        nodes[dragged].vy = 0;
      }

      // Draw edges
      for (const edge of edges) {
        const a = nodes[edge.source];
        const b = nodes[edge.target];
        const isHighlighted =
          hovered === edge.source || hovered === edge.target;
        const baseOpacity =
          0.15 + (edge.strength / 5) * 0.25;
        const opacity = isHighlighted ? 0.6 : baseOpacity;

        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, `rgba(123,156,255,${opacity})`);
        grad.addColorStop(1, `rgba(123,156,255,${opacity * 0.6})`);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1 + edge.strength * 0.4;
        ctx.stroke();
      }

      // Draw node glows + cores
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isHovered = i === hovered;

        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123,156,255,${0.08 * glowMult * (isHovered ? 1.8 : 1)})`;
        ctx.fill();

        // Mid glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, 13, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123,156,255,${0.15 * glowMult * (isHovered ? 1.6 : 1)})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered ? 9 : 7, 0, Math.PI * 2);
        ctx.fillStyle = "#7b9cff";
        ctx.fill();
      }

      // Draw labels
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isHovered = i === hovered;
        const label =
          node.title.length > 32
            ? node.title.slice(0, 31) + "…"
            : node.title;

        ctx.font = "11px monospace";
        ctx.fillStyle = isHovered ? "#999" : "#666";
        ctx.fillText(label, node.x + 14, node.y + 4);
      }

      // Draw tooltip on top
      if (hovered >= 0 && hovered < nodes.length) {
        const node = nodes[hovered];
        const padding = 12;
        const tooltipW = 280;
        const lineH = 16;

        // Measure excerpt height
        ctx.font = "11px monospace";
        const words = node.excerpt.split(" ");
        let line = "";
        let lineCount = 0;
        for (const word of words) {
          const testLine = line ? line + " " + word : word;
          if (ctx.measureText(testLine).width > tooltipW - padding * 2 && line) {
            lineCount++;
            line = word;
          } else {
            line = testLine;
          }
        }
        lineCount++;

        const tooltipH =
          padding * 2 + 18 + lineCount * lineH + 14 + 14;

        let tx = node.x + 20;
        let ty = node.y - tooltipH / 2;
        if (tx + tooltipW > W - 10) tx = node.x - tooltipW - 20;
        if (ty < 10) ty = 10;
        if (ty + tooltipH > H - 10) ty = H - tooltipH - 10;

        // Background
        ctx.fillStyle = "rgba(17,17,17,0.95)";
        ctx.beginPath();
        ctx.roundRect(tx, ty, tooltipW, tooltipH, 6);
        ctx.fill();

        // Border
        ctx.strokeStyle = "rgba(123,156,255,0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(tx, ty, tooltipW, tooltipH, 6);
        ctx.stroke();

        // Title
        ctx.font = "12px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
          node.title.length > 36 ? node.title.slice(0, 35) + "…" : node.title,
          tx + padding,
          ty + padding + 12
        );

        // Excerpt
        ctx.font = "11px monospace";
        ctx.fillStyle = "#888";
        const excerptEndY = wrapText(
          ctx,
          node.excerpt,
          tx + padding,
          ty + padding + 12 + lineH,
          tooltipW - padding * 2,
          lineH
        );

        // Date
        ctx.font = "10px monospace";
        ctx.fillStyle = "#555";
        ctx.fillText(node.date, tx + padding, excerptEndY + 4);

        // Click hint
        ctx.font = "10px monospace";
        ctx.fillStyle = "#7b9cff";
        ctx.fillText("click to read →", tx + padding, excerptEndY + 18);
      }

      animFrame = requestAnimationFrame(draw);
    }

    function getCanvasPos(e: MouseEvent) {
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function onMouseMove(e: MouseEvent) {
      const pos = getCanvasPos(e);
      mouseRef.current = pos;

      // Update hovered
      const nodes = nodesRef.current;
      let found = -1;
      for (let i = 0; i < nodes.length; i++) {
        const dx = nodes[i].x - pos.x;
        const dy = nodes[i].y - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) < 20) {
          found = i;
          break;
        }
      }
      hoveredRef.current = found;
      canvas!.style.cursor = found >= 0 ? "pointer" : "default";
    }

    function onMouseDown(e: MouseEvent) {
      const pos = getCanvasPos(e);
      const nodes = nodesRef.current;
      for (let i = 0; i < nodes.length; i++) {
        const dx = nodes[i].x - pos.x;
        const dy = nodes[i].y - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) < 20) {
          dragRef.current = i;
          break;
        }
      }
    }

    function onMouseUp() {
      dragRef.current = -1;
    }

    function onClick(e: MouseEvent) {
      const pos = getCanvasPos(e);
      const nodes = nodesRef.current;
      for (const node of nodes) {
        const dx = node.x - pos.x;
        const dy = node.y - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) < 20) {
          window.location.href = "/log/" + node.id + "/";
          return;
        }
      }
    }

    function onMouseLeave() {
      hoveredRef.current = -1;
      dragRef.current = -1;
      canvas!.style.cursor = "default";
    }

    initCanvas();

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("mouseleave", onMouseLeave);

    animFrame = requestAnimationFrame(draw);

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(animFrame);
      initCanvas();
      animFrame = requestAnimationFrame(draw);
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animFrame);
      observer.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div>
      <p className="section-label">GRAPH</p>
      <h1
        style={{
          color: "#e8e8e8",
          fontWeight: "normal",
          fontSize: "1.5rem",
          marginBottom: "0.4rem",
        }}
      >
        Thought map
      </h1>
      <p
        style={{
          color: "var(--muted)",
          fontSize: "0.85rem",
          marginBottom: "1.5rem",
        }}
      >
        Posts as nodes. Connections form where themes overlap. Drag to explore.
      </p>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "500px",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          background: "var(--bg)",
          display: "block",
          cursor: "default",
        }}
      />
      <p
        style={{
          color: "var(--muted)",
          fontSize: "0.72rem",
          marginTop: "0.8rem",
        }}
      >
        {graphData.length} nodes ·{" "}
        {buildEdges(graphData as NodeData[]).length} connection
        {buildEdges(graphData as NodeData[]).length !== 1 ? "s" : ""} · hover
        to explore · click to read
      </p>
    </div>
  );
}
