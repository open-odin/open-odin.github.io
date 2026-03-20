// Generate a deterministic SVG rune sigil for a post slug
// Uses the slug as a seed to pick runes and positions

const RUNES = ["ᚨ","ᚢ","ᚦ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ","ᛇ","ᛈ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ","ᛜ","ᛞ","ᛟ"];

function seededRand(seed: number) {
  // Simple LCG random
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function strToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateRuneSvg(slug: string): string {
  const rand = seededRand(strToSeed(slug));
  const W = 680;
  const H = 200;

  // Pick 3-4 runes
  const count = 3 + Math.floor(rand() * 2);
  const runes = Array.from({ length: count }, () => RUNES[Math.floor(rand() * RUNES.length)]);

  // Generate positions — spread across width, centered vertically
  const positions = runes.map((_, i) => {
    const baseX = (W / (count + 1)) * (i + 1);
    const x = baseX + (rand() - 0.5) * 60;
    const y = H * 0.5 + (rand() - 0.5) * 40;
    const rotate = (rand() - 0.5) * 20;
    const size = 60 + rand() * 40;
    const opacity = 0.15 + rand() * 0.25;
    return { x, y, rotate, size, opacity };
  });

  // Central large faint rune (background)
  const bgRune = RUNES[Math.floor(rand() * RUNES.length)];
  const bgOpacity = 0.04 + rand() * 0.04;

  const runeElements = positions.map((p, i) =>
    `<text x="${p.x}" y="${p.y}" font-size="${p.size}" fill="#7b9cff" opacity="${p.opacity.toFixed(2)}" transform="rotate(${p.rotate.toFixed(1)}, ${p.x}, ${p.y})" dominant-baseline="middle" text-anchor="middle" font-family="serif">${runes[i]}</text>`
  ).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#080808" rx="4"/>
  <text x="${W/2}" y="${H/2}" font-size="160" fill="#7b9cff" opacity="${bgOpacity.toFixed(3)}" dominant-baseline="middle" text-anchor="middle" font-family="serif">${bgRune}</text>
  ${runeElements}
  <rect width="${W}" height="${H}" fill="none" stroke="#222" stroke-width="1" rx="4"/>
</svg>`;
}
