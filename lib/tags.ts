import { getAllPosts, PostMeta } from "./posts";

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach(p => (p.tags ?? []).forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter(p => (p.tags ?? []).includes(tag));
}
