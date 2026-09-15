import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FoodCard from '../components/FoodCard';
import { Store, Eye, EyeOff, Search, Layers, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const branchId = user?.branchId || 1;

  const [branch, setBranch] = useState(null);
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBranchFoods = () => {
    setLoading(true);
    fetch(`/api/branches/${branchId}/foods`)
      .then((res) => res.json())
      .then((data) => {
        setBranch(data.branch);
        setCategories(data.categories || []);
        setFoods(data.foods || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching admin branch data', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBranchFoods();
  }, [branchId]);

  const handleToggleActive = async (foodId) => {
    setUpdatingId(foodId);
    try {
      const res = await fetch(`/api/branches/${branchId}/foods/${foodId}/toggle`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setFoods((prev) =>
          prev.map((f) => (f.id === foodId ? { ...f, active: data.active } : f))
        );
      }
    } catch (err) {
      console.error('Failed to toggle food status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const activeCount = foods.filter((f) => f.active !== false).length;
  const hiddenCount = foods.length - activeCount;

  const filteredFoods = foods.filter((f) => {
    const matchesCategory = selectedCategory === 'all' || f.categoryId === Number(selectedCategory);
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-16">
      
      {/* Header */}
      <div className="bg-stone-900 border-b border-stone-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-black uppercase tracking-wider mb-1">
              <Store className="w-4 h-4" /> Branch Admin Panel
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {branch ? branch.name : `Branch #${branchId}`}
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Manage food item visibility and availability for your branch.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3">
            <div className="bg-stone-950 px-4 py-2 rounded-xl border border-stone-800 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Total Foods</span>
              <span className="text-lg font-black text-white">{foods.length}</span>
            </div>
            <div className="bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-800/80 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Active</span>
              <span className="text-lg font-black text-emerald-300">{activeCount}</span>
            </div>
            <div className="bg-red-950/60 px-4 py-2 rounded-xl border border-red-800/80 text-center">
              <span className="text-[10px] uppercase font-bold text-red-400 block">Hidden</span>
              <span className="text-lg font-black text-red-300">{hiddenCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
              }`}
            >
              All Categories ({foods.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(String(cat.id))}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                  selectedCategory === String(cat.id)
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

        </div>

        {/* Instructions Alert */}
        <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-200 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-amber-400">Branch Food Visibility Controls:</span>
            Toggling a food item to <strong>Hidden</strong> will immediately remove it from your branch's customer menu (`/branch/${branchId}`), while keeping it in the master catalog.
          </div>
        </div>

        {/* Foods Grid */}
        {loading ? (
          <div className="py-20 text-center text-stone-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
            Loading branch catalog...
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="py-16 text-center bg-stone-900/40 rounded-3xl border border-stone-800">
            <p className="text-stone-400 font-bold text-sm">No food items found matching criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => {
              const cat = categories.find((c) => c.id === food.categoryId);
              return (
                <FoodCard
                  key={food.id}
                  food={food}
                  categoryName={cat ? cat.name : ''}
                  isAdminView={true}
                  onToggleActive={handleToggleActive}
                />
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
