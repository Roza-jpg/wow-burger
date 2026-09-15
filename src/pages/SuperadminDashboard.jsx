import React, { useState, useEffect } from 'react';
import { Shield, Users, Utensils, Layers, Store, Plus, Edit2, Trash2, X, MessageSquare, Star } from 'lucide-react';

export default function SuperadminDashboard() {
  const [activeTab, setActiveTab] = useState('users'); // users, foods, categories, branches, reviews

  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [modalType, setModalType] = useState(null); // 'user', 'food', 'category', 'branch'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, foodsRes, catsRes, branchesRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/foods'),
        fetch('/api/categories'),
        fetch('/api/branches'),
      ]);

      const [usersData, foodsData, catsData, branchesData] = await Promise.all([
        usersRes.json(),
        foodsRes.json(),
        catsRes.json(),
        branchesRes.json(),
      ]);

      setUsers(usersData || []);
      setFoods(foodsData || []);
      setCategories(catsData || []);
      setBranches(branchesData || []);

      // Extract all reviews across foods
      let allRevs = [];
      (foodsData || []).forEach((f) => {
        if (f.reviews && f.reviews.length > 0) {
          f.reviews.forEach((r) => allRevs.push({ ...r, foodName: f.name }));
        }
      });
      setReviews(allRevs);
    } catch (err) {
      console.error('Failed fetching superadmin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      if (type === 'user') {
        setFormData({ name: '', email: '', password: 'password123', role: 'Admin', branchId: branches[0]?.id || 1 });
      } else if (type === 'food') {
        setFormData({ name: '', categoryId: categories[0]?.id || 1, price: 350, description: '', ingredients: '', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', isPopular: false });
      } else if (type === 'category') {
        setFormData({ name: '', icon: 'Hamburger', description: '' });
      } else if (type === 'branch') {
        setFormData({ name: '', location: '', phone: '', status: 'Active' });
      }
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!editingItem;
    let url = `/api/${modalType}s`;
    let method = isEdit ? 'PUT' : 'POST';

    if (isEdit) {
      url += `/${editingItem.id}`;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchData();
        closeModal();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'Operation failed'}`);
      }
    } catch (err) {
      console.error('Submit error', err);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const res = await fetch(`/api/${type}s/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(`Delete error`, err);
    }
  };

  return (
    <div className="min-h-screen pb-16 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header */}
      <div className="bg-stone-900 border-b border-stone-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-black uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" /> Superadmin Console
            </div>
            <h1 className="text-3xl font-black text-white">System Master Controls</h1>
            <p className="text-xs text-stone-400 mt-1">
              Full CRUD management over system users, food catalog, categories, branches, and customer reviews.
            </p>
          </div>

          {activeTab !== 'reviews' && (
            <button
              onClick={() => openModal(activeTab.slice(0, -1))}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/10 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New {activeTab.slice(0, -1).toUpperCase()}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-800 pb-4 mb-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
              activeTab === 'users'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border border-stone-800'
            }`}
          >
            <Users className="w-4 h-4" /> Users CRUD ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('foods')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
              activeTab === 'foods'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border border-stone-800'
            }`}
          >
            <Utensils className="w-4 h-4" /> Food Catalog CRUD ({foods.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border border-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" /> Categories CRUD ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('branches')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
              activeTab === 'branches'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border border-stone-800'
            }`}
          >
            <Store className="w-4 h-4" /> Branches CRUD ({branches.length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
              activeTab === 'reviews'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border border-stone-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Customer Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="py-20 text-center text-stone-500">Loading catalog management data...</div>
        ) : (
          <div>
            
            {/* 1. USERS CRUD TABLE */}
            {activeTab === 'users' && (
              <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400 uppercase font-extrabold tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Assigned Branch</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-200">
                    {users.map((u) => {
                      const branchObj = branches.find((b) => b.id === u.branchId);
                      return (
                        <tr key={u.id} className="hover:bg-stone-800/40">
                          <td className="p-4 font-bold text-stone-400">#{u.id}</td>
                          <td className="p-4 font-bold text-white">{u.name}</td>
                          <td className="p-4 font-mono text-stone-300">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              u.role === 'Superadmin'
                                ? 'bg-red-950 text-red-400 border border-red-800'
                                : u.role === 'Admin'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-stone-800 text-stone-300'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-stone-300">
                            {branchObj ? branchObj.name : u.role === 'Admin' ? `Branch #${u.branchId}` : 'N/A'}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => openModal('user', u)}
                              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete('user', u.id)}
                              className="p-1.5 bg-stone-800 hover:bg-red-950 text-red-400 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. FOODS CRUD TABLE */}
            {activeTab === 'foods' && (
              <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400 uppercase font-extrabold tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Popular</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-200">
                    {foods.map((f) => {
                      const cat = categories.find((c) => c.id === f.categoryId);
                      return (
                        <tr key={f.id} className="hover:bg-stone-800/40">
                          <td className="p-4 flex items-center gap-3">
                            <img src={f.image} alt={f.name} className="w-10 h-10 object-cover rounded-lg bg-stone-950" />
                            <div>
                              <div className="font-bold text-white">{f.name}</div>
                              <div className="text-[10px] text-stone-400 line-clamp-1">{f.description}</div>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-stone-300">{cat ? cat.name : 'Unknown'}</td>
                          <td className="p-4 font-black text-amber-500">{f.price} ETB</td>
                          <td className="p-4">
                            {f.isPopular ? (
                              <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold">YES</span>
                            ) : (
                              <span className="text-stone-500">NO</span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => openModal('food', f)}
                              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete('food', f.id)}
                              className="p-1.5 bg-stone-800 hover:bg-red-950 text-red-400 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. CATEGORIES CRUD TABLE */}
            {activeTab === 'categories' && (
              <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400 uppercase font-extrabold tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Category Name</th>
                      <th className="p-4">Icon Symbol</th>
                      <th className="p-4">Description</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-200">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-stone-800/40">
                        <td className="p-4 font-bold text-stone-400">#{c.id}</td>
                        <td className="p-4 font-extrabold text-white">{c.name}</td>
                        <td className="p-4 font-mono text-amber-400">{c.icon}</td>
                        <td className="p-4 text-stone-300">{c.description}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => openModal('category', c)}
                            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete('category', c.id)}
                            className="p-1.5 bg-stone-800 hover:bg-red-950 text-red-400 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 4. BRANCHES CRUD TABLE */}
            {activeTab === 'branches' && (
              <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400 uppercase font-extrabold tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Branch Name</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-200">
                    {branches.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-800/40">
                        <td className="p-4 font-bold text-stone-400">#{b.id}</td>
                        <td className="p-4 font-extrabold text-white">{b.name}</td>
                        <td className="p-4 text-stone-300">{b.location}</td>
                        <td className="p-4 font-mono text-stone-400">{b.phone}</td>
                        <td className="p-4">
                          <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => openModal('branch', b)}
                            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-lg"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete('branch', b.id)}
                            className="p-1.5 bg-stone-800 hover:bg-red-950 text-red-400 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 5. CUSTOMER REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400 uppercase font-extrabold tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Dish</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Comment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-200">
                    {reviews.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-stone-500 font-bold">
                          No customer reviews submitted yet.
                        </td>
                      </tr>
                    ) : (
                      reviews.map((r) => (
                        <tr key={r.id} className="hover:bg-stone-800/40">
                          <td className="p-4 font-mono text-stone-400">{r.date}</td>
                          <td className="p-4 font-extrabold text-amber-400">{r.foodName || `Dish #${r.foodId}`}</td>
                          <td className="p-4 font-bold text-white">{r.author}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {[...Array(r.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-stone-300">{r.comment}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

      </main>

      {/* CRUD MODAL DIALOG */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            
            <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                {editingItem ? `Edit ${modalType}` : `Create New ${modalType}`}
              </h3>
              <button onClick={closeModal} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              
              {/* USER FORM */}
              {modalType === 'user' && (
                <>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Password</label>
                    <input
                      type="text"
                      required
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Role</label>
                    <select
                      value={formData.role || 'Admin'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    >
                      <option value="Superadmin">Superadmin</option>
                      <option value="Admin">Admin (Branch Manager)</option>
                      <option value="Client">Client</option>
                    </select>
                  </div>
                  {formData.role === 'Admin' && (
                    <div>
                      <label className="block text-stone-400 mb-1 font-bold">Assigned Branch</label>
                      <select
                        value={formData.branchId || branches[0]?.id || 1}
                        onChange={(e) => setFormData({ ...formData, branchId: Number(e.target.value) })}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                      >
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* FOOD FORM */}
              {modalType === 'food' && (
                <>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Food Title</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Category</label>
                    <select
                      value={formData.categoryId || categories[0]?.id || 1}
                      onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Price (ETB)</label>
                    <input
                      type="number"
                      required
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white font-black"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Image URL</label>
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Description</label>
                    <textarea
                      rows="2"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Ingredients</label>
                    <input
                      type="text"
                      value={formData.ingredients || ''}
                      onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPopular"
                      checked={!!formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <label htmlFor="isPopular" className="text-stone-300 font-bold">Mark as Popular</label>
                  </div>
                </>
              )}

              {/* CATEGORY FORM */}
              {modalType === 'category' && (
                <>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Category Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Icon Name</label>
                    <input
                      type="text"
                      value={formData.icon || 'Hamburger'}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Description</label>
                    <input
                      type="text"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </>
              )}

              {/* BRANCH FORM */}
              {modalType === 'branch' && (
                <>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Branch Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Location Address</label>
                    <input
                      type="text"
                      required
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">Phone Contact</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-extrabold shadow"
                >
                  Save {modalType}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
