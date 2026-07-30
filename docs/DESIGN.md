# Design Specification: Zero-Maintenance Portfolio

## 1. Visual Thesis & Aesthetics
- **Visual Thesis:** A high-contrast Dark Editorial & Swiss Grid interface using an obsidian backdrop, structured typography, subtle glassmorphism borders, and energetic electric-teal accents.
- **Vibe & Mood:** Tech-forward, publication-grade, crisp, and high-density without clutter.
- **Design Signature:** Alternating Flex-Hero cards with full-bleed subtle border glows and dynamic logo/monogram resolution badges.

---

## 2. Color Palette & Depth System

### Palette Tokens (OKLCH Base)
- **Background Base (`--bg-base`):** `oklch(0.12 0.015 250)` (#0A0C10) — Obsidian dark core
- **Background Surface (`--bg-surface`):** `oklch(0.16 0.02 250)` (#12161F) — Elevated card backdrop
- **Background Surface Hover (`--bg-surface-hover`):** `oklch(0.20 0.025 250)` (#1A202C)
- **Text Primary (`--text-primary`):** `oklch(0.96 0.005 250)` (#F0F4F8) — Crisp off-white
- **Text Secondary (`--text-secondary`):** `oklch(0.70 0.015 250)` (#8C9BAE) — Soft gray-blue
- **Text Muted (`--text-muted`):** `oklch(0.48 0.02 250)` (#4A5568) — Dimmed metadata
- **Accent Primary (`--accent-teal`):** `oklch(0.80 0.18 190)` (#00F2FE) — Electric cyan-teal accent
- **Accent Soft (`--accent-teal-glow`):** `oklch(0.80 0.18 190 / 0.12)` — Subtle glow ring
- **Border Default (`--border-subtle`):** `oklch(0.25 0.02 250)` — 1px thin divider line

### Depth & Elevation
- **Card Border:** `1px solid var(--border-subtle)`
- **Hover Elevation:** `0 12px 32px -8px rgba(0, 242, 254, 0.08), inset 0 1px 0 rgba(255,255,255,0.08)`
- **Glassmorphism Backdrop:** `backdrop-filter: blur(12px)` for sticky headers and modal dialogs.

---

## 3. Typography & Hierarchy

- **Display & Section Titles:** `Syne`, `sans-serif` (700 / 800 weight) — Distinctive geometric structure.
- **Body Text:** `Inter`, `sans-serif` (400 / 500 weight) — Ultra-legible body text.
- **Code & Tech Badges:** `JetBrains Mono`, `monospace` (500 weight) — Technical tags and metadata.

| Role | Font Family | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Hero Title | Syne | `3.5rem` (`56px`) | 800 | 1.1 | `-0.03em` |
| Section Headline | Syne | `2.25rem` (`36px`)| 700 | 1.2 | `-0.02em` |
| Card Title | Syne | `1.5rem` (`24px`) | 700 | 1.3 | `-0.01em` |
| Body Text | Inter | `1.0rem` (`16px`) | 400 | 1.6 | `0em` |
| Badge / Tag | JetBrains Mono | `0.8125rem` (`13px`)| 500 | 1.0 | `0.04em` |

---

## 4. Dynamic Component Specifications

### 4.1 Tier-1 Flagship Layout Engine (Odd/Even Flex-Hero)
- **Container:** Full-width responsive section (`max-width: 1200px`).
- **Alternating Layout:**
  - **Even Row (`index % 2 === 0`):** Media Container (55% width, Left) $\leftrightarrow$ Content Container (45% width, Right).
  - **Odd Row (`index % 2 === 1`):** Content Container (45% width, Left) $\leftrightarrow$ Media Container (55% width, Right).
- **Odd Flagship Count Rule:** If total Tier-1 projects count is odd, the last item (`index === total - 1`) automatically expands to `100%` width as a full-bleed Hero Banner with a 65/35 split or background overlay.

### 4.2 Tier-2 Standard Projects Layout Grid
- **Container:** CSS Grid with `grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))`.
- **Card Style:** Compact vertical stack, 1:1 media thumbnail top, summary & tech tags below.

### 4.3 Certifications Grid & Fallback Resolver Engine
- **Container:** `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`.
- **Odd Count Rule:** Last card stretches across remaining columns if total count is odd (`grid-column: 1 / -1`).
- **Icon Resolution Pipeline:**
  1. **Custom Image:** `cert.logoUrl` (if verified & direct URL).
  2. **Simple Icons CDN:** `https://cdn.simpleicons.org/${slug}/${color}`.
  3. **Monogram Avatar Fallback:** If CDN returns 404 or fails, render a square SVG monogram badge using `cert.issuer` initials with an OKLCH gradient ring.

---

## 5. Micro-Interactions & Motion Rules

- **Hover Transition:** `all 0.25s cubic-bezier(0.16, 1, 0.3, 1)`.
- **Card Hover:** Micro-y-axis offset (`transform: translateY(-4px)`) and border glow transition (`border-color: var(--accent-teal)`).
- **Media Zoom:** Internal thumbnail images scale `1.03x` inside `overflow: hidden` containers upon parent card hover.

---

## 6. Responsive Breakpoints & Accessibility Baseline

- **Desktop:** `> 1024px` — Full side-by-side flex layouts & multi-column grids.
- **Tablet:** `768px - 1023px` — Stacked odd/even flex rows into 1-column cards; 2-column certificate grid.
- **Mobile:** `< 767px` — Single column stack throughout. Padding reduced to `1rem`. Font size adjusted using `clamp()`.
- **Accessibility:** Minimum contrast ratio `4.5:1` for body text. All interactive elements have focus rings (`outline: 2px solid var(--accent-teal)`).
