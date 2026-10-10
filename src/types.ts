export interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  old_price?: number | null;
  tag?: string | null;
  image_url: string;
  image_urls?: string[] | null;
  description?: string | null;
  active?: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export type CurrencyCode = 'INR' | 'USD' | 'GBP' | 'AED' | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromINR: number; // multiplier from INR
}

export interface OrderDetails {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  items: CartItem[];
  totalAmount: number;
  currency: CurrencyCode;
  paymentMethod: 'cod' | 'bank_transfer' | 'card';
  createdAt: string;
}
