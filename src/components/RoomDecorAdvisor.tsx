import React, { useState } from 'react';
import { 
  Palette, 
  Check, 
  ShoppingBag, 
  Lightbulb, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Heart, 
  Info, 
  CheckCircle2, 
  Package, 
  Flame, 
  Plus,
  Minus,
  SlidersHorizontal,
  Layers,
  Star,
  Tag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { handleImageError } from '../utils/imageHelper';

// Public room aesthetic images served from /public/images/
const cozySunsetNeonImg = '/images/IMG-20260806-WA0188.jpg';
const cyberSunsetRoomImg = '/images/IMG-20260806-WA0187.jpg';
const neonFlexWaveImg = '/images/neon_flex_wave.jpg';
const fairyLightBotanicalImg = '/images/fairy_light_botanical.jpg';
const popMusicWallImg = '/images/pop_music_wall.jpg';
const ultimateDormGlowupImg = '/images/ultimate_dorm_glowup.jpg';

interface ComboPackage {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  priceNGN: number;
  priceUSD: number;
  originalPriceNGN: number;
  image: string;
  items: string[];
  vibeTag: string;
  whatsappPresetText: string;
}

const COMBO_PACKAGES: ComboPackage[] = [
  {
    id: 'combo-cozy-sunset',
    name: 'Cozy Sunset & Neon Butterfly Room',
    subtitle: 'Warm yellow room glow with cascading green vines, glowing pink neon butterfly light & flower cushion vibe.',
    badge: '🔥 Student Favorite',
    priceNGN: 28500,
    priceUSD: 19.00,
    originalPriceNGN: 35000,
    image: cozySunsetNeonImg,
    items: [
      'Hanging Green Ivy Vines (12 strands)',
      'Glowing Pink Neon Butterfly Wall Light',
      'Plush Pink Flower Cushion Decor',
      'Pink Aesthetic Wall Collage Set (30 posters)',
      '3D Butterfly Wall Stickers (12 pcs)',
      'Trace-Free Double-Sided Nano Tape'
    ],
    vibeTag: 'Cozy Warm Sunset',
    whatsappPresetText: 'Hi Dwell & Decor! I want to order the Cozy Sunset & Neon Butterfly Room Combo Package (₦28,500).'
  },
  {
    id: 'combo-cyber-sunset',
    name: 'Cyber Sunset & Ambient Ivy Vibe',
    subtitle: 'Mood-shifting ceiling LED strip, golden sunset lamp projection, vertical ivy leaves & album poster wall.',
    badge: 'Vibe Master Choice',
    priceNGN: 32000,
    priceUSD: 21.33,
    originalPriceNGN: 40000,
    image: cyberSunsetRoomImg,
    items: [
      'RGB Ceiling LED Strip Lights (5 meters)',
      'Golden Sunset Lamp Projection Light',
      'Vertical Hanging Green Ivy Vines',
      'Music & Vogue Aesthetic Poster Pack (30 pcs)',
      '3D Butterfly Wall Stickers (12 pcs)',
      'Trace-Free Double-Sided Nano Tape'
    ],
    vibeTag: 'Cyber Sunset Ambient',
    whatsappPresetText: 'Hi Dwell & Decor! I want to order the Cyber Sunset & Ambient Ivy Vibe Combo Package (₦32,000).'
  },
  {
    id: 'combo-neon-wave',
    name: 'Neon Flex Wave & Cyber Room',
    subtitle: 'Flexible neon rope light shaped into custom wall waves, purple ambient LED glow & anime wall collage.',
    badge: '⚡ Cyberpunk Glow',
    priceNGN: 35000,
    priceUSD: 23.33,
    originalPriceNGN: 45000,
    image: neonFlexWaveImg,
    items: [
      'Flexible DIY Neon Rope Light (3 meters)',
      'Purple Ambient RGB Ceiling LED Strip',
      'Anime & Custom Character Poster Wall Set',
      'Trace-Free Wall Mounting Hooks (6 pcs)',
      'Transparent Double-Sided Nano Tape'
    ],
    vibeTag: 'Cyber Wave Neon',
    whatsappPresetText: 'Hi Dwell & Decor! I want to order the Neon Flex Wave & Cyber Room Combo Package (₦35,000).'
  },
  {
    id: 'combo-fairy-botanical',
    name: 'Fairy Light Botanical Garden',
    subtitle: 'Warm twinkling fairy lights woven through green ivy foliage with soft pastel affirmative wall art.',
    badge: '🌿 Soft Dreamy Aesthetic',
    priceNGN: 26500,
    priceUSD: 17.67,
    originalPriceNGN: 33000,
    image: fairyLightBotanicalImg,
    items: [
      'Warm Fairy Light Vines (Leaf string with LEDs)',
      'Pastel Pink Aesthetic Wall Collage (SZA, Taylor, Daily Affirmations)',
      'Teddy Bear Plush Accent Decor',
      'Clear Trace-Free Wall Hooks (10 pcs)',
      'Transparent Heavy Duty Nano Tape'
    ],
    vibeTag: 'Fairy Botanical',
    whatsappPresetText: 'Hi Dwell & Decor! I want to order the Fairy Light Botanical Garden Combo Package (₦26,500).'
  },
  {
    id: 'combo-pop-music',
    name: 'Pop Culture & Music Icon Wall',
    subtitle: 'Taylor Swift, The Weeknd & SZA album wall collage framed by cascading ivy vines and romantic pink lighting.',
    badge: '🎵 Pop & Music Vibe',
    priceNGN: 24500,
    priceUSD: 16.33,
    originalPriceNGN: 30000,
    image: popMusicWallImg,
    items: [
      'Customized Music & Artist Poster Set (50 pcs)',
      'Cascading Green Ivy Vines (12 strands)',
      'Pink Ambient Wall Strip Lights',
      'Trace-Free Nano Mounting Tape'
    ],
    vibeTag: 'Music Lover Wall',
    whatsappPresetText: 'Hi Dwell & Decor! I want to order the Pop Culture & Music Icon Wall Combo Package (₦24,500).'
  },
  {
    id: 'combo-master-makeover',
    name: 'The Ultimate Dorm Glow-Up Master Pack',
    subtitle: 'The complete 100% room transformation! Neon rope, fairy light vines, full poster wall, butterfly stickers & tools.',
    badge: '🏆 Best Value (Save 25%)',
    priceNGN: 42000,
    priceUSD: 28.00,
    originalPriceNGN: 56000,
    image: ultimateDormGlowupImg,
    items: [
      'DIY Flexible Neon Wave Rope Light',
      'Warm Fairy Light String Vines (12 strands)',
      'RGB Multi-Color LED Strip Light',
      'Mega Wall Collage Poster Collection (50 pcs)',
      '3D Butterfly Wall Stickers (24 pcs)',
      '10x Trace-Free Adhesive Wall Hooks',
      '2x Rolls Heavy Duty Transparent Nano Tape'
    ],
    vibeTag: 'Ultimate Room Makeover',
    whatsappPresetText: 'Hi Dwell & Decor! I want to order the Ultimate Dorm Glow-Up Master Pack (₦42,000).'
  }
];

interface CustomAddon {
  id: string;
  name: string;
  priceNGN: number;
  icon: string;
}

const CUSTOM_ADDONS: CustomAddon[] = [
  { id: 'vines', name: 'Hanging Green Ivy Vines (12 Strands)', priceNGN: 3500, icon: '🌿' },
  { id: 'fairy-vines', name: 'Fairy Light Vine String (Warm LEDs)', priceNGN: 4500, icon: '💡' },
  { id: 'neon-light', name: 'Pink / Purple Neon Wall Sign Light', priceNGN: 8500, icon: '💖' },
  { id: 'led-strip', name: 'RGB Smart LED Strip Light (5m)', priceNGN: 6000, icon: '⚡' },
  { id: 'wall-collage', name: 'Aesthetic Wall Collage Pack (50 Posters)', priceNGN: 7500, icon: '🖼️' },
  { id: 'butterfly', name: '3D Butterfly Wall Stickers (12 pcs)', priceNGN: 2500, icon: '🦋' },
  { id: 'nano-tape', name: 'Transparent Double-Sided Nano Tape Roll', priceNGN: 2000, icon: '📼' },
  { id: 'wall-hooks', name: 'Trace-Free Adhesive Wall Hooks (10 pcs)', priceNGN: 1500, icon: '🪝' },
];

export const RoomDecorAdvisor: React.FC = () => {
  const { products, addToCart, formatPrice, setActiveTab, showToast } = useShop();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['vines', 'wall-collage', 'nano-tape']);

  // AI Advisor State
  const [roomType, setRoomType] = useState('Dorm Room');
  const [styleTheme, setStyleTheme] = useState('Cozy Soft Pink & Vines');
  const [budget, setBudget] = useState('Under $25');
  const [spaceSize, setSpaceSize] = useState('Bedside Accent Wall');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<{
    recommendation: string;
    tips: string[];
    bundleProducts: typeof products;
  } | null>(null);

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(item => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const customSubtotal = selectedAddons.reduce((sum, id) => {
    const addon = CUSTOM_ADDONS.find(a => a.id === id);
    return sum + (addon ? addon.priceNGN : 0);
  }, 0);

  const handleAddCustomComboToCart = () => {
    if (selectedAddons.length === 0) {
      showToast('Please select at least 1 item for your custom room bundle!', 'warning');
      return;
    }

    // Add matching or base catalog products to cart
    const matchingProducts = products.filter(p => 
      p.category === 'led-lighting' || 
      p.category === 'wall-decor-collage' || 
      p.category === 'butterfly-decor' ||
      p.category === 'organizers-storage'
    ).slice(0, Math.min(3, selectedAddons.length));

    if (matchingProducts.length > 0) {
      matchingProducts.forEach(p => addToCart(p, 1));
    } else if (products.length > 0) {
      addToCart(products[0], 1);
    }

    showToast(`Custom Combo Package (${selectedAddons.length} items) added to your shopping bag!`, 'success');
    setActiveTab('cart');
  };

  const handleAddPackageToCart = (pkg: ComboPackage) => {
    // Add representative catalog item
    const match = products.find(p => p.category === 'led-lighting' || p.category === 'wall-decor-collage') || products[0];
    if (match) {
      addToCart(match, 1);
    }
    showToast(`Added ${pkg.name} to your shopping bag!`, 'success');
    setActiveTab('cart');
  };

  const handleConsultAI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/decor-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomType, styleTheme, budget, spaceSize })
      });

      const data = await response.json();

      let matching = products.filter(p => p.category === 'led-lighting' || p.category === 'wall-decor-collage').slice(0, 3);
      if (matching.length < 2) matching = products.slice(0, 3);

      setRecommendationResult({
        recommendation: data.recommendation || `For a ${roomType} with ${styleTheme} vibe, combine hanging green ivy vines along the wall ceiling perimeter with warm fairy lights, a custom wall collage, and double-sided Nano Tape for a 100% damage-free host setup!`,
        tips: data.tips || [
          'Use transparent double-sided Nano Tape to mount posters without peeling host paint.',
          'Drape green ivy vines around ceiling edges to soften harsh dorm room lighting.',
          'Layer glowing LED neon signs over dense photo collages for maximum aesthetic depth.'
        ],
        bundleProducts: matching
      });
    } catch {
      setRecommendationResult({
        recommendation: `Recommended combo for ${roomType}: Combine hanging ivy vines, glowing LED lights, custom poster wall collage, and trace-free Nano Tape for a complete room glow-up!`,
        tips: [
          'Nano tape is essential for trace-free poster & vine mounting.',
          'Position fairy lights around window frames and headboards.',
          'Mix 3D butterfly wall stickers into poster collages for a 3D pop.'
        ],
        bundleProducts: products.slice(0, 3)
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPackages = COMBO_PACKAGES.filter(pkg => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'neon' && (pkg.id.includes('neon') || pkg.id.includes('cyber'))) return true;
    if (activeCategory === 'botanical' && (pkg.id.includes('botanical') || pkg.id.includes('sunset'))) return true;
    if (activeCategory === 'music' && (pkg.id.includes('music') || pkg.id.includes('pop'))) return true;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Title & Vibe Header */}
      <div className="bg-gradient-to-r from-[#2c2221] via-[#4a3836] to-[#2c2221] text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-[#f09a8e] text-[#2c2221] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-xs">
            <Star className="w-3.5 h-3.5 fill-current" />
            Make It Yours: Style My Room
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white leading-tight">
            Curated Room Aesthetics & Combo Packages
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
            Transform your student dorm room into a cozy vibe! Browse complete decor combo packages featuring green ivy vines, fairy lights, LED strip lights, wall collages, butterfly stickers, and damage-free mounting tools.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a 
              href="#combo-packages" 
              className="bg-[#f09a8e] hover:bg-[#e2887c] text-white px-5 py-2.5 rounded-full font-bold text-xs transition flex items-center gap-2 shadow-sm"
            >
              <span>Explore Combo Packages</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#custom-builder" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-full font-bold text-xs transition flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#f09a8e]" />
              <span>Build Custom Combo</span>
            </a>
          </div>
        </div>

        {/* Background Decorative Blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f09a8e]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* IMPORTANT NANO TAPE & WALL SAFETY ALERT BOX */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
          <ShieldCheck className="w-6 h-6 text-amber-600" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900">
              Host / Dorm Wall Safety Guarantee
            </h4>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              Trace-Free & Damage-Free
            </span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Note:</strong> Double-sided transparent <strong>Nano Tape</strong> and trace-free wall hooks are included or recommended with most of your room decorations to guarantee zero wall damage when moving out of university hostels or student apartments!
          </p>
        </div>
      </div>

      {/* SECTION 1: CURATED ROOM COMBO PACKAGES */}
      <div id="combo-packages" className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebdcd8] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#a37068]">
              <Package className="w-4 h-4 text-[#f09a8e]" />
              <span>Ready-To-Hang Sets</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#2c2221] mt-0.5">
              Popular Student Room Combo Packages
            </h2>
          </div>

          {/* Vibe Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeCategory === 'all'
                  ? 'bg-[#2c2221] text-white'
                  : 'bg-white text-[#594744] hover:bg-[#ebdcd8] border border-[#ebdcd8]'
              }`}
            >
              All Packages
            </button>
            <button
              onClick={() => setActiveCategory('neon')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeCategory === 'neon'
                  ? 'bg-[#2c2221] text-white'
                  : 'bg-white text-[#594744] hover:bg-[#ebdcd8] border border-[#ebdcd8]'
              }`}
            >
              Neon & Cyber Glow
            </button>
            <button
              onClick={() => setActiveCategory('botanical')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeCategory === 'botanical'
                  ? 'bg-[#2c2221] text-white'
                  : 'bg-white text-[#594744] hover:bg-[#ebdcd8] border border-[#ebdcd8]'
              }`}
            >
              Ivy & Fairy Lights
            </button>
            <button
              onClick={() => setActiveCategory('music')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                activeCategory === 'music'
                  ? 'bg-[#2c2221] text-white'
                  : 'bg-white text-[#594744] hover:bg-[#ebdcd8] border border-[#ebdcd8]'
              }`}
            >
              Music & Poster Wall
            </button>
          </div>
        </div>

        {/* Combo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredPackages.map((pkg) => {
            const savingsNGN = pkg.originalPriceNGN - pkg.priceNGN;
            return (
              <div 
                key={pkg.id} 
                className="bg-white rounded-3xl border border-[#ebdcd8] overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition duration-300 group"
              >
                <div>
                  {/* Image Container with 4:3 Aspect Ratio */}
                  <div className="relative aspect-[4/3] bg-[#faf5f4] overflow-hidden">
                    <img 
                    //  src={getCleanImageUrl(pkg.image, pkg.name)} 
                      alt={pkg.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      onError={handleImageError}
                    />

                    {/* Gradient Overlay for Top/Bottom Badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-[#2c2221]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs border border-white/20">
                        {pkg.badge}
                      </span>
                    </div>

                    {/* Savings Tag */}
                    {savingsNGN > 0 && (
                      <div className="absolute top-3 right-3 bg-[#f09a8e] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                        Save {formatPrice(savingsNGN)}
                      </div>
                    )}

                    {/* Bottom Vibe Tag & Price Bar */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                        {pkg.vibeTag}
                      </span>

                      <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm text-right">
                        <span className="text-sm font-extrabold text-[#2c2221] block leading-none">
                          {formatPrice(pkg.priceNGN, pkg.priceUSD)}
                        </span>
                        <span className="text-[10px] text-gray-400 line-through block mt-0.5">
                          {formatPrice(pkg.originalPriceNGN)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Package Details */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-bold font-serif text-lg text-[#2c2221] leading-snug">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-[#735853] mt-1.5 leading-relaxed">
                        {pkg.subtitle}
                      </p>
                    </div>

                    {/* Included Items List */}
                    <div className="bg-[#faf5f4] p-3.5 rounded-2xl border border-[#ebdcd8] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#a37068] flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-[#f09a8e]" />
                          Full Set Includes ({pkg.items.length} items):
                        </span>
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Ready to Hang
                        </span>
                      </div>

                      <ul className="space-y-1.5 text-xs text-[#4a3836]">
                        {pkg.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#f09a8e] shrink-0 mt-0.5" />
                            <span className="font-medium text-[#3d302f]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => handleAddPackageToCart(pkg)}
                    className="w-full bg-[#2c2221] hover:bg-[#3d302f] active:scale-[0.99] text-white py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#f8d0c8]" />
                    <span>Add Complete Combo ({formatPrice(pkg.priceNGN, pkg.priceUSD)})</span>
                  </button>

                  <a
                    href={`https://wa.me/2348123456789?text=${encodeURIComponent(pkg.whatsappPresetText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1f9347] py-2.5 rounded-2xl font-bold text-[11px] transition flex items-center justify-center gap-1.5 border border-[#25D366]/30"
                  >
                    <span>Order via WhatsApp Direct</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE CUSTOM COMBO PACKAGE BUILDER */}
      <div id="custom-builder" className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd8] shadow-2xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ebdcd8] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#a37068]">
              <SlidersHorizontal className="w-4 h-4 text-[#f09a8e]" />
              <span>Custom Room Bundle</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#2c2221] mt-0.5">
              Build Your Custom Room Package
            </h2>
            <p className="text-xs text-[#735853] mt-0.5">
              Pick your favorite decor pieces and craft a personalized room setup tailored to your exact budget!
            </p>
          </div>

          <div className="bg-[#faf5f4] px-4 py-2 rounded-2xl border border-[#ebdcd8] text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#a37068] block">Custom Package Subtotal</span>
            <span className="text-xl font-bold text-[#2c2221] block">
              {formatPrice(customSubtotal)}
            </span>
          </div>
        </div>

        {/* Addon Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CUSTOM_ADDONS.map((addon) => {
            const isSelected = selectedAddons.includes(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddon(addon.id)}
                className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#faf3f1] border-[#f09a8e] ring-2 ring-[#f09a8e]/30 shadow-2xs'
                    : 'bg-[#faf5f4] border-[#ebdcd8] hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="text-xl shrink-0">{addon.icon}</span>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-[#2c2221] block line-clamp-1">{addon.name}</span>
                    <span className="text-[11px] font-semibold text-[#f09a8e] block">{formatPrice(addon.priceNGN)}</span>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  isSelected ? 'bg-[#2c2221] text-white' : 'bg-white border border-gray-300 text-gray-400'
                }`}>
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Builder Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ebdcd8]">
          <div className="text-xs text-[#735853] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#f09a8e] shrink-0" />
            <span>Selected {selectedAddons.length} items. Includes damage-free installation guidance!</span>
          </div>

          <button
            onClick={handleAddCustomComboToCart}
            className="w-full sm:w-auto bg-[#f09a8e] hover:bg-[#e2887c] text-white px-8 py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add Custom Combo ({formatPrice(customSubtotal)}) to Shopping Bag</span>
          </button>
        </div>

      </div>

      {/* SECTION 3: AI DORM ROOM STYLIST CONSULTANT */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd8] shadow-2xs space-y-6">
        
        <div className="space-y-1">
          <span className="bg-[#f09a8e]/20 text-[#a37068] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1">
            <Palette className="w-3 h-3 text-[#f09a8e]" />
            AI Stylist Assistant
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#2c2221]">
            Need Custom Styling Advice? Consult AI
          </h2>
          <p className="text-xs text-[#735853]">
            Tell our AI room advisor your room specs and budget for instant damage-free decoration tips!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-[#a37068]">Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full bg-[#faf5f4] border border-[#ebdcd8] text-[#2c2221] font-semibold text-xs rounded-2xl p-3 focus:outline-none focus:border-[#f09a8e]"
            >
              <option value="Dorm Room">University Dorm Room</option>
              <option value="Shared Bedroom">Shared Student Bedroom</option>
              <option value="Home Study Desk">Home Study Corner</option>
              <option value="School Hostel Room">School Hostel Room</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-[#a37068]">Aesthetic Vibe</label>
            <select
              value={styleTheme}
              onChange={(e) => setStyleTheme(e.target.value)}
              className="w-full bg-[#faf5f4] border border-[#ebdcd8] text-[#2c2221] font-semibold text-xs rounded-2xl p-3 focus:outline-none focus:border-[#f09a8e]"
            >
              <option value="Cozy Soft Pink & Vines">Cozy Soft Pink & Green Ivy Vines</option>
              <option value="Cyber Sunset LED Glow">Cyber Sunset LED Glow & Neon Wave</option>
              <option value="Fairy Light Botanical">Fairy Light Botanical Dream</option>
              <option value="Pop Music Wall Poster">Pop Culture & Music Poster Wall</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-[#a37068]">Budget Range</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-[#faf5f4] border border-[#ebdcd8] text-[#2c2221] font-semibold text-xs rounded-2xl p-3 focus:outline-none focus:border-[#f09a8e]"
            >
              <option value="Under $20">Under $20 (~₦30,000)</option>
              <option value="$20 - $35">$20 - $35 (~₦30,000 - ₦52,500)</option>
              <option value="$35 - $50">$35 - $50 (~₦52,500 - ₦75,000)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-[#a37068]">Decor Target Area</label>
            <select
              value={spaceSize}
              onChange={(e) => setSpaceSize(e.target.value)}
              className="w-full bg-[#faf5f4] border border-[#ebdcd8] text-[#2c2221] font-semibold text-xs rounded-2xl p-3 focus:outline-none focus:border-[#f09a8e]"
            >
              <option value="Bedside Accent Wall">Bedside & Headboard Wall</option>
              <option value="Ceiling Perimeter">Ceiling Perimeter & Vines</option>
              <option value="Full Room Makeover">Full Room & Study Desk Corner</option>
            </select>
          </div>

        </div>

        <button
          onClick={handleConsultAI}
          disabled={isLoading}
          className="w-full bg-[#2c2221] hover:bg-[#3d302f] text-white py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating Custom AI Room Tips...</span>
            </>
          ) : (
            <>
              <Palette className="w-4 h-4 text-[#f09a8e]" />
              <span>Get AI Room Decor Advice</span>
            </>
          )}
        </button>

        {recommendationResult && (
          <div className="bg-[#fcf7f6] p-5 rounded-2xl border border-[#e8d8d4] space-y-4 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase text-[#a37068] flex items-center gap-1">
                <Lightbulb className="w-4 h-4 text-[#f09a8e]" /> AI Stylist Recommendation
              </span>
              <p className="text-xs text-[#2c2221] font-medium leading-relaxed bg-white p-3.5 rounded-xl border border-[#ebdcd8]">
                {recommendationResult.recommendation}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase text-[#a37068]">Damage-Free Tips:</span>
              <ul className="space-y-1 text-xs text-[#594744]">
                {recommendationResult.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white/90 p-2 rounded-lg border border-gray-100">
                    <Check className="w-3.5 h-3.5 text-[#f09a8e] shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

