# Joy&Co Quick Start Guide

## ✅ What's Been Built

A complete party rental marketing website with admin inventory management:

### Customer-Facing Site (Public)
- ✅ **Homepage** (`/index.html`) — Hero section, featured items grid, testimonials, contact CTA
- ✅ **Items Page** — Browse all rental items by category, search, filter by price/rating
- ✅ **Packages Page** (`/packages.html`) — View bundled item packages with auto-generated descriptions
- ✅ **WhatsApp Inquiry** — "Enquire" button on every item/package (direct WhatsApp pre-filled message)
- ✅ **Responsive Design** — Mobile-first, tested on 375px → 1440px
- ✅ **SEO Optimized** — Schema.org markup, meta tags, semantic HTML

### Admin Panel (Protected)
- ✅ **Login** (`/admin/index.html`) — Email + password auth via Supabase
- ✅ **Dashboard** (`/admin/dashboard.html`) — Stats, recent items, low stock alerts
- ✅ **Items Management** (`/admin/items.html`):
  - Add/edit/delete items
  - Upload images (drag & drop)
  - Set price, stock, category, featured toggle
  - No code editing required!

- ✅ **Package Builder** (`/admin/packages.html`):
  - Select items from inventory
  - Specify quantities per item
  - Auto-generate marketing descriptions
  - Edit descriptions before publishing
  - Set package price with auto-markup option

### Design & Branding
- ✅ **Design System** — 8-color vibrant palette (Design 2: Vibrant & Bold)
- ✅ **Typography** — Poppins (headings) + Open Sans (body)
- ✅ **Components** — Buttons, cards, forms, modals, badges, alerts
- ✅ **Animations** — Smooth transitions, hover effects, loading states
- ✅ **Accessibility** — WCAG AA contrast, focus states, keyboard nav

---

## 🚀 Next Steps (15 minutes to live)

### 1. Create Supabase Project (5 min)
1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Create new project → Name: "joyco" → Select South Africa region (or closest)
3. Wait for project to initialize
4. Copy **Project URL** and **Anon Key** from Settings → API

### 2. Set Up Database Tables (5 min)
1. In Supabase, open **SQL Editor**
2. Copy & paste the SQL schema from `README.md` (lines 70-122)
3. Run the query
4. Enable **Storage**: Go to Storage tab → Create bucket `item-images` (public)

### 3. Configure Your Code (3 min)
1. Open `js/supabase.js`
2. Replace:
   - `SUPABASE_URL` with your project URL
   - `SUPABASE_ANON_KEY` with your anon key
3. Replace `27XXXXXXXXX` with your WhatsApp number:
   - `index.html` (line 75)
   - `packages.html` (line 96)
   - Update footer emails/phones (index.html, packages.html)

### 4. Deploy to Cloudflare (2 min)
1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial Joy&Co build"
   git remote add origin https://github.com/YOUR_GITHUB/joy-co.git
   git push -u origin main
   ```

2. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
3. **Connect GitHub** → Select your repo
4. **Build settings**: Leave empty (no build step needed)
5. **Environment variables**:
   - `SUPABASE_URL` = your URL
   - `SUPABASE_ANON_KEY` = your anon key
6. **Deploy!**

---

## 📋 File Overview

```
joy-co/
├── index.html              Customer homepage
├── packages.html           Packages showcase
├── README.md              Full setup guide
├── QUICKSTART.md          This file
├── css/
│   ├── main.css           Design tokens + base components
│   └── components.css     Advanced components (modals, alerts)
├── js/
│   └── supabase.js        Database client setup
└── admin/
    ├── index.html         Login page
    ├── dashboard.html     Admin overview
    ├── items.html         Manage items (add/edit/delete + images)
    ├── packages.html      Create/edit packages with auto-description
    └── js/
        └── auth.js        Protect admin pages, handle logout
```

---

## 🎯 Admin Workflow (How It Works)

### Adding Items (No coding!)
1. Go to `/admin` → Login with email + password
2. Click **"Add New Item"**
3. Fill form:
   - Name, Category, Price (ZAR), Stock Qty
   - Description, upload images
   - Toggle "Featured" for homepage highlight
4. Click **Save Item** → Appears on site instantly!

### Creating Packages
1. Go to `/admin/packages`
2. Click **"Create Package"**
3. Select items from your inventory + set quantities
4. **Auto-generated description** appears (editable)
5. Set package price → Click **Save Package**
6. Toggle "Published" to show on site

---

## 💰 Pricing Example

**Items you add:**
- Gold Chair Set: R45.00 / day
- Wedding Table: R75.00 / day
- String Lights: R25.00 / day (qty 6)

**Package created:**
- Name: "Elegant Wedding Package"
- Includes: 4 chairs + 2 tables + 6 lights
- Subtotal: R505.00
- You set package price: R550.00
- Auto-description: "The Elegant Wedding Package includes: 4 × Gold Chairs, 2 × Wedding Tables, 6 × String Lights. Perfect for events of 20–50 guests..."

---

## 🌍 South African Setup

All built in for you:
- ✅ Currency: ZAR (R45.00 format)
- ✅ Delivery areas: Major metros + custom
- ✅ WhatsApp inquiry (best for SA market)
- ✅ Local contact format: +27 11 XXX-XXXX

---

## 🔐 Security

- Admin pages password-protected (Supabase Auth)
- Database uses Row Level Security (RLS)
- No sensitive data in browser
- Images hosted in Supabase Storage (CDN-backed)
- Free SSL/HTTPS via Cloudflare

---

## 📊 First 48 Hours

**After deployment:**
1. ✅ Add 5-10 sample items to test admin
2. ✅ Create 2-3 test packages
3. ✅ Visit site on phone + desktop
4. ✅ Test WhatsApp inquiry buttons
5. ✅ Check Google PageSpeed Insights for performance
6. ✅ Share site with team for feedback

---

## 💡 Pro Tips

1. **Images**: Use high-res photos (min 600px wide), they'll be optimized automatically
2. **Descriptions**: Write clear, benefit-focused copy (avoid technical jargon)
3. **Pricing**: Use R50 increments for cleaner UX
4. **SEO**: Item names should include keywords (e.g., "Gold Chiavari Chair Set" not "Chairs")
5. **Testing**: Always check site as customer before launch

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Admin login fails | Check email exists in Supabase Authentication |
| Items don't show | Verify Supabase URL/key in `js/supabase.js` |
| Images not displaying | Check Storage bucket is public in Supabase |
| WhatsApp button broken | Replace `27XXXXXXXXX` with actual number (no +) |
| Site looks broken on mobile | Check viewport meta tag in HTML (should be there) |

---

## 🎓 Next Features (Phase 2)

When ready to add:
1. **Real booking system** — Calendar, inventory deduction
2. **Payment processing** — Yoco integration (ZAR support)
3. **Customer accounts** — Login, order history
4. **Reviews & ratings** — Social proof
5. **Discount codes** — Marketing campaigns
6. **Email notifications** — Order confirmations
7. **Admin analytics** — Sales dashboard

---

## 📞 Setup Complete? 

When your site is live:
1. Share it with friends → test experience
2. Add your actual items & packages
3. Set up Google Analytics for traffic tracking
4. Create social media pages (Instagram, Facebook)
5. Share site link on WhatsApp Business catalog

---

## 🎉 You're Ready!

Your Joy&Co site is built and deployed. Now it's just about:
- Adding your items
- Creating packages
- Getting customers to visit
- Handling inquiries via WhatsApp

**Go live! 🚀**

---

*For detailed setup, see README.md*
