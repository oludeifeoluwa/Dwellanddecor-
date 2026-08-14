import React from 'react';

// Standard clean fallback image path available in /public/images/
export const DEFAULT_PRODUCT_FALLBACK_IMAGE = '/images/pink_leaf_vines.jpg';

// Comprehensive dictionary mapping keywords to authentic local image assets
const KNOWN_IMAGE_MAP: Record<string, string> = {
  'pink blossom': '/images/pink_leaf_vines.jpg',
  'pink leaf': '/images/pink_leaf_vines.jpg',
  'blossom leaf': '/images/pink_leaf_vines.jpg',
  'garland vines': '/images/pink_leaf_vines.jpg',
  'cherry blossom': '/images/cherry_blossom_vines.jpg',
  'pink vines': '/images/pink_leaf_vines.jpg',
  'green vines': '/images/green_vines_exact.jpg',
  'ivy vines': '/images/green_ivy_vines.jpg',
  'custom collage': '/images/ultimate_dorm_glowup.jpg',
  'wall collage': '/images/ultimate_dorm_glowup.jpg',
  'dorm glow': '/images/ultimate_dorm_glowup.jpg',
  'mirror': '/images/detachable_cat_mirror.jpg',
  'cat ear': '/images/detachable_cat_mirror.jpg',
  'towel': '/images/towel_2in1_set.jpg',
  'scrubber': '/images/silicone_body_scrubber.jpg',
  'silicone': '/images/silicone_body_scrubber.jpg',
  'body scrubber': '/images/silicone_body_scrubber.jpg',
  'scalp': '/images/silicone_body_scrubber.jpg',
  'exfoliating': '/images/silicone_body_scrubber.jpg',
  'cramp': '/images/cramp_relief_belt.jpg',
  'heating belt': '/images/cramp_relief_belt.jpg',
  'menstrual': '/images/cramp_relief_belt.jpg',
  'period': '/images/cramp_relief_belt.jpg',
  'swab': '/images/acrylic_swab_jar.jpg',
  'cotton': '/images/acrylic_swab_jar.jpg',
  'acrylic swab': '/images/acrylic_swab_jar.jpg',
  'jewelry': '/images/wavy_jewelry_palette.jpg',
  'palette': '/images/wavy_jewelry_palette.jpg',
  'rotating': '/images/rotating_makeup_organizer.jpg',
  'carousel': '/images/rotating_makeup_organizer.jpg',
  'makeup organizer': '/images/twotier_makeup_organizer.jpg',
  'skincare organizer': '/images/twotier_makeup_organizer.jpg',
  '2-tier': '/images/twotier_makeup_organizer.jpg',
  'two tier': '/images/twotier_makeup_organizer.jpg',
  'shoe': '/images/shoe_rack_7k.jpg',
  'bag organizer': '/images/bag_organizer_8k.jpg',
  'closet': '/images/bag_organizer_8k.jpg',
  'hook': '/images/hooks_4pcs_1k.jpg',
  'peg': '/images/wooden_peg_rack.jpg',
  'hanger': '/images/wooden_peg_rack.jpg',
  'nano tape': '/images/nano_tape_roll.jpg',
  'tape': '/images/nano_tape_roll.jpg',
  'crate': '/images/storage_basket_crate.jpg',
  'storage basket': '/images/storage_basket_crate.jpg',
  'hanging shelf': '/images/hanging_wooden_shelf.jpg',
  'rope': '/images/hanging_wooden_shelf.jpg',
  'drawer organizer': '/images/space_saving_mesh.jpg',
  'closet drawer': '/images/space_saving_mesh.jpg',
  'wallpaper': '/images/wallpaper_rolls.jpg',
  'contact paper': '/images/wallpaper_rolls.jpg',
  'glow': '/images/glow_dark_stars.jpg',
  'stars': '/images/glow_dark_stars.jpg',
  'bow wall': '/images/pink_bow_wall.jpg',
  'ribbon wall': '/images/pink_bow_wall.jpg',
  'banner': '/images/bow_ribbon_garland.jpg',
  'pull flag': '/images/bow_ribbon_garland.jpg',
  'pink butterfly': '/images/pink_butterfly_12pcs.jpg',
  'mandala': '/images/red_butterfly_mandala.jpg',
  'vibrant butterfly': '/images/red_butterfly_mandala.jpg',
  'glowing butterfly': '/images/glowing_led_butterflies.jpg',
  'led butterfly': '/images/glowing_led_butterflies.jpg',
  'marquee': '/images/letter_marquee_light.jpg',
  'letter': '/images/letter_marquee_light.jpg',
  'sunset': '/images/sunset_lamp_1color.jpg',
  'fairy': '/images/fairy_light_vines.jpg',
  'led strip': '/images/led_strip_light.jpg',
  'stripe light': '/images/led_strip_light.jpg',
  'trolley': '/images/three_tier_trolley.jpg',
  'utility cart': '/images/three_tier_trolley.jpg',
  '3-drawer': '/images/three_drawer_bow_box.jpg',
  'bow knobs': '/images/three_drawer_bow_box.jpg',
  'bow box': '/images/three_drawer_bow_box.jpg',
  'corner rack': '/images/corner_rack_real.jpg',
  'shower rack': '/images/corner_rack_real.jpg',
  'bathroom corner': '/images/corner_rack_real.jpg',
  'aurora': '/images/aurora_projector.jpg',
  'northern lights': '/images/aurora_projector.jpg',
  'galaxy projector': '/images/aurora_projector.jpg',
  'crystal wave': '/images/projection_lamp.jpg',
  'ocean wave': '/images/projection_lamp.jpg',
  'crystal ball': '/images/projection_lamp.jpg',
  'wave lamp': '/images/projection_lamp.jpg',
  'laundry': '/images/mesh_laundry_basket.jpg',
  'hamper': '/images/mesh_laundry_basket.jpg',
  'gold handles': '/images/clear_gold_handle_box.jpg',
  'gold handle': '/images/clear_gold_handle_box.jpg',
  'fluted': '/images/clear_gold_handle_box.jpg',
  'acrylic bin': '/images/clear_gold_handle_box.jpg',
  'acrylic organizer': '/images/clear_gold_handle_box.jpg'
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
 * Handles image load errors gracefully with progressive recovery
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string = DEFAULT_PRODUCT_FALLBACK_IMAGE
) => {
  const img = e.currentTarget;
  const stage = parseInt(img.dataset.errorStage || '0', 10);
  const altText = img.alt || '';

  if (stage === 0) {
    img.dataset.errorStage = '1';
    
    // First try keyword match from alt text
    const keywordMatch = findImageByKeyword(altText);
    if (keywordMatch && !img.src.endsWith(keywordMatch)) {
      img.src = keywordMatch;
      return;
    }

    // Try stripping timestamp or suffix if present
    const currentSrc = img.src || '';
    if (currentSrc.includes('_') && currentSrc.endsWith('.jpg')) {
      const cleanVersion = currentSrc.replace(/_\d{10,15}\.jpg$/, '.jpg');
      if (cleanVersion !== currentSrc) {
        img.src = cleanVersion;
        return;
      }
    }

    // Fallback to standard verified image
    img.src = fallbackUrl;
  } else if (stage === 1) {
    img.dataset.errorStage = '2';
    img.src = '/images/pink_leaf_vines.jpg';
  } else if (stage === 2) {
    img.dataset.errorStage = '3';
    img.src = '/images/ultimate_dorm_glowup.jpg';
  }
};

/**
 * Ensures an image URL is well-formed normal JPEG path or data URI.
 */
export const getCleanImageUrl = (url?: string | null, productName?: string | null): string => {
  // If product name is provided and matches known dictionary, ensure accurate image
  if (productName) {
    const keywordMatch = findImageByKeyword(productName);
    if (keywordMatch && (!url || url.includes('placeholder') || url.includes('placehold.co') || !url.startsWith('/images/'))) {
      return keywordMatch;
    }
  }

  if (!url || typeof url !== 'string' || !url.trim() || url.includes('placehold.co') || url.includes('placeholder')) {
    if (productName) {
      const match = findImageByKeyword(productName);
      if (match) return match;
    }
    return DEFAULT_PRODUCT_FALLBACK_IMAGE;
  }

  let trimmed = url.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (!trimmed.startsWith('/')) {
    trimmed = `/${trimmed}`;
  }
  return trimmed;
};
