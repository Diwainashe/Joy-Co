# Joy&Co Party Rental Platform - System Documentation

A modern, full-featured party and event rental platform built with vanilla JavaScript (OOP architecture), Supabase backend, and responsive design. Joy&Co specializes in premium party rentals across South Africa including inflatables, soft play equipment, furniture, and back arches.

---

## System Overview

Joy&Co is a two-tier web application with a public-facing storefront and a private admin dashboard:

- **Public Frontend** (`index.html`, `contact.html`, `packages.html`) — Browse items, view packages, submit reviews
- **Admin Dashboard** (`admin/index.html`) — Manage inventory, packages, and moderate customer reviews
- **Backend** — Supabase (PostgreSQL) with Row-Level Security for data protection
- **Authentication** — Supabase Auth for admin access; public review submissions require moderation

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript (OOP), HTML5, CSS3 |
| **Architecture** | Modular class-based system with event delegation |
| **Backend** | Supabase (PostgreSQL database + REST API) |
| **Storage** | Supabase Storage (image uploads) |
| **Auth** | Supabase Authentication (email/password for admin) |
| **Hosting** | Static site deployment (GitHub Pages, Vercel, Netlify, Cloudflare) |
| **Design System** | CSS custom properties (variables), responsive grid/flexbox |

---

## File Structure

```
joy&co/
├── PUBLIC PAGES
│   ├── index.html              # Homepage: items grid, gallery carousels, reviews
│   ├── contact.html            # Contact form & review submission
│   └── packages.html           # Package listings with filtering
│
├── ADMIN DASHBOARD
│   └── admin/
│       ├── index.html          # Admin dashboard & review moderation
│       └── js/
│           ├── auth.js         # Authentication guard & logout
│           └── reviews.js      # ReviewsManager class (pending/approved tabs)
│
├── JAVASCRIPT MODULES (OOP Classes)
│   └── js/
│       ├── carousel.js         # Carousel class: image/reviews carousels with smart scrolling
│       ├── nav.js              # NavManager: shared burger menu + secret admin access
│       ├── items.js            # ItemsLoader: fetch & render items from Supabase
│       ├── reviews-carousel.js # ReviewsCarousel: dynamic reviews with autoplay
│       ├── contact-form.js     # ContactForm: form submission & validation
│       └── supabase.js         # Supabase client config & helper functions
│
├── STYLING
│   ├── css/
│   │   ├── main.css            # Design system: colors, typography, spacing, components
│   │   └── components.css      # Component styles: carousels, modals, badges, animations
│
├── ASSETS
│   └── uploads/
│       ├── inflatables-*.jpeg  # Product photos (5 images)
│       ├── soft-play-*.jpeg    # Soft play equipment (2 images)
│       ├── e.jpeg, g.jpeg      # Brand showcase (2 images)
│       └── a.jpeg, b.jpeg, c.jpeg, d.jpeg  # Logo variants
│
├── CONFIGURATION
│   ├── .gitignore              # Git ignore: .md files, node_modules, .env
│   └── README.md               # This file

```

---

## Architecture & OOP Design

The codebase follows Object-Oriented Programming principles with clean separation of concerns. Each responsibility is isolated in its own class, promoting maintainability and reusability.

### Public Page Classes

#### **Carousel** (`js/carousel.js`)
Manages all image carousels (gallery slides and reviews).

**Features:**
- Smart scrolling: only shows arrow/dot controls if >3 images
- Continuous looping: advances one image per click, loops seamlessly with no blank spaces
- Centered layout: images center horizontally when ≤3 (auto-scroll off)
- Autoplay: 3.5s interval for gallery, 4s for reviews
- Pause-on-hover: stops autoplay on mouse enter, resumes on leave
- Responsive: adjusts slide width (300px desktop, 240px mobile) on window resize
- Event delegation: prev/next/dots use event delegation (no inline onclick)

**Key Methods:**
- `init()` — Initialize carousel and set up UI
- `next()`, `prev()`, `goTo(index)` — Navigation
- `play()`, `pause()` — Autoplay control
- `_update()` — Apply transform and update active dot

**Behavior Examples:**
- Inflatables (5 images): Scrollable, positions 0→1→2→loop
- Soft Play (2 images): Centered, no scroll controls
- Reviews: Dynamic from Supabase, scrollable if >1 review

---

#### **NavManager** (`js/nav.js`)
Shared navigation across all public pages (DRY principle).

**Features:**
- Burger menu toggle at ≤768px viewport width
- Opens/closes with ☰/✕ icon animation
- Closes on link click or outside click
- Secret admin access: tap logo 5 times within 3 seconds → redirects to `/admin/`

**Used on:** `index.html`, `contact.html`, `packages.html`

**Key Methods:**
- `init()` — Set up burger and logo-tap listeners
- `_setupBurger()` — Burger menu toggle logic
- `_setupLogoTap()` — Secret access sequence

---

#### **ItemsLoader** (`js/items.js`)
Fetches items from Supabase and renders product card grid.

**Features:**
- Queries Supabase: `SELECT * FROM items WHERE available = true`
- Renders cards with image, name, description, price, rating, WhatsApp CTA
- Error handling and empty state messaging
- Uses Supabase helper functions: `formatZAR()`, `getCardColorClass()`, `getWhatsAppLink()`

**Used on:** `index.html` (Featured Items section)

**Key Methods:**
- `load()` — Async fetch from Supabase
- `_renderCard(item, index)` — Single card HTML
- `_renderEmpty()`, `_renderError()` — Fallback states

---

#### **ReviewsCarousel** (`js/reviews-carousel.js`)
Loads approved reviews from Supabase and renders a scrollable carousel.

**Features:**
- Queries: `SELECT * FROM reviews WHERE status = 'approved' ORDER BY created_at DESC`
- Dynamic carousel rendering based on review count
- Autoplay (4s) with pause-on-hover
- Shows placeholder if no reviews exist
- Event delegation for prev/next/dot clicks

**Used on:** `index.html` (What Our Customers Say section)

**Key Methods:**
- `load()` — Async fetch approved reviews
- `_render()` — Render carousel or placeholder
- `_renderCard(review)` — Single review card (stars + quote + author)
- `next()`, `prev()`, `goTo(index)` — Navigation

---

#### **ContactForm** (`js/contact-form.js`)
Handles review form submission with validation and feedback.

**Features:**
- Form validation: name (required), rating (required), review text (required)
- Location field (optional)
- Star rating picker (1-5)
- Supabase insert: `INSERT INTO reviews (name, location, rating, body, status) VALUES (..., 'pending')`
- Toast notifications (success/error)
- Form reset after successful submit
- Button state management (loading, disabled)

**Used on:** `contact.html` (Leave a Review section)

**Key Methods:**
- `init()` — Set up form listener
- `_handleSubmit(e)` — Async Supabase insert
- `_showToast(message, type)` — Toast notification

---

### Admin Classes

#### **ReviewsManager** (`admin/js/reviews.js`)
Manages review moderation workflow (pending approval → published).

**Features:**
- Tab navigation: Pending and Approved reviews
- Queries Supabase with RLS: public can insert, admin can read/update/delete
- Approve action: `UPDATE reviews SET status = 'approved' WHERE id = ?`
- Delete action: `DELETE FROM reviews WHERE id = ?`
- Pending count badge in sidebar (auto-updates)
- Event delegation for approve/delete buttons
- Auto-refresh after each action

**Used on:** `admin/index.html` (⭐ Reviews section)

**Key Methods:**
- `init()` — Set up tabs and event listeners
- `loadPending()`, `loadApproved()` — Fetch from Supabase
- `approve(id)`, `delete(id, tab)` — Actions
- `showTab(tab)` — Switch between tabs
- `_render()` — Generate table rows
- `_updateBadge()` — Update pending count display

---

#### **Auth** (`admin/js/auth.js`)
Protects admin pages with Supabase authentication.

**Features:**
- Checks session on page load
- Redirects unauthenticated users to login
- Logout functionality (clears session)
- Stores user info in `window.adminUser`

---

## Database Schema

### `reviews` Table
```sql
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public: insert pending reviews only
CREATE POLICY "reviews_insert_public" ON reviews
  FOR INSERT WITH CHECK (status = 'pending');

-- Public: read only approved reviews
CREATE POLICY "reviews_select_approved" ON reviews
  FOR SELECT USING (status = 'approved');

-- Admin: full access
CREATE POLICY "reviews_admin_all" ON reviews
  FOR ALL USING (auth.uid() IS NOT NULL);
```

### `items` Table
```sql
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price_zar numeric NOT NULL,
  category text,
  available boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Related: item_images table for product photos
CREATE TABLE item_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  url text NOT NULL,
  is_primary boolean DEFAULT false
);
```

### `packages` Table
```sql
CREATE TABLE packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  auto_description text,
  price_zar numeric NOT NULL,
  featured boolean DEFAULT false,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Join table: relates packages to items
CREATE TABLE package_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1
);
```

---

## End-to-End Workflows

### Workflow 1: Customer Browsing Items
1. User visits `index.html`
2. Page loads; JavaScript instantiates `ItemsLoader` and `Carousel` classes
3. `ItemsLoader.load()` queries Supabase: `SELECT * FROM items WHERE available=true`
4. Items rendered in grid with images, pricing, "Enquire" WhatsApp button
5. Gallery carousels auto-render:
   - Inflatables (5 images) → scrollable
   - Soft Play (2 images) → centered, no scroll
   - Brand (2 images) → centered, no scroll
6. Reviews carousel loads approved reviews and auto-scrolls
7. Mobile: burger menu appears at ≤768px; user can tap ☰ to see nav links

---

### Workflow 2: Customer Submitting Review
1. Customer clicks "Leave a Review" button
2. Navigates to `contact.html`
3. Fills form: name, rating (1-5 star picker), review text
4. Clicks "Submit Review"
5. `ContactForm._handleSubmit()` validates form
6. Supabase: `INSERT INTO reviews (...) VALUES (..., status='pending')`
7. Toast notification: "Thanks! Your review will appear once approved."
8. Form resets
9. Review stored in database but NOT visible on homepage yet

---

### Workflow 3: Admin Moderating Reviews
1. Admin logs in to `/admin/index.html`
2. Dashboard shows pending count badge (⭐ Reviews)
3. Admin clicks "Reviews" in sidebar
4. Pending tab loads automatically
5. `ReviewsManager.loadPending()` queries Supabase: `SELECT * FROM reviews WHERE status='pending'`
6. Reviews displayed in table with Approve/Delete buttons
7. Admin clicks "Approve":
   - `ReviewsManager.approve(id)` runs: `UPDATE reviews SET status='approved' WHERE id=?`
   - Review immediately appears in homepage carousel
   - Pending count badge updates (decrements)
8. Or admin clicks "Delete":
   - `ReviewsManager.delete(id)` runs: `DELETE FROM reviews WHERE id=?`
   - Review removed
   - Pending count badge updates

---

### Workflow 4: Mobile Burger Menu
1. User on mobile (width ≤768px)
2. Burger button (☰) appears in top-right of nav
3. User taps ☰
4. `NavManager._setupBurger()` toggles class `.open` on nav-links
5. Nav links slide down from top
6. Button icon changes to ✕
7. User clicks a link (e.g., "Packages")
8. Menu automatically closes, icon reverts to ☰

---

### Workflow 5: Secret Admin Access
1. User on any public page
2. Taps Joy&Co logo in top-left navbar
3. Tap count increments; timer resets on each tap
4. After 5 taps within 3 seconds:
   - `NavManager._setupLogoTap()` redirects to `/admin/`
   - Admin login page displays

---

## Design System & Styling

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| **Gold** | #c89a3a | Primary brand, accents, active states |
| **Coral** | #e89881 | Secondary accent, buttons |
| **Sage** | #93a37a | Tertiary accent |
| **Lilac** | #b094c8 | Links, hover states |
| **Pink** | #ff6eb4 | Alerts, call-to-action |
| **Mint** | #a8e6d7 | Success states |
| **Dark** | #111827 | Text, backgrounds |
| **Light** | #F9FAFB | Light backgrounds |
| **Gray** | #6B7280 | Secondary text |

### Typography
- **Headings**: Fraunces (serif, 400–500 weight) — professional, elegant
- **Body**: Open Sans (sans-serif, 400–500 weight) — clean, readable
- **Script**: Dancing Script (cursive, 600 weight) — brand accent, decorative

### Spacing
8px base unit with scale:
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 40px, 3xl: 48px+

### Responsive Breakpoints
- **Mobile**: ≤640px (max 375px width)
- **Tablet**: 641–1024px (768px target)
- **Desktop**: ≥1025px (1440px+ wide screens)

---

## Key Features & Highlights

### Smart Carousel Behavior
- Images ≤3: centered layout, no scroll controls, all visible at once
- Images >3: left-aligned, scrollable with arrows/dots, autoplay
- Looping: after last image, smoothly loops back to first (no blanks)
- Responsive: slide width adapts to mobile vs desktop

### Security & Access Control
- **Public**: Can view items, packages, submit reviews (pending moderation)
- **Admin**: Protected by Supabase Auth; full CRUD on items, packages, reviews
- **RLS Policies**: Enforce access at database level, not just frontend

### Mobile Optimization
- Hamburger menu (≤768px)
- Touch-friendly buttons and star picker
- Full-width carousels
- Responsive images (lazy-loaded)
- Proper viewport scaling

### Performance
- No build step (vanilla JS, no compilation)
- Lazy-loaded images (load on-demand)
- Event delegation (fewer listeners)
- CSS transitions (hardware-accelerated)
- Supabase caching (REST API + database query caching)

---

## Configuration & Deployment

### Environment Setup
1. Clone repository: `git clone https://github.com/Diwainashe/Joy-Co.git`
2. Create Supabase project and set up tables (see SETUP_REVIEWS.md)
3. Add Supabase URL & anon key to `js/supabase.js`
4. Update WhatsApp number: search `27732026535` in HTML files
5. Start local server: `python -m http.server 8000`
6. Test at `http://localhost:8000`

### Deploying Changes
1. Make code changes locally
2. Test on mobile/desktop
3. Commit: `git add . && git commit -m "description"`
4. Push: `git push origin master`
5. Site auto-deploys (GitHub Pages, Vercel, Netlify, or Cloudflare Pages)

---

## Code Quality & Best Practices

### OOP Principles Applied
- **Single Responsibility**: One class per domain (Carousel, NavManager, ContactForm)
- **Encapsulation**: Private methods prefixed with `_`
- **Reusability**: NavManager shared across 3 pages; Carousel used for 4 carousels
- **Event Delegation**: Buttons use `data-*` attributes, not inline onclick
- **Dependency Injection**: Classes receive element IDs, not globals

### Lines of Code Reduction
- **index.html**: 330 lines inline JS → 50 lines boot script (85% reduction)
- **contact.html**: 100 lines → 8 lines (92% reduction)
- **packages.html**: 80 lines → 6 lines (93% reduction)

---

## Future Enhancements

1. **Booking System** — Calendar-based rental date selection
2. **Payment Integration** — Stripe/PayPal for online payments
3. **Analytics** — Track popular items, booking trends, revenue
4. **Inventory Management** — Track availability per date range
5. **Email Notifications** — Booking confirmations, review approvals
6. **Search & Filtering** — Full-text search, advanced filters
7. **Customer Accounts** — Save preferences, booking history

---

## Testing Checklist

- [x] Homepage loads items from Supabase
- [x] Carousels: galleries scroll smoothly (1 image per advance)
- [x] Carousels: ≤3 images centered, >3 scrollable
- [x] Reviews carousel: loads approved reviews, autoplay 4s
- [x] Contact form: submits to Supabase, shows toast, resets
- [x] Mobile: burger menu opens/closes at ≤768px
- [x] Mobile: logo tap sequence (5 taps in 3s) works
- [x] Admin: login/logout works
- [x] Admin: Reviews Pending tab loads pending reviews
- [x] Admin: Approve button updates status, refreshes page
- [x] Admin: Delete button removes review, updates badge
- [x] Footer: year updates dynamically

---

## Support & Maintenance

**Developer**: Diwainashe (web development)  
**Contact**: hello@joyco.co.za  
**Repository**: https://github.com/Diwainashe/Joy-Co

---

**Version**: 2.0 (OOP Architecture + Smart Carousels)  
**Last Updated**: May 2026  
**Status**: Production Ready
