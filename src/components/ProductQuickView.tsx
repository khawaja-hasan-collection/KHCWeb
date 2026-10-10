import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Ruler, Sparkles, Check } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatCurrency, FALLBACK_IMAGE } from '../lib/constants';

interface ProductQuickViewProps {
  product: Product | null;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

const SIZES = ['38 (S)', '40 (M)', '42 (L)', '44 (XL)', 'Custom Bespoke'];

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  currency,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
}) => {
  if (!product) return null;

  const images: string[] = Array.isArray(product.image_urls) && product.image_urls.length > 0
    ? product.image_urls
    : (product.image_url ? [product.image_url] : [FALLBACK_IMAGE]);

  const [selectedImg, setSelectedImg] = useState<string>(images[0] || FALLBACK_IMAGE);
  const [selectedSize, setSelectedSize] = useState<string>('40 (M)');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const hasDiscount = product.old_price && product.old_price > product.price;
  const discountPercent = hasDiscount && product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#111014] border border-[#38301e] rounded-xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-[#d4af37] text-white hover:text-black flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images Gallery */}
        <div className="md:w-1/2 p-4 sm:p-6 bg-[#0c0c0e] flex flex-col justify-between">
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#181613] mb-4">
            <img
              src={selectedImg}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover object-center"
            />
            {product.tag && (
              <span className="absolute top-3 left-3 px-3 py-1 bg-black/80 border border-[#d4af37]/60 text-[#f7dfa5] text-[10px] uppercase tracking-widest rounded">
                {product.tag}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(img)}
                  className={`w-14 h-16 rounded overflow-hidden flex-shrink-0 border-2 transition ${
                    selectedImg === img ? 'border-[#d4af37]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-medium">
                {product.category}
              </span>
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-1.5 rounded-full border transition ${
                  isWishlisted
                    ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10'
                    : 'border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#d4af37]' : ''}`} />
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-wide mb-3 leading-tight">
              {product.name}
            </h2>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-serif font-bold text-[#f7dfa5]">
                {formatCurrency(product.price, currency)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-neutral-400 line-through">
                    {formatCurrency(product.old_price, currency)}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-[#d4af37] text-black font-bold uppercase rounded">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-[#272115] pt-4 mb-5">
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-light">
                {product.description ||
                  'Exclusively tailored by master artisans using premium fabric and royal heritage needlework.'}
              </p>
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-neutral-300 uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-[#d4af37]" /> Select Size (Chest / Cut)
                </span>
                <span className="text-[11px] text-[#c5a059] cursor-pointer hover:underline">
                  Size Guide
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 text-[11px] font-medium uppercase rounded border transition cursor-pointer text-center ${
                      selectedSize === sz
                        ? 'border-[#d4af37] bg-[#221c11] text-[#f7dfa5] shadow-sm'
                        : 'border-[#2d2516] bg-[#14120f] text-neutral-400 hover:text-white hover:border-neutral-500'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                Quantity:
              </span>
              <div className="flex items-center border border-[#38301e] rounded bg-[#14120f]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-neutral-300 hover:text-white text-sm"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-mono font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 text-neutral-300 hover:text-white text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Add to Bag CTA & Assurance */}
          <div className="space-y-3 pt-4 border-t border-[#272115]">
            <button
              onClick={handleAdd}
              className={`w-full py-3.5 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#d4af37] via-[#f7dfa5] to-[#c5a059] text-black hover:brightness-110 shadow-[#d4af37]/20'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag • {formatCurrency(product.price * quantity, currency)}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-around text-[10px] text-neutral-400 pt-2 border-t border-[#1d1911]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#d4af37]" /> 100% Authentic Fabric
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#d4af37]" /> Master Tailored
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
