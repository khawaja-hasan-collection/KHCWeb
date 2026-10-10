# KHCWeb — Khawaja Hasan Collection

Luxury Indian occasionwear storefront with a dynamic product hero slider, product catalog, search and category filters, product quick view, cart, wishlist, checkout UI, and an admin dashboard. Product data can use Supabase or the built-in local fallback catalog.

## Run locally

Prerequisite: Node.js (a current LTS release).

```bash
npm install
npm run dev
```

Create a local `.env.local` file if you want to configure Supabase with environment variables:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

You can also configure the Supabase URL and public anon/publishable key in the app's Admin Portal settings. Never put a Supabase service-role key or other private secret in frontend code. Configure Supabase Auth, table permissions/RLS, and Storage policies before enabling live product management.

## Build

```bash
npm run build
npm run lint
```

## GitHub repository

This archive is prepared for a repository named `KHCWeb`. Extract the ZIP contents directly into the repository root so `package.json`, `index.html`, `src/`, and the configuration files are at the top level.

## Important notes

- Currency display defaults to Indian Rupees (INR); additional currencies are display conversions and their rates should be updated before production use.
- Confirm product pricing, contact details, shipping/returns policy, and payment integration before publishing.
- The checkout interface is not by itself a payment gateway or order-processing backend.
