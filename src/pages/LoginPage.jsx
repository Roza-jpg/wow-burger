import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Shield, Store, User, ArrowRight, Lock, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Security message if redirected from protected route
  const securityMessage = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      if (res.user.role === 'Superadmin') {
        navigate('/superadmin');
      } else if (res.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate(`/branch/${res.user.branchId || 1}`);
      }
    } else {
      setError(res.message || 'Invalid authentication credentials');
    }
  };

  const quickLogin = async (presetEmail, presetPassword) => {
    setEmail(presetEmail);
    setPassword(presetPassword);
    setLoading(true);
    const res = await login(presetEmail, presetPassword);
    setLoading(false);
    if (res.success && res.user) {
      if (res.user.role === 'Superadmin') {
        navigate('/superadmin');
      } else if (res.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate(`/branch/${res.user.branchId || 1}`);
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-stone-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-md w-full space-y-6 bg-stone-900 p-8 rounded-3xl border border-stone-800 shadow-2xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <Lock className="w-7 h-7 text-stone-950 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">SYSTEM SECURE LOGIN</h2>
          <p className="text-xs text-stone-400 mt-1">
            Authenticate to access Admin or Superadmin consoles
          </p>
        </div>

        {/* Security Alert if unauthorized attempt */}
        {securityMessage && (
          <div className="bg-amber-950/80 border border-amber-800 text-amber-300 p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>{securityMessage}</span>
          </div>
        )}

        {/* Auth Error Notice */}
        {error && (
          <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-2xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-400 font-bold mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="user@wowburger.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-stone-400 font-bold mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95 disabled:opacity-50 text-xs uppercase tracking-wide"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        {/* Test Accounts Reference */}
        <div className="pt-5 border-t border-stone-800">
          <span className="text-[10px] uppercase font-extrabold text-stone-500 block mb-3 text-center tracking-wider">
            Authorised System Credentials
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => quickLogin('superadmin@wowburger.com', 'password123')}
              className="bg-stone-950 hover:bg-stone-800 border border-stone-800 p-2.5 rounded-xl text-left transition group"
            >
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                <Shield className="w-3.5 h-3.5" /> Superadmin
              </div>
              <div className="text-[10px] text-stone-500 truncate mt-0.5">superadmin@wowburger.com</div>
            </button>

            <button
              onClick={() => quickLogin('admin.bole@wowburger.com', 'password123')}
              className="bg-stone-950 hover:bg-stone-800 border border-stone-800 p-2.5 rounded-xl text-left transition group"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <Store className="w-3.5 h-3.5" /> Admin Bole
              </div>
              <div className="text-[10px] text-stone-500 truncate mt-0.5">admin.bole@wowburger.com</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
