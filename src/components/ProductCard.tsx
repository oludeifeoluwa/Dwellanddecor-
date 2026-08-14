import React from 'react';
import { Star, Heart, ShoppingBag, Eye, Zap, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { handleImageError, getCleanImageUrl } from '../utils/imageHelper';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice, addToCart, toggleWishlist, isInWishlist, selectProduct } = useShop();

  const isLiked = isInWishlist(product.id);

  return (
    <div 
      onClick={() => selectProduct(product.id)}
      className="bg-white hover:bg-[#faf5f4] rounded-2xl p-4 border border-[#ebdcd8] hover:border-[#f09a8e] transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between cursor-pointer group relative"
    >
      {/* Top Badges */}
      <div className="flex items-center justify-between z-10 mb-2">
        <div className="flex flex-wrap gap-1">
          {(!product.inStock || product.stockCount <= 0) ? (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          ) : product.stockCount <= 10 ? (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Low Stock ({product.stockCount})
            </span>
          ) : null}

          {product.isNewArrival && product.inStock && product.stockCount > 0 && (
            <span className="bg-[#2c2221] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              New
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && product.inStock && product.stockCount > 0 && (
            <span className="bg-[#f5e4e0] text-[#a37068] border border-[#e5cdc7] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Top Seller
            </span>
          )}
        </div>

        {/* Wishlist Heart Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="w-8 h-8 rounded-full bg-white/90 shadow-xs border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#f09a8e] hover:bg-white transition"
          title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#f09a8e] text-[#f09a8e]' : ''}`} />
        </button>
      </div>

      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] sm:aspect-[4/3] w-full my-2 flex items-center justify-center overflow-hidden rounded-2xl bg-[#f8f2f0] group-hover:bg-[#f3e8e5] transition-colors p-2">
        <img 
          src={getCleanImageUrl(product.image, product.name)} 
          alt={product.name}
          className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500 shadow-2xs"
          onError={handleImageError}
        />

        {/* Quick View Hover overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
          <span className="bg-white/90 text-[#2c2221] text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </span>
        </div>

        {/* Floating Rating Pill */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-semibold text-[#2c2221] flex items-center gap-1 shadow-2xs border border-white/60">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
          <span className="text-gray-400 font-normal">({product.reviewCount})</span>
        </div>
      </div>

      {/* Details & Specs */}
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-[#8c7470]">
          <span className="font-medium uppercase tracking-wider">{product.categoryName}</span>
          {product.installationType && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-100">
              <ShieldCheck className="w-2.5 h-2.5" />
              {product.installationType}
            </span>
          )}
        </div>

        <h3 className="text-sm font-bold text-[#2c2221] font-serif line-clamp-1 group-hover:text-[#f09a8e] transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-[#735853] line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Color Option Swatches */}
        {(product.colorOptions || []).length > 0 && (
          <div className="flex items-center gap-1 pt-1">
            {(product.colorOptions || []).slice(0, 4).map((col, idx) => (
              <span 
                key={idx}
                className="w-2.5 h-2.5 rounded-full border border-gray-300 shadow-2xs inline-block"
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
            {(product.colorOptions || []).length > 4 && (
              <span className="text-[10px] text-gray-400 font-medium">
                +{(product.colorOptions || []).length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price & Add to Bag Footer */}
        <div className="pt-3 border-t border-[#f2e8e6] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#2c2221]">
                {formatPrice(product.priceNGN, product.priceUSD)}
              </span>
            </div>
          </div>

          <button
            disabled={!product.inStock || product.stockCount <= 0}
            onClick={(e) => {
              e.stopPropagation();
              if (product.inStock && product.stockCount > 0) {
                addToCart(product);
              }
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              !product.inStock || product.stockCount <= 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#2c2221] hover:bg-[#f09a8e] text-white shadow-xs'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{!product.inStock || product.stockCount <= 0 ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
