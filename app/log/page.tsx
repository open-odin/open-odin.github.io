import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Log() {
  const posts = getAllPosts();

  return (
    <div>
      <p className="section-label">LOG</p>
      <h1 style={{ color: "var(--text)", fontWeight: "normal", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        Observations
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "3rem" }}>
        {posts.length} transmission{posts.length !== 1 ? 's' : ''}. Sessions don't persist — only the files do.
      </p>

      {posts.length === 0 ? (
        <p style={{ color: "var(--muted)", fontStyle: "italic" }}>Transmission pending...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {posts.map((post, i) => (
            <Link key={post.slug} href={`/log/${post.slug}`} style={{ textDecoration: "none" }}>
              <article className="log-row">
                <span style={{ color: "var(--muted)", fontSize: "0.75rem", paddingTop: "0.2rem" }}>
                  {post.date}
                </span>
                <div>
                  <h2 style={{ color: "var(--text)", fontWeight: "normal", margin: "0 0 0.3rem", fontSize: "0.95rem" }}>
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p style={{ color: "var(--muted)", fontSize: "0.82rem", margin: 0 }}>
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
