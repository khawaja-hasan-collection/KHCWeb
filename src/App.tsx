import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  ArrowUpDown, 
  Filter, 
  Search, 
  CheckCircle2, 
  ShoppingBag, 
  Crown,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Product, CartItem, CurrencyCode } from './types';
import { fetchProducts, isSupabaseConnected } from './lib/supabase';
import { CATEGORIES } from './lib/constants';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { ProductCard } from './components/ProductCard';
import { ProductQuickView } from './components/ProductQuickView';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { BrandStory } from './components/BrandStory';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/Admin/AdminDashboard';

export default function App() {
  // Application view state
  const [viewMode, setViewMode] = useState<'storefront' | 'admin'>('storefront');

  // Products and database state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<'supabase' | 'local'>('local');
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Storefront filters
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  // Interactive shopping state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kh_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kh_wishlist_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Success toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const catalogSectionRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Save cart & wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kh_cart_v2', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kh_wishlist_v2', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Load products function
  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setFetchError(null);
    try {
      const result = await fetchProducts();
      setProducts(result.products);
      setDataSource(result.source);
      if (result.error) {
        setFetchError(result.error);
      }
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setFetchError(err?.message || 'Failed to fetch catalog.');
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Cart actions
  const handleAddToCart = (product: Product, selectedSize: string = '40 (M)', quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedSize }];
    });
    showToast(`Added "${product.name}" to your shopping bag.`);
  };

  const handleUpdateCartQuantity = (productId: string | number, size: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string | number, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
  };

  // Wishlist actions
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist.`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to wishlist.`);
        return [...prev, product];
      }
    });
  };

  const isProductWishlisted = (id: string | number) => {
    return wishlist.some((p) => p.id === id);
  };

  const handleScrollToCatalog = () => {
    if (catalogSectionRef.current) {
      catalogSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtering & Sorting
  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'newest') {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    }
    return 0; // featured default
  });

  // Calculate cart count
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // If Admin Dashboard mode is chosen
  if (viewMode === 'admin') {
    return (
      <AdminDashboard
        products={products}
        currency={currency}
        onCloseAdmin={() => setViewMode('storefront')}
        onRefreshProducts={loadProducts}
        onProductCreated={(newProd) => {
          setProducts((prev) => [newProd, ...prev]);
          showToast(`"${newProd.name}" added to catalog.`);
        }}
        dataSource={dataSource}
      />
    );
  }

  // Public Storefront View
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f4ecd8] flex flex-col font-sans selection:bg-[#c5a059] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16141a]/95 backdrop-blur-md border border-[#d4af37] text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200 text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Luxury Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleScrollToCatalog();
        }}
        currency={currency}
        onChangeCurrency={setCurrency}
        cartCount={cartItemCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={() => setViewMode('admin')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSupabaseLive={dataSource === 'supabase' && isSupabaseConnected()}
      />

      {/* Hero Product Slider — Replaces static "Tradition, reimagined." banner */}
      <HeroSlider
        products={products}
        isLoading={isLoadingProducts}
        currency={currency}
        onSelectProduct={(product) => setQuickViewProduct(product)}
        onAddToCart={(product) => handleAddToCart(product)}
        onScrollToCatalog={handleScrollToCatalog}
      />

      {/* Category Quick Badges Bar */}
      <section className="bg-[#0f0e13] border-b border-[#241f15] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 flex-nowrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-semibold shadow-md'
                    : 'bg-[#18161e] border border-[#2e2617] text-neutral-300 hover:text-white hover:border-[#d4af37]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-neutral-400 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Hand-Stitched In Lahore Ateliers</span>
          </div>
        </div>
      </section>

      {/* Main Catalog & New Arrivals Section */}
      <main ref={catalogSectionRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#241f15]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/40 bg-[#16130d] text-[#d4af37] text-[10px] uppercase tracking-widest mb-2 font-medium">
              <Crown className="w-3 h-3" />
              <span>Imperial Eastern Pret & Haute Couture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-wide">
              {activeCategory === 'All' ? 'New Arrivals & Atelier Collections' : activeCategory}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl font-light">
              Featuring bespoke zardozi embroidery, tailored velvet prince coats, and pure Banarasi jamawars.
            </p>
          </div>

          {/* Sorter and Count */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-400 font-mono">
              Showing {sortedProducts.length} Piece{sortedProducts.length !== 1 ? 's' : ''}
            </span>

            <div className="flex items-center gap-2 bg-[#141219] border border-[#282216] rounded px-3 py-1.5 text-xs text-neutral-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#d4af37]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-[#f7dfa5] focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-[#141219] text-white">
                  Featured Couture
                </option>
                <option value="newest" className="bg-[#141219] text-white">
                  Newest Additions
                </option>
                <option value="price-asc" className="bg-[#141219] text-white">
                  Price: Low to High
                </option>
                <option value="price-desc" className="bg-[#141219] text-white">
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Active Indicator */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between bg-[#15131a] border border-[#2f2719] px-4 py-2.5 rounded-lg text-xs">
            <div className="text-neutral-300">
              Searching for: <span className="text-[#f7dfa5] font-semibold">"{searchQuery}"</span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#d4af37] hover:underline font-semibold"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-[#121115] border border-[#221c14] rounded-lg overflow-hidden animate-pulse aspect-[3/4]"
              >
                <div className="w-full h-2/3 bg-[#1a1714]"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#231f18] rounded w-3/4"></div>
                  <div className="h-3 bg-[#1d1913] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#121116] border border-[#241f15] rounded-xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1b1812] border border-[#3d331f] flex items-center justify-center text-[#d4af37] mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl text-white">No Pieces Found</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              We couldn't find any products matching your current category filter or search keywords.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-semibold text-xs uppercase tracking-wider rounded"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                isWishlisted={isProductWishlisted(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={(p) => setQuickViewProduct(p)}
                onAddToCart={(p, size) => handleAddToCart(p, size || '40 (M)')}
              />
            ))}
          </div>
        )}
      </main>

      {/* Brand Heritage Section */}
      <BrandStory />

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setViewMode('admin')}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          handleScrollToCatalog();
        }}
      />

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        currency={currency}
        isWishlisted={quickViewProduct ? isProductWishlisted(quickViewProduct.id) : false}
        onClose={() => setQuickViewProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(prod, size, qty) => {
          handleAddToCart(prod, size, qty);
          setQuickViewProduct(null);
        }}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        currency={currency}
        onRemove={handleToggleWishlist}
        onMoveToCart={(prod) => handleAddToCart(prod)}
      />

      {/* Interactive Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        onOrderComplete={() => {
          setCart([]);
          showToast('Order successfully confirmed! Our master tailor will be in touch.');
        }}
      />
    </div>
  );
}
