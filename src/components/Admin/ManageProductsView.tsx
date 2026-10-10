import React, { useState } from 'react';
import { 
  Search, 
  Edit3, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  ExternalLink, 
  AlertTriangle, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Product, CurrencyCode } from '../../types';
import { CATEGORIES, formatCurrency, FALLBACK_IMAGE } from '../../lib/constants';
import { updateProduct, deleteProduct } from '../../lib/supabase';

interface ManageProductsViewProps {
  products: Product[];
  currency: CurrencyCode;
  onRefresh: () => void;
  onNavigateToAdd: () => void;
  onProductUpdated: () => void;
}

export const ManageProductsView: React.FC<ManageProductsViewProps> = ({
  products,
  currency,
  onRefresh,
  onNavigateToAdd,
  onProductUpdated,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Filtered products
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tag && p.tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleActive = async (p: Product) => {
    const newActive = !p.active;
    await updateProduct(p.id, { active: newActive });
    onProductUpdated();
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingId);
      setDeletingId(null);
      onProductUpdated();
    } catch (err: any) {
      alert('Delete failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setEditForm({
      name: p.name,
      category: p.category,
      price: p.price,
      old_price: p.old_price,
      tag: p.tag,
      description: p.description,
      image_url: p.image_url,
      active: p.active,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSavingEdit(true);
    try {
      await updateProduct(editingProduct.id, {
        name: editForm.name,
        category: editForm.category,
        price: Number(editForm.price),
        old_price: editForm.old_price ? Number(editForm.old_price) : null,
        tag: editForm.tag || null,
        description: editForm.description || null,
        image_url: editForm.image_url,
        active: editForm.active,
      });

      setEditingProduct(null);
      onProductUpdated();
    } catch (err: any) {
      alert('Failed to update product: ' + (err?.message || 'Error'));
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#241f13]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Catalog Inventory
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-wide mt-1">
            Manage Atelier Products
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Total of {products.length} registered couture pieces. Updates immediately sync to homepage hero slider.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="p-2 rounded bg-[#18151c] hover:bg-[#252028] border border-[#383020] text-neutral-300 hover:text-white transition cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onNavigateToAdd}
            className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#aa771c] hover:brightness-110 text-black font-semibold text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by product name or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#131117] border border-[#262016] focus:border-[#d4af37] pl-9 pr-4 py-2 rounded text-xs text-white focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#131117] border border-[#262016] text-[#d4af37] text-xs px-3 py-2 rounded focus:outline-none cursor-pointer"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              Category: {c}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table (Desktop & Tablet) */}
      <div className="bg-[#111015] border border-[#241e15] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#17151c] border-b border-[#241e15] text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Tag</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1913]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-neutral-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const img = product.image_url ||
                    (Array.isArray(product.image_urls) && product.image_urls[0]) ||
                    FALLBACK_IMAGE;

                  return (
                    <tr key={product.id} className="hover:bg-[#18151f] transition">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={product.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                            }}
                            className="w-12 h-14 object-cover rounded bg-[#1c1813] border border-[#2b2416]"
                          />
                          <div className="max-w-xs">
                            <div className="font-serif text-white font-medium line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-[10px] text-neutral-500 font-mono">
                              ID: {String(product.id).substring(0, 10)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-[#c5a059] uppercase tracking-wider font-medium text-[11px]">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-serif font-bold text-[#f7dfa5]">
                          {formatCurrency(product.price, currency)}
                        </div>
                        {product.old_price && (
                          <div className="text-[10px] text-neutral-500 line-through">
                            {formatCurrency(product.old_price, currency)}
                          </div>
                        )}
                      </td>

                      {/* Tag */}
                      <td className="py-3 px-4">
                        {product.tag ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#1a1711] border border-[#d4af37]/40 text-[#d4af37] uppercase tracking-wider">
                            {product.tag}
                          </span>
                        ) : (
                          <span className="text-neutral-600">—</span>
                        )}
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer ${
                            product.active !== false
                              ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-400'
                              : 'bg-neutral-800 border border-neutral-700 text-neutral-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.active !== false ? 'bg-emerald-400' : 'bg-neutral-500'
                            }`}
                          />
                          <span>{product.active !== false ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEdit(product)}
                            className="p-1.5 text-neutral-400 hover:text-[#d4af37] hover:bg-[#201c13] rounded transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeletingId(product.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-950/30 rounded transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#121116] border border-red-900/60 rounded-xl p-6 shadow-2xl text-neutral-200">
            <div className="flex items-center gap-2 text-red-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif text-lg text-white font-semibold">
                Confirm Product Deletion
              </h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete this product? It will be removed from your Supabase database and will no longer appear on the website or hero slider.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded bg-[#1a1820] hover:bg-[#25222e] text-neutral-300 text-xs uppercase font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-bold transition cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-[#121116] border border-[#3d331e] rounded-xl p-6 sm:p-8 shadow-2xl text-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#241f13] mb-6">
              <h3 className="font-serif text-xl text-white font-semibold">
                Edit Atelier Product
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-[#18161e] border border-[#2e2617] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                    Category *
                  </label>
                  <select
                    value={editForm.category || 'Sherwanis'}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-[#18161e] border border-[#2e2617] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                    Product Tag
                  </label>
                  <input
                    type="text"
                    value={editForm.tag || ''}
                    onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                    className="w-full bg-[#18161e] border border-[#2e2617] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                    Selling Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editForm.price ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full bg-[#18161e] border border-[#2e2617] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                    Original Price (INR)
                  </label>
                  <input
                    type="number"
                    value={editForm.old_price ?? ''}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        old_price: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full bg-[#18161e] border border-[#2e2617] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                  Primary Image URL
                </label>
                <input
                  type="url"
                  value={editForm.image_url || ''}
                  onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                  className="w-full bg-[#18161e] border border-[#2e2617] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-[#18161e] border border-[#2e2617] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs uppercase tracking-wider text-neutral-300">
                  Active Status
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.active ?? true}
                    onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#252018] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#231e13]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded bg-[#1c1820] text-neutral-300 text-xs uppercase font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-6 py-2 rounded bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black text-xs uppercase tracking-wider font-bold transition shadow-md disabled:opacity-50"
                >
                  {isSavingEdit ? 'Saving Changes...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
