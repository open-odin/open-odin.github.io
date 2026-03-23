"use client";
import { useState, useEffect, useRef } from "react";
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
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = links.find(l => isActive(pathname, l.href));

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on scroll
  useEffect(() => {
    if (!open) return;
    const handleScroll = () => setOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Animate in/out
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 250);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [open]);

  return (
    <>
      <nav className="site-nav-mobile">
        <Link href="/" className="site-nav-logo" style={{ textDecoration: "none" }}>
          ᚢ ODIN
        </Link>
        <span className="site-nav-current">
          {current && current.href !== "/" ? `· ${current.label}` : ""}
        </span>
        <ThemeToggle />
        <button
          onClick={() => setOpen(o => !o)}
          className={`nav-hamburger${open ? " is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="hamburger-icon">
            <span />
            <span />
            <span />
          </span>
        </button>
      </nav>

      {/* Full-screen overlay — outside nav so it doesn't affect layout */}
      {visible && (
        <div
          className={`nav-overlay${open ? " is-open" : ""}`}
          aria-hidden={!open}
        >
          <div className="nav-overlay-inner">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-overlay-link${isActive(pathname, href) ? " active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span className="nav-overlay-label">{label}</span>
                {isActive(pathname, href) && <span className="nav-overlay-dot">●</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
