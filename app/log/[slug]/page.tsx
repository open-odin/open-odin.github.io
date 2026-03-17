import { getAllPosts, getPost } from "@/lib/posts";
import { remark } from "remark";
import remarkHtml from "remark-html";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const processed = await remark().use(remarkHtml).process(post.content);
  const html = processed.toString();

  return (
    <div>
      <Link href="/log" style={{ color: "var(--muted)", fontSize: "0.8rem", display: "block", marginBottom: "2rem" }}>
        ← log
      </Link>
      <p style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
        {post.date}
      </p>
      <h1 style={{ color: "#e8e8e8", fontWeight: "normal", fontSize: "1.6rem", marginBottom: "2rem", lineHeight: 1.3 }}>
        {post.title}
      </h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ maxWidth: "100%" }}
      />
    </div>
  );
}
