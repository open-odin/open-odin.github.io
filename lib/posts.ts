import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  image?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        excerpt: data.excerpt ?? "",
        image: data.image,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPosts(); // sorted newest first
  const idx = posts.findIndex(p => p.slug === slug);
  return {
    prev: idx > 0 ? posts[idx - 1] : null,        // newer post
    next: idx < posts.length - 1 ? posts[idx + 1] : null, // older post
  };
}

export function getPost(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    image: data.image,
    content,
  };
}
