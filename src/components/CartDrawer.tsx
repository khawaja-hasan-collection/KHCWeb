import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, Tag } from 'lucide-react';
import { CartItem, CurrencyCode } from '../types';
import { formatCurrency, FALLBACK_IMAGE } from '../lib/constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (productId: string | number, size: string, delta: number) => void;
  onRemoveItem: (productId: string | number, size: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedPromo === 'ROYAL10' ? rawSubtotal * 0.1 : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const handleApplyPromo = () => {
    if (promoInput.trim().toUpperCase() === 'ROYAL10') {
      setAppliedPromo('ROYAL10');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Use ROYAL10 for 10% off');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#100f13] border-l border-[#2e2617] text-neutral-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#241f13] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h2 className="font-serif text-lg text-white font-medium tracking-wide">
                Your Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-neutral-400 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#1b1812] border border-[#38301d] flex items-center justify-center text-[#d4af37]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-serif text-lg text-white">Your bag is currently empty</p>
                <p className="text-xs max-w-xs text-neutral-400">
                  Explore the Khawaja Hasan couture collection and add your favorite sherwanis and prince coats.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded bg-[#1e1a12] border border-[#d4af37]/50 text-[#d4af37] text-xs uppercase tracking-wider font-semibold hover:bg-[#2c2417] transition"
                >
                  Discover Collections
                </button>
              </div>
            ) : (
              items.map((item) => {
                const img = item.product.image_url ||
                  (Array.isArray(item.product.image_urls) && item.product.image_urls[0]) ||
                  FALLBACK_IMAGE;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-4 p-3 bg-[#151319] border border-[#262016] rounded-lg items-center justify-between"
                  >
                    <img
                      src={img}
                      alt={item.product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                      className="w-16 h-20 object-cover rounded bg-[#1c1913]"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm text-white truncate font-medium">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#c5a059] uppercase tracking-wider mt-0.5">
                        Size: {item.selectedSize}
                      </p>
                      <div className="text-xs text-[#f7dfa5] font-semibold mt-1">
                        {formatCurrency(item.product.price, currency)}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-[#38301d] rounded bg-[#0d0c0f]">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, -1)}
                            className="px-2 py-0.5 text-xs text-neutral-300 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, 1)}
                            className="px-2 py-0.5 text-xs text-neutral-300 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                      className="text-neutral-500 hover:text-red-400 p-2 transition cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#241f13] bg-[#0c0c0e] space-y-4">
              {/* Promo input */}
              <div className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Promo Code (try: ROYAL10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full bg-[#16141a] border border-[#2b2518] pl-8 pr-3 py-1.5 rounded text-xs text-white uppercase placeholder:normal-case focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 bg-[#252015] hover:bg-[#342a1b] text-[#f7dfa5] border border-[#d4af37]/40 text-xs rounded uppercase font-medium transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-red-400">{promoError}</p>}
                {appliedPromo && (
                  <p className="text-[11px] text-emerald-400 font-medium">
                    Promo ROYAL10 applied (10% VIP Discount)
                  </p>
                )}
              </div>

              {/* Price summary */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-[#1c1811]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{formatCurrency(rawSubtotal, currency)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Promotion</span>
                    <span>-{formatCurrency(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="text-emerald-400 font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#f7dfa5] pt-2 border-t border-[#221c13]">
                  <span>Total</span>
                  <span>{formatCurrency(finalTotal, currency)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f7dfa5] to-[#c5a059] text-black font-bold uppercase tracking-widest text-xs rounded flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
