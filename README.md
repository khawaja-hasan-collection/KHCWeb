# KHCWeb — Khawaja Hasan Collection

This is a static HTML version of the storefront. It does not require Vite, Node.js, npm, or a build step. GitHub Pages can serve `index.html` directly from the repository root.

## Deploy on GitHub Pages
1. Extract this ZIP.
2. Upload `index.html` and `README.md` directly to the root of the `KHCWeb` repository (not inside an extra nested folder).
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, then Save.

## Supabase
The site reads active records from the existing `products` table and expects these columns: `id`, `name`, `category`, `price`, `old_price`, `tag`, `image_url`, `image_urls`, `description`, `active`, `created_at`.

Admin sign-in uses Supabase Auth. The signed-in user's `app_metadata.role` must equal `admin`. Keep Row Level Security enabled and configure policies so public visitors can read active products while only authorized admins can insert, read all, and delete products. The browser key is a publishable/anon key only; never put a Supabase service-role key in a public site.

Product image URLs should be public HTTPS URLs. This no-build edition intentionally uses plain HTML/CSS/JavaScript and a Supabase CDN script, so it does not use Vite or a package manager.
