# Joy&Co Party Rentals

A modern, vibrant marketing website for party and event item rentals in South Africa. Built with vanilla HTML, CSS, and JavaScript — no build tools required.

## 🚀 Quick Start

### Prerequisites
1. **GitHub Account** — To host the code (free)
2. **Supabase Account** — For database and storage (free tier included)
3. **Cloudflare Account** — For hosting (free)
4. **WhatsApp Business Number** — For customer inquiries (or personal)

### Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose South Africa region if available, or closest region)
3. In the SQL Editor, run the schema setup script below:

```sql
-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color_hex TEXT,
  icon_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price_zar DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  stock_qty INTEGER DEFAULT 0,
  damage_deposit DECIMAL(10, 2),
  featured BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Item images table
CREATE TABLE item_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Packages table
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  auto_description BOOLEAN DEFAULT TRUE,
  price_zar DECIMAL(10, 2) NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Package items join table
CREATE TABLE package_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Set up Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_items ENABLE ROW LEVEL SECURITY;

-- Public can read items and packages
CREATE POLICY "items_select_public" ON items FOR SELECT USING (true);
CREATE POLICY "packages_select_public" ON packages FOR SELECT USING (true);
CREATE POLICY "item_images_select_public" ON item_images FOR SELECT USING (true);
CREATE POLICY "package_items_select_public" ON package_items FOR SELECT USING (true);

-- Storage setup
-- Create 'item-images' bucket in Storage tab (public)
```

4. Get your Supabase URL and Anon Key:
   - Settings → API
   - Copy "URL" and "anon" key

5. Update `js/supabase.js`:
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

### Step 2: Set Up Admin Authentication

1. In Supabase, go to Authentication → Users
2. Click "Invite" and add your admin email
3. Set a password for admin access
4. Admin can now log in at `/admin/`

### Step 3: Deploy to Cloudflare Pages

1. Push this repository to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
3. Connect your GitHub repo
4. Build settings:
   - Framework: None
   - Build command: (leave empty)
   - Build output directory: (leave empty)
5. Add environment variables:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
6. Deploy!

### Step 4: Configure Settings

1. **Update WhatsApp number** in:
   - `index.html` (hero section, line ~75)
   - `packages.html` (line ~96)
   - `js/supabase.js` (line ~27)

   Replace `27XXXXXXXXX` with your WhatsApp business number (with country code, no +)

2. **Update contact info** in footer:
   - Email: `hello@joyco.co.za`
   - Phone: `+27 XX XXX-XXXX`

3. **Custom domain** (optional):
   - Domain registrar: Point `joyco.co.za` to Cloudflare nameservers
   - Cloudflare: Add custom domain in Pages settings

---

## 📁 Project Structure

```
joy-co/
├── index.html                 # Homepage (hero, featured items, testimonials)
├── packages.html              # Packages grid page
├── css/
│   ├── main.css              # Design system (colors, typography, spacing)
│   └── components.css        # Components (modals, badges, alerts, animations)
├── js/
│   └── supabase.js           # Supabase client setup & helper functions
└── admin/
    ├── index.html            # Admin login page
    ├── dashboard.html        # Admin dashboard (stats, overview)
    ├── items.html            # Manage rental items (CRUD)
    ├── packages.html         # Create/edit packages with auto-description
    └── js/
        └── auth.js           # Admin auth guard & logout
```

---

## 🎨 Design System

**Colors** (Design 2: Vibrant & Bold):
- Primary: Blue (#3B82F6)
- Secondary: Green (#10B981)
- Accent: Amber (#F59E0B), Pink (#EC4899), Purple (#8B5CF6), Coral (#FF6B6B)

**Typography**:
- Headings: Poppins 600–800 (bold, modern)
- Body: Open Sans 400–500 (readable, clean)

**Spacing**: 8px base unit
- Small: 8px, Medium: 16px, Large: 24px, XL: 32px, 2XL: 40px, etc.

**Border Radius**:
- Small: 6px, Medium: 12px, Large: 16px, XL: 20px (cards)

---

## 👥 Admin Features

### Dashboard (`/admin/dashboard.html`)
- View item count, package count, featured items, low stock alerts
- Quick links to add items or create packages
- Recent items and packages overview

### Manage Items (`/admin/items.html`)
- Add new rental items
- Edit item details (name, description, price, stock, category, images)
- Toggle featured/available status
- Upload multiple images (drag & drop supported)
- Delete items

**Item Fields**:
- Name, Category, Price (ZAR), Stock Quantity, Damage Deposit
- Description, Featured toggle, Availability toggle
- Multiple images (lazy-loaded, optimized)

### Create Packages (`/admin/packages.html`)
- Select multiple items from inventory
- Specify quantity per item
- Auto-generate description from items
- Edit description before publishing
- Set package price (with 5% auto-markup option)
- Toggle featured/published status

**Auto-Generated Description**:
```
The [Package Name] includes:
• [Qty] × [Item Name]
• [Qty] × [Item Name]

Perfect for events of 20–50 guests.
All items professionally delivered and collected by Joy&Co.
```

---

## 🔒 Security & Privacy

- **Admin pages** protected by Supabase Auth
- **Database** uses Row Level Security (RLS) to prevent unauthorized access
- **Images** stored in Supabase Storage with URL expiration (configurable)
- **POPIA compliant** — See `PRIVACY_POLICY.md` (create this with your legal team)
- **No sensitive data** in client-side code

---

## 📱 Responsive Design

Fully responsive across:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1024px, 1440px+

All elements tested on modern browsers (Chrome, Safari, Firefox, Edge).

---

## 🌍 South Africa Localization

✅ Prices in ZAR (R format)  
✅ Delivery areas: Johannesburg, Cape Town, Durban, Pretoria, + custom  
✅ 9 provinces in address form  
✅ SAST timezone  
✅ 15% VAT included in display prices  
✅ WhatsApp inquiries (popular in SA)  
✅ Public holidays calendar (for future booking features)  

---

## ⚡ Performance Optimizations

- **Lazy-load images** — Images load only when visible
- **WebP format** — Automatic fallback to JPEG
- **Responsive images** — Serves optimized sizes per device
- **No build tools** — Instant page load (no JavaScript compilation)
- **Cached fonts** — Google Fonts preconnect
- **Minified CSS** — Production-ready stylesheets
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

---

## 🔍 SEO Features

✅ Semantic HTML (`<main>`, `<article>`, `<section>`, `<nav>`)  
✅ Schema.org markup (Product, LocalBusiness, ItemList)  
✅ Meta tags (title, description, og:image)  
✅ Alt text on all images  
✅ Mobile-first design  
✅ Sitemap (manual, can be auto-generated)  
✅ robots.txt (allow search engines)  
✅ Internal linking (related items, breadcrumbs)  

---

## 📝 Configuration Checklist

- [ ] Supabase project created and tables set up
- [ ] Supabase anon key added to `js/supabase.js`
- [ ] Admin email invited in Supabase Authentication
- [ ] WhatsApp business number added to pages
- [ ] Contact info (email, phone) updated
- [ ] GitHub repo created and pushed
- [ ] Cloudflare Pages connected to repo
- [ ] Custom domain configured (optional)
- [ ] First test item added via admin
- [ ] Site tested on mobile and desktop

---

## 🚀 Next Steps After Launch

1. **Add sample items** — Test the customer experience
2. **Create first packages** — Show how bundling works
3. **Monitor Core Web Vitals** — Use Google PageSpeed Insights
4. **Collect customer feedback** — Use Hotjar or surveys
5. **Track conversions** — Set up Google Analytics
6. **Optimize images** — Compress and test load times
7. **Add more features** — Booking system, reviews, discounts (Phase 2)

---

## 🆘 Troubleshooting

### Images not showing
- Check Supabase Storage bucket is public
- Verify image URLs are correct in database
- Check browser console for CORS errors

### Admin login not working
- Verify email is invited in Supabase Authentication
- Check password is set correctly
- Clear browser cookies and try again
- Check Supabase project is running

### Prices not displaying in ZAR
- Check `formatZAR()` function in `js/supabase.js`
- Verify Intl.NumberFormat support (modern browsers only)
- Test in Chrome DevTools

### Items not loading on homepage
- Check network tab in browser DevTools
- Verify Supabase URL and anon key are correct
- Check RLS policies allow public SELECT
- Check database has items with `available = true`

---

## 📞 Support

**For Supabase**: [supabase.com/support](https://supabase.com/support)  
**For Cloudflare**: [support.cloudflare.com](https://support.cloudflare.com)  
**For this project**: Email `hello@joyco.co.za`

---

## 📄 License

This project is proprietary to Joy&Co. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: May 2024  
**Made with ❤️ for Joy&Co**
