import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatCurrency, FALLBACK_IMAGE } from '../lib/constants';

interface HeroSliderProps {
  products: Product[];
  isLoading: boolean;
  currency: CurrencyCode;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onScrollToCatalog: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  products,
  isLoading,
  currency,
  onSelectProduct,
  onAddToCart,
  onScrollToCatalog,
}) => {
  // Only use active products with valid details
  const activeProducts = products.filter(p => p.active !== false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string | number, boolean>>({});

  // Slide navigation
  const nextSlide = useCallback(() => {
    if (activeProducts.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % activeProducts.length);
  }, [activeProducts.length]);

  const prevSlide = useCallback(() => {
    if (activeProducts.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + activeProducts.length) % activeProducts.length);
  }, [activeProducts.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Autoplay timer every 5 seconds (5000ms), paused on hover
  useEffect(() => {
    if (isPaused || activeProducts.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, activeProducts.length, nextSlide]);

  // If index falls out of bounds (e.g. products deleted)
  useEffect(() => {
    if (currentIndex >= activeProducts.length && activeProducts.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeProducts.length, currentIndex]);

  // Touch / Swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  // Helper for safe image URL
  const getProductImage = (product: Product): string => {
    if (imgErrorMap[product.id]) return FALLBACK_IMAGE;
    if (product.image_url && typeof product.image_url === 'string' && product.image_url.trim().length > 0) {
      return product.image_url;
    }
    if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
      return product.image_urls[0];
    }
    return FALLBACK_IMAGE;
  };

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="relative w-full h-[580px] sm:h-[650px] lg:h-[720px] bg-[#111115] border-b border-[#2a2415] flex items-center justify-center overflow-hidden">
        <div className="animate-pulse flex flex-col items-center gap-4 text-center px-6">
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
          <div className="h-6 w-36 bg-[#232018] rounded"></div>
          <div className="h-10 w-72 bg-[#2a261d] rounded"></div>
          <div className="h-4 w-48 bg-[#1f1b14] rounded"></div>
          <div className="h-12 w-40 bg-[#3a3222] rounded mt-4"></div>
        </div>
      </div>
    );
  }

  // Fallback if no active products exist
  if (activeProducts.length === 0) {
    return (
      <div className="relative w-full min-h-[500px] bg-gradient-to-b from-[#141419] to-[#0c0c0e] border-b border-[#2d2616] flex items-center justify-center px-4 py-16 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/40 bg-[#1a1710] text-[#d4af37] text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Khawaja Hasan Collection
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-wide leading-tight">
            Tradition, Reimagined
          </h1>
          <p className="text-[#b8af9b] text-sm sm:text-base leading-relaxed">
            Discover bespoke royal sherwanis, prince coats, and hand-embroidered couture crafted with timeless heritage.
          </p>
          <button
            onClick={onScrollToCatalog}
            className="px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa771c] text-black font-semibold uppercase tracking-wider text-xs rounded hover:opacity-95 transition shadow-lg shadow-[#d4af37]/20"
          >
            Explore The Ateliers
          </button>
        </div>
      </div>
    );
  }

  const currentProduct = activeProducts[currentIndex];
  const currentImg = getProductImage(currentProduct);

  // Calculate discount percentage if old_price is greater than price
  const hasDiscount = currentProduct.old_price && currentProduct.old_price > currentProduct.price;
  const discountPercent = hasDiscount && currentProduct.old_price
    ? Math.round(((currentProduct.old_price - currentProduct.price) / currentProduct.old_price) * 100)
    : 0;

  return (
    <div
      role="region"
      aria-label="Hero Product Slider"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[580px] sm:h-[650px] lg:h-[720px] bg-[#09090b] select-none overflow-hidden group focus:outline-none border-b border-[#262015]"
    >
      {/* Background Slides with smooth fade and subtle luxury pan */}
      {activeProducts.map((product, idx) => {
        const isCurrent = idx === currentIndex;
        const bgImg = getProductImage(product);

        return (
          <div
            key={product.id}
            aria-hidden={!isCurrent}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={bgImg}
                alt={product.name}
                loading={idx === 0 ? 'eager' : 'lazy'}
                onError={() => {
                  setImgErrorMap(prev => ({ ...prev, [product.id]: true }));
                }}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out ${
                  isCurrent ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>

            {/* Cinematic Gradient Overlays (Luxury black & warm vignette) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/65 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0e] via-[#0c0c0e]/75 to-transparent sm:w-2/3" />
            <div className="absolute inset-0 bg-radial at-center from-transparent via-transparent to-black/80" />
          </div>
        );
      })}

      {/* Main Slide Content */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end sm:justify-center pb-20 sm:pb-0">
        <div className="max-w-2xl py-8">
          {/* Tag and Category Pill */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-[#1a1710]/90 backdrop-blur-md border border-[#d4af37]/50 text-[#d4af37] text-[11px] font-medium tracking-widest uppercase rounded">
              {currentProduct.tag || 'Royal Couture'}
            </span>
            <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-neutral-300 text-[11px] tracking-wider uppercase rounded">
              {currentProduct.category}
            </span>
            {hasDiscount && (
              <span className="px-2.5 py-1 bg-[#d4af37] text-black font-bold text-[10px] tracking-wider uppercase rounded shadow-sm">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Product Name */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-wide leading-[1.15] mb-4 drop-shadow-md">
            {currentProduct.name}
          </h2>

          {/* Description snippet */}
          {currentProduct.description && (
            <p className="text-neutral-300 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-2 max-w-xl mb-5 font-light">
              {currentProduct.description}
            </p>
          )}

          {/* Price display - never NaN or undefined */}
          <div className="flex items-baseline gap-3 mb-7">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#f7dfa5] drop-shadow-sm">
              {formatCurrency(currentProduct.price, currency)}
            </span>
            {hasDiscount && (
              <span className="text-base sm:text-lg text-neutral-400 line-through decoration-neutral-500 font-light">
                {formatCurrency(currentProduct.old_price, currency)}
              </span>
            )}
            <span className="text-[11px] text-[#c5a059] uppercase tracking-wider font-medium ml-1">
              • Custom Tailored Included
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onSelectProduct(currentProduct)}
              className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f7dfa5] to-[#c5a059] text-black font-semibold text-xs uppercase tracking-widest rounded shadow-lg shadow-[#d4af37]/20 hover:brightness-110 active:scale-[0.98] transition flex items-center gap-2 group/btn cursor-pointer"
            >
              <span>Shop Now</span>
              <Eye className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
            </button>

            <button
              onClick={() => onAddToCart(currentProduct)}
              className="px-5 sm:px-6 py-3.5 bg-[#171511]/80 hover:bg-[#252018] text-[#f4ecd8] border border-[#d4af37]/40 hover:border-[#d4af37] font-medium text-xs uppercase tracking-widest rounded transition flex items-center gap-2 backdrop-blur-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              <span>Add to Bag</span>
            </button>

            <button
              onClick={onScrollToCatalog}
              className="text-neutral-400 hover:text-white text-xs uppercase tracking-wider underline-offset-4 hover:underline px-2 py-2 transition"
            >
              View New Arrivals ↓
            </button>
          </div>
        </div>
      </div>

      {/* Floating Product Preview Card on Desktop (Right Side Luxury Glimpse) */}
      <div className="hidden lg:flex absolute right-12 bottom-16 z-20 flex-col items-end">
        <div
          onClick={() => onSelectProduct(currentProduct)}
          className="cursor-pointer group/card w-56 bg-[#131215]/85 backdrop-blur-md border border-[#383120] hover:border-[#d4af37] p-3 rounded-lg shadow-2xl transition duration-300"
        >
          <div className="w-full h-64 overflow-hidden rounded mb-3 relative bg-[#1c1a17]">
            <img
              src={currentImg}
              alt={currentProduct.name}
              className="w-full h-full object-cover group-hover/card:scale-105 transition duration-500"
            />
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 text-[10px] text-[#d4af37] font-serif uppercase tracking-widest rounded">
              Feature
            </div>
          </div>
          <div className="text-xs text-white font-serif font-medium line-clamp-1 group-hover/card:text-[#d4af37] transition">
            {currentProduct.name}
          </div>
          <div className="text-[11px] text-[#d4af37] font-semibold mt-1">
            {formatCurrency(currentProduct.price, currency)}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-2 sm:px-4 pointer-events-none">
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#1a1710] border border-[#d4af37]/30 hover:border-[#d4af37] text-white hover:text-[#d4af37] flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#1a1710] border border-[#d4af37]/30 hover:border-[#d4af37] text-white hover:text-[#d4af37] flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Slide Indicators & Counter Bar at the bottom */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
        {/* Dot Indicators */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {activeProducts.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-gradient-to-r from-[#d4af37] to-[#f7dfa5] shadow-sm shadow-[#d4af37]'
                  : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Slide Counter (e.g. 01 / 06) */}
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-[#383120] px-3 py-1 rounded text-xs font-mono tracking-widest text-[#d4af37] pointer-events-auto">
          <span className="text-white font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="text-neutral-500">/</span>
          <span className="text-neutral-400">{String(activeProducts.length).padStart(2, '0')}</span>
          {isPaused && (
            <span className="ml-1 text-[9px] uppercase tracking-wider text-neutral-400 font-sans hidden sm:inline">
              (Paused)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
