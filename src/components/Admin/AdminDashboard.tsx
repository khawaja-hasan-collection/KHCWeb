import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Home, 
  PlusCircle, 
  Package, 
  ExternalLink, 
  LogOut, 
  Database, 
  Sparkles, 
  Layers, 
  TrendingUp, 
  Menu, 
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Product, CurrencyCode } from '../../types';
import { formatCurrency, CATEGORIES } from '../../lib/constants';
import { isSupabaseConnected } from '../../lib/supabase';
import { AddProductView } from './AddProductView';
import { ManageProductsView } from './ManageProductsView';
import { SupabaseSettingsModal } from './SupabaseSettingsModal';

type AdminTab = 'dashboard' | 'add-product' | 'manage-products';

interface AdminDashboardProps {
  products: Product[];
  currency: CurrencyCode;
  onCloseAdmin: () => void;
  onRefreshProducts: () => void;
  onProductCreated: (product: Product) => void;
  dataSource: 'supabase' | 'local';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  currency,
  onCloseAdmin,
  onRefreshProducts,
  onProductCreated,
  dataSource,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Statistics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active !== false).length;
  const inactiveProducts = totalProducts - activeProducts;
  const totalValuation = products.reduce((acc, p) => acc + (p.price || 0), 0);
  const isSupabaseConfigured = isSupabaseConnected();

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-neutral-200 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111015] border-b border-[#262016]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 text-neutral-300 hover:text-white"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif font-bold text-white tracking-widest text-sm">
            KH ATELIER PORTAL
          </span>
        </div>

        <button
          onClick={onCloseAdmin}
          className="text-xs text-[#d4af37] flex items-center gap-1 font-semibold"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Website</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#100f14] border-r border-[#262016] flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Monogram */}
          <div className="p-6 border-b border-[#241f15] flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-[1px] bg-[#d4af37]"></span>
              <span className="text-[10px] tracking-[0.3em] text-[#d4af37] font-serif uppercase font-semibold">
                KH
              </span>
              <span className="w-4 h-[1px] bg-[#d4af37]"></span>
            </div>
            <h1 className="font-serif text-lg font-bold tracking-[0.18em] text-white mt-1">
              KHAWAJA HASAN
            </h1>
            <span className="text-[9px] tracking-[0.35em] text-[#c5a059] uppercase">
              ADMINISTRATION
            </span>
          </div>

          {/* Navigation Items (Exact requirements: Dashboard, Homepage, Add Product, Manage Products, View Website, Logout) */}
          <nav className="p-4 space-y-1.5">
            {/* Dashboard */}
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#d4af37]/20 to-transparent border-l-2 border-[#d4af37] text-[#f7dfa5]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#18161f]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#d4af37]" />
              <span>Dashboard</span>
            </button>

            {/* Homepage (public storefront) */}
            <button
              onClick={onCloseAdmin}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold text-neutral-400 hover:text-white hover:bg-[#18161f] transition cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#d4af37]" />
              <span>Homepage</span>
            </button>

            {/* Add Product */}
            <button
              onClick={() => handleTabChange('add-product')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition cursor-pointer ${
                activeTab === 'add-product'
                  ? 'bg-gradient-to-r from-[#d4af37]/20 to-transparent border-l-2 border-[#d4af37] text-[#f7dfa5]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#18161f]'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-[#d4af37]" />
              <span>Add Product</span>
            </button>

            {/* Manage Products */}
            <button
              onClick={() => handleTabChange('manage-products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition cursor-pointer ${
                activeTab === 'manage-products'
                  ? 'bg-gradient-to-r from-[#d4af37]/20 to-transparent border-l-2 border-[#d4af37] text-[#f7dfa5]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#18161f]'
              }`}
            >
              <Package className="w-4 h-4 text-[#d4af37]" />
              <span>Manage Products</span>
            </button>

            {/* View Website */}
            <button
              onClick={onCloseAdmin}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold text-neutral-400 hover:text-white hover:bg-[#18161f] transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-[#d4af37]" />
              <span>View Website</span>
            </button>

            {/* Supabase Connection Setup */}
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold text-neutral-400 hover:text-[#f7dfa5] hover:bg-[#18161f] transition cursor-pointer mt-3 border border-[#2b2518]"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#d4af37]" />
                <span>Supabase DB</span>
              </div>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Logout */}
        <div className="p-4 border-t border-[#241f15] space-y-3">
          <div className="p-3 bg-[#16141a] border border-[#2b2518] rounded-lg text-[11px]">
            <div className="text-neutral-400 uppercase tracking-widest text-[10px]">Data Source</div>
            <div className="flex items-center gap-1.5 font-medium mt-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  dataSource === 'supabase' ? 'bg-emerald-400 animate-pulse' : 'bg-[#d4af37]'
                }`}
              />
              <span className="text-white">
                {dataSource === 'supabase' ? 'Supabase Cloud DB' : 'Local Active Cache'}
              </span>
            </div>
          </div>

          <button
            onClick={onCloseAdmin}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-neutral-400 hover:text-red-400 hover:bg-red-950/20 text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Render Tab Contents */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#241f13]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>Verified Master Administration</span>
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-wide mt-1">
                  Atelier Executive Overview
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage inventory, pricing, and live hero slider showcasing in real-time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSupabaseModalOpen(true)}
                  className="px-3.5 py-2 bg-[#1b1812] hover:bg-[#282216] border border-[#3e341f] text-[#f7dfa5] text-xs font-semibold uppercase rounded transition flex items-center gap-2 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Connect Supabase'}</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#121116] border border-[#262016] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-neutral-400">
                    Total Products
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                    {totalProducts}
                  </div>
                  <div className="text-[10px] text-[#c5a059] mt-0.5">Across all couture lines</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#1c1810] border border-[#3d331f] flex items-center justify-center text-[#d4af37]">
                  <Package className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 bg-[#121116] border border-[#262016] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-neutral-400">
                    Active on Hero & Store
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400 mt-1">
                    {activeProducts}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Live for customers</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 bg-[#121116] border border-[#262016] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-neutral-400">
                    Inactive Products
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-neutral-400 mt-1">
                    {inactiveProducts}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Hidden from slider</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#1a1820] border border-neutral-700 flex items-center justify-center text-neutral-400">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 bg-[#121116] border border-[#262016] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-neutral-400">
                    Catalog Valuation
                  </div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#f7dfa5] mt-1">
                    {formatCurrency(totalValuation, currency)}
                  </div>
                  <div className="text-[10px] text-[#c5a059] mt-0.5">Total registered value</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#1c1810] border border-[#3d331f] flex items-center justify-center text-[#d4af37]">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick Actions & Supabase Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Launch Cards */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-serif text-lg text-white font-medium">
                  Atelier Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => handleTabChange('add-product')}
                    className="p-5 bg-[#141219] hover:bg-[#1a1722] border border-[#2b2518] hover:border-[#d4af37] rounded-xl cursor-pointer transition group shadow-lg"
                  >
                    <PlusCircle className="w-6 h-6 text-[#d4af37] mb-3 group-hover:scale-110 transition" />
                    <h4 className="font-serif text-white font-semibold text-base mb-1">
                      Add New Masterpiece
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Upload photos, set prices, tags, and instantly display on the Homepage Hero Slider.
                    </p>
                    <div className="mt-3 text-xs text-[#d4af37] font-semibold flex items-center gap-1">
                      <span>Launch Form</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div
                    onClick={() => handleTabChange('manage-products')}
                    className="p-5 bg-[#141219] hover:bg-[#1a1722] border border-[#2b2518] hover:border-[#d4af37] rounded-xl cursor-pointer transition group shadow-lg"
                  >
                    <Package className="w-6 h-6 text-[#d4af37] mb-3 group-hover:scale-110 transition" />
                    <h4 className="font-serif text-white font-semibold text-base mb-1">
                      Manage Atelier Inventory
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Edit descriptions, adjust pricing, toggle active status, or delete old collections.
                    </p>
                    <div className="mt-3 text-xs text-[#d4af37] font-semibold flex items-center gap-1">
                      <span>Open Table</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Recent Products Snapshot */}
                <div className="pt-4">
                  <h3 className="font-serif text-base text-white font-medium mb-3">
                    Recent Collections ({products.slice(0, 4).length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-[#111015] border border-[#211c13] rounded-lg flex items-center gap-3"
                      >
                        <img
                          src={
                            p.image_url ||
                            (Array.isArray(p.image_urls) && p.image_urls[0]) ||
                            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded bg-[#1c1813]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-serif text-xs text-white truncate font-medium">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-[#c5a059] uppercase tracking-wider">
                            {p.category}
                          </div>
                          <div className="text-xs text-[#f7dfa5] font-semibold mt-0.5">
                            {formatCurrency(p.price, currency)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Supabase Status Card */}
              <div className="p-6 bg-[#131118] border border-[#2d2516] rounded-xl flex flex-col justify-between h-fit space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[#d4af37] mb-2">
                    <Database className="w-5 h-5" />
                    <h4 className="font-serif text-base text-white font-semibold">
                      Supabase Cloud Sync
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Khawaja Hasan Collection supports live synchronization with your Supabase database (`products` table & storage buckets).
                  </p>
                </div>

                <div className="p-4 bg-[#0e0d11] rounded-lg border border-[#211b11] text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Connection State:</span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isSupabaseConfigured ? 'Active / Configured' : 'Local Fallback'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Table Targeted:</span>
                    <span className="font-mono text-neutral-200">products</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Storage Target:</span>
                    <span className="font-mono text-neutral-200">products bucket</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsSupabaseModalOpen(true)}
                  className="w-full py-2.5 bg-[#201c13] hover:bg-[#2d2518] text-[#f7dfa5] border border-[#d4af37]/40 rounded text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
                >
                  Configure Supabase Keys
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Tab */}
        {activeTab === 'add-product' && (
          <AddProductView
            onProductCreated={onProductCreated}
            onNavigateToManage={() => setActiveTab('manage-products')}
          />
        )}

        {/* Manage Products Tab */}
        {activeTab === 'manage-products' && (
          <ManageProductsView
            products={products}
            currency={currency}
            onRefresh={onRefreshProducts}
            onNavigateToAdd={() => setActiveTab('add-product')}
            onProductUpdated={onRefreshProducts}
          />
        )}
      </main>

      {/* Supabase Settings Modal */}
      <SupabaseSettingsModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onRefreshData={onRefreshProducts}
      />
    </div>
  );
};
