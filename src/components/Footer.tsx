import React from 'react';
import { 
  Store, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Heart, 
  Send,
  Lock,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCategory } from '../types';
import { DwellDecorLogo } from './DwellDecorLogo';

export const Footer: React.FC = () => {
  const { setActiveTab, setFilter } = useShop();

  return (
    <footer className="bg-[#2c2221] text-white pt-12 pb-8 border-t border-[#3d302f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-gray-300">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <button onClick={() => setActiveTab('home')} className="text-left focus:outline-none">
              <DwellDecorLogo size="lg" variant="light" showTagline={true} />
            </button>
            <p className="text-xs text-gray-400 leading-relaxed pt-1">
              Modern aesthetic small room decor for school & dorm use. Specializing in wall hooks, LED lighting, desk organizers, and mini planters.
            </p>
            <div className="flex items-center gap-1.5 text-[#f8d0c8] font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Trace-Free Wall Safe Guarantee</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Decor Categories</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => { setFilter('category', 'led-lighting'); setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#f09a8e] transition">
                  LED & Neon Lighting
                </button>
              </li>
              <li>
                <button onClick={() => { setFilter('category', 'wall-hooks'); setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#f09a8e] transition">
                  Damage-Free Wall Hooks
                </button>
              </li>
              <li>
                <button onClick={() => { setFilter('category', 'desk-organizers'); setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#f09a8e] transition">
                  Acrylic Desk Organizers
                </button>
              </li>
              <li>
                <button onClick={() => { setFilter('category', 'mini-planters'); setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#f09a8e] transition">
                  Mini Succulent Planters
                </button>
              </li>
              <li>
                <button onClick={() => { setFilter('category', 'wall-decor'); setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#f09a8e] transition">
                  Wall Photo Clip Strings
                </button>
              </li>
            </ul>
          </div>

          {/* Student Services */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Student Help & Express</h4>
            <ul className="space-y-2">
              <li><button onClick={() => { setActiveTab('advisor'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#f09a8e] transition">AI Room Stylist</button></li>
              <li><button onClick={() => { setActiveTab('account'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#f09a8e] transition">Track Campus Order</button></li>
              <li><button onClick={() => { setActiveTab('wishlist'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#f09a8e] transition">Saved Wishlist</button></li>
              <li><button onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#f09a8e] transition text-left">Campus Express Pickup (Owner's Room)</button></li>
              <li><button onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#f09a8e] transition text-left">Damage-Free Wall Decor</button></li>
            </ul>
          </div>

          {/* Quality & Campus Guarantee */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Quality Guarantee</h4>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              Carefully curated damage-free decor items tested for dorms and student bedrooms.
            </p>
            <div className="flex items-center gap-2 pt-1 text-gray-300 text-[10px] bg-white/5 p-2 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Student Approved Decor</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
