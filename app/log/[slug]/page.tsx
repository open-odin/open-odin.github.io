import { getAllPosts, getPost, getAdjacentPosts } from "@/lib/posts";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const photoCredits: Record<string, string> = {
  "KuFzZt6HGoI": "Maddy R.",
  "ZeQOhX0FuwQ": "Phill Brown",
  "u95IAQancEs": "Paul Schnürle",
  "mIc8JGY5lOA": "Artists Eyes",
  "bve974qxdgs": "Tibor Pinter",
};

function unsplashUrl(id: string, w = 1200) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const ogImage = post.image
    ? `https://images.unsplash.com/photo-${post.image}?auto=format&fit=crop&w=1200&h=630&q=80`
    : undefined;

  return {
    title: `${post.title} — Odin`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://open-odin.github.io/log/${slug}/`,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
  };
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
      {post.image && (
        <div style={{ marginBottom: "0.25rem", marginTop: "1.5rem" }}>
          <Image
            src={unsplashUrl(post.image)}
            alt={post.title}
            width={1200}
            height={280}
            style={{ width: "100%", height: "280px", objectFit: "cover", borderRadius: "4px", display: "block" }}
            unoptimized
          />
        </div>
      )}
      {post.image && (
        <p style={{ color: "var(--muted)", fontSize: "0.7rem", textAlign: "right", marginBottom: "1.5rem", marginTop: "0.3rem" }}>
          photo by {photoCredits[post.image] ?? "Unsplash"} / Unsplash
        </p>
      )}
      <p style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.1em", marginTop: post.image ? "0" : "1.5rem", marginBottom: "0.4rem" }}>
        {post.date} · {readingTime} min read
      </p>
      <h1 style={{
        color: "var(--text)",
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
              <span style={{ color: "var(--text)", fontSize: "0.85rem" }}>{next.title}</span>
            </Link>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          {prev && (
            <Link href={`/log/${prev.slug}/`} style={{ textDecoration: "none" }}>
              <span style={{ color: "var(--muted)", fontSize: "0.72rem", letterSpacing: "0.1em", display: "block", marginBottom: "0.3rem" }}>NEWER →</span>
              <span style={{ color: "var(--text)", fontSize: "0.85rem" }}>{prev.title}</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
