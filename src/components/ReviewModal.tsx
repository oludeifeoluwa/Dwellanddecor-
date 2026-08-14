import React, { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ReviewModal: React.FC = () => {
  const { isReviewModalOpen, setIsReviewModalOpen, selectedProduct, addReview } = useShop();

  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  if (!isReviewModalOpen || !selectedProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !title || !comment) return;

    addReview({
      productId: selectedProduct.id,
      userName,
      rating,
      title,
      comment,
      verifiedPurchase: true
    });

    setUserName('');
    setTitle('');
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-4 animate-scale-up">
        
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-bold font-serif text-base text-[#2c2221]">Write a Review</h3>
            <span className="text-xs text-[#8c7470]">{selectedProduct.name}</span>
          </div>
          <button 
            onClick={() => setIsReviewModalOpen(false)}
            className="p-1 rounded-full text-gray-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Star rating selector */}
          <div className="space-y-1">
            <label className="font-bold text-[#a37068] uppercase text-[10px]">Your Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition"
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#a37068] uppercase text-[10px]">Your Name / Handle</label>
            <input
              type="text"
              placeholder="e.g. Amina B."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium focus:outline-none focus:border-[#f09a8e]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#a37068] uppercase text-[10px]">Review Headline</label>
            <input
              type="text"
              placeholder="e.g. Transformed my dorm study desk!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium focus:outline-none focus:border-[#f09a8e]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#a37068] uppercase text-[10px]">Review Comments</label>
            <textarea
              placeholder="Describe wall adhesion, lighting effect, or desk organization..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2.5 bg-[#faf5f4] border border-[#ebdcd8] rounded-xl font-medium h-24 focus:outline-none focus:border-[#f09a8e]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2c2221] hover:bg-[#3d302f] text-white py-3 rounded-full font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-[#f09a8e]" />
            <span>Submit Verified Student Review</span>
          </button>

        </form>

      </div>
    </div>
  );
};
