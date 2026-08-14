import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpRight, 
  Palette, 
  Tag, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { handleImageError, getCleanImageUrl } from '../utils/imageHelper';

export const HeroSection: React.FC = () => {
  const { 
    products, 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    selectProduct, 
    setActiveTab,
    setFilter
  } = useShop();

  const newArrivals = (products || []).filter(p => p.isNewArrival || p.isBestSeller);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const heroProduct = newArrivals.length > 0 ? newArrivals[currentSlideIndex % newArrivals.length] : (products[0] || null);

  const topPicks = (products || []).slice(1, 4);

  const handleNextSlide = () => {
    if (newArrivals.length > 0) {
      setCurrentSlideIndex((prev) => (prev + 1) % newArrivals.length);
    }
  };

  const handlePrevSlide = () => {
    if (newArrivals.length > 0) {
      setCurrentSlideIndex((prev) => (prev - 1 + newArrivals.length) % newArrivals.length);
    }
  };

  return (
    <section className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Value Proposition Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#f5ebe8] p-3 rounded-2xl border border-[#ebd8d4] text-xs font-medium text-[#594744]">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Truck className="w-4 h-4 text-[#f09a8e]" />
          <span>School Pickup (Owner's Room)</span>
        </div>
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <ShieldCheck className="w-4 h-4 text-[#f09a8e]" />
          <span>Damage-Free Wall Guarantee</span>
        </div>
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <RotateCcw className="w-4 h-4 text-[#f09a8e]" />
          <span>Easy Student Returns</span>
        </div>
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Tag className="w-4 h-4 text-[#f09a8e]" />
          <span>Instant Room Glow Up</span>
        </div>
      </div>

      {/* Main Grid inspired directly by the Reference Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        
        {/* Left Card: New Arrivals Showcase with Carousel (5 cols in desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#f8ece9] via-[#f5e4e0] to-[#f3dbd6] rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between border border-[#e8d5d1] min-h-[420px] shadow-xs group">
          
          {/* Header text */}
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#a37068] block mb-1">
                Spotlight Collection
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2c2221]">
                New Arrivals
              </h2>
            </div>
            
            <button 
              onClick={() => selectProduct(heroProduct.id)}
              className="w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#2c2221] hover:bg-white shadow-xs transition"
              title="View Product"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>

          {/* Floating Product Image Spotlight */}
          <div className="relative my-4 flex-1 flex items-center justify-center">
            
            {/* Background Blob */}
            <div className="absolute w-52 h-52 bg-[#f09a8e]/20 rounded-full blur-2xl -z-0"></div>

            <img 
              src={getCleanImageUrl(heroProduct.image, heroProduct.name)} 
              alt={heroProduct.name}
              className="relative z-10 max-h-72 w-full object-contain rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-500"
              onError={handleImageError}
            />

            {/* Floating Price & Rating Card */}
            <div className="absolute top-2 left-2 z-20 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-sm border border-white/60">
              <span className="text-lg font-bold text-[#2c2221] block leading-tight">
                {formatPrice(heroProduct.priceNGN, heroProduct.priceUSD)}
              </span>
              <span className="text-[11px] text-[#8c7470] font-medium line-clamp-1">
                {heroProduct.name}
              </span>
            </div>

            {/* Rating pill badge */}
            <div className="absolute top-2 right-2 z-20 bg-white px-2.5 py-1 rounded-full text-xs font-semibold text-[#2c2221] shadow-xs flex items-center gap-1 border border-gray-100">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{heroProduct.rating}</span>
            </div>

            {/* Bottom floating wish/cart buttons */}
            <div className="absolute bottom-2 right-2 z-20 flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(heroProduct.id);
                }}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-xs hover:bg-[#fef2f2] transition"
              >
                <Heart className={`w-4 h-4 ${isInWishlist(heroProduct.id) ? 'fill-[#f09a8e] text-[#f09a8e]' : 'text-gray-600'}`} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(heroProduct);
                }}
                className="w-9 h-9 bg-[#2c2221] text-white rounded-full flex items-center justify-center shadow-xs hover:bg-[#3d302f] transition"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Slider Control */}
          <div className="relative z-10 bg-white/70 backdrop-blur-md p-2.5 rounded-2xl border border-white/60 flex items-center justify-between">
            <button 
              onClick={handlePrevSlide}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-[#f09a8e] hover:text-white transition shadow-xs"
              aria-label="Previous Slide"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="text-center">
              <span className="text-xs font-semibold text-[#594744]">
                {newArrivals.length > 0 ? (currentSlideIndex % newArrivals.length) + 1 : 1} / {newArrivals.length || 1}
              </span>
              <span className="text-[10px] text-[#8c7470] block">
                Slide left and right
              </span>
            </div>

            <button 
              onClick={handleNextSlide}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-[#f09a8e] hover:text-white transition shadow-xs"
              aria-label="Next Slide"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Section: 2 Top Banners + Bottom Top Picks Row (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4 lg:gap-6">
          
          {/* Top Two Split Offer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: School Pickup Info */}
            <div className="bg-[#f7ded8] rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between border border-[#ebd0c8] min-h-[200px] shadow-xs">
              <div className="relative z-10">
                <h3 className="text-xl font-bold font-serif text-[#2c2221]">
                  Pick Up At School
                </h3>
                <p className="text-xs text-[#735853] mt-1 max-w-[180px]">
                  All orders are collected directly from the owner's room on campus.
                </p>
              </div>

              {/* Tag */}
              <div className="mt-4 flex items-center justify-between relative z-10">
                <span className="inline-flex items-center gap-1 bg-[#f09a8e] text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                  <Tag className="w-3 h-3" />
                  <span>Owner's Room Pickup</span>
                </span>
                
                <button 
                  onClick={() => {
                    setActiveTab('shop');
                  }}
                  className="text-xs font-semibold text-[#2c2221] hover:underline flex items-center gap-1"
                >
                  Shop Catalog <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Decorative background image blend */}
              <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-40 mix-blend-multiply pointer-events-none">
                <img 
                  src={getCleanImageUrl("/images/rotating_makeup_organizer.jpg")} 
                  alt="Decor" 
                  className="w-full h-full object-contain"
                  onError={handleImageError}
                />
              </div>
            </div>

            {/* Card 2: Make It Yours / Aesthetic Room Combo Packages */}
            <div className="bg-[#ebdcd8] rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between border border-[#e0cdca] min-h-[200px] shadow-xs group">
              <div className="relative z-10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#a37068] flex items-center gap-1 mb-1">
                  <Palette className="w-3 h-3 text-[#f09a8e]" />
                  Dorm Room Aesthetics & Combos
                </span>
                <h3 className="text-xl font-bold font-serif text-[#2c2221]">
                  Make It Yours
                </h3>
                <p className="text-xs text-[#735853] mt-1 max-w-[210px]">
                  Explore complete room combos: Silk pink vines, LED strip lights, wall collages & damage-free Nano Tape!
                </p>
              </div>

              <div className="mt-4 relative z-10 flex items-center gap-2">
                <button 
                  onClick={() => setActiveTab('advisor')}
                  className="bg-[#2c2221] hover:bg-[#3d302f] text-white px-4 py-2 rounded-full text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Style My Room Combos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Decorative background image blend */}
              <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-35 mix-blend-multiply pointer-events-none group-hover:scale-105 transition-transform">
                <img 
                  src={getCleanImageUrl("/images/ultimate_dorm_glowup.jpg")} 
                  alt="Aesthetic Dorm Glow Up" 
                  className="w-full h-full object-cover rounded-2xl"
                  onError={handleImageError}
                />
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#f09a8e] shadow-2xs">
                <Heart className="w-4 h-4 fill-current" />
              </div>
            </div>

          </div>

          {/* Bottom Row: Top Picks For You (Matching reference image lower section) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif text-[#2c2221]">
                Top Picks For You
              </h3>
              <button 
                onClick={() => setActiveTab('shop')}
                className="text-xs font-semibold text-[#8c7470] hover:text-[#2c2221] flex items-center gap-1"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topPicks.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => selectProduct(product.id)}
                  className="bg-[#f6ebe8] hover:bg-[#f1e3df] p-3 rounded-2xl border border-[#e8d8d4] flex flex-col justify-between cursor-pointer transition shadow-2xs group relative"
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs font-bold text-[#2c2221] line-clamp-1">
                      {product.name}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-semibold bg-white px-2 py-0.5 rounded-full border border-gray-100 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  {/* Product Thumbnail */}
                  <div className="aspect-[4/3] w-full my-1 flex items-center justify-center overflow-hidden rounded-xl bg-[#f0e4e0] p-1">
                    <img 
                      src={getCleanImageUrl(product.image, product.name)} 
                      alt={product.name} 
                      className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                      onError={handleImageError}
                    />
                  </div>

                  {/* Action Pill Button */}
                  <div className="mt-2 flex items-center justify-between bg-white/80 p-1.5 rounded-full border border-white/60">
                    <span className="text-xs font-bold text-[#2c2221] pl-2">
                      {formatPrice(product.priceNGN, product.priceUSD)}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-7 h-7 bg-[#2c2221] hover:bg-[#f09a8e] text-white rounded-full flex items-center justify-center transition"
                      title="Quick Add"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
