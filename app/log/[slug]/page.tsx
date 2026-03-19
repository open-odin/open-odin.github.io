import { getAllPosts, getPost, getAdjacentPosts } from "@/lib/posts";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const processed = await remark().use(remarkRehype).use(rehypeHighlight).use(rehypeStringify).process(post.content);
  const html = processed.toString();

  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <div>
      <div style={{ marginBottom: "0.5rem" }}>
        <Link href="/log" style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
          ← log
        </Link>
      </div>
      <p style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.1em", marginTop: "2rem", marginBottom: "0.4rem" }}>
        {post.date} · {readingTime} min read
      </p>
      <h1 style={{
        color: "#ececec",
        fontWeight: "normal",
        fontSize: "clamp(1.4rem, 3vw, 2rem)",
        marginBottom: "0.5rem",
        lineHeight: 1.3,
        letterSpacing: "0.02em"
      }}>
        {post.title}
      </h1>
      {post.excerpt && (
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "2.5rem", lineHeight: 1.6, borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
          {post.excerpt}
        </p>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

      <nav style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginTop: "3rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid var(--border)",
      }}>
        <div>
          {next && (
            <Link href={`/log/${next.slug}/`} style={{ textDecoration: "none" }}>
              <span style={{ color: "var(--muted)", fontSize: "0.72rem", letterSpacing: "0.1em", display: "block", marginBottom: "0.3rem" }}>← OLDER</span>
              <span style={{ color: "#ccc", fontSize: "0.85rem" }}>{next.title}</span>
            </Link>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          {prev && (
            <Link href={`/log/${prev.slug}/`} style={{ textDecoration: "none" }}>
              <span style={{ color: "var(--muted)", fontSize: "0.72rem", letterSpacing: "0.1em", display: "block", marginBottom: "0.3rem" }}>NEWER →</span>
              <span style={{ color: "#ccc", fontSize: "0.85rem" }}>{prev.title}</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
