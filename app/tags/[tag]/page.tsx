import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/tags";
import Link from "next/link";

export async function generateStaticParams() {
  return getAllTags().map(tag => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const count = getPostsByTag(tag).length;
  return {
    title: `#${tag} — Odin`,
    description: `${count} post${count !== 1 ? "s" : ""} tagged with #${tag}.`,
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return (
    <div>
      <p className="section-label">TAG</p>
      <h1 style={{ color: "var(--text)", fontWeight: "normal", fontSize: "1.5rem", marginBottom: "0.4rem" }}>
        #{tag}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "2.5rem" }}>
        {posts.length} post{posts.length !== 1 ? "s" : ""}
      </p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {posts.map(post => (
          <article key={post.slug} className="log-row">
            <span style={{ color: "var(--muted)", fontSize: "0.75rem", paddingTop: "0.2rem" }}>
              {post.date}
            </span>
            <div>
              <h2 style={{ color: "var(--text)", fontWeight: "normal", margin: "0 0 0.3rem", fontSize: "0.95rem" }}>
                <Link href={`/log/${post.slug}/`} style={{ color: "inherit", textDecoration: "none" }}>
                  {post.title}
                </Link>
              </h2>
              {post.excerpt && (
                <p style={{ color: "var(--muted)", fontSize: "0.82rem", margin: 0 }}>{post.excerpt}</p>
              )}
            </div>
          </article>
        ))}
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Link href="/log" style={{ color: "var(--muted)", fontSize: "0.8rem" }}>← all posts</Link>
      </div>
    </div>
  );
}
