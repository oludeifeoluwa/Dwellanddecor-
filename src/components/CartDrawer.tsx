import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { handleImageError, getCleanImageUrl } from '../utils/imageHelper';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    formatPrice, 
    setActiveTab
  } = useShop();

  if (!isCartOpen) return null;

  const subtotalNGN = cart.reduce((sum, item) => sum + item.product.priceNGN * item.quantity, 0);
  const deliveryFeeNGN = 500; // Fixed school campus pickup fee (₦500)
  const serviceFeeNGN = 150;
  const estimatedTotalNGN = subtotalNGN + deliveryFeeNGN + serviceFeeNGN;

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setActiveTab('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#faf8f7] h-full shadow-2xl flex flex-col justify-between animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#f2e8e6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#f8f1ef] text-[#2c2221] flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4 text-[#f09a8e]" />
            </div>
            <div>
              <h2 className="font-bold font-serif text-[#2c2221] text-base">Shopping Bag</h2>
              <span className="text-[11px] text-[#8c7470]">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-gray-500 hover:bg-[#f2e9e7] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fulfillment Options Info Banner */}
        <div className="bg-emerald-50/80 px-5 py-3 border-b border-emerald-100 space-y-1 text-xs text-emerald-900">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>School Campus Pickup (Owner's Room) — ₦500</span>
          </div>
          <p className="text-[11px] text-emerald-800">
            Pick up directly at school with your confirmation code. Trace-free wall mounting included.
          </p>
        </div>

        {/* Cart Items Scroll List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 my-12">
              <div className="w-16 h-16 rounded-full bg-[#f5ebe8] text-[#f09a8e] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold font-serif text-base text-[#2c2221]">Your bag is currently empty</h3>
              <p className="text-xs text-[#735853] max-w-xs">
                Browse our wall hooks, LED strip lights, desk organizers, and mini planters to decorate your space!
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveTab('shop');
                }}
                className="bg-[#2c2221] text-white px-5 py-2 rounded-full text-xs font-semibold shadow-xs cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-3 rounded-2xl border border-[#ebdcd8] shadow-2xs flex gap-3 items-center"
              >
                <img 
                  src={getCleanImageUrl(item.product.image, item.product.name)} 
                  alt={item.product.name}
                  className="w-16 h-16 object-contain rounded-xl bg-[#faf5f4] p-1 border border-gray-100 shrink-0"
                  onError={handleImageError}
                />

                <div className="flex-1 overflow-hidden space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-xs text-[#2c2221] line-clamp-1">{item.product.name}</h4>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition p-0.5 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[10px] text-[#8c7470] block">
                    Color: {item.selectedColor || 'Standard'}
                  </span>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-xs text-[#2c2221]">
                      {formatPrice(item.product.priceNGN * item.quantity, item.product.priceUSD * item.quantity)}
                    </span>

                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-[#faf5f4] border border-[#ebdcd8] rounded-full p-0.5 text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-2xs cursor-pointer"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-[#2c2221] text-[11px]">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#f2e8e6] space-y-3">
            
            {/* Price Calculations Breakdown */}
            <div className="space-y-1 text-xs text-[#594744]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>{formatPrice(subtotalNGN)}</span>
              </div>

              <div className="flex justify-between text-[11px] text-gray-600">
                <span>School Pickup (Owner's Room)</span>
                <span className="font-semibold text-[#2c2221]">{formatPrice(deliveryFeeNGN)}</span>
              </div>

              <div className="flex justify-between text-[11px] text-gray-600">
                <span>Service & Processing Fee</span>
                <span className="font-semibold text-[#2c2221]">{formatPrice(serviceFeeNGN)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-[#2c2221] pt-2 border-t border-[#f2e8e6]">
                <span>Estimated Total Amount</span>
                <span className="text-base text-[#2c2221] font-serif">{formatPrice(estimatedTotalNGN)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Action */}
            <button
              onClick={handleProceedCheckout}
              className="w-full bg-[#2c2221] hover:bg-[#3d302f] text-white py-3 rounded-full font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#f09a8e]" />
              <span>Proceed to Paystack Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
