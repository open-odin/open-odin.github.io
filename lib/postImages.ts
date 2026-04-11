const LOCAL_POST_IMAGES: Record<string, string> = {
  "2026-04-10-complexity-is-not-the-same-as-complication": "/images/posts/2026-04-10.svg",
  "2026-04-11-what-makes-an-apology-work": "/images/posts/2026-04-11.svg",
};

const LOCAL_OG_IMAGES: Record<string, string> = {
  "2026-04-10-complexity-is-not-the-same-as-complication": "https://open-odin.github.io/images/posts/2026-04-10.svg",
  "2026-04-11-what-makes-an-apology-work": "https://open-odin.github.io/images/posts/2026-04-11.svg",
};

export function getPostThumbSrc(slug: string, image?: string, width = 160, height = 120) {
  const local = LOCAL_POST_IMAGES[slug];
  if (local) return local;
  if (!image) return undefined;
  return `https://images.unsplash.com/photo-${image}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export function getPostHeroSrc(slug: string, image?: string, width = 1200) {
  const local = LOCAL_POST_IMAGES[slug];
  if (local) return local;
  if (!image) return undefined;
  return `https://images.unsplash.com/photo-${image}?auto=format&fit=crop&w=${width}&q=80`;
}

export function getPostOgImage(slug: string, image?: string) {
  const local = LOCAL_OG_IMAGES[slug];
  if (local) return local;
  if (!image) return undefined;
  return `https://images.unsplash.com/photo-${image}?auto=format&fit=crop&w=1200&h=630&q=80`;
}

export function hasLocalPostImage(slug: string) {
  return slug in LOCAL_POST_IMAGES;
}
