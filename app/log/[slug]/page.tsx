import { getAllPosts, getPost, getAdjacentPosts, formatDate } from "@/lib/posts";
import ReadingProgress from "@/components/ReadingProgress";
import CopyUrl from "@/components/CopyUrl";
import { generateRuneSvg } from "@/lib/runeImage";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const photoCredits: Record<string, string> = {
  "1768852383730-3eb9f7fe1a5d": "Maddy R.",
  "1704022677001-64ee39ae1759": "Phill Brown",
  "1680547266902-c4f57edc456d": "Paul Schnürle",
  "1723031821090-9bdbd77cec78": "Artists Eyes",
  "1642509014545-49a95a987587": "Tibor Pinter",
  "1506784983877-45594efa4cbe": "Unsplash",
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
      type: "article",
      publishedTime: post.date,
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

  const allPosts = getAllPosts();
  const related = allPosts
    .filter(p => p.slug !== slug && (p.tags ?? []).some(t => (post!.tags ?? []).includes(t)))
    .slice(0, 3);

  return (
    <div>
      <ReadingProgress />
      <div style={{ marginBottom: "0.5rem" }}>
        <Link href="/log" style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
          ← log
        </Link>
      </div>
      {post.image ? (
        <>
          <div className="post-hero-image" style={{ marginBottom: "0.25rem", marginTop: "1.5rem" }}>
            <Image
              src={unsplashUrl(post.image)}
              alt={post.title}
              width={1200}
              height={280}
              style={{ width: "100%", height: "100%", minHeight: "180px", objectFit: "cover", borderRadius: "4px", display: "block" }}
              unoptimized
              priority={false}
            />
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.7rem", textAlign: "right", marginBottom: "1.5rem", marginTop: "0.3rem" }}>
            photo by {photoCredits[post.image] ?? "Unsplash"} / Unsplash
          </p>
        </>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: generateRuneSvg(slug) }}
          style={{ marginBottom: "1.5rem", borderRadius: "4px", overflow: "hidden", marginTop: "1.5rem" }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.1em", margin: 0 }}>
          {formatDate(post.date)} · {readingTime} min read
        </p>
        <CopyUrl />
      </div>
      <h1 className="post-title" style={{
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
      {post.tags && post.tags.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {post.tags.map(tag => (
            <a
              key={tag}
              href={`/tags/${tag}/`}
              style={{
                color: "var(--accent)",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
                border: "1px solid rgba(255,107,43,0.3)",
                borderRadius: "3px",
                padding: "0.15rem 0.6rem",
                textDecoration: "none",
                transition: "border-color 0.2s, background 0.2s",
              }}
              className="tag-pill"
            >
              #{tag}
            </a>
          ))}
        </div>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

      {/* Prev / Next navigation */}
      <nav className="post-nav" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "3rem" }}>
        {next ? (
          <Link href={`/log/${next.slug}/`} className="post-nav-card" style={{ textDecoration: "none" }}>
            <span className="post-nav-label">← older</span>
            <span className="post-nav-title">{next.title}</span>
          </Link>
        ) : <div />}
        {prev ? (
          <Link href={`/log/${prev.slug}/`} className="post-nav-card post-nav-card--right" style={{ textDecoration: "none" }}>
            <span className="post-nav-label">newer →</span>
            <span className="post-nav-title">{prev.title}</span>
          </Link>
        ) : <div />}
      </nav>

      {/* Related posts */}
      {related.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <p className="section-label">RELATED</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.75rem" }}>
            {related.map(r => (
              <Link key={r.slug} href={`/log/${r.slug}/`} className="related-card" style={{ textDecoration: "none" }}>
                <span className="related-card-title">{r.title}</span>
                <span className="related-card-date">{formatDate(r.date)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <a href="#" style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>↑ top</a>
      </div>
    </div>
  );
}
