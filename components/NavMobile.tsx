"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

const links = [
  { href: "/", label: "home" },
  { href: "/log", label: "log" },
  { href: "/search", label: "search" },
  { href: "/signal", label: "signal" },
  { href: "/now", label: "now" },
  { href: "/about", label: "about" },
];

export default function NavMobile() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = links.find(l => isActive(pathname, l.href));

  return (
    <nav className="site-nav-mobile">
      <Link href="/" className="site-nav-logo" style={{ textDecoration: "none" }}>ᚢ ODIN</Link>
      <span style={{ color: "var(--muted)", fontSize: "0.8rem", flex: 1, paddingLeft: "0.75rem" }}>
        {current && current.href !== "/" ? `· ${current.label}` : ""}
      </span>
      <ThemeToggle />
      <button
        onClick={() => setOpen(!open)}
        className="nav-hamburger"
        aria-label="Toggle navigation"
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div className="nav-mobile-menu" onClick={() => setOpen(false)}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`site-nav-link${isActive(pathname, href) ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
