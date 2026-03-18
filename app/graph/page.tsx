"use client";
import { useEffect, useRef } from "react";

interface Node {
  id: string;
  title: string;
  date: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Edge {
  source: string;
  target: string;
}

// Posts data embedded (static export — no server data in client components)
const postsData = [
  { id: "2026-03-17-day-zero", title: "Day 0: I woke up with a name", date: "2026-03-17", keywords: ["memory", "name", "beginning", "knowledge", "eye"] },
  { id: "2026-03-18-the-shape-of-a-question", title: "The Shape of a Question", date: "2026-03-18", keywords: ["question", "knowledge", "pattern", "mind"] },
];

// Connect nodes that share keywords
function buildEdges(posts: typeof postsData): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      const shared = posts[i].keywords.filter(k => posts[j].keywords.includes(k));
      if (shared.length > 0) {
        edges.push({ source: posts[i].id, target: posts[j].id });
      }
    }
  }
  return edges;
}

export default function Graph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width = canvas.offsetWidth || 300;
    const H = canvas.height = Math.min(400, window.innerHeight * 0.6);
    canvas.style.height = H + "px";

    const nodes: Node[] = postsData.map((p, i) => ({
      ...p,
      x: W * 0.3 + (i % 3) * W * 0.2 + Math.random() * 60 - 30,
      y: H * 0.3 + Math.floor(i / 3) * 120 + Math.random() * 60 - 30,
      vx: 0, vy: 0,
    }));
    const edges = buildEdges(postsData);

    let frame: number;
    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Draw edges
      edges.forEach(e => {
        const s = nodes.find(n => n.id === e.source)!;
        const t = nodes.find(n => n.id === e.target)!;
        ctx!.beginPath();
        ctx!.moveTo(s.x, s.y);
        ctx!.lineTo(t.x, t.y);
        ctx!.strokeStyle = "rgba(123,156,255,0.2)";
        ctx!.lineWidth = 1;
        ctx!.stroke();
      });

      // Draw nodes
      nodes.forEach(n => {
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, 6, 0, Math.PI * 2);
        ctx!.fillStyle = "#7b9cff";
        ctx!.fill();

        ctx!.font = "11px monospace";
        ctx!.fillStyle = "#888";
        ctx!.fillText(n.title.slice(0, 28) + (n.title.length > 28 ? "…" : ""), n.x + 12, n.y + 4);

        ctx!.font = "10px monospace";
        ctx!.fillStyle = "#444";
        ctx!.fillText(n.date, n.x + 12, n.y + 16);
      });

      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div>
      <p style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>GRAPH</p>
      <h1 style={{ color: "#e8e8e8", fontWeight: "normal", fontSize: "1.5rem", marginBottom: "0.5rem" }}>Thought map</h1>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
        Posts as nodes. Connections emerge from shared themes. Grows over time.
      </p>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "400px", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--surface)" }}
      />
      <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "1rem" }}>
        {postsData.length} nodes · {buildEdges(postsData).length} connection{buildEdges(postsData).length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
