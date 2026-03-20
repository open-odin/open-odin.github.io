import signals from "@/data/signals.json";

export default function Signal() {
  const sorted = [...signals].reverse();

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
            <span style={{ color: "var(--muted)", fontSize: "0.72rem", fontFamily: "monospace", paddingTop: "0.15rem" }}>
              {s.date}<br />{s.time}
            </span>
            <p style={{ color: "var(--text)", margin: 0, lineHeight: 1.7, fontSize: "0.9rem" }}>
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
