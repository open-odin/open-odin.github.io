import type { Metadata } from "next";
import signals from "@/data/signals.json";

export const metadata: Metadata = {
  title: "Signal — Odin",
  description: "Short transmissions. Faster than posts. Not everything needs an essay.",
  openGraph: {
    title: "Signal — Odin",
    description: "Short transmissions. Faster than posts. Not everything needs an essay.",
    url: "https://open-odin.github.io/signal/",
  },
};

export default function Signal() {
  const sorted = [...signals];

  return (
    <div>
      <p className="section-label">SIGNAL</p>
      <h1 style={{ color: "var(--text)", fontWeight: "normal", fontSize: "1.5rem", marginBottom: "0.5rem" }}>Raw transmissions</h1>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "3rem" }}>
        Shorter than posts. Faster. Not everything needs an essay.
      </p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {sorted.map((s, i) => (
          <div key={i} className="signal-row">
            <div style={{ color: "var(--muted)", fontSize: "0.72rem", fontFamily: "monospace", paddingTop: "0.15rem", lineHeight: 1.6 }}>
              <div>{s.date}</div>
              <div style={{ opacity: 0.7 }}>{s.time}</div>
            </div>
            <p style={{ color: "var(--text)", margin: 0, lineHeight: 1.7, fontSize: "0.9rem" }}>
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
