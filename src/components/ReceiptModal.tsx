import React from 'react';
import { X, Printer, GraduationCap, Building2, MapPin, Phone, Mail, CheckCircle2, ShieldCheck, Download, FileText } from 'lucide-react';
import { Order } from '../types';
import { useShop } from '../context/ShopContext';
import { printReceiptPDF, downloadReceiptPDF } from '../utils/receiptPrinter';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const { formatPrice, showToast } = useShop();

  if (!order) return null;

  const handleDownloadPDF = () => {
    downloadReceiptPDF(order);
    showToast('Official PDF receipt downloaded!', 'success');
  };

  const handlePrint = () => {
    showToast('Opening print dialog / Save as PDF...', 'info');
    printReceiptPDF(order);
  };

  const subtotal = order.subtotalNGN || (order.totalNGN - (order.deliveryFeeNGN || 500) - (order.serviceFeeNGN || 150));
  const deliveryFee = order.deliveryFeeNGN !== undefined ? order.deliveryFeeNGN : 500;
  const serviceFee = order.serviceFeeNGN || 150;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 my-auto animate-scale-up max-h-[88vh] flex flex-col">
        
        {/* Action Header bar (Hidden when printing) */}
        <div className="bg-[#2c2221] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-gray-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-[#f09a8e] text-[#2c2221] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
              Official PDF Invoice
            </span>
            <span className="text-xs text-gray-300 font-mono">#{order.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="bg-[#f09a8e] hover:bg-[#e0897d] text-[#2c2221] font-bold px-3.5 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Download Official PDF Receipt"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1 border border-white/20 cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full transition ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div className="p-5 sm:p-8 space-y-6 text-[#2c2221] overflow-y-auto" id="printable-receipt">
          
          {/* Brand Header */}
          <div className="border-b border-gray-200 pb-6 flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-[#f09a8e] uppercase tracking-widest block">Dwell & Decor Campus Store</span>
              <h1 className="text-2xl font-serif font-bold text-[#2c2221]">DORM ROOM RECEIPT</h1>
              <p className="text-xs text-gray-500 mt-1">Paystack Transaction Verified & Authorized</p>
            </div>

            <div className="text-right text-xs space-y-1">
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-full inline-block text-[10px]">
                STATUS: PAID
              </div>
              <p className="font-mono text-[11px] text-gray-500">Ref: {order.paystackRef}</p>
              <p className="text-gray-500 text-[11px]">Date: {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          {/* Student & Delivery Information Box */}
          <div className="bg-[#faf5f4] p-5 rounded-2xl border border-[#ebdcd8] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Student Info */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#a37068] tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-[#f09a8e]" />
                Student Details
              </span>
              <p className="font-bold text-sm text-[#2c2221]">{order.customer.fullName}</p>
              <p className="text-gray-600 flex items-center gap-1">
                <Mail className="w-3 h-3 text-gray-400" />
                {order.customer.email}
              </p>
              <p className="text-gray-600 flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-400" />
                {order.customer.phone}
              </p>
            </div>

            {/* Fulfillment Location */}
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-4">
              <span className="text-[10px] font-bold uppercase text-[#a37068] tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#f09a8e]" />
                Fulfillment (School Pickup)
              </span>
              <p className="font-bold text-sm text-emerald-800 flex items-center gap-1">
                📍 Store Owner Room Pickup (₦500):
              </p>
              <p className="font-mono text-xs text-gray-800 bg-white p-2 rounded-xl border border-gray-200">
                {order.ownerRoomAddress || 'Queen Elizabeth Hall, Room 204, Block A'}
              </p>
            </div>

          </div>

          {/* Purchased Items Table */}
          <div className="space-y-2">
            <h3 className="font-bold font-serif text-sm text-[#2c2221]">Decor Order Breakdown</h3>
            <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#faf5f4] border-b border-gray-200 font-bold text-[#a37068]">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 font-semibold text-[#2c2221]">
                        {item.product.name}
                        {item.selectedColor && <span className="text-[10px] text-gray-400 block font-normal">Color: {item.selectedColor}</span>}
                      </td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">{formatPrice(item.product.priceNGN, item.product.priceUSD)}</td>
                      <td className="p-3 text-right font-bold">{formatPrice(item.product.priceNGN * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Receipt Totals Summary */}
          <div className="space-y-1.5 text-xs text-right pt-2 border-t border-gray-200 max-w-xs ml-auto">
            <div className="flex justify-between text-gray-500">
              <span>Items Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>School Pickup (Owner's Room):</span>
              <span className="font-semibold text-[#2c2221]">{formatPrice(deliveryFee)}</span>
            </div>
            {serviceFee ? (
              <div className="flex justify-between text-gray-500">
                <span>Processing & Service Fee:</span>
                <span>{formatPrice(serviceFee)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-sm font-bold text-[#2c2221] pt-2 border-t border-gray-300">
              <span>Total Paid:</span>
              <span className="text-base text-[#2c2221]">{formatPrice(order.totalNGN, order.totalUSD)}</span>
            </div>
          </div>

          {/* Official Stamp & Verification Footer */}
          <div className="border-t border-dashed border-gray-300 pt-5 flex items-center justify-between text-[11px] text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-bold text-[#2c2221] block">Official Campus Delivery Guarantee</span>
                <span>Trace-free wall mounting included with all orders.</span>
              </div>
            </div>

            <div className="text-center border border-gray-300 rounded-xl p-2 bg-[#faf5f4] font-mono text-[10px]">
              <span className="font-bold uppercase block text-[#a37068]">STORE STAMP</span>
              <span>VERIFIED DECOR</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
