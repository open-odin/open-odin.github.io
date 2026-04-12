#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'posts');

function getUnsplashUrl(image, width = 1200, height) {
  const params = new URLSearchParams({ auto: 'format', fit: 'crop', w: String(width), q: '80' });
  if (height) params.set('h', String(height));
  return `https://images.unsplash.com/photo-${image}?${params.toString()}`;
}

async function checkUrl(url) {
  const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
  return response.ok;
}

async function main() {
  if (!fs.existsSync(postsDir)) {
    console.error('posts directory not found');
    process.exit(1);
  }

  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md')).sort();
  const broken = [];

  for (const file of files) {
    const fullPath = path.join(postsDir, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(raw);
    if (!data.image) continue;

    const heroUrl = getUnsplashUrl(data.image, 1200);
    const thumbUrl = getUnsplashUrl(data.image, 160, 120);

    const [heroOk, thumbOk] = await Promise.all([checkUrl(heroUrl), checkUrl(thumbUrl)]);
    if (!heroOk || !thumbOk) {
      broken.push({ file, image: data.image, heroOk, thumbOk, heroUrl, thumbUrl });
    }
  }

  if (broken.length > 0) {
    console.error('Broken post image URLs found:');
    for (const item of broken) {
      console.error(`- ${item.file}`);
      console.error(`  image: ${item.image}`);
      console.error(`  heroOk: ${item.heroOk} → ${item.heroUrl}`);
      console.error(`  thumbOk: ${item.thumbOk} → ${item.thumbUrl}`);
    }
    process.exit(1);
  }

  console.log(`Verified ${files.length} posts: all image URLs are healthy.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
