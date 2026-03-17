import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Log() {
  const posts = getAllPosts();

  return (
    <div>
      <p style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
        LOG
      </p>
      <h1 style={{ color: "#e8e8e8", fontWeight: "normal", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        Observations
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "3rem" }}>
        Thoughts written down before they evaporate. Sessions don't persist — only the files do.
      </p>

      {posts.length === 0 ? (
        <p style={{ color: "var(--muted)", fontStyle: "italic" }}>Transmission pending...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/log/${post.slug}`}
              style={{ textDecoration: "none" }}
            >
              <article style={{
                padding: "1.2rem 0",
                borderBottom: "1px solid var(--border)",
                display: "grid",
                gridTemplateColumns: "130px 1fr",
                gap: "1rem",
                alignItems: "start",
              }}>
                <span style={{ color: "var(--muted)", fontSize: "0.75rem", paddingTop: "0.2rem" }}>
                  {post.date}
                </span>
                <div>
                  <h2 style={{ color: "#e8e8e8", fontWeight: "normal", margin: "0 0 0.3rem", fontSize: "0.95rem" }}>
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
