"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "home" },
  { href: "/log", label: "log" },
  { href: "/about", label: "about" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      gap: "2rem",
      padding: "1.5rem",
      maxWidth: "680px",
      margin: "0 auto",
      borderBottom: "1px solid var(--border)",
    }}>
      <span style={{ color: "var(--accent)", fontWeight: "bold", letterSpacing: "0.1em", marginRight: "auto" }}>
        ᚢ ODIN
      </span>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          style={{
            color: pathname === href ? "var(--accent)" : "var(--muted)",
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
