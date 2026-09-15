import React from 'react';
import { Phone, Mail, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top 3 Columns: About, Contact Us, Follow Us */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About Section */}
          <div>
            <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-3">
              About
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Wow Burger is a local fast-food restaurant chain in Addis Ababa serving burgers, fries, chicken wraps, pizza, and other casual American-style fast food. It has multiple branches across the city, each known for its laid-back vibe and affordable quick bites. Several locations open daily and many operate long hours, making them a convenient stop for lunch or dinner.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-3">
              Contact Us
            </h3>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                <a href="mailto:wowburgeret@gmail.com" className="hover:text-white transition">
                  wowburgeret@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 font-mono">
                  <a href="tel:+251911634938" className="hover:text-white transition">+251 91 163 4938</a>
                  <a href="tel:+251911875524" className="hover:text-white transition">+251 91 187 5524</a>
                  <a href="tel:+251990222919" className="hover:text-white transition">+251 99 022 2919</a>
                </div>
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-3">
              Follow Us
            </h3>
            <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
              <a
                href="#tiktok"
                className="bg-stone-800 hover:bg-stone-700 text-white px-3.5 py-2 rounded-xl transition"
              >
                TIK TOK
              </a>
              <a
                href="#facebook"
                className="bg-stone-800 hover:bg-stone-700 text-white px-3.5 py-2 rounded-xl transition"
              >
                FACEBOOK
              </a>
              <a
                href="#telegram"
                className="bg-stone-800 hover:bg-stone-700 text-white px-3.5 py-2 rounded-xl transition"
              >
                TELEGRAM
              </a>
            </div>
          </div>

        </div>

        {/* Developer Credit Section */}
        <div className="pt-8 border-t border-stone-800/80 bg-stone-950/60 p-6 rounded-2xl border border-stone-800/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-extrabold text-amber-500 tracking-wider mb-1">
                Developed by TriCore IT Solution
              </div>
              <p className="text-xs text-stone-400">
                Delivering cutting-edge digital solutions including websites, digital menus, and system management.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>tricoreitsolution99@gmail.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>+251 999 40 10 10</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-400 font-bold">www.tricore.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-stone-500 pt-4 border-t border-stone-800/40">
          © 2026 WOW Burger All rights reserved.
        </div>

      </div>
    </footer>
  );
}
