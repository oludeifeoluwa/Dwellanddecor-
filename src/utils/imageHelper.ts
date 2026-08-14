import React from  'react';

// Standard clean fallback image path available in /public/images/
export const DEFAULT_PRODUCT_FALLBACK_IMAGE = '/images/IMG-20260806-WA0168.jpg';

// Comprehensive dictionary mapping keywords to authentic local image assets
const KNOWN_IMAGE_MAP: Record<string, string> = {
  'pink blossom': '/images/IMG-20260806-WA0096.jpg',
  'pink leaf': '/images/IMG-20260806-WA0096.jpg',
  'blossom leaf': '/images/IMG-20260806-WA0096.jpg',
  'garland vines': '/images/IMG-20260806-WA0096.jpg',
  'cherry blossom': '/images/IMG-20260806-WA0075.jpg',
  'pink vines': '/images/IMG-20260806-WA0075.jpg',
  'green vines': '/images/IMG-20260806-WA0099(1).jpg',
  'ivy vines': '/images/IMG-20260806-WA0099(1).jpg',
  'custom collage': '/images/IMG-20260806-WA0121.jpg',
  'wall collage': '/images/IMG-20260806-WA0121.jpg',
  'dorm glow': '/images/IMG-20260806-WA0121.jpg',
  'mirror': '/images/IMG-20260806-WA0136.jpg',
  'cat ear': '/images/IMG-20260806-WA0136.jpg',
  'towel': '/images/IMG-20260806-WA0135.jpg',
  'scrubber': '/images/IMG-20260806-WA0139.jpg',
  'silicone': '/images/IMG-20260806-WA0139.jpg',
  'body scrubber': '/images/IMG-20260806-WA0139.jpg',
  'scalp': '/images/IMG-20260806-WA0139.jpg',
  'exfoliating': '/images/IMG-20260806-WA0139.jpg',
  'cramp': '/images/IMG-20260806-WA0133.jpg',
  'heating belt': '/images/IMG-20260806-WA0133.jpg',
  'menstrual': '/images/IMG-20260806-WA0133.jpg',
  'period': '/images/IMG-20260806-WA0133.jpg',
  'swab': '/images/IMG-20260806-WA0167.jpg',
  'cotton': '/images/IMG-20260806-WA0167.jpg',
  'acrylic swab': '/images/IMG-20260806-WA0167.jpg',
  'jewelry': '/images/IMG-20260806-WA0161.jpg',
  'palette': '/images/IMG-20260806-WA0161.jpg',
  'rotating': '/images/IMG-20260806-WA0086.jpg',
  'carousel': '/images/IMG-20260806-WA0086.jpg',
  'makeup organizer': '/images/IMG-20260806-WA0104.jpg',
  'skincare organizer': '/images/IMG-20260806-WA0104.jpg',
  '2-tier': '/images/IMG-20260806-WA0104.jpg',
  'two tier': '/images/IMG-20260806-WA0104.jpg',
  'shoe': '/images/IMG-20260806-WA0107.jpg',
  'bag organizer': '/images/IMG-20260806-WA0108.jpg',
  'closet': '/images/IMG-20260806-WA0162.jpg',
  'hook': '/images/IMG-20260806-WA0106.jpg',
  'peg': '/images/IMG-20260806-WA0113.jpg',
  'hanger': '/images/IMG-20260806-WA0113.jpg',
  'nano tape': '/images/IMG-20260806-WA0145.jpg',
  'tape': '/images/IMG-20260806-WA0145.jpg',
  'crate': '/images/IMG-20260806-WA0156.jpg',
  'storage basket': '/images/IMG-20260806-WA0156.jpg',
  'hanging shelf': '/images/IMG-20260806-WA0159.jpg',
  'rope': '/images/IMG-20260806-WA0159.jpg',
  'drawer organizer': '/images/IMG-20260806-WA0162.jpg',
  'closet drawer': '/images/IMG-20260806-WA0162.jpg',
  'wallpaper': '/images/IMG-20260806-WA0115.jpg',
  'contact paper': '/images/IMG-20260806-WA0115.jpg',
  'glow': '/images/IMG-20260806-WA0114.jpg',
  'stars': '/images/IMG-20260806-WA0114.jpg',
  'bow wall': '/images/IMG-20260806-WA0165.jpg',
  'ribbon wall': '/images/IMG-20260814-WA0046.jpg',
  'banner': '/images/IMG-20260814-WA0046.jpg',
  'pull flag': '/images/IMG-20260814-WA0046.jpg',
  'pink butterfly': '/images/IMG-20260806-WA0075.jpg',
  'mandala': '/images/IMG-20260806-WA0077.jpg',
  'vibrant butterfly': '/images/IMG-20260806-WA0073.jpg',
  'glowing butterfly': '/images/IMG-20260806-WA0168.jpg',
  'led butterfly': '/images/IMG-20260806-WA0168.jpg',
  'marquee': '/images/IMG-20260806-WA0073.jpg',
  'letter': '/images/IMG-20260806-WA0073.jpg',
  'sunset': '/images/IMG-20260806-WA0101.jpg',
  'fairy': '/images/IMG-20260806-WA0149.jpg',
  'led strip': '/images/IMG-20260806-WA0196.jpg',
  'stripe light': '/images/IMG-20260806-WA0196.jpg',
  'trolley': '/images/IMG-20260806-WA0183.jpg',
  'utility cart': '/images/IMG-20260806-WA0183.jpg',
  '3-drawer': '/images/IMG-20260806-WA0182.jpg',
  'bow knobs': '/images/IMG-20260806-WA0182.jpg',
  'bow box': '/images/IMG-20260806-WA0182.jpg',
  'corner rack': '/images/IMG-20260806-WA0182.jpg',
  'shower rack': '/images/IMG-20260806-WA0182.jpg',
  'bathroom corner': '/images/IMG-20260806-WA0182.jpg',
  'aurora': '/images/IMG-20260806-WA0181.jpg',
  'northern lights': '/images/IMG-20260806-WA0181.jpg',
  'galaxy projector': '/images/IMG-20260806-WA0181.jpg',
  'crystal wave': '/images/IMG-20260806-WA0180.jpg',
  'ocean wave': '/images/IMG-20260806-WA0180.jpg',
  'crystal ball': '/images/IMG-20260806-WA0180.jpg',
  'wave lamp': '/images/IMG-20260806-WA0180.jpg',
  'laundry': '/images/IMG-20260806-WA0179.jpg',
  'hamper': '/images/IMG-20260806-WA0179.jpg',
  'gold handles': '/images/IMG-20260806-WA0176.jpg',
  'gold handle': '/images/IMG-20260806-WA0176.jpg',
  'fluted': '/images/IMG-20260806-WA0176.jpg',
  'acrylic bin': '/images/IMG-20260806-WA0176.jpg',
  'acrylic organizer': '/images/IMG-20260806-WA0176.jpg'
};

/**
 * Finds matching image based on title or description text
 */
export const findImageByKeyword = (text?: string | null): string | null => {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const [key, imagePath] of Object.entries(KNOWN_IMAGE_MAP)) {
    if (lower.includes(key)) {
      return imagePath;
    }
  }
  return null;
};

/**
 * Handles image load errors gracefully without looping into broken-image icons.
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string = DEFAULT_PRODUCT_FALLBACK_IMAGE
) => {
  const img = e.currentTarget;
  const currentSrc = img.currentSrc || img.src || '';

  if ((img.dataset as Record<string, string>).errorHandled === 'true') {
    img.onerror = null;
    img.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
        <rect width="800" height="800" fill="#f5e7e4"/>
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="42" fill="#8b5e5b" font-family="Arial, sans-serif">
          Image unavailable
        </text>
      </svg>
    `)}`;
    return;
  }

  (img.dataset as Record<string, string>).errorHandled = 'true';

  if (currentSrc !== fallbackUrl) {
    img.src = fallbackUrl;
    return;
  }

  img.onerror = null;
  img.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <rect width="800" height="800" fill="#f5e7e4"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="42" fill="#8b5e5b" font-family="Arial, sans-serif">
        Image unavailable
      </text>
    </svg>
  `)}`;
};

/**
 * Ensures an image URL is a valid local/static URL or a safe remote URL.
 */
export const getCleanImageUrl = (url?: string | null, productName?: string | null): string => {
  if (productName) {
    const keywordMatch = findImageByKeyword(productName);
    if (keywordMatch) {
      return keywordMatch;
    }
  }

  if (!url || typeof url !== 'string' || !url.trim()) {
    return DEFAULT_PRODUCT_FALLBACK_IMAGE;
  }

  const trimmed = url.trim();

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return `/${trimmed}`;
};
