import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  ArrowLeft, 
  CreditCard, 
  Store
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { handleImageError, getCleanImageUrl } from '../utils/imageHelper';
import { CustomerInfo } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    formatPrice, 
    setActiveTab, 
    initiateCheckout,
    currentUser,
    ownerRoomAddress
  } = useShop();

  const [fulfillmentType] = useState<'pickup'>('pickup');

  const [customer, setCustomer] = useState<CustomerInfo>(() => ({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    addressType: 'dorm',
    university: currentUser?.university || '',
    dormHall: currentUser?.dormHall || '',
    roomNumber: currentUser?.roomNumber || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    state: currentUser?.state || ''
  }));

  React.useEffect(() => {
    if (currentUser) {
      setCustomer(prev => ({
        ...prev,
        fullName: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phone || prev.phone,
        university: currentUser.university || prev.university,
        dormHall: currentUser.dormHall || prev.dormHall,
        roomNumber: currentUser.roomNumber || prev.roomNumber,
        address: currentUser.address || prev.address
      }));
    }
  }, [currentUser]);

  const subtotalNGN = cart.reduce((acc, item) => acc + item.product.priceNGN * item.quantity, 0);
  const deliveryFeeNGN = 500; // Fixed school campus store owner room pickup fee (₦500)
  const serviceFeeNGN = 150; // Handling & service processing fee
  const discountNGN = 0;
  const totalNGN = subtotalNGN - discountNGN + deliveryFeeNGN + serviceFeeNGN;

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    initiateCheckout(customer, deliveryFeeNGN, discountNGN, 'pickup', serviceFeeNGN);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#2c2221]">Your bag is empty</h2>
        <p className="text-xs text-[#735853]">Please add decor items before proceeding to checkout.</p>
        <button
          onClick={() => setActiveTab('shop')}
          className="bg-[#2c2221] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#3d302f] transition cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('cart')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8c7470] hover:text-[#2c2221] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping Bag</span>
        </button>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Secure Paystack Checkout
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Delivery Details Form (7 cols) */}
        <form onSubmit={handleSubmitCheckout} className="lg:col-span-7 space-y-6">
          
          {/* Fulfillment Method Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#ebdcd8] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-serif text-[#2c2221] flex items-center gap-2">
                <Store className="w-4 h-4 text-[#f09a8e]" />
                Campus Fulfillment Method
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-0.5 rounded-full border border-emerald-200">
                School Pickup (₦500)
              </span>
            </div>

            {/* School / Store Owner Room Pickup Box */}
            <div className="p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/50 space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#2c2221] text-xs flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-emerald-600" />
                    Pick Up at School (Store Owner's Room)
                  </span>
                  <span className="text-emerald-900 block text-[11px]">
                    Collect your package directly from the store owner's room on campus with your order confirmation code.
                  </span>
                </div>
                <span className="font-bold text-emerald-900 shrink-0 bg-white px-2.5 py-1 rounded-full text-[11px] border border-emerald-200 shadow-2xs">
                  ₦500
                </span>
              </div>

              <div className="pt-2 border-t border-emerald-200/60 flex items-start gap-2 text-[11px] text-emerald-950 font-medium">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-900">Pickup Location: </span>
                  <span className="font-mono bg-white/90 px-2 py-0.5 rounded-md border border-emerald-200 text-[#2c2221]">{ownerRoomAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Contact Information Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#ebdcd8] shadow-2xs space-y-4">
            <h2 className="text-lg font-bold font-serif text-[#2c2221] flex items-center gap-2">
              <User className="w-4 h-4 text-[#f09a8e]" />
              Student Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#a37068] uppercase text-[10px]">Full Name</label>
                <input
                  type="text"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium text-[#2c2221] focus:outline-none focus:border-[#f09a8e]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#a37068] uppercase text-[10px]">Email Address (For Instant PDF Receipt)</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium text-[#2c2221] focus:outline-none focus:border-[#f09a8e]"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-[#a37068] uppercase text-[10px]">Phone Number (For WhatsApp / SMS Pickup Notification)</label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium text-[#2c2221] focus:outline-none focus:border-[#f09a8e]"
                  placeholder="e.g. 08123456789"
                  required
                />
              </div>
            </div>
          </div>

          {/* Student Campus Record Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#ebdcd8] shadow-2xs space-y-4">
            <h2 className="text-lg font-bold font-serif text-[#2c2221] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#f09a8e]" />
              Student Campus Record (For Order Verification)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-[#a37068] uppercase text-[10px]">University / Institution Name</label>
                <input
                  type="text"
                  value={customer.university}
                  onChange={(e) => setCustomer({ ...customer, university: e.target.value })}
                  className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium text-[#2c2221] focus:outline-none focus:border-[#f09a8e]"
                  placeholder="e.g. University of Lagos / Covenant / Babcock / UI"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#a37068] uppercase text-[10px]">Hostel / Hall / Wing</label>
                <input
                  type="text"
                  value={customer.dormHall}
                  onChange={(e) => setCustomer({ ...customer, dormHall: e.target.value })}
                  className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium text-[#2c2221] focus:outline-none focus:border-[#f09a8e]"
                  placeholder="e.g. Moremi Hall / Hall 3"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#a37068] uppercase text-[10px]">Room / Door Number</label>
                <input
                  type="text"
                  value={customer.roomNumber}
                  onChange={(e) => setCustomer({ ...customer, roomNumber: e.target.value })}
                  className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium text-[#2c2221] focus:outline-none focus:border-[#f09a8e]"
                  placeholder="e.g. Room B204"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Checkout Button */}
          <button
            type="submit"
            className="w-full bg-[#2c2221] hover:bg-[#3d302f] text-white py-4 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#f09a8e]" />
            <span>Proceed to Paystack Payment ({formatPrice(totalNGN)})</span>
          </button>

        </form>

        {/* Right Column: Order Summary Card (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#ebdcd8] shadow-2xs space-y-5 sticky top-28">
          <h2 className="text-lg font-bold font-serif text-[#2c2221] border-b border-[#f2e8e6] pb-3">
            Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} items)
          </h2>

          {/* Item List */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 items-center text-xs">
                <img 
                  src={getCleanImageUrl(item.product.image, item.product.name)} 
                  alt={item.product.name} 
                  className="w-12 h-12 object-contain bg-[#faf5f4] rounded-xl p-1 border border-gray-100 shrink-0" 
                  onError={handleImageError}
                />
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-[#2c2221] line-clamp-1">{item.product.name}</h4>
                  <span className="text-[10px] text-gray-400">Qty: {item.quantity} • {item.selectedColor}</span>
                </div>
                <span className="font-bold text-[#2c2221] shrink-0">
                  {formatPrice(item.product.priceNGN * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="pt-4 border-t border-[#f2e8e6] space-y-2 text-xs text-[#594744]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-medium text-[#2c2221]">{formatPrice(subtotalNGN)}</span>
            </div>

            <div className="flex justify-between">
              <span>School Pickup (Owner's Room)</span>
              <span className="font-semibold text-[#2c2221]">
                {formatPrice(deliveryFeeNGN)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <span>Service & Processing Fee</span>
                <span className="text-[10px] text-gray-400 font-normal">(Paystack & Handling)</span>
              </span>
              <span className="font-semibold text-[#2c2221]">{formatPrice(serviceFeeNGN)}</span>
            </div>

            <div className="flex justify-between font-bold text-base text-[#2c2221] pt-3 border-t border-[#f2e8e6]">
              <span>Total Payable</span>
              <span className="text-xl font-serif text-[#2c2221]">{formatPrice(totalNGN)}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-[#faf5f4] p-3 rounded-2xl border border-[#ebdcd8] text-[11px] text-[#735853] space-y-1">
            <p className="flex items-center gap-1 font-bold text-[#2c2221]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trace-Free Wall Safe Guarantee</span>
            </p>
            <p>100% trace-free wall mounting materials included with every decor item.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
