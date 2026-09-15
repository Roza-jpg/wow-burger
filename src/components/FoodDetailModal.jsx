import React, { useState, useEffect } from 'react';
import { X, Star, Plus, Minus, Check, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FoodDetailModal({ food, categoryName, onClose }) {
  const { addToCart } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (food?.id) {
      fetch(`/api/foods/${food.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.reviews) {
            setReviews(data.reviews);
          }
        })
        .catch((err) => console.error('Failed fetching reviews', err));
    }
  }, [food?.id]);

  if (!food) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(food);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/foods/${food.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: newAuthor.trim() || 'Valued Customer',
          rating: newRating,
          comment: newComment.trim(),
        }),
      });

      if (res.ok) {
        const addedReview = await res.json();
        setReviews((prev) => [addedReview, ...prev]);
        setNewComment('');
        setNewAuthor('');
        setNewRating(5);
      }
    } catch (err) {
      console.error('Failed submitting review', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-stone-900 font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-stone-900/80 hover:bg-stone-900 text-white p-2 rounded-full backdrop-blur-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-60 w-full bg-slate-100">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          {categoryName && (
            <span className="absolute bottom-3 left-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
              {categoryName}
            </span>
          )}
        </div>

        {/* Dish Title */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tight">
              {food.name}
            </h2>
          </div>

          {/* Description Section */}
          <div className="space-y-1.5 border-t border-slate-100 pt-4">
            <h3 className="text-base font-extrabold text-stone-900">Description</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {food.description || 'Delightful WOW Burger dish prepared fresh on order.'}
            </p>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-1.5 border-t border-slate-100 pt-4">
            <h3 className="text-base font-extrabold text-stone-900">Ingredients</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {food.ingredients || 'High quality fresh local ingredients, signature spices & sauces.'}
            </p>
          </div>

          {/* Price & Quantity Controls */}
          <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-stone-500 uppercase block">Price</span>
              <span className="text-2xl font-black text-red-600">
                {(food.price * quantity).toFixed(2)} <span className="text-sm font-extrabold text-stone-700">ETB</span>
              </span>
            </div>

            {/* Quantity Controls − 1 + */}
            <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-stone-700 hover:bg-slate-200 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-black text-base w-6 text-center text-stone-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-stone-700 hover:bg-slate-200 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Order button */}
            <button
              onClick={handleAddToCart}
              className={`px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 transition shadow-md ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1d4ed8] hover:bg-blue-800 text-white active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Order!
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" /> Add to Order
                </>
              )}
            </button>
          </div>

          {/* Customer Reviews Section */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-600" />
                Customer Reviews
              </h3>
              <span className="text-xs font-bold text-stone-500">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            {/* Review List */}
            {reviews.length > 0 && (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-stone-900">{r.author}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600">{r.comment}</p>
                    <span className="text-[10px] text-stone-400 block">{r.date}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Leave a Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-slate-100 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-extrabold text-stone-800">Write a Customer Review</div>
              
              {/* Star Rating Picker */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-stone-500 mr-2 font-bold">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Author name input */}
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              {/* Comment text area */}
              <textarea
                rows="2"
                placeholder="Write your review here..."
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              {/* Submit button matching exact prompt requirement */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 shadow transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReview ? 'Submitting...' : 'Submit'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
