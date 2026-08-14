import React from 'react';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Printer, 
  Download, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Truck, 
  ShoppingBag,
  MessageCircle,
  Calendar,
  CreditCard,
  User,
  GraduationCap
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { printReceiptPDF, downloadReceiptPDF } from '../utils/receiptPrinter';
import { handleImageError, getCleanImageUrl } from '../utils/imageHelper';

export const OrderConfirmationPage: React.FC = () => {
  const { 
    lastPlacedOrder, 
    orders, 
    setActiveTab, 
    formatPrice, 
    showToast,
    whatsappNumber 
  } = useShop();

  // If lastPlacedOrder is null, fallback to the latest order in order history
  const order = lastPlacedOrder || orders[0] || null;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#f8f1ef] text-[#f09a8e] flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif text-[#2c2221]">No Recent Order Found</h2>
        <p className="text-xs text-[#735853]">You haven't placed an order in this session yet.</p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('shop')}
            className="bg-[#2c2221] hover:bg-[#3d302f] text-white px-5 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer"
          >
            Explore Decor Catalog
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className="bg-white border border-[#ebdcd8] text-[#2c2221] px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#faf5f4] transition cursor-pointer"
          >
            View Account Orders
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    downloadReceiptPDF(order);
    showToast('Official PDF receipt downloaded!', 'success');
  };

  const handlePrint = () => {
    showToast('Opening print dialog / Save as PDF...', 'info');
    printReceiptPDF(order);
  };

  const openWhatsAppHelp = () => {
    const text = encodeURIComponent(
      `Hello! I just placed campus decor order #${order.id} (Ref: ${order.paystackRef}) and would like to confirm my school pickup status.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  const subtotal = order.subtotalNGN || (order.totalNGN - (order.deliveryFeeNGN || 500) - (order.serviceFeeNGN || 150));
  const deliveryFee = order.deliveryFeeNGN !== undefined ? order.deliveryFeeNGN : 500;
  const serviceFee = order.serviceFeeNGN || 150;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      
      {/* Top Success Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md animate-scale-up">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1.5">
          <span className="text-emerald-800 font-bold uppercase text-[11px] tracking-wider px-3 py-1 bg-emerald-100/80 rounded-full inline-block">
            Payment Verified & Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2c2221]">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-[#594744] max-w-md mx-auto">
            Your dorm & student room decor is being prepared. We've sent a full confirmation to{' '}
            <strong className="text-[#2c2221]">{order.customer.email}</strong>.
          </p>
        </div>

        {/* Order Quick Metadata Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
          <div className="bg-white px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs font-medium text-gray-700">
            <span className="text-gray-400 mr-1">Order ID:</span>
            <strong className="font-mono text-[#2c2221]">#{order.id}</strong>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs font-medium text-gray-700">
            <span className="text-gray-400 mr-1">Paystack Ref:</span>
            <strong className="font-mono text-[#2c2221]">{order.paystackRef}</strong>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs font-medium text-gray-700">
            <span className="text-gray-400 mr-1">Date:</span>
            <span>{new Date(order.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Campus Order Status Stepper */}
      <div className="bg-white border border-[#ebdcd8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-sm font-bold text-[#a37068] uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#f09a8e]" />
          <span>Campus Fulfillment Status</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              ✓
            </div>
            <div>
              <p className="text-xs font-bold text-[#2c2221]">Order Placed</p>
              <p className="text-[11px] text-gray-500">Payment received</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2c2221] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs animate-pulse">
              2
            </div>
            <div>
              <p className="text-xs font-bold text-[#2c2221]">Processing Package</p>
              <p className="text-[11px] text-gray-500">Packing damage-free strips</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 opacity-60">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600">
                Ready for School Pickup
              </p>
              <p className="text-[11px] text-gray-400">
                Owner's room ready
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 opacity-60">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-xs shrink-0">
              4
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600">Package Collected</p>
              <p className="text-[11px] text-gray-400">Cozy space ready!</p>
            </div>
          </div>
        </div>

        {/* Fulfillment Specific Location Banner */}
        <div className="p-4 sm:p-5 rounded-2xl border text-xs space-y-2 bg-emerald-50/80 border-emerald-200 text-emerald-900">
          <div className="flex items-center gap-2 font-bold text-sm">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>
              School Pickup Location (Store Owner's Room — ₦500 Fee)
            </span>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-emerald-950">
              📍 {order.ownerRoomAddress || 'Queen Elizabeth Hall, Room 204, Block A, Main Campus'}
            </p>
            <p className="text-[11px] text-emerald-800">
              Show your downloaded PDF receipt or quote Order ID <strong>#{order.id}</strong> when you stop by for pickup.
            </p>
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="bg-white border border-[#ebdcd8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-sm font-bold text-[#a37068] uppercase tracking-wider flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#f09a8e]" />
          <span>Items in Your Order ({order.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
        </h2>

        <div className="divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-[#faf5f4] border border-[#ebdcd8] overflow-hidden p-1 shrink-0 flex items-center justify-center">
                  <img 
                    src={getCleanImageUrl(item.product.image, item.product.name)} 
                    alt={item.product.name} 
                    className="w-full h-full object-contain"
                    onError={handleImageError}
                  />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs sm:text-sm text-[#2c2221] line-clamp-1">{item.product.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                    <span>Qty: <strong className="text-[#2c2221]">{item.quantity}</strong></span>
                    {item.selectedColor && (
                      <>
                        <span>•</span>
                        <span>Color: <strong className="text-[#2c2221]">{item.selectedColor}</strong></span>
                      </>
                    )}
                    {item.selectedSize && (
                      <>
                        <span>•</span>
                        <span>Option: <strong className="text-[#2c2221]">{item.selectedSize}</strong></span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-bold text-xs sm:text-sm text-[#2c2221] block">
                  {formatPrice(item.product.priceNGN * item.quantity)}
                </span>
                <span className="text-[10px] text-gray-400">
                  {formatPrice(item.product.priceNGN)} each
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Totals Box */}
        <div className="border-t border-gray-200 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Items Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>School Pickup (Owner's Room)</span>
            <span className="font-semibold text-[#2c2221]">{formatPrice(deliveryFee)}</span>
          </div>
          {serviceFee ? (
            <div className="flex justify-between text-gray-600">
              <span>Service & Processing Fee</span>
              <span>{formatPrice(serviceFee)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-base font-bold text-[#2c2221] pt-2 border-t border-gray-200">
            <span>Total Paid Amount</span>
            <span className="text-lg text-[#2c2221] font-serif">{formatPrice(order.totalNGN, order.totalUSD)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 sm:flex-none bg-[#f09a8e] hover:bg-[#e2887c] text-white px-5 py-3 rounded-full font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Receipt</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none bg-white border border-[#ebdcd8] text-[#2c2221] hover:bg-[#faf5f4] px-5 py-3 rounded-full font-bold text-xs transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={openWhatsAppHelp}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            title="Chat with store owner on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Store Owner</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 sm:flex-none bg-[#2c2221] hover:bg-[#3d302f] text-white px-6 py-3 rounded-full font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
