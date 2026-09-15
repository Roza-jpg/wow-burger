import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FoodCard({ food, categoryName, isAdminView = false, onToggleActive = null }) {
  const { addToCart } = useAuth();
  const navigate = useNavigate();
  const { branchId = '1' } = useParams();

  const handleViewDish = () => {
    navigate(`/branch/${branchId}/dish/${food.id}`);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
  };

  return (
    <div className={`bg-white rounded-[1.75rem] p-4 shadow-sm border border-slate-100 transition-all duration-200 flex flex-col justify-between items-center text-center relative ${
      food.active === false ? 'opacity-50 border-red-300' : 'hover:shadow-lg hover:scale-[1.01]'
    }`}>
      
      {/* 4:3 Aspect Ratio Image Container matching screenshot exactly */}
      <div 
        onClick={handleViewDish}
        className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 cursor-pointer relative group mb-3"
      >
        <img
          src={food.image}
          alt={food.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Admin Visibility Tag */}
        {isAdminView && (
          <div className="absolute top-2 right-2 z-10">
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 border shadow ${
              food.active !== false 
                ? 'bg-emerald-600 text-white border-emerald-500' 
                : 'bg-red-600 text-white border-red-500'
            }`}>
              {food.active !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {food.active !== false ? 'ACTIVE' : 'HIDDEN'}
            </span>
          </div>
        )}
      </div>

      {/* Food Title (Uppercase, bold, black font matching exact screenshot) */}
      <div className="w-full px-1">
        <h3 
          onClick={handleViewDish}
          className="text-stone-900 font-black text-xs sm:text-sm uppercase tracking-tight line-clamp-2 min-h-[2.25rem] flex items-center justify-center cursor-pointer hover:text-red-600 transition"
        >
          {food.name}
        </h3>

        {/* Price (Red, Bold, formatted as '781.74 Birr' matching exact screenshot) */}
        <div className="text-red-600 font-extrabold text-sm sm:text-base mt-1 mb-3">
          {food.price} Birr
        </div>
      </div>

      {/* Action Button: Royal Blue Pill Button 'View' matching exact screenshot */}
      <div className="w-full">
        {isAdminView ? (
          <button
            onClick={() => onToggleActive && onToggleActive(food.id)}
            className={`w-full py-2 px-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 shadow ${
              food.active !== false
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {food.active !== false ? (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Hide Item
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Activate Item
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleViewDish}
            className="w-full bg-[#1d4ed8] hover:bg-blue-800 text-white font-extrabold py-2.5 px-6 rounded-full text-xs sm:text-sm transition shadow active:scale-95"
          >
            View
          </button>
        )}
      </div>

    </div>
  );
}
