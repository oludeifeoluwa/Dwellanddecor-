import React, { useState, useEffect } from 'react';
import { Search, X, Star, ArrowRight, Palette } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { handleImageError, getCleanImageUrl } from '../utils/imageHelper';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, selectProduct, formatPrice } = useShop();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const searchResults = query.trim() === '' ? [] : products.filter(p => {
    const q = query.toLowerCase();
    return p.name.toLowerCase().includes(q) || 
           p.description.toLowerCase().includes(q) || 
           p.tags.some(t => t.toLowerCase().includes(q));
  });

  const popularTags = ['LED Butterfly', '3D Butterflies', 'LED Strip Lights', 'Neon Rope Light', 'Desk Organizer', 'Wall Hooks'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-scale-up">
        
        {/* Search Input Bar */}
        <div className="p-4 bg-[#faf5f4] border-b border-[#ebdcd8] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#f09a8e]" />
          <input
            type="text"
            autoFocus
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-[#2c2221] focus:outline-none placeholder:text-[#8c7470]"
          />
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Suggestions Container */}
        <div className="p-5 max-h-[420px] overflow-y-auto space-y-4">
          
          {query.trim() === '' ? (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a37068] block">
                Popular Student Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="bg-[#faf5f4] hover:bg-[#f2e9e7] text-[#594744] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#ebdcd8] transition flex items-center gap-1"
                  >
                    <Palette className="w-3 h-3 text-[#f09a8e]" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500">
              No room decor items found matching "{query}".
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a37068] block">
                Matching Products ({searchResults.length})
              </span>
              <div className="space-y-2">
                {searchResults.map(product => (
                  <div
                    key={product.id}
                    onClick={() => {
                      selectProduct(product.id);
                      setIsSearchOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-[#faf5f4] hover:bg-[#f5ebe8] border border-[#ebdcd8] flex items-center gap-3 cursor-pointer transition"
                  >
                    <img 
                      src={getCleanImageUrl(product.image, product.name)} 
                      alt={product.name} 
                      className="w-12 h-12 object-contain bg-white rounded-xl p-1 shrink-0" 
                      onError={handleImageError}
                    />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold text-xs text-[#2c2221] line-clamp-1">{product.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span>{product.categoryName}</span>
                        <span>•</span>
                        <span className="text-amber-500 font-bold flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-[#2c2221] shrink-0">
                      {formatPrice(product.priceNGN, product.priceUSD)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Hint */}
        <div className="bg-[#faf5f4] px-5 py-2 text-[10px] text-gray-400 border-t border-[#ebdcd8] flex justify-between">
          <span>Press ESC to close</span>
          <span>Paystack Express Available</span>
        </div>

      </div>
    </div>
  );
};
