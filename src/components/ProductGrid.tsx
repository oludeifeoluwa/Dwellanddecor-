import React, { useMemo, useState } from 'react';
import { 
  Filter, 
  X, 
  SlidersHorizontal, 
  Grid3X3, 
  Grid2X2, 
  RotateCcw, 
  Check, 
  Palette, 
  Search,
  Tag,
  Star
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/products';
import { ProductCategory } from '../types';

export const ProductGrid: React.FC = () => {
  const { 
    products,
    filteredProducts, 
    filters, 
    setFilter, 
    resetFilters, 
    formatPrice,
    currency,
    exchangeRateUSD 
  } = useShop();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  const catalogCategories = useMemo(() => {
    const categoryCounts = new Map<string, number>();

    products.forEach(product => {
      categoryCounts.set(product.category, (categoryCounts.get(product.category) || 0) + 1);
    });

    return CATEGORIES.map(category => ({
      ...category,
      count: category.id === 'all' ? products.length : categoryCounts.get(category.id) || 0,
    }));
  }, [products]);

  const availableColors = [
    { name: 'Blush Pink', hex: '#ec4899' },
    { name: 'Pure White', hex: '#ffffff' },
    { name: 'Sage Green', hex: '#86efac' },
    { name: 'Warm Amber', hex: '#f59e0b' },
    { name: 'Matte Black', hex: '#18181b' },
    { name: 'Lilac Purple', hex: '#c084fc' },
  ];

  const handleColorToggle = (colorName: string) => {
    const exists = filters.selectedColors.includes(colorName);
    if (exists) {
      setFilter('selectedColors', filters.selectedColors.filter(c => c !== colorName));
    } else {
      setFilter('selectedColors', [...filters.selectedColors, colorName]);
    }
  };

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.onSaleOnly || 
    filters.inStockOnly || 
    filters.minRating > 0 || 
    filters.selectedColors.length > 0 ||
    filters.searchQuery !== '' ||
    filters.maxPriceUSD < 20;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header Breadcrumb & Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-[#a37068] block">
            School & Dorm Collections
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2c2221]">
            Small Room Decor
          </h1>
          <p className="text-xs text-[#735853] mt-1">
            Damage-free, space-saving aesthetic decor designed for students & small spaces.
          </p>
        </div>

        {/* View Toggle & Sorting Controls */}
        <div className="flex items-center gap-3">
          
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 bg-white border border-[#ebdcd8] text-[#2c2221] px-3.5 py-2 rounded-full text-xs font-semibold shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#f09a8e]" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#f09a8e]"></span>
            )}
          </button>

          {/* Grid Layout Switcher (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-white border border-[#ebdcd8] p-1 rounded-full text-xs">
            <button
              onClick={() => setGridCols(3)}
              className={`p-1.5 rounded-full transition ${gridCols === 3 ? 'bg-[#2c2221] text-white' : 'text-gray-500 hover:text-black'}`}
              title="3 Columns"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-1.5 rounded-full transition ${gridCols === 4 ? 'bg-[#2c2221] text-white' : 'text-gray-500 hover:text-black'}`}
              title="4 Columns"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-white border border-[#ebdcd8] px-3 py-1.5 rounded-full text-xs">
            <span className="text-[#8c7470] font-medium hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilter('sortBy', e.target.value as any)}
              className="bg-transparent font-semibold text-[#2c2221] focus:outline-none cursor-pointer text-xs"
            >
              <option value="featured">Top Featured</option>
              <option value="newest">New Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="mb-4 bg-[#f8f1ef] p-3 rounded-2xl border border-[#ebdcd8] flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-[#594744]">Active Filters:</span>

          {filters.category !== 'all' && (
            <span className="bg-white text-[#2c2221] px-2.5 py-1 rounded-full border border-[#e0d0cc] flex items-center gap-1 font-medium">
              Category: {filters.category}
              <X className="w-3 h-3 cursor-pointer hover:text-[#f09a8e]" onClick={() => setFilter('category', 'all')} />
            </span>
          )}

          {filters.onSaleOnly && (
            <span className="bg-[#fde8e5] text-[#d94636] px-2.5 py-1 rounded-full border border-[#f8b4aa] flex items-center gap-1 font-semibold">
              Flash Deals Only
              <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => setFilter('onSaleOnly', false)} />
            </span>
          )}

          {filters.inStockOnly && (
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 font-medium">
              In Stock Only
              <X className="w-3 h-3 cursor-pointer hover:text-emerald-900" onClick={() => setFilter('inStockOnly', false)} />
            </span>
          )}

          {filters.selectedColors.map(col => (
            <span key={col} className="bg-white text-[#2c2221] px-2.5 py-1 rounded-full border border-[#e0d0cc] flex items-center gap-1 font-medium">
              Color: {col}
              <X className="w-3 h-3 cursor-pointer hover:text-[#f09a8e]" onClick={() => handleColorToggle(col)} />
            </span>
          ))}

          {filters.searchQuery && (
            <span className="bg-white text-[#2c2221] px-2.5 py-1 rounded-full border border-[#e0d0cc] flex items-center gap-1 font-medium">
              Search: "{filters.searchQuery}"
              <X className="w-3 h-3 cursor-pointer hover:text-[#f09a8e]" onClick={() => setFilter('searchQuery', '')} />
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs font-bold text-[#f09a8e] hover:underline flex items-center gap-1 ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white p-5 rounded-3xl border border-[#ebdcd8] shadow-2xs space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-[#f2e8e6]">
            <h3 className="font-bold font-serif text-[#2c2221] text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#f09a8e]" />
              Filter Catalog
            </h3>
            {hasActiveFilters && (
              <button 
                onClick={resetFilters}
                className="text-xs text-[#a37068] hover:text-[#2c2221] font-semibold"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#a37068]">
              Category
            </label>
            <div className="space-y-1">
              {catalogCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilter('category', cat.id as ProductCategory)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    filters.category === cat.id
                      ? 'bg-[#2c2221] text-white font-bold'
                      : 'text-[#594744] hover:bg-[#f6ebe8]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-3 border-t border-[#f2e8e6]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#a37068]">
                Max Price
              </label>
              <span className="text-xs font-bold text-[#2c2221]">
                {formatPrice(filters.maxPriceUSD * exchangeRateUSD, filters.maxPriceUSD)}
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              step="0.5"
              value={filters.maxPriceUSD}
              onChange={(e) => setFilter('maxPriceUSD', parseFloat(e.target.value))}
              className="w-full accent-[#f09a8e] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>{formatPrice(3 * exchangeRateUSD, 3)}</span>
              <span>{formatPrice(20 * exchangeRateUSD, 20)}</span>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2 pt-3 border-t border-[#f2e8e6]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#a37068]">
              Color Palette
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableColors.map(color => {
                const isSelected = filters.selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => handleColorToggle(color.name)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl text-xs font-medium border transition ${
                      isSelected ? 'bg-[#f8f1ef] border-[#f09a8e] font-bold text-[#2c2221]' : 'border-[#ebe1de] text-[#594744] hover:bg-[#faf5f4]'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs shrink-0" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="truncate text-[11px]">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Toggles */}
          <div className="space-y-2 pt-3 border-t border-[#f2e8e6]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#a37068]">
              Special Offers
            </label>
            
            <label className="flex items-center justify-between text-xs text-[#594744] font-medium cursor-pointer p-1 hover:bg-[#faf5f4] rounded-lg">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#f09a8e]" />
                Flash Deals Only
              </span>
              <input
                type="checkbox"
                checked={filters.onSaleOnly}
                onChange={(e) => setFilter('onSaleOnly', e.target.checked)}
                className="rounded text-[#f09a8e] focus:ring-[#f09a8e] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-[#594744] font-medium cursor-pointer p-1 hover:bg-[#faf5f4] rounded-lg">
              <span>In-Stock Ready to Ship</span>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilter('inStockOnly', e.target.checked)}
                className="rounded text-[#f09a8e] focus:ring-[#f09a8e] cursor-pointer"
              />
            </label>
          </div>

        </aside>

        {/* Product Cards Grid Area */}
        <main className="lg:col-span-3 space-y-4">
          
          {/* Result Count Banner */}
          <div className="flex items-center justify-between text-xs text-[#735853] px-1">
            <span>Showing <strong className="text-[#2c2221] font-bold">{filteredProducts.length}</strong> items</span>
            <span>All items guarantee 100% trace-free wall safety</span>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#ebdcd8] my-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#f8f1ef] text-[#f09a8e] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-[#2c2221]">No decor items found</h3>
              <p className="text-xs text-[#735853] max-w-sm mx-auto">
                Try widening your price range or clearing selected category filters.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#2c2221] hover:bg-[#3d302f] text-white px-5 py-2 rounded-full text-xs font-semibold shadow-xs transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 sm:gap-5`}>
              {filteredProducts.filter((p, index, self) => index === self.findIndex(t => t.id === p.id)).map((product, idx) => (
                <ProductCard key={`${product.id}-${idx}`} product={product} />
              ))}
            </div>
          )}

        </main>
      </div>

      {/* Mobile Drawer Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-bold text-lg font-serif text-[#2c2221]">Filter Products</h3>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div className="py-4 border-b border-gray-100 space-y-2">
                <label className="text-xs font-bold uppercase text-[#a37068]">Category</label>
                <div className="space-y-1">
                  {catalogCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setFilter('category', cat.id as ProductCategory);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                        filters.category === cat.id ? 'bg-[#2c2221] text-white' : 'text-[#594744] bg-[#faf5f4]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price slider */}
              <div className="py-4 border-b border-gray-100 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Max Price</span>
                  <span>{formatPrice(filters.maxPriceUSD * exchangeRateUSD, filters.maxPriceUSD)}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="20"
                  step="0.5"
                  value={filters.maxPriceUSD}
                  onChange={(e) => setFilter('maxPriceUSD', parseFloat(e.target.value))}
                  className="w-full accent-[#f09a8e]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={resetFilters}
                className="w-1/2 bg-gray-100 text-gray-700 py-2.5 rounded-full text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 bg-[#2c2221] text-white py-2.5 rounded-full text-xs font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
