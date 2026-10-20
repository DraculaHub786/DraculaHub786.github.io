# Portfolio Master Plan

## Design Vision
Clean, professional, classical — with a modern twist. Cream background as the anchor, complemented by smooth light brown accents and warm light orange highlights. 3D scroll-interactive cards, subtle animations, filterable grid. No noise. Every element earns its place.

## Color Palette
| Variable | CSS Value | Description |
|----------|-----------|-------------|
| `--bg` | `hsl(38, 15%, 98%)` | Warm cream background |
| `--card` | `hsl(0, 0%, 100%)` | White card surfaces |
| `--accent-brown` | `hsl(34, 15%, 52%)` | Smooth light brown |
| `--accent-orange` | `hsl(30, 55%, 62%)` | Light orange |
| `--text` | `hsl(30, 15%, 12%)` | Dark charcoal for readability |
| `--muted` | `hsl(30, 10%, 45%)` | Secondary text |
| `--border` | `hsl(34, 10%, 85%)` | Card borders |

## Typography
- **Display**: `Cormorant Garamond`, serif — elegant, classical, great for headers and card titles
- **Body**: `Inter`, system UI — clean, modern, highly readable at length
- **UI**: fallback: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, `Noto Sans`

## Visual Style
- Cream `--bg` with a very subtle `conic-gradient` overlay for depth
- Cards: `--card` with `box-shadow: 0 2px 12px rgba(0,0,0,0.04)`, rounded `8px`
- Borders: `--border` subtle, only on interactive elements
- Hover states: background shift to `hsl(30, 15%, 96%)` for cream-adjacent areas
- All transitions: `220ms ease`

## Layout
1. **Navbar** — sticky, minimal: logo/name on left, filter chips on right (for grid view), reduced height on scroll
2. **Hero** — full-height intro with name, tagline, subtle floating 3D sphere/orb animation
3. **Featured Stack** — 6 large tilt cards in a slight curve, sticky on desktop, scrolls to grid on mobile
4. **All Projects Grid** — 3-column, filterable by category chips. Lazy-loaded images with `width/height` attrs so layout doesn't shift
5. **Skills Strip** — horizontal scrollable pill tags drawn from project tags
6. **Footer** — minimal: year, GitHub link, theme toggle (system preference respects `prefers-reduced-motion`)

## Data Model: `projects.json`
Each project object has these exact fields:

```json
{
  "title": "Clean project name (not repo name)",
  "category": "Security | AI | App | Web | Crypto",
  "featured": true/false,
  "desc": "One sentence (~25 words) about what it does",
  "tags": ["tag1", "tag2", "tag3"],  // 3 max, category-relevant
  "github": "https://github.com/DraculaHub786/repo-name",
  "live": "URL or \"none\"",
  "image": "/assets/img/projects/name.webp"  // 1200x750 .webp or null
}
```

## Project List (15 total)
See `projects.json` for the canonical source. 15 projects split:

- **Featured (6)**: sticky 3D cards from current site
- **Grid (9)**: filterable, tilt effect on hover

## Category System
Projects are tagged with one primary category for filtering:

| Category | Chips | Projects |
|----------|-------|----------|
| Security & Crypto | 8 chips | Honeypot, Sentinel, SIEM, Secure File Sharing, Password Cracking, Cryptography Simulation, Cryptography Algorithms, Crypto Wallet |
| AI & Data | 2 chips | SkillGap AI, AQI Health Planner |
| Apps & Web | 5 chips | NLP-Digitox, DecentralChat, Nur-e-Haya, StreamGrab, Error Sound Alert |

Chips live in the grid header. Active chip gets `aria-pressed="true"` and visual `background: var(--accent-orange)`.

## Featured Stack (6 cards)
These appear as large 3D-tilt cards in a gentle arc. Each has:
- Screenshot (`.webp`, 1200×750) or a fallback glyph tile
- Title + one-line description
- Tags badge row
- Live demo button (shows only if `live !== "none"`)
- GitHub link in footer of card

Grid cards are smaller, show title + short desc + tag icons, no 3D tilt.

## Interactions
1. **3D Tilt** — on `mousemove` over card, rotate on X & Y axes based on mouse position relative to center. Deactivated entirely if `prefers-reduced-motion: reduce`.
2. **Filter chips** — click filters grid, updates URL `?cat=security` etc. for deep linking.
3. **Scroll reveal** — `IntersectionObserver` fades/slide-up each section as it enters viewport. Staggered: hero first, then featured, then grid, then skills.
4. **Skills horizontal scroll** — scroll by clicking arrow buttons or by dragging/flicking. Pagination dots indicate position.
5. **Navbar shadow** — appears on scroll down, disappears on scroll up past hero.
6. **Reduce motion** — all transform/animation disabled; only essential transitions remain.

## Polish Checklist (before push)
- [ ] No repo-style names on cards
- [ ] Every GitHub and live link works
- [ ] Lighthouse ≥ 90 in all 4 categories
- [ ] Tested at 375px, 768px, 1440px widths
- [ ] Keyboard-only navigation works
- [ ] Animation stops with `prefers-reduced-motion: reduce` on
- [ ] Settings → Pages → Enforce HTTPS is on
- [ ] CNAME reads `nlpdigitox.me`
- [ ] Pin 6 featured repos on GitHub profile
- [ ] Decide whether Gmail address stays public

## Asset Specs
| Asset | Size | Format |
|-------|------|--------|
| Project screenshots | 1200×750 | .webp < 150 KB |
| Open Graph image | 1200×630 | .png |
| Favicon | 180×180 | .png (or .ico) |
| Glyph tiles (fallback) | 200×200 | SVG |

## Build Order
1. Write `projects.json` with all 15 projects
2. Create `index.html` with full structure
3. Write `styles.css` with theme, animations, responsive breakpoints
4. Write `script.js` for tilt, filters, scroll reveal, skills scroll
5. Generate SVG fallback tiles for projects without screenshots
6. Create `og.png` and favicon (SVG-based where possible)
7. Add `CNAME`, `robots.txt`, `sitemap.xml`, `404.html`
8. Run Lighthouse, test breakpoints, verify reduce motion
9. Push to GitHub Pages

## Notes
- The repo is freshly initialized — all files are new
- GitHub Actions or manual deploy to `main` branch + `gh-pages` branch (or single main with `/(docs)` if using GitHub Pages directory)
- CNAME file for `nlpdigitox.me` custom domain
- All images referenced from `projects.json` must exist on disk or be generated as placeholders