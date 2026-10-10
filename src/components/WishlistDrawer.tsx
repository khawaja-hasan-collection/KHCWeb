import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatCurrency, FALLBACK_IMAGE } from '../lib/constants';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  currency: CurrencyCode;
  onRemove: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onRemove,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#100f13] border-l border-[#2e2617] text-neutral-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#241f13] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
              <h2 className="font-serif text-lg text-white font-medium tracking-wide">
                Your Wishlist ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-neutral-400 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#1b1812] border border-[#38301d] flex items-center justify-center text-[#d4af37]">
                  <Heart className="w-8 h-8" />
                </div>
                <p className="font-serif text-lg text-white">Your wishlist is empty</p>
                <p className="text-xs max-w-xs text-neutral-400">
                  Save pieces you admire to revisit or purchase for upcoming festivities.
                </p>
              </div>
            ) : (
              items.map((prod) => {
                const img = prod.image_url ||
                  (Array.isArray(prod.image_urls) && prod.image_urls[0]) ||
                  FALLBACK_IMAGE;

                return (
                  <div
                    key={prod.id}
                    className="flex gap-4 p-3 bg-[#151319] border border-[#262016] rounded-lg items-center justify-between"
                  >
                    <img
                      src={img}
                      alt={prod.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                      className="w-16 h-20 object-cover rounded bg-[#1c1913]"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm text-white truncate font-medium">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-[#c5a059] uppercase tracking-wider mt-0.5">
                        {prod.category}
                      </p>
                      <div className="text-xs text-[#f7dfa5] font-semibold mt-1">
                        {formatCurrency(prod.price, currency)}
                      </div>

                      <button
                        onClick={() => {
                          onMoveToCart(prod);
                          onRemove(prod);
                        }}
                        className="mt-2 text-[11px] font-semibold text-[#d4af37] hover:text-[#f7dfa5] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onRemove(prod)}
                      className="text-neutral-500 hover:text-red-400 p-2 transition cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
