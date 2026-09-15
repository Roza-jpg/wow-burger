import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Star, Plus, Minus, Check, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function DishDetailPage() {
  const { branchId = '1', foodId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useAuth();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (foodId) {
      setLoading(true);
      fetch(`/api/foods/${foodId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Not found via ID route');
          return res.json();
        })
        .then((data) => {
          setFood(data);
          setReviews(data.reviews || []);
          setLoading(false);
        })
        .catch(() => {
          fetch('/api/foods')
            .then((res) => res.json())
            .then((allFoods) => {
              const matched = allFoods.find((f) => String(f.id) === String(foodId));
              if (matched) {
                setFood(matched);
                setReviews(matched.reviews || []);
              }
              setLoading(false);
            })
            .catch((err) => {
              console.error('Failed fallback fetch', err);
              setLoading(false);
            });
        });
    }
  }, [foodId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#dce1e7] flex items-center justify-center py-20 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="text-center font-bold text-stone-600">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading dish details...
        </div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-[#dce1e7] flex flex-col items-center justify-center py-20 px-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <h2 className="text-2xl font-black text-stone-800 mb-2">Dish Not Found</h2>
        <p className="text-xs text-stone-500 mb-4">Item ID #{foodId} could not be retrieved.</p>
        <Link
          to={`/branch/${branchId}`}
          className="bg-red-600 text-white font-extrabold px-6 py-2.5 rounded-full text-xs shadow hover:bg-red-700 transition"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

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

    const authorName = newAuthor.trim() || 'Valued Customer';
    const commentText = newComment.trim();

    const optimisticReview = {
      id: Date.now(),
      foodId: food.id,
      author: authorName,
      rating: newRating,
      comment: commentText,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews((prev) => [optimisticReview, ...prev]);
    setNewComment('');
    setNewAuthor('');
    setNewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 5000);

    setSubmittingReview(true);
    try {
      await fetch(`/api/foods/${food.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: authorName,
          rating: newRating,
          comment: commentText,
        }),
      });
    } catch (err) {
      console.error('Failed persisting review to server', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
  };

  return (
    <div className="min-h-screen bg-[#dce1e7] text-stone-900 pb-16 font-['Plus_Jakarta_Sans',sans-serif]">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Back to Menu Button */}
        <button
          onClick={() => navigate(`/branch/${branchId}`)}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-stone-700 hover:text-stone-950 bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full shadow-sm border border-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4 text-red-600" />
          <span>Back to Menu</span>
        </button>

        {/* Dish Detail Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Dish Image */}
          <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
            <img
              src={food.image}
              alt={food.name}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dish Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 uppercase tracking-tight">
              {food.name}
            </h1>
          </div>

          {/* Description Section */}
          <div className="space-y-1.5 border-t border-slate-100 pt-4">
            <h2 className="text-base font-extrabold text-stone-900">Description</h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              {food.description || 'botteled coca cola sprite fanta (300ml)'}
            </p>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-1.5 border-t border-slate-100 pt-4">
            <h2 className="text-base font-extrabold text-stone-900">Ingredients</h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              {food.ingredients || 'Bottled carbonated beverage (Coca-Cola, Sprite, Fanta 300ml)'}
            </p>
          </div>

          {/* Price & Quantity Controls */}
          <div className="border-t border-slate-100 pt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase block">Price</span>
              <span className="text-2xl font-black text-red-600">
                {(food.price * quantity).toFixed(2)} <span className="text-sm font-extrabold text-stone-700">ETB</span>
              </span>
            </div>

            {/* Quantity Controls: − 1 + */}
            <div className="flex items-center gap-3 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-stone-800 hover:bg-slate-200 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-black text-base w-6 text-center text-stone-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-stone-800 hover:bg-slate-200 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Order button */}
            <button
              onClick={handleAddToCart}
              className={`px-6 py-3 rounded-full font-extrabold text-sm flex items-center gap-2 transition shadow-md ${
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
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-600" />
                Customer Reviews
              </h2>
              <span className="text-xs font-bold text-stone-500">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            {/* PROMINENT SUCCESS BANNER */}
            {reviewSuccess && (
              <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-extrabold shadow-lg animate-bounce">
                <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0" />
                <span>Comment sent successfully!</span>
              </div>
            )}

            {/* Review List */}
            {reviews.length > 0 && (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-stone-900">{r.author}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{r.comment}</p>
                    <span className="text-[10px] text-stone-400 block">{r.date}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Review Form */}
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

              {/* Submit button & inline banner notice */}
              <div className="flex items-center justify-between pt-1">
                {reviewSuccess ? (
                  <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Comment sent successfully!
                  </span>
                ) : (
                  <span />
                )}

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit</span>
                </button>
              </div>
            </form>

          </div>

        </div>
      </main>
    </div>
  );
}
