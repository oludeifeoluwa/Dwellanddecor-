import React from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { ProductDetailPage } from './components/ProductDetailPage';
import { RoomDecorAdvisor } from './components/RoomDecorAdvisor';
import { AccountDashboard } from './components/AccountDashboard';
import { WishlistPage } from './components/WishlistPage';
import { AdminPanel } from './components/AdminPanel';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { PaystackModal } from './components/PaystackModal';
import { ReviewModal } from './components/ReviewModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { useShop } from './context/ShopContext';

export default function App() {
  const { 
    activeTab, 
    notification
  } = useShop();

  return (
    <div className="min-h-screen bg-[#fbf8f7] text-[#2c2221] flex flex-col font-sans relative antialiased selection:bg-[#f09a8e]/30 selection:text-[#2c2221]">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-bounce-short">
          <div className={`px-4 py-2.5 rounded-2xl shadow-lg border text-xs font-semibold flex items-center gap-2 backdrop-blur-md ${
            notification.type === 'success' 
              ? 'bg-emerald-900/90 border-emerald-700 text-white' 
              : notification.type === 'warning'
              ? 'bg-amber-900/90 border-amber-700 text-white'
              : 'bg-[#2c2221]/90 border-gray-700 text-white'
          }`}>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Sticky Header */}
      <Header />

      {/* Primary Dynamic Main Page Views */}
      <main className="flex-1 pb-12">
        {/* Home / Shop Catalog Page View */}
        {(activeTab === 'home' || activeTab === 'shop') && (
          <>
            <HeroSection />
            <div id="product-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
              <ProductGrid />
            </div>
          </>
        )}

        {/* Product Detail Page View */}
        {activeTab === 'product-detail' && (
          <ProductDetailPage />
        )}

        {/* Full-Page Checkout Route View */}
        {activeTab === 'checkout' && (
          <CheckoutModal />
        )}

        {/* Full-Page Order Confirmation & Receipt Route View */}
        {activeTab === 'order-confirmation' && (
          <OrderConfirmationPage />
        )}

        {/* AI Room Decor Stylist View */}
        {activeTab === 'advisor' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <RoomDecorAdvisor />
          </div>
        )}

        {/* Wishlist Page View */}
        {activeTab === 'wishlist' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <WishlistPage onSelectProduct={() => {}} />
          </div>
        )}

        {/* Student Account & Orders View */}
        {activeTab === 'account' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AccountDashboard />
          </div>
        )}

        {/* Store Manager Admin Panel View */}
        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminPanel />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Slide-over Drawers & Interactive Modals */}
      <CartDrawer />
      <SearchModal />
      <AuthModal />
      <PaystackModal />
      <ReviewModal />
      <NotificationsDrawer />
      
      {/* WhatsApp Quick Concierge Float */}
      <WhatsAppButton />
    </div>
  );
}
