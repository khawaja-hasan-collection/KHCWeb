import React, { useState } from 'react';
import { PlusCircle, Upload, CheckCircle2, AlertCircle, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import { CATEGORIES } from '../../lib/constants';
import { createProduct, uploadImage } from '../../lib/supabase';
import { Product } from '../../types';

interface AddProductViewProps {
  onProductCreated: (product: Product) => void;
  onNavigateToManage: () => void;
}

export const AddProductView: React.FC<AddProductViewProps> = ({
  onProductCreated,
  onNavigateToManage,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Sherwanis',
    price: '',
    old_price: '',
    tag: 'New Arrival',
    description: '',
    active: true,
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim() && !imageUrls.includes(imageUrlInput.trim())) {
      setImageUrls([...imageUrls, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadImage(file);
        if (res.url) {
          setImageUrls((prev) => [...prev, res.url]);
        }
      }
    } catch (err: any) {
      alert('Upload failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Validation
    if (!formData.name.trim()) {
      setStatusMessage({ type: 'error', text: 'Product name is required.' });
      return;
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setStatusMessage({ type: 'error', text: 'Selling price must be a valid number greater than 0.' });
      return;
    }

    const oldPriceNum = formData.old_price ? Number(formData.old_price) : null;
    if (oldPriceNum !== null && (isNaN(oldPriceNum) || oldPriceNum <= 0)) {
      setStatusMessage({ type: 'error', text: 'Original price must be a valid number.' });
      return;
    }

    // Default image fallback if none provided
    const finalImages = imageUrls.length > 0 
      ? imageUrls 
      : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'];

    setIsSubmitting(true);

    try {
      const result = await createProduct({
        name: formData.name.trim(),
        category: formData.category,
        price: priceNum,
        old_price: oldPriceNum,
        tag: formData.tag.trim() || null,
        description: formData.description.trim() || null,
        image_url: finalImages[0],
        image_urls: finalImages,
        active: formData.active,
      });

      if (result.error && !result.product) {
        setStatusMessage({ type: 'error', text: `Failed to save product: ${result.error}` });
      } else {
        setStatusMessage({
          type: 'success',
          text: `Piece "${result.product.name}" successfully created and saved! It is now active on the public website and hero slider.`,
        });
        onProductCreated(result.product);

        // Reset form
        setFormData({
          name: '',
          category: 'Sherwanis',
          price: '',
          old_price: '',
          tag: 'New Arrival',
          description: '',
          active: true,
        });
        setImageUrls([]);
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Database error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#241f13]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            Admin Catalog Management
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-wide mt-1">
            Add New Atelier Product
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            New additions are immediately synced with the homepage hero slider and collection grid.
          </p>
        </div>

        <button
          onClick={onNavigateToManage}
          className="px-4 py-2 rounded bg-[#1c1811] hover:bg-[#282216] border border-[#3d331d] text-[#f7dfa5] text-xs uppercase tracking-wider font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          View All Products
        </button>
      </div>

      {/* Status Feedback Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-lg border text-xs flex items-start gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
              : 'bg-red-950/70 border-red-500/60 text-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <div>
            <div className="font-semibold">{statusMessage.type === 'success' ? 'Success' : 'Error'}</div>
            <div>{statusMessage.text}</div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-[#121116] border border-[#262015] rounded-xl p-6 sm:p-8 space-y-6">
        {/* Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Maroon Velvet Prince Coat"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#18161e] border border-[#2e2617] focus:border-[#d4af37] rounded px-3 py-2.5 text-xs text-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-[#18161e] border border-[#2e2617] focus:border-[#d4af37] rounded px-3 py-2.5 text-xs text-white focus:outline-none transition cursor-pointer"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prices & Tag */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
              Selling Price (INR) *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 85000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-[#18161e] border border-[#2e2617] focus:border-[#d4af37] rounded px-3 py-2.5 text-xs text-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
              Original / Old Price (INR)
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 95000 (optional)"
              value={formData.old_price}
              onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
              className="w-full bg-[#18161e] border border-[#2e2617] focus:border-[#d4af37] rounded px-3 py-2.5 text-xs text-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
              Product Tag
            </label>
            <input
              type="text"
              placeholder="e.g. New Arrival, Bespoke, Bestseller"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="w-full bg-[#18161e] border border-[#2e2617] focus:border-[#d4af37] rounded px-3 py-2.5 text-xs text-white focus:outline-none transition"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
            Craftsmanship & Fabric Description
          </label>
          <textarea
            rows={3}
            placeholder="Describe the fabric weave (pure raw silk, Banarasi jamawar, micro-velvet), hand zardozi motifs, cut, and occasions..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-[#18161e] border border-[#2e2617] focus:border-[#d4af37] rounded px-3 py-2.5 text-xs text-white focus:outline-none transition leading-relaxed"
          />
        </div>

        {/* Product Images: URL or File Upload */}
        <div className="border-t border-[#231e13] pt-6 space-y-4">
          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium">
            Product Images (One or Multiple)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input URL */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste image URL (https://...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImageUrl();
                  }
                }}
                className="w-full bg-[#18161e] border border-[#2e2617] focus:border-[#d4af37] rounded px-3 py-2 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-[#221c13] hover:bg-[#312719] text-[#f7dfa5] border border-[#d4af37]/40 text-xs rounded uppercase font-semibold transition cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* Upload File to Storage */}
            <div>
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-[#18161e] hover:bg-[#252019] border border-dashed border-[#d4af37]/50 rounded cursor-pointer text-xs text-[#d4af37] transition">
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Uploading Image...' : 'Upload Image File (Supabase Storage)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Image Previews */}
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative w-20 h-24 rounded border border-[#38301e] overflow-hidden group bg-[#1a1713]">
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[#d4af37] text-[9px] text-center font-bold uppercase py-0.5">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active / Inactive Status Toggle */}
        <div className="border-t border-[#231e13] pt-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-white font-medium">
              Product Visibility Status
            </div>
            <div className="text-[11px] text-neutral-400">
              When active, this product immediately appears in the Hero Slider and public storefront.
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#252018] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
            <span className="ml-3 text-xs font-semibold text-neutral-300">
              {formData.active ? 'Active' : 'Inactive'}
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-8 py-3 bg-gradient-to-r from-[#d4af37] via-[#f7dfa5] to-[#c5a059] text-black font-bold uppercase tracking-widest text-xs rounded hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving to Supabase...' : 'Save & Publish Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
