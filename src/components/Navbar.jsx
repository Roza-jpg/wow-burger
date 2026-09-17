import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Store, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout, cart, setIsCartOpen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { branchId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(branchId || '1');

  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    fetch('/api/branches')
      .then((res) => res.json())
      .then((data) => setBranches(data))
      .catch((err) => console.error('Failed loading branches', err));

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed loading categories', err));
  }, []);

  useEffect(() => {
    if (branchId) {
      setSelectedBranchId(branchId);
    }
  }, [branchId]);

  const handleBranchChange = (e) => {
    const newBranchId = e.target.value;
    setSelectedBranchId(newBranchId);
    navigate(`/branch/${newBranchId}`);
  };

  const handleCategoryClick = (catId) => {
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: String(catId) });
    }
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isHomePage = location.pathname.startsWith('/branch');

  const handleLogoError = (e) => {
    e.target.onerror = null;
    e.target.src = '/images/Wow burger logo.png';
  };

  return (
    <header className="sticky top-0 z-40 shadow-md font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. RED TOP HEADER BAR matching exact website inspect HTML */}
      <div className="bg-[#d32f2f] text-white px-2 sm:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        
        {/* Left: Official WOW Burger Logo Image & Title using exact HTML inspect code */}
        <Link to={`/branch/${selectedBranchId}`} className="flex items-center gap-1 sm:gap-3 group shrink-0">
          <img 
            src="/images/Wow burger logo.png" 
            alt="logo" 
            width="100" 
            height="100" 
            onError={handleLogoError}
            className="rounded-lg w-16 h-16 sm:w-[100px] sm:h-[100px]"
          />

          
          <span className="hidden sm:inline font-black text-xl sm:text-2xl tracking-tight text-white uppercase">
            WOW BURGER
          </span>
        </Link>

        {/* Right: Header Navigation Links (Home, About, Login, Branch Selector, Cart) */}
        <div className="flex items-center gap-2 sm:gap-6 font-bold text-xs sm:text-sm">
          
          {/* Home Link */}
          <Link
            to={`/branch/${selectedBranchId}`}
            className={`transition py-1 text-[11px] sm:text-sm ${
              isHomePage
                ? 'text-white border-b-2 border-white font-extrabold'
                : 'text-red-100 hover:text-white'
            }`}
          >
            Home
          </Link>

          {/* About Link */}
          <a
            href="#about"
            className="text-red-100 hover:text-white transition hidden sm:inline"
          >
            About
          </a>

          {/* Login / Logout Link */}
          {user && user.role !== 'Client' ? (
            <button
              onClick={logout}
              className="text-red-100 hover:text-white font-bold"
            >
              Logout ({user.role})
            </button>
          ) : (
            <Link
              to="/login"
              className="text-red-100 hover:text-white font-extrabold text-[11px] sm:text-sm"
            >
              Login
            </Link>
          )}

          {/* Branch Selector Dropdown */}
          <div className="flex items-center gap-1 bg-red-800/80 border border-red-700 px-2.5 py-1 rounded-lg text-white">
            <Store className="w-3.5 h-3.5 text-amber-300" />
            <select
              value={selectedBranchId}
              onChange={handleBranchChange}
              className="bg-transparent text-[10px] sm:text-xs font-bold text-white focus:outline-none cursor-pointer w-[70px] sm:w-auto"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-stone-900 text-stone-100">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Role Dashboards if logged in */}
          {user?.role === 'Superadmin' && (
            <Link
              to="/superadmin"
              className="px-2.5 py-1 rounded bg-stone-950 text-amber-400 font-bold text-xs flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" /> Superadmin
            </Link>
          )}

          {user?.role === 'Admin' && (
            <Link
              to="/admin"
              className="px-2.5 py-1 rounded bg-stone-950 text-amber-400 font-bold text-xs flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" /> Admin
            </Link>
          )}

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-amber-400 hover:bg-amber-300 text-stone-950 px-2 py-1 rounded-lg font-extrabold text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 shadow"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalCartItems > 0 && (
              <span className="bg-red-700 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* 2. YELLOW CATEGORY NAVIGATION BAR matching exact website */}
      <div className="bg-[#fbc02d] border-t border-amber-500 shadow-inner px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-amber-600">
        <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-6 h-11 text-stone-900 font-extrabold text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap">
          {categories.map((cat) => {
            const isSelected =
              (activeCategory === 'all' && cat.name === 'All') ||
              String(activeCategory) === String(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name === 'All' ? 'all' : cat.id)}
                className={`h-full flex items-center px-1.5 border-b-4 transition-all ${
                  isSelected
                    ? 'border-stone-950 text-stone-950 font-black'
                    : 'border-transparent text-stone-800 hover:text-stone-950'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
