import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Check, 
  MessageSquare, 
  Share2, 
  Palette,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Flame,
  Clock
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { handleImageError, getCleanImageUrl } from '../utils/imageHelper';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProduct, 
    products, 
    reviews, 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setActiveTab,
    setIsReviewModalOpen,
    initiateCheckout
  } = useShop();

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#2c2221]">No product selected</h2>
        <button
          onClick={() => setActiveTab('shop')}
          className="bg-[#2c2221] text-white px-5 py-2 rounded-full text-xs font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Deduplicate gallery images (main image + additional images)
  const galleryImages = Array.from(
    new Set([selectedProduct.image, ...(selectedProduct.additionalImages || [])])
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const [selectedColor, setSelectedColor] = useState(selectedProduct.colorOptions?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizeOptions?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTabSection, setActiveTabSection] = useState<'specs' | 'installation' | 'shipping'>('specs');

  // Reset gallery carousel index when switching selected product
  useEffect(() => {
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
  }, [selectedProduct.id]);

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
    setTouchStartX(null);
  };

  // Keyboard navigation for carousel & lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryImages.length]);

  const getCurrentPriceNGN = () => {
    if (selectedSize && selectedSize.includes('₦')) {
      const match = selectedSize.match(/₦([\d,]+)/);
      if (match && match[1]) {
        const val = parseInt(match[1].replace(/,/g, ''), 10);
        if (!isNaN(val)) return val;
      }
    }
    return selectedProduct.priceNGN;
  };

  const currentPriceNGN = getCurrentPriceNGN();
  const currentPriceUSD = +(currentPriceNGN / 1500).toFixed(2);

  const productToAddToCart = {
    ...selectedProduct,
    priceNGN: currentPriceNGN,
    priceUSD: currentPriceUSD,
  };

  const productReviews = reviews.filter(r => r.productId === selectedProduct.id);
  const relatedProducts = products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 3);

  const isLiked = isInWishlist(selectedProduct.id);

  const handleBuyNow = () => {
    addToCart(productToAddToCart, quantity, selectedColor, selectedSize);
    setActiveTab('checkout');
  };

  const currentActiveImage = galleryImages[activeImageIndex] || selectedProduct.image;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* Back to Shop Link */}
      <button 
        onClick={() => setActiveTab('shop')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8c7470] hover:text-[#2c2221] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to School & Dorm Decor</span>
      </button>

      {/* Main Product Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Gallery Carousel Stage (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Carousel Image Stage */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="bg-white rounded-3xl p-4 sm:p-6 border border-[#ebdcd8] relative overflow-hidden shadow-sm group flex items-center justify-center min-h-[420px] sm:min-h-[500px] w-full select-none"
          >
            <img 
              key={activeImageIndex}
              src={getCleanImageUrl(currentActiveImage, selectedProduct.name)} 
              alt={`${selectedProduct.name} - View ${activeImageIndex + 1}`}
              className="max-h-[440px] w-full object-contain rounded-2xl shadow-xs transition-all duration-300 group-hover:scale-105 cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
              onError={handleImageError}
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
              {selectedProduct.isBestSeller && (
                <span className="bg-[#2c2221] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                  #1 Best Seller
                </span>
              )}
            </div>

            {/* Floating Top Right Buttons (Lightbox Zoom + Wishlist) */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs shadow-xs border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#f09a8e] hover:bg-white transition"
                title="Expand full screen gallery"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs shadow-xs border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#f09a8e] hover:bg-white transition"
                title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#f09a8e] text-[#f09a8e]' : ''}`} />
              </button>
            </div>

            {/* Carousel Navigation Arrow Buttons */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-md flex items-center justify-center text-[#2c2221] hover:bg-[#2c2221] hover:text-white transition-all z-20 focus:outline-none"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-md flex items-center justify-center text-[#2c2221] hover:bg-[#2c2221] hover:text-white transition-all z-20 focus:outline-none"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Bottom Left / Center Pagination Dots */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 shadow-xs flex items-center gap-1.5 z-10">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeImageIndex 
                        ? 'w-6 bg-[#f09a8e]' 
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Bottom Right Slide Counter Badge */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-[#2c2221]/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs z-10">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>

          {/* Interactive Image Thumbnails Carousel Row */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
            {galleryImages.map((imgUrl, index) => {
              const isActive = index === activeImageIndex;
              return (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border-2 p-1 bg-white overflow-hidden shrink-0 transition-all duration-300 relative group ${
                    isActive 
                      ? 'border-[#f09a8e] ring-2 ring-[#f09a8e]/30 shadow-md scale-105' 
                      : 'border-[#ebdcd8] opacity-75 hover:opacity-100 hover:border-[#f09a8e]/60'
                  }`}
                >
                  <img 
                    src={getCleanImageUrl(imgUrl, selectedProduct.name)} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-contain rounded-xl" 
                    onError={handleImageError}
                  />
                  <span className={`absolute bottom-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-[#f09a8e] text-white' : 'bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity'
                  }`}>
                    #{index + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Student Guarantee Box */}
          <div className="bg-[#f8f1ef] p-4 rounded-2xl border border-[#e8d8d4] text-xs space-y-2 text-[#594744]">
            <div className="flex items-center gap-2 font-bold text-[#2c2221]">
              <ShieldCheck className="w-4 h-4 text-[#f09a8e]" />
              <span>Trace-Free Wall & Dorm Safety Promise</span>
            </div>
            <p className="text-[11px] text-[#735853] leading-relaxed">
              Designed specifically for student accommodations and rental walls. Easy clean removal with zero paint damage or sticky residue.
            </p>
          </div>

        </div>

        {/* Right Column: Details & Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#a37068] block">
              {selectedProduct.categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2c2221] mt-1">
              {selectedProduct.name}
            </h1>

            {/* Rating Summary & Dynamic Stock Pills */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{selectedProduct.rating}</span>
              </div>
              <a href="#reviews" className="text-xs text-[#8c7470] hover:underline">
                Based on {selectedProduct.reviewCount} student reviews
              </a>
            </div>
          </div>

          {/* Pricing Banner */}
          <div className="bg-[#faf5f4] p-4 rounded-2xl border border-[#ebdcd8] flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-[#2c2221]">
              {formatPrice(currentPriceNGN, currentPriceUSD)}
            </span>
          </div>

          {/* DYNAMIC REAL-TIME STOCK STATUS BADGE */}
          {(!selectedProduct.inStock || selectedProduct.stockCount <= 0) ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-900 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-red-800">Out of Stock</span>
                  <span className="text-[10px] bg-red-200/80 text-red-800 px-2 py-0.5 rounded-full font-bold">0 Available</span>
                </div>
                <p className="text-xs text-red-700 leading-relaxed">
                  This item is currently sold out. Store administrators update inventory in real time. Please check back soon or select another item!
                </p>
              </div>
            </div>
          ) : selectedProduct.stockCount <= 10 ? (
            <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-amber-950 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-5 h-5 text-amber-600 animate-pulse" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-900">Low Stock Alert</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      Only {selectedProduct.stockCount} left!
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-800 font-bold flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 text-amber-600" /> High Demand
                  </span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Selling fast among students! Secure yours now before campus stock runs out completely.
                </p>
                {/* Stock Gauge Progress Bar */}
                <div className="w-full bg-amber-200/80 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, (selectedProduct.stockCount / 10) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-950 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">In Stock</span>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                      {selectedProduct.stockCount} Units Ready
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Real-Time Verified
                  </span>
                </div>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Ready for instant packing and fast campus hostel delivery.
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#594744] leading-relaxed">
            {selectedProduct.description}
          </p>

          {/* Key Bullet Features */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase text-[#a37068]">Highlights</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4a3836]">
              {selectedProduct.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#f09a8e] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Color Selection Swatches */}
          {(selectedProduct.colorOptions || []).length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#a37068] block">
                Color Option: <span className="text-[#2c2221] normal-case">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {(selectedProduct.colorOptions || []).map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                      selectedColor === col.name 
                        ? 'bg-[#2c2221] text-white border-[#2c2221] shadow-xs' 
                        : 'bg-white text-[#594744] border-[#ebdcd8] hover:bg-[#f8f1ef]'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size / Length / Pack Option Selector */}
          {selectedProduct.sizeOptions && selectedProduct.sizeOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#a37068] block">
                Select Length / Option: <span className="text-[#2c2221] normal-case">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {selectedProduct.sizeOptions.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      selectedSize === sz 
                        ? 'bg-[#f09a8e] text-white border-[#f09a8e] shadow-xs' 
                        : 'bg-white text-[#594744] border-[#ebdcd8] hover:bg-[#f8f1ef]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper + Add to Cart & Express Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase text-[#a37068]">Quantity</span>
              <div className="flex items-center bg-white border border-[#ebdcd8] rounded-full p-1 text-xs">
                <button
                  disabled={!selectedProduct.inStock || selectedProduct.stockCount <= 0 || quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full bg-[#f8f1ef] hover:bg-[#ebdcd8] text-gray-700 flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-bold text-[#2c2221]">
                  {!selectedProduct.inStock || selectedProduct.stockCount <= 0 ? 0 : quantity}
                </span>
                <button
                  disabled={!selectedProduct.inStock || selectedProduct.stockCount <= 0 || quantity >= selectedProduct.stockCount}
                  onClick={() => setQuantity(Math.min(selectedProduct.stockCount, quantity + 1))}
                  className="w-7 h-7 rounded-full bg-[#f8f1ef] hover:bg-[#ebdcd8] text-gray-700 flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                disabled={!selectedProduct.inStock || selectedProduct.stockCount <= 0}
                onClick={() => addToCart(productToAddToCart, quantity, selectedColor, selectedSize)}
                className={`py-3 px-6 rounded-full font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                  !selectedProduct.inStock || selectedProduct.stockCount <= 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                    : 'bg-[#2c2221] hover:bg-[#3d302f] text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#f8d0c8]" />
                <span>
                  {!selectedProduct.inStock || selectedProduct.stockCount <= 0 
                    ? 'Item Out of Stock' 
                    : 'Add to Shopping Bag'}
                </span>
              </button>

              <button
                disabled={!selectedProduct.inStock || selectedProduct.stockCount <= 0}
                onClick={handleBuyNow}
                className={`py-3 px-6 rounded-full font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                  !selectedProduct.inStock || selectedProduct.stockCount <= 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    : 'bg-[#f09a8e] hover:bg-[#e2887c] text-white'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>
                  {!selectedProduct.inStock || selectedProduct.stockCount <= 0 
                    ? 'Currently Unavailable' 
                    : 'Express Buy Now'}
                </span>
              </button>
            </div>
          </div>

          {/* Tabbed Info Accordion */}
          <div className="pt-4 border-t border-[#f2e8e6] space-y-3">
            <div className="flex border-b border-[#f2e8e6]">
              <button
                onClick={() => setActiveTabSection('specs')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider px-3 border-b-2 transition ${
                  activeTabSection === 'specs' ? 'border-[#2c2221] text-[#2c2221]' : 'border-transparent text-gray-400'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTabSection('installation')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider px-3 border-b-2 transition ${
                  activeTabSection === 'installation' ? 'border-[#2c2221] text-[#2c2221]' : 'border-transparent text-gray-400'
                }`}
              >
                Install & Care
              </button>
              <button
                onClick={() => setActiveTabSection('shipping')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider px-3 border-b-2 transition ${
                  activeTabSection === 'shipping' ? 'border-[#2c2221] text-[#2c2221]' : 'border-transparent text-gray-400'
                }`}
              >
                School Pickup
              </button>
            </div>

            {activeTabSection === 'specs' && (
              <div className="bg-[#faf5f4] p-3 rounded-2xl border border-[#ebdcd8] text-xs space-y-1.5">
                {selectedProduct.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                    <span className="text-[#8c7470] font-medium">{spec.label}</span>
                    <span className="font-semibold text-[#2c2221]">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTabSection === 'installation' && (
              <div className="bg-[#faf5f4] p-3 rounded-2xl border border-[#ebdcd8] text-xs space-y-2 text-[#594744]">
                <p><strong>1. Clean Wall Surface:</strong> Wipe surface with dry cloth to remove dust.</p>
                <p><strong>2. Peel & Press:</strong> Peel off adhesive film and press firmly onto wall for 30 seconds.</p>
                <p><strong>3. Clean Removal:</strong> Warm adhesive slightly and peel clean with zero damage.</p>
              </div>
            )}

            {activeTabSection === 'shipping' && (
              <div className="bg-[#faf5f4] p-3 rounded-2xl border border-[#ebdcd8] text-xs space-y-2 text-[#594744]">
                <p><strong>📍 School Pickup Location:</strong> All orders are picked up directly from the owner's room at school. No delivery date needed!</p>
                <p><strong>⚡ Instant Order Confirmation:</strong> Receive order confirmation instantly with exact pickup room details and owner contact info.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <section id="reviews" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebdcd8] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f2e8e6]">
          <div>
            <h3 className="text-xl font-bold font-serif text-[#2c2221]">Student Reviews & Photos</h3>
            <p className="text-xs text-[#735853] mt-0.5">
              Verified buyers from university campuses across the country.
            </p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-[#2c2221] hover:bg-[#3d302f] text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews List */}
        {productReviews.length === 0 ? (
          <p className="text-xs text-gray-500 py-4">Be the first student to review this decor item!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productReviews.map((rev) => (
              <div key={rev.id} className="bg-[#faf5f4] p-4 rounded-2xl border border-[#ebdcd8] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#f09a8e] text-white font-bold text-xs flex items-center justify-center">
                      {rev.userName[0]}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#2c2221] block leading-none">{rev.userName}</span>
                      <span className="text-[10px] text-emerald-700 font-medium">Verified Campus Buyer</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Palette 
                      key={idx} 
                      className={`w-3 h-3 ${idx < rev.rating ? 'fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>

                <h4 className="text-xs font-bold text-[#2c2221]">{rev.title}</h4>
                <p className="text-xs text-[#594744] leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold font-serif text-[#2c2221]">Complete Your Dorm Setup</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Fullscreen Gallery Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn select-none">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">{selectedProduct.name}</h3>
              <p className="text-xs text-gray-400">
                Image {activeImageIndex + 1} of {galleryImages.length}
              </p>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Stage Image in Lightbox */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-8 overflow-hidden">
            <img
              key={activeImageIndex}
              src={getCleanImageUrl(currentActiveImage, selectedProduct.name)}
              alt={selectedProduct.name}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300"
              onError={handleImageError}
            />

            {/* Navigation Arrows in Lightbox */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition z-10"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition z-10"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip in Lightbox */}
          {galleryImages.length > 1 && (
            <div className="flex items-center justify-center gap-3 overflow-x-auto pt-4 border-t border-white/10">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl border-2 p-1 overflow-hidden shrink-0 transition ${
                    idx === activeImageIndex 
                      ? 'border-[#f09a8e] ring-2 ring-[#f09a8e]/50 opacity-100 scale-105' 
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getCleanImageUrl(imgUrl, selectedProduct.name)}
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-contain rounded-lg"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
