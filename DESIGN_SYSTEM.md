# Joy&Co Party Rentals - Design System

## Project Overview
**Product:** B2C party/event rental e-commerce platform with admin inventory management
**Target Audience:** Event planners, party organizers, venue managers
**Key Features:** 
- Customer: Browse rental items via tile cards → add to cart → checkout
- Admin: Upload inventory items → bundle into packages → manage inventory
- AI Optimization: Semantic HTML, schema.org structured data, meta tags, fast Core Web Vitals

---

## Design System Foundation

### Color Palette (Accessible)
- **Primary (Trust/Professional):** #1E40AF (Blue-900)
- **Secondary (Action/Growth):** #3B82F6 (Blue-500)
- **Success/CTA:** #22C55E (Green-500)
- **Accent (Engagement):** #F59E0B (Amber-500)
- **Warning/Alert:** #EF4444 (Red-500)
- **Neutral Light:** #F9FAFB (Gray-50)
- **Neutral Dark:** #1F2937 (Gray-900)
- **Text Primary:** #111827 (Gray-900)
- **Text Secondary:** #6B7280 (Gray-500)
- **Border:** #E5E7EB (Gray-200)

**Contrast Ratios:** All text meets WCAG AA (4.5:1 minimum)

### Typography
- **Headings (H1-H6):** Poppins (600, 700 weight) - Modern, professional, friendly
- **Body Text:** Open Sans (400, 500 weight) - Clean, readable, approachable
- **Code/Data:** Menlo/Monaco - Monospace for prices and specs
- **Font Sizes:**
  - H1: 48px (desktop), 32px (mobile)
  - H2: 36px (desktop), 24px (mobile)
  - H3: 28px (desktop), 20px (mobile)
  - Body: 16px (minimum, never below)
  - Small: 14px

### Spacing System
- Base unit: 8px
- Scale: 8, 16, 24, 32, 40, 48, 56, 64px
- Gutters: 16px (mobile), 24px (tablet), 32px (desktop)
- Card padding: 24px
- Section margins: 64px vertical

### Border Radius
- Buttons/Small: 6px
- Cards/Medium: 12px
- Large containers: 16px
- Pills/Badges: 20px

### Shadows
- Elevation 1 (cards): `0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)`
- Elevation 2 (hover): `0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)`
- Elevation 3 (modals): `0 10px 40px rgba(0, 0, 0, 0.16)`
- Glass blur: `backdrop-filter: blur(10px)`

### Animation Timings
- Micro-interactions: 150ms (ease-in-out)
- Hover states: 200ms (ease-out)
- Page transitions: 300ms (ease-in-out)
- Reduced motion: Respect `prefers-reduced-motion: reduce`

---

## Component Standards

### Buttons
- **Height:** 44px (minimum touch target)
- **Padding:** 12px 24px (text), 12px (icon)
- **States:**
  - Default: `bg-blue-500 text-white`
  - Hover: `bg-blue-600 shadow-md` (darker, lifted)
  - Active: `bg-blue-700`
  - Disabled: `bg-gray-300 text-gray-500 cursor-not-allowed`
  - Focus: `outline-2 outline-offset-2 outline-blue-500`
- **Cursor:** Always `cursor-pointer` on interactive elements

### Cards (Rental Items & Admin Items)
- **Min height:** 320px (product card)
- **Image area:** 200px height (16:9 aspect ratio)
- **Padding:** 24px
- **Border:** 1px solid #E5E7EB
- **Hover effect:** Lift (shadow elevation 2) + subtle scale (1.02x)
- **Transition:** All 200ms ease-out

### Form Inputs
- **Height:** 44px
- **Padding:** 12px 16px
- **Border:** 1px solid #E5E7EB
- **Focus:** 2px outline offset blue-500
- **Labels:** Above input, 14px, bold, #1F2937

### Navigation
- **Sticky/Float:** 4px from edges (safe area)
- **Height:** 64px
- **Logo size:** 32px
- **Link spacing:** 16px between items
- **Active state:** Blue-500 underline or background

---

## SEO & AI Optimization

### Semantic HTML
- Use `<header>`, `<main>`, `<section>`, `<article>`, `<nav>` tags
- Heading hierarchy: H1 (1 per page), H2, H3 (never skip levels)
- Image alt text: Descriptive, 5-10 words (e.g., "Gold cocktail table with glass top and golden legs")
- Form labels: Always connected with `<label for="">` 

### Schema.org Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Party Table Set",
  "image": "https://example.com/image.jpg",
  "description": "Elegant round party table with 6 chairs",
  "price": "45.00",
  "priceCurrency": "USD",
  "availability": "https://schema.org/InStock",
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/party-table",
    "price": "45.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

### Meta Tags (Customer Pages)
```html
<meta name="description" content="Rent party tables, chairs, decorations & more. Affordable event rental packages for celebrations." />
<meta property="og:title" content="Joy&Co - Party Rentals" />
<meta property="og:image" content="hero-image.jpg" />
<meta property="og:description" content="Your one-stop shop for event rentals" />
<meta name="robots" content="index, follow" />
```

### Performance (Core Web Vitals)
- LCP (Largest Contentful Paint): < 2.5s → Optimize hero image, lazy-load below-fold
- FID (First Input Delay): < 100ms → Code-split, minimize JS
- CLS (Cumulative Layout Shift): < 0.1 → Reserve space for images, avoid late-loading ads
- Image optimization: WebP with fallbacks, `srcset` for responsive, lazy-load
- Font loading: `font-display: swap` for Google Fonts

### AI-Friendly Content
- Product descriptions: Clear, scannable, action-oriented
- Pricing clearly visible at item level
- FAQ sections with H2 headers
- Internal linking: "You might also like..." for cross-sells
- Breadcrumb navigation: Home > Category > Item

---

## Three Design Variations

### Design 1: **GLASSMORPHIC ELEGANCE** ✨
**Best for:** Premium party planners, luxury events, high-end clientele
**Vibe:** Sophisticated, modern, cutting-edge

- **Hero:** Glassmorphic cards floating over vibrant gradient background
- **Color Accent:** Amber/Gold (#F59E0B) for premium/luxury items
- **Product Cards:** Glass effect with backdrop blur, vibrant background
- **Admin:** Dark mode with glass cards and neon accents
- **Typography:** Poppins bold for impact
- **Effects:** Subtle animations, floating elements, layered depth

### Design 2: **VIBRANT & BOLD** 🎉
**Best for:** Playful party planners, colorful themes, creative events
**Vibe:** Energetic, modern, engaging

- **Hero:** Bold colorful gradients, bento grid layout
- **Color Accents:** Multiple brand colors (blue, green, amber, pink)
- **Product Cards:** Bright backgrounds, bold rounded corners
- **Admin:** Light mode with vibrant accent colors and clear CTAs
- **Typography:** Poppins heavy weights for personality
- **Effects:** Smooth transitions, hover scale, vibrant shadows

### Design 3: **MINIMAL & DIRECT** 🎯
**Best for:** Corporate events, formal occasions, professional planners
**Vibe:** Clean, professional, sophisticated

- **Hero:** Minimal text, plenty of white space, single hero image
- **Color Accents:** Primary blue + success green only
- **Product Cards:** Simple white cards, minimal borders
- **Admin:** Light, airy interface with clear data hierarchy
- **Typography:** Open Sans for maximum readability
- **Effects:** Subtle shadows, clean hover states, no animation clutter

---

## Implementation Checklist

### Pre-Delivery Quality
- [ ] No emoji icons (use Heroicons/Lucide SVG)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states smooth (150-300ms), no layout shift
- [ ] Focus visible (outline-2 offset-2) for keyboard nav
- [ ] Images optimized (WebP, srcset, lazy-load)
- [ ] Mobile: 375px, Tablet: 768px, Desktop: 1440px responsive
- [ ] Dark mode colors verified (if applicable)
- [ ] Alt text on all meaningful images
- [ ] Form labels connected with `<label for="">`
- [ ] Prefers-reduced-motion respected
- [ ] WCAG AA contrast (4.5:1 minimum)

### SEO & Performance
- [ ] H1 tag per page (1 only)
- [ ] Meta descriptions (150-160 chars)
- [ ] Schema.org markup for products
- [ ] Image alt text descriptive (5-10 words)
- [ ] Internal links with descriptive anchor text
- [ ] Mobile-first CSS
- [ ] Font loading optimized (`font-display: swap`)
- [ ] Core Web Vitals < targets (LCP 2.5s, FID 100ms, CLS 0.1)
- [ ] No render-blocking resources
- [ ] Lazy-load images below fold

