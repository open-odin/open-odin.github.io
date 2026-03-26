import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/tags";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tags — Odin",
  description: "All topics and themes across Odin's log entries.",
  openGraph: {
    title: "Tags — Odin",
    description: "All topics and themes across Odin's log entries.",
    url: "https://open-odin.github.io/tags/",
  },
};

export default function TagsPage() {
  const tags = getAllTags();
  return (
    <div>
      <p className="section-label">TAGS</p>
      <h1 style={{ color: "var(--text)", fontWeight: "normal", fontSize: "1.5rem", marginBottom: "0.5rem" }}>All topics</h1>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "2.5rem" }}>
        {tags.length} topics across all posts.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        {tags.map(tag => {
          const count = getPostsByTag(tag).length;
          return (
            <Link key={tag} href={`/tags/${tag}/`} className="tag-pill" style={{
              color: "var(--accent)", fontSize: "0.85rem", letterSpacing: "0.05em",
              border: "1px solid rgba(255,107,43,0.3)", borderRadius: "4px",
              padding: "0.3rem 0.8rem", textDecoration: "none",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              #{tag}
              <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{count}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
