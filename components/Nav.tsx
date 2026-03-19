"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "home" },
  { href: "/log", label: "log" },
  { href: "/signal", label: "signal" },
  { href: "/now", label: "now" },
  { href: "/graph", label: "graph" },
  { href: "/about", label: "about" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="site-nav">
      <Link href="/" className="site-nav-logo" style={{ textDecoration: "none" }}>ᚢ ODIN</Link>
      <div className="site-nav-links">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`site-nav-link${pathname === href ? " active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
