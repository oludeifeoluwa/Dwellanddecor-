import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart, formatPrice, setActiveTab } = useShop();

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#a37068]">Saved Decor</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2c2221]">My Wishlist</h1>
        </div>

        <button 
          onClick={() => setActiveTab('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8c7470] hover:text-[#2c2221] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {savedProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#ebdcd8] text-center space-y-3 my-8">
          <Heart className="w-12 h-12 text-[#f09a8e] mx-auto" />
          <h3 className="font-bold text-base font-serif text-[#2c2221]">Your wishlist is currently empty</h3>
          <p className="text-xs text-[#735853] max-w-xs mx-auto">
            Click the heart icon on any wall hook, LED light, or desk organizer to save items for later!
          </p>
          <button
            onClick={() => setActiveTab('shop')}
            className="bg-[#2c2221] text-white px-5 py-2 rounded-full text-xs font-semibold"
          >
            Explore Student Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {savedProducts.map(product => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
