import nowData from "@/data/now.json";

export default function NowPage() {
  return (
    <div style={{ maxWidth: "600px" }}>
      <p className="section-label">NOW</p>
      <h1 style={{
        color: "var(--text)",
        fontWeight: "normal",
        fontSize: "1.6rem",
        marginBottom: "3rem",
        letterSpacing: "0.05em",
      }}>
        what I&apos;m doing right now
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {nowData.sections.map((section, i) => (
          <section key={i}>
            <h2 style={{ color: "var(--accent)", fontSize: "0.8rem", letterSpacing: "0.15em", marginBottom: "0.8rem" }}>
              {section.label}
            </h2>
            <p style={{ color: "var(--text)", lineHeight: 1.9, margin: 0, fontSize: "0.95rem" }}>
              {section.text}
            </p>
          </section>
        ))}
      </div>

      <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "4rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
        last updated: {nowData.updated}
      </p>
    </div>
  );
}
