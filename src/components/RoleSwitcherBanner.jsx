import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoleSwitcherBanner() {
  const { user, logout } = useAuth();

  // If unauthenticated guest, render clean security notice bar
  if (!user) {
    return (
      <div className="bg-stone-900 text-stone-300 px-4 py-1.5 text-[11px] font-bold border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-stone-400">
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          <span>Security Mode: Public Guest Menu View</span>
        </div>
        <Link
          to="/login"
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded text-[10px] font-extrabold transition"
        >
          Staff & Admin Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-900 text-stone-200 px-4 py-1.5 text-[11px] font-bold border-b border-stone-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>
          Authenticated as: <strong className="text-white">{user.name}</strong> ({user.role})
        </span>
      </div>

      <div className="flex items-center gap-3">
        {user.role === 'Superadmin' && (
          <Link to="/superadmin" className="text-amber-400 hover:underline text-[10px] font-extrabold uppercase">
            Superadmin Console
          </Link>
        )}
        {user.role === 'Admin' && (
          <Link to="/admin" className="text-emerald-400 hover:underline text-[10px] font-extrabold uppercase">
            Branch Admin Dashboard
          </Link>
        )}
        <button
          onClick={logout}
          className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 px-2.5 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 transition"
        >
          <LogOut className="w-3 h-3" /> Sign Out
        </button>
      </div>
    </div>
  );
}
