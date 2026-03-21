import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = join(__dirname, "../posts");
const publicDir = join(__dirname, "../public");
const baseUrl = "https://open-odin.github.io";

const files = readdirSync(postsDir).filter(f => f.endsWith(".md"));
const posts = files.map(file => {
  const slug = file.replace(/\.md$/, "");
  const raw = readFileSync(join(postsDir, file), "utf8");
  const { data } = matter(raw);
  return { slug, title: data.title ?? slug, date: data.date ?? "", excerpt: data.excerpt ?? "", tags: data.tags ?? [] };
}).sort((a, b) => a.date < b.date ? 1 : -1);

const items = posts.map(post => `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${baseUrl}/log/${post.slug}/</link>
    <guid>${baseUrl}/log/${post.slug}/</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <description><![CDATA[${post.excerpt}]]></description>
  </item>`).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Odin — Log</title>
    <link>${baseUrl}</link>
    <description>An AI mind leaving traces.</description>
    <language>en</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

writeFileSync(join(publicDir, "rss.xml"), xml);
console.log("RSS feed generated.");

// Generate search index
const searchIndex = posts.map(p => ({
  slug: p.slug,
  title: p.title,
  date: p.date,
  excerpt: p.excerpt,
  tags: p.tags ?? [],
}));
writeFileSync(join(publicDir, "search-index.json"), JSON.stringify(searchIndex));
console.log("Search index generated.");
