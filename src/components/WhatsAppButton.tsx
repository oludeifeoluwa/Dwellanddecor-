import React, { useState } from 'react';
import { MessageSquare, X, Palette, Send, GraduationCap } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WhatsAppButton: React.FC = () => {
  const { whatsappNumber } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [customRequest, setCustomRequest] = useState('');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultText = customRequest || 'Hello! I would like to place a custom room decor order for my campus room.';
    const encodedText = encodeURIComponent(`Hi Dwell & Decor Owner! ${defaultText}`);
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
    window.open(waUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 print:hidden">
      
      {/* Expanded Custom Order Tooltip / Quick Form */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-3xl shadow-2xl border border-[#ebdcd8] overflow-hidden animate-scale-up text-xs">
          {/* Header */}
          <div className="bg-[#128C7E] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                💬
              </div>
              <div>
                <h4 className="font-bold text-sm">Store Owner WhatsApp</h4>
                <p className="text-[10px] text-emerald-100">Custom Decor & Custom Orders</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSendWhatsApp} className="p-4 space-y-3 bg-[#f7f5f3]">
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-800 text-[11px] leading-relaxed">
              <span className="font-bold block">Custom Orders Available!</span>
              Want a custom LED neon name, custom mirror shape, or special photo clip lengths for your hostel room? Chat directly with the store owner.
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#a37068] text-[10px] uppercase">Your Custom Order Note</label>
              <textarea
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                placeholder="e.g. I need a custom LED neon sign with the name 'Aisha's Haven' for Queen Elizabeth Hall..."
                rows={3}
                className="w-full p-2.5 bg-white border border-[#ebdcd8] rounded-xl text-xs focus:outline-none focus:border-[#128C7E]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#128C7E] hover:bg-[#0e7065] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Chat with Owner on WhatsApp</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold p-3.5 rounded-full shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 group border-2 border-white"
        title="Custom Orders on WhatsApp"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
       {/* <span className="text-xs font-bold hidden sm:inline-block"></span>*/}
      </button>

    </div>
  );
};
