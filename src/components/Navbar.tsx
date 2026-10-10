import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES, CATEGORIES } from '../lib/constants';

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  currency: CurrencyCode;
  onChangeCurrency: (curr: CurrencyCode) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSupabaseLive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  currency,
  onChangeCurrency,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAdmin,
  searchQuery,
  onSearchChange,
  isSupabaseLive,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-b border-[#241f14]">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#12100a] border-b border-[#262013] text-center py-1.5 px-4 text-[11px] text-[#c5a059] tracking-widest uppercase flex items-center justify-between max-w-7xl mx-auto">
        <div className="hidden md:flex items-center gap-2 text-neutral-400">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span>Bespoke Handcrafted Couture & Bridal Wear</span>
        </div>
        <div className="mx-auto md:mx-0 flex items-center gap-3">
          <span>Complimentary Worldwide Delivery On Orders Above $500</span>
          {isSupabaseLive && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950/70 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded-full font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Supabase Live
            </span>
          )}
        </div>
        <div className="hidden md:flex items-center gap-4 text-neutral-300">
          <div className="flex items-center gap-1.5 text-xs">
            <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent text-[#d4af37] font-semibold text-xs focus:outline-none cursor-pointer"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c} className="bg-[#12100a] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-[#d4af37] transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-neutral-300 hover:text-[#d4af37] transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo & Royal Title */}
          <div 
            onClick={() => onSelectCategory('All')} 
            className="cursor-pointer text-center flex flex-col items-center group py-2"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]"></span>
              <span className="text-[10px] tracking-[0.35em] text-[#d4af37] font-serif uppercase font-semibold">
                KH
              </span>
              <span className="w-6 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]"></span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-[0.2em] text-white group-hover:text-[#f7dfa5] transition duration-300">
              KHAWAJA HASAN
            </h1>
            <span className="text-[9px] sm:text-[10px] tracking-[0.45em] text-[#c5a059] uppercase -mt-0.5">
              C O L L E C T I O N
            </span>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search sherwanis, kurtas..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#14120e] border border-[#2e2617] focus:border-[#d4af37] pl-9 pr-4 py-1.5 rounded text-xs text-white placeholder-neutral-500 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Actions: Admin, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Currency selector on mobile */}
            <div className="md:hidden flex items-center">
              <select
                value={currency}
                onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
                className="bg-[#14120e] border border-[#2e2617] text-[#d4af37] font-semibold text-xs py-1 px-1.5 rounded focus:outline-none"
              >
                {Object.keys(CURRENCIES).map((c) => (
                  <option key={c} value={c} className="bg-[#12100a] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Dashboard shortcut button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#16130d] hover:bg-[#231e13] border border-[#3d331d] hover:border-[#d4af37] text-[#d4af37] transition text-xs font-medium cursor-pointer"
              title="Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline">Admin Portal</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-neutral-300 hover:text-[#d4af37] transition cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#d4af37] text-black text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-2 rounded bg-gradient-to-r from-[#d4af37] to-[#aa771c] hover:brightness-110 text-black font-semibold text-xs tracking-wider uppercase transition shadow-md shadow-[#d4af37]/20 cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="w-5 h-5 rounded-full bg-black text-[#d4af37] text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar toggle */}
        {isSearchOpen && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search bridal, sherwani, prince coat..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full bg-[#14120e] border border-[#d4af37]/50 pl-9 pr-8 py-2 rounded text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Desktop Category Navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-8 py-3 border-t border-[#1c1810]">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`relative text-xs tracking-[0.18em] uppercase transition-all pb-1 cursor-pointer font-medium ${
                  isActive
                    ? 'text-[#f7dfa5] font-semibold'
                    : 'text-neutral-400 hover:text-neutral-100'
                }`}
              >
                {cat}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-[#0d0d10] border-b border-[#2d2514] px-6 py-6 shadow-2xl space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
            Collections & Categories
          </div>
          <div className="flex flex-col space-y-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-sm py-2 px-3 rounded flex items-center justify-between ${
                  activeCategory === cat
                    ? 'bg-[#1e1910] text-[#f7dfa5] border-l-2 border-[#d4af37] font-medium'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                <span>{cat}</span>
                <span className="text-xs text-[#c5a059]">→</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#1e1910] flex items-center justify-between">
            <button
              onClick={() => {
                onOpenAdmin();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs text-[#d4af37] font-medium py-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
