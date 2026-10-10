import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from './constants';

const STORAGE_KEYS = {
  SUPABASE_URL: 'kh_supabase_url',
  SUPABASE_ANON_KEY: 'kh_supabase_anon_key',
  PRODUCTS_CACHE: 'kh_products_cache_v2',
};

// Retrieve configured or saved credentials
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  const savedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '' : '';
  const savedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY) || '' : '';

  return {
    url: (savedUrl || envUrl).trim(),
    anonKey: (savedKey || envKey).trim(),
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
    else localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);

    if (anonKey) localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
  }
  supabaseInstance = null; // Reset client
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

export function isSupabaseConnected(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey);
}

// Local storage fallback cache
function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS_CACHE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading local products cache:', e);
  }
  // Store default catalogue
  localStorage.setItem(STORAGE_KEYS.PRODUCTS_CACHE, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

function saveLocalProducts(products: Product[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS_CACHE, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving local products cache:', e);
    }
  }
}

/**
 * Fetch all products
 * Fetches from Supabase if credentials are provided, with seamless fallback
 */
export async function fetchProducts(): Promise<{ products: Product[]; source: 'supabase' | 'local'; error?: string }> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch query error:', error.message);
        // Fallback to local products but return warning
        return {
          products: getLocalProducts(),
          source: 'local',
          error: `Supabase query: ${error.message}. Loaded cached items.`
        };
      }

      if (data && Array.isArray(data)) {
        // Normalize fields if needed
        const formatted: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name || 'Couture Piece',
          category: item.category || 'Luxury Pret',
          price: Number(item.price) || 0,
          old_price: item.old_price ? Number(item.old_price) : null,
          tag: item.tag || null,
          image_url: item.image_url || (Array.isArray(item.image_urls) && item.image_urls[0]) || '',
          image_urls: Array.isArray(item.image_urls) && item.image_urls.length > 0 ? item.image_urls : (item.image_url ? [item.image_url] : []),
          description: item.description || '',
          active: item.active !== false,
          created_at: item.created_at || new Date().toISOString(),
        }));

        // Cache locally for offline resilience
        saveLocalProducts(formatted);

        return { products: formatted, source: 'supabase' };
      }
    } catch (err: any) {
      console.warn('Supabase network error:', err);
      return {
        products: getLocalProducts(),
        source: 'local',
        error: err?.message || 'Network error connecting to Supabase.'
      };
    }
  }

  // Not configured with Supabase yet
  return {
    products: getLocalProducts(),
    source: 'local'
  };
}

/**
 * Add a new product
 */
export async function createProduct(productData: Omit<Product, 'id' | 'created_at'>): Promise<{ product: Product; error?: string }> {
  const client = getSupabaseClient();
  const newProduct: Product = {
    ...productData,
    id: `kh-${Date.now()}`,
    created_at: new Date().toISOString(),
    active: productData.active ?? true,
    image_url: productData.image_url || (productData.image_urls && productData.image_urls[0]) || '',
    image_urls: productData.image_urls || (productData.image_url ? [productData.image_url] : []),
  };

  if (client) {
    try {
      const payload: any = {
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        old_price: newProduct.old_price ? Number(newProduct.old_price) : null,
        tag: newProduct.tag || null,
        image_url: newProduct.image_url,
        image_urls: newProduct.image_urls,
        description: newProduct.description,
        active: newProduct.active,
      };

      const { data, error } = await client
        .from('products')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Supabase product insert error:', error);
        throw new Error(error.message);
      }

      if (data) {
        const created: Product = {
          ...newProduct,
          id: data.id,
          created_at: data.created_at || newProduct.created_at,
        };
        // Also update local cache
        const local = getLocalProducts();
        saveLocalProducts([created, ...local]);
        return { product: created };
      }
    } catch (err: any) {
      console.warn('Supabase insert failed, persisting to local store:', err);
      // Fallback: save to local store and notify
      const local = getLocalProducts();
      saveLocalProducts([newProduct, ...local]);
      return { product: newProduct, error: `Saved locally: ${err?.message || 'Supabase error'}` };
    }
  }

  // Local fallback
  const local = getLocalProducts();
  const updated = [newProduct, ...local];
  saveLocalProducts(updated);
  return { product: newProduct };
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string | number, updates: Partial<Product>): Promise<{ product: Product; error?: string }> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const payload: any = { ...updates };
      // Ensure numeric formatting
      if (payload.price !== undefined) payload.price = Number(payload.price);
      if (payload.old_price !== undefined) payload.old_price = payload.old_price ? Number(payload.old_price) : null;

      // Keep image_url aligned with image_urls if provided
      if (payload.image_urls && payload.image_urls.length > 0 && !payload.image_url) {
        payload.image_url = payload.image_urls[0];
      }

      const { data, error } = await client
        .from('products')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        // Sync local cache
        const local = getLocalProducts().map(p => p.id === id ? { ...p, ...data } : p);
        saveLocalProducts(local);
        return { product: data };
      }
    } catch (err: any) {
      console.warn('Supabase update failed, updating local copy:', err);
      const local = getLocalProducts().map(p => p.id === id ? { ...p, ...updates } : p);
      saveLocalProducts(local);
      const updated = local.find(p => p.id === id) as Product;
      return { product: updated, error: `Updated locally: ${err?.message}` };
    }
  }

  // Local update
  const local = getLocalProducts().map(p => p.id === id ? { ...p, ...updates } : p);
  saveLocalProducts(local);
  const updated = local.find(p => p.id === id) as Product;
  return { product: updated };
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string | number): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { error } = await client
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.warn('Supabase delete failed, removing locally:', err);
      const local = getLocalProducts().filter(p => p.id !== id);
      saveLocalProducts(local);
      return { success: true, error: `Removed locally: ${err?.message}` };
    }
  }

  // Update local cache
  const local = getLocalProducts().filter(p => p.id !== id);
  saveLocalProducts(local);
  return { success: true };
}

/**
 * Upload image to Supabase Storage
 * Falls back to client-side data URL if bucket is not created or permissions are pending
 */
export async function uploadImage(file: File): Promise<{ url: string; error?: string }> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Try uploading to 'products' or 'product-images' bucket
      const bucketName = 'products';
      const { error: uploadError } = await client.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicData } = client.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (publicData?.publicUrl) {
          return { url: publicData.publicUrl };
        }
      } else {
        console.warn('Supabase storage upload error:', uploadError.message);
      }
    } catch (err: any) {
      console.warn('Supabase storage exception:', err);
    }
  }

  // Safe fallback to FileReader base64 so user can immediately view and save product images!
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ url: '', error: 'Could not read image file.' });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Seed initial catalog to Supabase if products table is newly created
 */
export async function seedProductsToSupabase(): Promise<{ count: number; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { count: 0, error: 'Supabase is not configured yet.' };
  }

  try {
    const itemsToInsert = INITIAL_PRODUCTS.map(p => ({
      name: p.name,
      category: p.category,
      price: p.price,
      old_price: p.old_price,
      tag: p.tag,
      image_url: p.image_url,
      image_urls: p.image_urls,
      description: p.description,
      active: true,
    }));

    const { data, error } = await client
      .from('products')
      .insert(itemsToInsert)
      .select();

    if (error) throw error;
    return { count: data?.length || itemsToInsert.length };
  } catch (err: any) {
    return { count: 0, error: err?.message || 'Failed to seed products.' };
  }
}
