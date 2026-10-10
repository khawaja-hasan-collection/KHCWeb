import React, { useState } from 'react';
import { Eye, Heart, ShoppingBag, Check } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatCurrency, FALLBACK_IMAGE } from '../lib/constants';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Safe image resolution
  const imageUrl = imgError 
    ? FALLBACK_IMAGE 
    : (product.image_url || (Array.isArray(product.image_urls) && product.image_urls[0]) || FALLBACK_IMAGE);

  const hasDiscount = product.old_price && product.old_price > product.price;
  const discountPercent = hasDiscount && product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-[#121115] border border-[#231e15] hover:border-[#d4af37]/70 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#d4af37]/10 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#181613]">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          {product.tag && (
            <span className="px-2.5 py-1 bg-[#100f0b]/90 backdrop-blur-md border border-[#d4af37]/60 text-[#f7dfa5] text-[10px] font-medium tracking-wider uppercase rounded shadow-sm">
              {product.tag}
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-[#d4af37] text-black font-bold text-[10px] uppercase tracking-wider rounded shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-black/40 hover:bg-black/70 text-white hover:text-[#d4af37]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-black' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2.5 bg-black/85 hover:bg-black border border-[#d4af37]/60 text-[#f7dfa5] text-xs font-semibold tracking-wider uppercase rounded flex items-center justify-center gap-1.5 backdrop-blur-md transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleAdd}
            className={`px-3 py-2.5 rounded text-xs font-bold uppercase transition flex items-center justify-center cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-[#d4af37] to-[#aa771c] hover:brightness-110 text-black'
            }`}
            title="Add to Bag"
          >
            {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-[11px] text-[#c5a059] uppercase tracking-wider font-medium mb-1">
            {product.category}
          </div>
          <h3 className="font-serif text-sm sm:text-base font-medium text-white group-hover:text-[#f7dfa5] transition line-clamp-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-neutral-400 text-xs mt-1 line-clamp-2 font-light">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Cart Actions */}
        <div className="mt-3 pt-3 border-t border-[#231e15] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-serif font-bold text-[#f7dfa5]">
              {formatCurrency(product.price, currency)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                {formatCurrency(product.old_price, currency)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="text-[11px] text-[#d4af37] hover:text-[#f7dfa5] uppercase tracking-wider font-semibold hover:underline flex items-center gap-1"
          >
            {isAdded ? 'Added ✓' : '+ Bag'}
          </button>
        </div>
      </div>
    </div>
  );
};
