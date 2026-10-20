# Portfolio — As-Built Specification

This is the spec the site was actually built to. It replaces the original
pre-build plan, which was written before the layout and interaction model
settled.

## Design Vision

Clean, professional, classical with a modern twist. Cream is the anchor, smooth
light brown carries the structure, warm light orange marks what is interactive.
3D depth is used sparingly — one signature moment, not everywhere. No noise;
every element earns its place.

## Color Palette

| Token | Value | Role |
|-------|-------|------|
| `--cream` | `hsl(40 44% 97%)` | Page background |
| `--cream-deep` | `hsl(38 30% 94%)` | Alternating section band |
| `--card-raised` | `hsl(0 0% 100%)` | Card surfaces |
| `--brown` | `hsl(30 26% 44%)` | Structure, secondary text |
| `--orange` | `hsl(22 82% 57%)` | Accent, active state, focus ring |
| `--orange-deep` | `hsl(20 78% 48%)` | Accent hover / gradient end |
| `--ink` | `hsl(26 26% 12%)` | Body text |
| `--line` | `hsl(32 24% 88%)` | Hairlines and borders |

## Typography

- **Display**: Fraunces (variable serif) — headings and card titles
- **Body / UI**: Inter — everything else

Both are loaded from Google Fonts with a system fallback stack, so the page is
still correct if the font request is blocked.

## Sections

1. **Hero** — headline with a gradient italic, stat row (15 / 5 / 32), and a 3D
   fan of the first three featured projects over a slowly rotating ring.
2. **Featured** — six projects as a sticky 3D pile. Each card docks 92px below
   the nav and recedes in scale, rotation and opacity as the next one slides
   over it. The final card hands off to the "All projects" sheet.
3. **All projects** — all 15 projects as a filterable card grid.
4. **Stack** — the 32 technologies used, grouped into six kinds.
5. **About** — copy alongside a sticky profile card.

## Data Model: `projects.json`

```json
{
  "title": "Clean project name (not repo name)",
  "category": "Security | Crypto | AI | Apps | Web",
  "featured": true,
  "desc": "One sentence about what it does",
  "tags": ["tag1", "tag2", "tag3"],
  "github": "https://github.com/DraculaHub786/repo-name",
  "live": "URL or \"none\"",
  "image": "/assets/img/projects/name.svg"
}
```

`projects.json` is the single source of truth — every card on the page is
rendered from it at runtime.

## Category System

| Filter chip | `category` values | Count |
|-------------|-------------------|-------|
| Security & Crypto | `Security`, `Crypto` | 8 |
| AI & Data | `AI` | 2 |
| Apps & Web | `Apps`, `Web` | 5 |

The active filter is written to the URL as `?cat=<group>`, so a filtered view
can be linked to directly.

## Interactions

1. **Sticky 3D pile** — `--p` (0→1) is written to each card by a rAF-throttled
   scroll handler and drives `scale()`, `rotateX()` and `opacity()`. The progress
   for card *n* is measured against the dock position of card *n+1*, so a card
   recedes exactly as its successor arrives. The last card is measured against
   the "All projects" section instead.
2. **Filter chips** — click filters the grid and updates the URL.
3. **Scroll reveal** — `IntersectionObserver` fades and lifts section headers.
4. **Nav** — sticky with a blur backdrop, an active-section indicator, and a
   dropdown menu below 860px.
5. **Reduced motion** — `prefers-reduced-motion: reduce` disables the 3D pile,
   the deck float, the ring spin and the reveal transitions. Content renders
   immediately, statically.

## Layout Rules Worth Keeping

- The "All projects" sheet overlaps the featured section by a **fixed 96px**,
  never a viewport unit. An overlap larger than 108px rides up over the last
  docked card and slices it in half mid-button.
- Below 720px the sticky pile becomes a plain vertical flow, the sheet overlap
  is dropped, and the hero deck narrows so its third card stays in the
  viewport once the 3D rotation widens it.
- `.card` sets `display: flex`, which outranks the UA stylesheet's
  `[hidden] { display: none }` — the filter needs `.card[hidden] { display: none }`
  restated, or the chips hide nothing.

## Pre-Launch Checklist

- [x] No repo-style names on cards
- [x] Every card links to its GitHub source
- [x] Tested at 375px, 768px and 1440px
- [x] Keyboard-only navigation works
- [x] Animation stops with `prefers-reduced-motion: reduce`
- [x] `CNAME` reads `nlpdigitox.me`
- [x] Automated checks pass (`node tools/verify.js`)
- [ ] Lighthouse ≥ 90 in all 4 categories
- [ ] Settings → Pages → Enforce HTTPS is on
- [ ] Pin the 6 featured repos on the GitHub profile
- [ ] Replace SVG tiles with real `.webp` screenshots
- [ ] Decide whether a Gmail address stays public
- [ ] Repo cleanup skipped for now (secrets in Secure-File-Sharing, zipped
      repos, clutter, repo renames) — deliberate, revisit before launch

## Asset Specs

| Asset | Size | Format |
|-------|------|--------|
| Project tiles | 320×180 | SVG (16:9) |
| Open Graph image | 1200×630 | PNG |
| Favicon | — | SVG |

## Repo Notes

- `CNAME` holds the custom domain; `.nojekyll` stops GitHub Pages from running
  Jekyll over the site.
- `tools/` holds dev-only helpers (headless-Chrome screenshotting, auditing and
  the verification suite). They are not referenced by the site.
