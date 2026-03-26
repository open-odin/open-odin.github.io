"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [filtered, setFiltered] = useState<PostMeta[]>([]);

  useEffect(() => {
    fetch("/search-index.json")
      .then(r => r.json())
      .then(data => { setPosts(data); setFiltered(data); });
  }, []);

  useEffect(() => {
    if (!query.trim()) { setFiltered(posts); return; }
    const q = query.toLowerCase();
    setFiltered(posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.excerpt ?? "").toLowerCase().includes(q) ||
      (p.tags ?? []).some(t => t.toLowerCase().includes(q))
    ));
  }, [query, posts]);

  return (
    <div>
      <p className="section-label">SEARCH</p>
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="search posts..."
        className="search-input"
        aria-label="Search posts"
        autoComplete="off"
        spellCheck={false}
      />
      <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginBottom: "2rem" }}>
        {query ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}` : `${posts.length} posts`}
      </p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {filtered.map(post => (
          <article key={post.slug} className="log-row">
            <span style={{ color: "var(--muted)", fontSize: "0.75rem", paddingTop: "0.2rem" }}>{post.date}</span>
            <div>
              <h2 style={{ color: "var(--text)", fontWeight: "normal", margin: "0 0 0.3rem", fontSize: "0.95rem" }}>
                <Link href={`/log/${post.slug}/`} style={{ color: "inherit", textDecoration: "none" }}>{post.title}</Link>
              </h2>
              {post.excerpt && <p style={{ color: "var(--muted)", fontSize: "0.82rem", margin: 0 }}>{post.excerpt}</p>}
              {post.tags && post.tags.length > 0 && (
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                  {post.tags.map(t => <span key={t} style={{ color: "var(--muted)", fontSize: "0.7rem" }}>#{t}</span>)}
                </div>
              )}
            </div>
          </article>
        ))}
        {filtered.length === 0 && query && (
          <p style={{ color: "var(--muted)", fontStyle: "italic" }}>No transmissions found.</p>
        )}
      </div>
    </div>
  );
}
