import React, { useState } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Clock, 
  Truck, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Printer,
  Download,
  LogOut,
  GraduationCap,
  LogIn,
  Mail,
  Phone
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { handleImageError, getCleanImageUrl } from '../utils/imageHelper';
import { Order } from '../types';
import { ReceiptModal } from './ReceiptModal';
import { downloadReceiptPDF, printReceiptPDF } from '../utils/receiptPrinter';

export const AccountDashboard: React.FC = () => {
  const { 
    orders, 
    formatPrice, 
    setActiveTab, 
    wishlist, 
    currentUser, 
    setIsAuthModalOpen, 
    logout,
    showToast
  } = useShop();

  const [activeAccountTab, setActiveAccountTab] = useState<'orders' | 'addresses'>('orders');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(orders[0] || null);
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-[#f09a8e]/10 text-[#f09a8e] rounded-full flex items-center justify-center mx-auto border border-[#f09a8e]/20">
          <User className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-serif text-[#2c2221]">Sign in to your Student Account</h2>
          <p className="text-xs text-[#735853] max-w-md mx-auto">
            Access your active Paystack decor orders, official PDF receipts, and school pickup verification.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full sm:w-auto bg-[#2c2221] hover:bg-[#3d302f] text-white px-8 py-3.5 rounded-2xl font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-[#f09a8e]" />
            <span>Sign In / Create Student Account</span>
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = (order: Order, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    downloadReceiptPDF(order);
    showToast('Official PDF receipt downloaded!', 'success');
  };

  const handlePrintReceipt = (order: Order, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOrderToPrint(order);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Student Account Overview Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ebdcd8] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {currentUser.avatarUrl ? (
              <img 
                src={getCleanImageUrl(currentUser.avatarUrl)} 
                alt={currentUser.fullName} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#f09a8e] shadow-xs" 
                onError={handleImageError}
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2c2221] to-[#4a3836] text-[#f8d0c8] font-serif text-2xl font-bold flex items-center justify-center shadow-xs">
                {currentUser.fullName.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold font-serif text-[#2c2221]">{currentUser.fullName}</h1>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-emerald-600" />
                Verified Student
              </span>
            </div>
            <p className="text-xs text-[#8c7470] mt-0.5">
              {currentUser.email} {currentUser.university ? `• ${currentUser.university}` : ''}
            </p>
            {currentUser.dormHall && (
              <p className="text-[11px] text-gray-500 mt-0.5">
                Hostel: {currentUser.dormHall}, {currentUser.roomNumber}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action & Sign Out */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={logout}
            className="p-3 bg-[#faf5f4] hover:bg-[#f2e8e6] text-[#2c2221] rounded-2xl border border-[#ebdcd8] transition text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Row */}
      <div className="flex border-b border-[#f2e8e6] gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveAccountTab('orders')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeAccountTab === 'orders' ? 'border-[#2c2221] text-[#2c2221]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveAccountTab('addresses')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
            activeAccountTab === 'addresses' ? 'border-[#2c2221] text-[#2c2221]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Campus Records</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className="pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-gray-400 hover:text-[#2c2221] whitespace-nowrap transition cursor-pointer"
        >
          <Heart className="w-4 h-4 text-[#f09a8e]" />
          <span>Wishlist ({wishlist.length})</span>
        </button>
      </div>

      {/* 1. ORDERS TAB CONTENT */}
      {activeAccountTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#ebdcd8] text-center space-y-3">
              <Package className="w-12 h-12 text-[#f09a8e] mx-auto" />
              <h3 className="font-bold text-base font-serif text-[#2c2221]">No orders placed yet</h3>
              <p className="text-xs text-[#735853]">Your room decor orders and official PDF receipts will show up here.</p>
              <button
                onClick={() => setActiveTab('shop')}
                className="bg-[#2c2221] text-white px-5 py-2 rounded-full text-xs font-semibold cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Orders List (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrderForTracking(ord)}
                    className={`bg-white p-5 rounded-3xl border cursor-pointer transition shadow-2xs space-y-3 ${
                      selectedOrderForTracking?.id === ord.id ? 'border-[#f09a8e] ring-1 ring-[#f09a8e]' : 'border-[#ebdcd8] hover:border-[#f09a8e]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-[#f2e8e6]">
                      <div>
                        <span className="font-bold text-[#2c2221] block">Order #{ord.id}</span>
                        <span className="text-[10px] text-gray-400">{new Date(ord.date).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDownloadPDF(ord, e)}
                          className="bg-[#f09a8e] hover:bg-[#e0897d] text-[#2c2221] font-bold px-2.5 py-1 rounded-xl text-[10px] transition flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Download Official PDF Receipt"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                        <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {ord.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2 overflow-hidden">
                        {ord.items.slice(0, 3).map((item, i) => (
                          <img 
                            key={i} 
                            src={getCleanImageUrl(item.product.image, item.product.name)} 
                            alt={item.product.name} 
                            className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-contain bg-[#faf5f4]" 
                            onError={handleImageError}
                          />
                        ))}
                      </div>

                      <div className="flex-1 overflow-hidden text-xs">
                        <span className="font-semibold text-[#2c2221] block truncate">
                          {ord.items.map(i => i.product.name).join(', ')}
                        </span>
                        <span className="text-[10px] text-gray-400">Paystack Ref: {ord.paystackRef}</span>
                      </div>

                      <span className="font-bold text-sm text-[#2c2221]">
                        {formatPrice(ord.totalNGN, ord.totalUSD)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Order Parcel Tracking Detail (5 cols) */}
              {selectedOrderForTracking && (
                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#ebdcd8] shadow-2xs space-y-5 sticky top-28">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f2e8e6]">
                    <div>
                      <h3 className="font-bold font-serif text-[#2c2221] text-base">Order Details & Tracking</h3>
                      <span className="text-[11px] text-gray-400">Ref: {selectedOrderForTracking.paystackRef}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleDownloadPDF(selectedOrderForTracking)}
                        className="p-2 bg-[#f09a8e] hover:bg-[#e0897d] text-[#2c2221] rounded-full transition flex items-center gap-1 text-xs font-bold px-3 shadow-2xs cursor-pointer"
                        title="Download PDF Receipt"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                      <button 
                        onClick={() => handlePrintReceipt(selectedOrderForTracking)}
                        className="p-2 bg-[#faf5f4] rounded-full text-gray-600 hover:text-black transition flex items-center gap-1 text-xs font-semibold px-3 border border-[#ebdcd8] cursor-pointer"
                        title="Print Receipt"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#f09a8e]" />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>

                  {/* Parcel Status Timeline */}
                  <div className="space-y-4 text-xs">
                    <div className="relative pl-6 border-l-2 border-[#f09a8e] space-y-4">
                      <div className="relative">
                        <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#f09a8e] text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="font-bold text-[#2c2221] block">Order Confirmed & Paystack Verified</span>
                        <span className="text-[10px] text-gray-400">Payment ID: {selectedOrderForTracking.paystackRef}</span>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#f09a8e] text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="font-bold text-[#2c2221] block">Packed at Campus Hub</span>
                        <span className="text-[10px] text-gray-400">Quality inspected & trace-free wall safe checked</span>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#2c2221] text-white flex items-center justify-center">
                          <Truck className="w-3 h-3" />
                        </div>
                        <span className="font-bold text-[#2c2221] block">Ready for School Pickup</span>
                        <span className="text-[10px] text-emerald-700 font-semibold">Store Owner Room Pickup (₦500 Fee Applied)</span>
                      </div>
                    </div>
                  </div>

                  {/* School Pickup Location Details */}
                  <div className="bg-[#faf5f4] p-4 rounded-2xl border border-[#ebdcd8] text-xs space-y-2">
                    <span className="font-bold text-[#a37068] uppercase text-[10px] block">School Pickup Location (Owner's Room)</span>
                    <p className="font-bold text-emerald-900 bg-white p-2.5 rounded-xl border border-[#ebdcd8] font-mono text-[11px]">
                      📍 {selectedOrderForTracking.ownerRoomAddress || 'Queen Elizabeth Hall, Room 204, Block A'}
                    </p>
                    <div className="text-gray-600 pt-1 space-y-0.5 text-[11px]">
                      <p>Customer: <strong>{selectedOrderForTracking.customer.fullName}</strong></p>
                      <p>Email: {selectedOrderForTracking.customer.email}</p>
                      <p>Phone: {selectedOrderForTracking.customer.phone}</p>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* 2. SAVED ADDRESSES TAB CONTENT */}
      {activeAccountTab === 'addresses' && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif text-[#2c2221]">Student Campus Records</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-[#f09a8e] space-y-2 relative shadow-xs">
              <span className="bg-[#2c2221] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Primary Hostel Record
              </span>
              <h4 className="font-bold text-sm text-[#2c2221]">{currentUser.dormHall}, {currentUser.roomNumber}</h4>
              <p className="text-xs text-gray-600">{currentUser.university}</p>
              <p className="text-xs text-gray-600">{currentUser.city}, {currentUser.state}</p>
              <p className="text-xs text-gray-500 font-medium pt-1">Phone: {currentUser.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Switcher for Store Operations / Admin Portal */}
      <div className="bg-[#f5ebe8] border border-[#ebd8d4] p-4.5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="font-bold text-[#2c2221] flex items-center gap-1.5 font-serif">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Store Management Operations
          </span>
          <p className="text-[11px] text-[#735853]">
            Are you a store manager or administrator? Access order fulfillment, stock controls & room address settings.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('admin')}
          className="bg-[#2c2221] hover:bg-[#3d302f] text-white px-4 py-2 rounded-2xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
        >
          <span>Store Manager Portal</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#f09a8e]" />
        </button>
      </div>

      {/* Official Printable Receipt Modal */}
      <ReceiptModal 
        order={orderToPrint} 
        onClose={() => setOrderToPrint(null)} 
      />

    </div>
  );
};
