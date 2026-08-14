import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  X, 
  CreditCard, 
  Building2, 
  PhoneCall, 
  Copy, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Loader2,
  Palette,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const PaystackModal: React.FC = () => {
  const { 
    isPaystackOpen, 
    setIsPaystackOpen, 
    pendingCheckoutOrder, 
    handlePaystackPaymentSuccess, 
    formatPrice,
    showToast 
  } = useShop();

  const [paymentChannel, setPaymentChannel] = useState<'card' | 'bank' | 'ussd'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // States for verification flows
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [virtualAccountCopied, setVirtualAccountCopied] = useState(false);

  if (!isPaystackOpen || !pendingCheckoutOrder) return null;

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpScreen(true);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      handlePaystackPaymentSuccess(pendingCheckoutOrder.paystackRef);
    }, 1500);
  };

  const handleSimulateBankTransferSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      handlePaystackPaymentSuccess(pendingCheckoutOrder.paystackRef);
    }, 1500);
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText('9928174621');
    setVirtualAccountCopied(true);
    showToast('Virtual account number copied!');
    setTimeout(() => setVirtualAccountCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col animate-scale-up">
        
        {/* Paystack Official Header */}
        <div className="bg-[#092c4c] text-white p-5 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
              P
            </div>
            <div>
              <span className="text-xs text-gray-300 font-medium block leading-none">Paystack Checkout</span>
              <h3 className="font-bold text-sm text-white mt-0.5">Dwell & Decor</h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-300 block">Amount Due</span>
            <span className="text-base font-bold text-emerald-400 font-serif">
              {formatPrice(pendingCheckoutOrder.totalNGN, pendingCheckoutOrder.totalUSD)}
            </span>
          </div>

          <button 
            onClick={() => setIsPaystackOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Info Bar */}
        <div className="bg-[#f0f4f8] px-5 py-2 text-xs font-medium text-[#092c4c] flex justify-between items-center border-b border-gray-200">
          <span>{pendingCheckoutOrder.customer.email}</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
            Ref: {pendingCheckoutOrder.paystackRef}
          </span>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 space-y-5 flex-1">

          {showOtpScreen ? (
            /* 3D Secure Bank OTP Verification Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-bold text-base text-[#092c4c]">3D-Secure Bank Authorization</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-digit verification code sent via SMS to {pendingCheckoutOrder.customer.phone}
                </p>
              </div>

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest font-mono text-xl font-bold p-3 border-2 border-emerald-500 rounded-2xl focus:outline-none bg-emerald-50/30 text-[#092c4c]"
                />
              </div>

              <p className="text-[11px] text-gray-400">
                A verification code is required to complete this transaction.
              </p>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying with Issuing Bank...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize Payment ({formatPrice(pendingCheckoutOrder.totalNGN)})</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <>
              {/* Payment Channel Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-2xl text-xs font-bold text-[#092c4c]">
                <button
                  type="button"
                  onClick={() => setPaymentChannel('card')}
                  className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    paymentChannel === 'card' ? 'bg-white shadow-xs text-emerald-600' : 'text-gray-500'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentChannel('bank')}
                  className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    paymentChannel === 'bank' ? 'bg-white shadow-xs text-emerald-600' : 'text-gray-500'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentChannel('ussd')}
                  className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    paymentChannel === 'ussd' ? 'bg-white shadow-xs text-emerald-600' : 'text-gray-500'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>USSD</span>
                </button>
              </div>

              {/* CARD PAYMENT CHANNEL */}
              {paymentChannel === 'card' && (
                <form onSubmit={handleCardSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-gray-500">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4084 0000 0000 1234"
                      className="w-full p-3 border border-gray-200 rounded-xl font-mono text-xs font-bold text-[#092c4c] focus:outline-none focus:border-emerald-500 bg-gray-50/50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-gray-500">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-200 rounded-xl font-mono text-xs font-bold text-[#092c4c] focus:outline-none focus:border-emerald-500 bg-gray-50/50"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-gray-500">CVV</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full p-3 border border-gray-200 rounded-xl font-mono text-xs font-bold text-[#092c4c] focus:outline-none focus:border-emerald-500 bg-gray-50/50"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#092c4c] hover:bg-[#072038] text-white py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting to Paystack Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pay {formatPrice(pendingCheckoutOrder.totalNGN)} Now</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* BANK TRANSFER CHANNEL */}
              {paymentChannel === 'bank' && (
                <div className="space-y-4 text-center">
                  <div className="bg-[#f0f7ff] p-4 rounded-2xl border border-blue-100 space-y-2 text-xs">
                    <span className="text-[11px] text-gray-500 uppercase font-bold block">
                      Paystack Virtual Bank Account
                    </span>
                    
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-2xl font-extrabold text-[#092c4c]">9928174621</span>
                      <button 
                        onClick={copyAccountNumber}
                        className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:text-emerald-600 transition"
                        title="Copy Account Number"
                      >
                        {virtualAccountCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="text-[11px] font-semibold text-[#092c4c]">
                      Bank Name: <strong className="text-blue-700">Wema Bank / Paystack</strong>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Account Name: Paystack - Dwell & Decor
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Account expires in 29:50 minutes</span>
                  </div>

                  <button
                    onClick={handleSimulateBankTransferSuccess}
                    disabled={isProcessing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Bank Credit Notification...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>I Have Sent the Payment ({formatPrice(pendingCheckoutOrder.totalNGN)})</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* USSD CHANNEL */}
              {paymentChannel === 'ussd' && (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-gray-600">
                    Select your bank to generate instant USSD payment string:
                  </p>

                  <div className="space-y-2 text-xs font-mono font-bold text-[#092c4c]">
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 flex justify-between items-center">
                      <span>GTBank (*737*)</span>
                      <span className="text-emerald-600">*737*000*9928174621#</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 flex justify-between items-center">
                      <span>Zenith Bank (*966*)</span>
                      <span className="text-emerald-600">*966*000*9928174621#</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulateBankTransferSuccess}
                    disabled={isProcessing}
                    className="w-full bg-[#092c4c] hover:bg-[#072038] text-white py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Complete USSD Payment</span>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer Security Badge */}
        <div className="bg-gray-50 p-3 text-center text-[10px] text-gray-400 border-t border-gray-100 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-500" />
          <span>256-Bit Bank Grade Encryption • Paystack Verified Gateway</span>
        </div>

      </div>
    </div>
  );
};
