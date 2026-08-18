import React from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Palette, 
  ShieldCheck, 
  Zap, 
  Settings,
  Store,
  Package,
  Bell
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';
import { ProductCategory } from '../types';
import { DwellDecorLogo } from './DwellDecorLogo';

export const Header: React.FC = () => {
  const { 
    cart, 
    orders,
    wishlist, 
    activeTab, 
    setActiveTab, 
    setIsCartOpen, 
    setIsSearchOpen,
    setIsAuthModalOpen,
    setIsNotificationsOpen,
    unreadNotificationsCount,
    currentUser,
    filters,
    setFilter,
    formatPrice,
    whatsappNumber,
    isManagerAuthenticated,
    adminEmail,
    deauthenticateAdmin
  } = useShop();

  const [isHeaderVisible, setIsHeaderVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show when near the top
      if (currentScrollY <= 50) {
        setIsHeaderVisible(true);
      } else {
        // Hide when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY.current + 10) {
          setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollY.current - 10) {
          setIsHeaderVisible(true);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.priceNGN * item.quantity, 0);

  return (
    <header className={`sticky top-0 z-40 bg-[#fbf8f7]/90 backdrop-blur-md border-b border-[#f0e8e6] transition-transform duration-300 ease-in-out ${
      isHeaderVisible ? 'translate-y-0 shadow-sm' : '-translate-y-full shadow-none'
    }`}>
      
      {/* Active Admin Operations Session Banner */}
      {isManagerAuthenticated && (
        <div className="bg-[#1f1716] text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-[#3d2e2c] shadow-inner">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold text-emerald-300 text-[11px] uppercase tracking-wide">Store Admin Session Active</span>
            <span className="hidden sm:inline-block text-gray-400">•</span>
            <span className="font-mono text-gray-200 text-[11px] truncate">{adminEmail || 'admin@dwellanddecor.ng'}</span>
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== 'admin' ? (
              <button
                onClick={() => setActiveTab('admin')}
                className="bg-[#f09a8e] hover:bg-[#e8887b] text-[#2c2221] px-2.5 py-0.5 rounded-full font-bold text-[11px] transition shadow-2xs flex items-center gap-1"
              >
                <span>Store Operations Dashboard</span>
                <span>→</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('home')}
                className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded-full font-bold text-[11px] transition flex items-center gap-1"
              >
                <span>Preview Student Storefront</span>
              </button>
            )}

            <button
              onClick={deauthenticateAdmin}
              className="text-red-300 hover:text-red-200 text-[11px] font-semibold underline pl-1.5"
            >
              Sign Out Admin
            </button>
          </div>
        </div>
      )}



      {/* Top Banner - WhatsApp Custom Orders Announcement */}
      <div className="bg-[#2c2221] text-white px-4 py-2 text-xs font-medium flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* <span className="bg-[#25D366] text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wide flex items-center gap-1 shrink-0 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
            WhatsApp
          </span> */}
          <span className="truncate text-xs sm:text-sm font-medium text-gray-100">
            📢 Custom orders or special requests? <strong className="text-[#f8d0c8] font-bold">DM us on WhatsApp!</strong> We handle custom wall collages, room setups & bulk orders.
          </span>
        </div>

        <a 
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello! I would like to place a custom room decor order.')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3 py-1 rounded-full font-bold text-[11px] transition-all hover:scale-105 shrink-0 shadow-xs"
        >
          <span>DM on WhatsApp</span>
          <span className="text-xs">→</span>
        </a>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo with Official DWELL & DECOR Typography and Monogram */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 group text-left focus:outline-none py-1 hover:opacity-90 transition-opacity"
            title="Dwell & Decor - Home"
          >
            <DwellDecorLogo size="md" variant="dark" showTagline={true} />
          </button>

          {/* Search Input */}
          <div className="flex-1 max-w-md hidden sm:block">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-white hover:bg-[#f6f0ee] border border-[#ebe1de] text-[#8c7470] text-sm rounded-full py-2 px-4 flex items-center justify-between shadow-xs transition-all group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#a38b87] group-hover:text-[#f09a8e] transition" />
                <span className="text-[#8c7470] text-xs sm:text-sm">Search...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#8c7470] bg-[#f2e9e7] px-2 py-0.5 rounded-full border border-[#e5d8d5]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Action Navigation Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Mobile Search Button */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:hidden rounded-full text-[#594744] hover:bg-[#f2e9e7] transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* AI Room Stylist Trigger */}
            <button
              onClick={() => setActiveTab('advisor')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition shadow-xs ${
                activeTab === 'advisor'
                  ? 'bg-[#2c2221] text-white'
                  : 'bg-[#f5e9e6] hover:bg-[#ebdcd8] text-[#4a3836] border border-[#e8d8d4]'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#f09a8e]" />
              <span>AI Room Stylist</span>
            </button>

            {/* Notifications Bell Button */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-full text-[#594744] hover:bg-[#f2e9e7] transition focus:outline-none"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#f09a8e] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center animate-pulse shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Wishlist Icon */}
            <button 
              onClick={() => setActiveTab('wishlist')}
              className="relative p-2 rounded-full text-[#594744] hover:bg-[#f2e9e7] transition focus:outline-none"
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#f09a8e] text-[#f09a8e]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#f09a8e] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-[#2c2221] hover:bg-[#3d302f] text-white px-3.5 py-2 rounded-full text-xs font-semibold transition shadow-sm hover:shadow group"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#f8d0c8]" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#f09a8e] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block border-l border-white/20 pl-2">
                {cartSubtotal > 0 ? formatPrice(cartSubtotal) : 'My Bag'}
              </span>
            </button>

            {/* Clean Account / Orders Button */}
            {currentUser ? (
              <button 
                onClick={() => setActiveTab('account')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition ${
                  activeTab === 'account' 
                    ? 'bg-[#2c2221] text-white border-[#2c2221]' 
                    : 'bg-white text-[#2c2221] border-[#ebdcd8] hover:bg-[#f5e9e6]'
                }`}
                title="Account & Orders"
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover border border-[#f09a8e]" />
                ) : (
                  <User className="w-4 h-4 text-[#f09a8e]" />
                )}
                <span className="hidden sm:inline-block">Account</span>
                {orders.length > 0 && (
                  <span className="bg-[#f09a8e] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {orders.length}
                  </span>
                )}
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-[#f09a8e] hover:bg-[#e0897d] text-white text-xs font-bold px-3.5 py-2 rounded-full transition shadow-xs flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>
        </div>

        {/* Category Pill Navigation Bar */}
        <nav className="mt-3 pt-2 border-t border-[#f2e9e7] flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => {
              setFilter('category', 'all');
              if (activeTab !== 'shop') setActiveTab('shop');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filters.category === 'all' && activeTab === 'shop'
                ? 'bg-[#2c2221] text-white shadow-xs'
                : 'bg-white hover:bg-[#f5e9e6] text-[#594744] border border-[#e8dedb]'
            }`}
          >
            All Items
          </button>

          {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setFilter('category', cat.id as ProductCategory);
                if (activeTab !== 'shop') setActiveTab('shop');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filters.category === cat.id && activeTab === 'shop'
                  ? 'bg-[#f09a8e] text-white font-semibold shadow-xs'
                  : 'bg-white hover:bg-[#f5e9e6] text-[#594744] border border-[#e8dedb]'
              }`}
            >
              {cat.name}
            </button>
          ))}

          {/* <button
            onClick={() => {
              setFilter('onSaleOnly', true);
              if (activeTab !== 'shop') setActiveTab('shop');
            }}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#d94636] bg-[#fde8e5] hover:bg-[#fcd3cd] border border-[#f8b4aa] whitespace-nowrap flex items-center gap-1 ml-auto"
          >
            <Zap className="w-3 h-3 fill-current" />
            Student Flash Deals
          </button> */}
        </nav>
      </div>

      {/* Fixed Bottom Mobile Navigation Bar */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#ebdcd8] px-3 py-2 flex items-center justify-around shadow-lg transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
            activeTab === 'home' || activeTab === 'shop' ? 'text-[#2c2221]' : 'text-gray-400'
          }`}
        >
          <Store className="w-5 h-5" />
          <span>Shop</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('advisor');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
            activeTab === 'advisor' ? 'text-[#f09a8e]' : 'text-gray-400'
          }`}
        >
          <Palette className="w-5 h-5 text-[#f09a8e]" />
          <span>AI Stylist</span>
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-gray-400 transition hover:text-[#2c2221]"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('wishlist');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
            activeTab === 'wishlist' ? 'text-[#f09a8e]' : 'text-gray-400'
          }`}
        >
          <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#f09a8e] text-[#f09a8e]' : ''}`} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 bg-[#f09a8e] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span>Saved</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-[10px] font-bold text-gray-400 transition"
        >
          <ShoppingBag className="w-5 h-5 text-[#2c2221]" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 right-1 bg-[#f09a8e] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
          <span>Bag</span>
        </button>

        <button
          onClick={() => {
            if (currentUser) {
              setActiveTab('account');
            } else {
              setIsAuthModalOpen(true);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
            activeTab === 'account' ? 'text-[#2c2221]' : 'text-gray-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>{currentUser ? 'Account' : 'Sign In'}</span>
        </button>
      </div>
    </header>
  );
};
