"use client";
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
            className={`site-nav-link${isActive(pathname, href) ? " active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>
      <ThemeToggle />
    </nav>
  );
}
