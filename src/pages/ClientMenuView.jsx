import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import { Utensils } from 'lucide-react';

export default function ClientMenuView() {
  const { branchId = '1' } = useParams();
  const [searchParams] = useSearchParams();

  const [branch, setBranch] = useState(null);
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    setLoading(true);
    fetch(`/api/branch/${branchId}/menu`)
      .then((res) => res.json())
      .then((data) => {
        setBranch(data.branch);
        setCategories(data.categories || []);
        setFoods(data.foods || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching menu', err);
        setLoading(false);
      });
  }, [branchId]);

  // Filter foods by activeCategory and searchQuery
  const filteredFoods = foods.filter((f) => {
    const matchesCategory =
      activeCategory === 'all' || f.categoryId === Number(activeCategory);
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#dce1e7] text-stone-900 pb-16 font-['Plus_Jakarta_Sans',sans-serif]">

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Banner Pill Boxes matching exact screenshot */}
        <div className="space-y-3 mb-5 max-w-4xl mx-auto">
          {/* Banner 1: Digital Menu */}
          <div className="bg-white rounded-2xl py-3 px-8 text-center shadow-sm border border-slate-200">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#005b52] tracking-tight">
              Digital Menu
            </h1>
          </div>

          {/* Banner 2: All prices exclude 15% VAT */}
          <div className="bg-white rounded-2xl py-2 px-6 text-center shadow-sm border border-slate-200">
            <p className="text-sm sm:text-base font-bold text-[#005b52]">
              All prices exclude 15% VAT
            </p>
          </div>
        </div>

        {/* Search Input Box with blue outline matching exact screenshot */}
        <div className="max-w-xs sm:max-w-sm mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-blue-500 rounded-xl py-2 px-4 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm transition"
            />
          </div>
        </div>

        {/* Food Items Grid (5 columns desktop matching exact screenshot) */}
        {loading ? (
          <div className="py-20 text-center text-stone-500 font-bold">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading menu items...
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-md mx-auto">
            <Utensils className="w-12 h-12 text-stone-400 mx-auto mb-3 stroke-1" />
            <h3 className="text-base font-bold text-stone-700">No food items found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              No items match your selected category or search term for this branch.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
            {filteredFoods.map((food) => {
              const cat = categories.find((c) => c.id === food.categoryId);
              return (
                <FoodCard
                  key={food.id}
                  food={food}
                  categoryName={cat ? cat.name : ''}
                />
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
