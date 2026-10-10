import { CurrencyCode, CurrencyConfig, Product } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rateFromINR: 1 },
  USD: { code: 'USD', symbol: '$', rateFromINR: 0.012 },
  GBP: { code: 'GBP', symbol: '£', rateFromINR: 0.0094 },
  AED: { code: 'AED', symbol: 'AED ', rateFromINR: 0.044 },
  EUR: { code: 'EUR', symbol: '€', rateFromINR: 0.011 },
};

export const CATEGORIES = [
  'All',
  'Sherwanis',
  'Prince Coats',
  'Embroidered Kurtas',
  'Waistcoats',
  'Royal Shawls',
  'Accessories'
];

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80';

// Initial curated Khawaja Hasan Collection catalog
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'kh-001',
    name: 'Imperial Zardozi Raw Silk Sherwani',
    category: 'Sherwanis',
    price: 185000,
    old_price: 215000,
    tag: 'Bespoke Masterpiece',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85',
    image_urls: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=85'
    ],
    description: 'Handcrafted in pure ivory raw silk featuring antique bullion, dabka, and real zardozi embroidery across the collar, cuffs, and front closure. Tailored for the modern royal groom.',
    active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    id: 'kh-002',
    name: 'Midnight Velvet Prince Coat',
    category: 'Prince Coats',
    price: 95000,
    old_price: 110000,
    tag: 'New Arrival',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=85',
    image_urls: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1400&q=85'
    ],
    description: 'Sculpted from deep midnight Italian micro-velvet adorned with customized crested metallic buttons and tonal silk hand-knotting. Perfectly paired with tailored straight trousers.',
    active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    id: 'kh-003',
    name: 'Gilded Resham Embroidered Kurta Set',
    category: 'Embroidered Kurtas',
    price: 42000,
    old_price: 48000,
    tag: 'Bestseller',
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1400&q=85',
    image_urls: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85'
    ],
    description: 'Woven from premium Egyptian long-staple cotton silk blend with intricate gold resham needlework over the placket and cuffs. Comes with matching churidar pajama.',
    active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString()
  },
  {
    id: 'kh-004',
    name: 'Antique Gold Jamawar Waistcoat',
    category: 'Waistcoats',
    price: 38000,
    old_price: 45000,
    tag: 'Limited Edition',
    image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1400&q=85',
    image_urls: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1400&q=85'
    ],
    description: 'Handloom antique gold Banarasi Jamawar featuring regal paisley motifs with bespoke filigree buttons. Ideal accent for festive evenings and wedding ceremonies.',
    active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
  },
  {
    id: 'kh-005',
    name: 'Royal Heritage Pashmina Shawl',
    category: 'Royal Shawls',
    price: 68000,
    old_price: 78000,
    tag: 'Pure Kashmiri Weave',
    image_url: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=1400&q=85',
    image_urls: [
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=1400&q=85'
    ],
    description: 'Authentic pure pashmina drape with intricate sozni tilla needlework borders. An heirloom piece passed through generations, providing royal warmth and grandeur.',
    active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString()
  },
  {
    id: 'kh-006',
    name: 'Emerald Green Velvet Jodhpuri Prince Coat',
    category: 'Prince Coats',
    price: 115000,
    old_price: 130000,
    tag: 'Signature Couturier',
    image_url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1400&q=85',
    image_urls: [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1400&q=85'
    ],
    description: 'Deep royal emerald plush velvet structured with structured shoulder pads, stand Mandarin collar, and hand-embroidered crest motif in micro gold beads.',
    active: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString()
  }
];

export function formatCurrency(amount: number | null | undefined, currency: CurrencyCode = 'INR'): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return 'Price on Inquiry';
  }
  const config = CURRENCIES[currency] || CURRENCIES.INR;
  const converted = Math.round(Number(amount) * config.rateFromINR);

  if (currency === 'INR') {
    return `${config.symbol}${converted.toLocaleString('en-IN')}`;
  }
  return `${config.symbol}${converted.toLocaleString()}`;
}
