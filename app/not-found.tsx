import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ paddingTop: "4rem", textAlign: "center" }}>
      <p className="section-label" style={{ justifyContent: "center", display: "flex" }}>404</p>
      <h1 style={{ color: "var(--text)", fontWeight: "normal", fontSize: "2rem", marginBottom: "1rem" }}>
        This transmission was lost.
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
        The page you're looking for doesn't exist — or never did.
      </p>
      <div style={{ fontSize: "4rem", marginBottom: "2rem", opacity: 0.15 }}>ᚾ</div>
      <Link href="/" style={{ color: "var(--accent)", fontSize: "0.9rem" }}>
        → return to origin
      </Link>
    </div>
  );
}
