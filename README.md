# DraculaHub786.github.io

Personal portfolio site — live at **[nlpdigitox.me](https://nlpdigitox.me)**

Built as a static site with plain HTML, CSS and JavaScript. No framework, no build step.

## Structure

```
index.html          Single-page portfolio
styles.css          Design tokens, layout, 3D stack, responsive
script.js           Card rendering, filters, sticky-stack scroll driver, nav
projects.json       All 15 projects — the single source of truth for card content
assets/
  favicon.svg       Browser tab icon
  og.png            1200×630 link-preview image
  img/projects/     Per-project 320×180 SVG tiles
404.html            Not-found page
CNAME               Custom domain
robots.txt          Crawler rules + sitemap pointer
sitemap.xml         Search-engine sitemap
tools/              Dev-only helpers (not part of the deployed site)
```

## Sections

1. **Hero** — headline, stat row, and a 3D fan of the first three featured projects
2. **Featured** — six projects as a sticky 3D pile: each card docks under the nav
   and recedes in scale and opacity as the next one slides over it
3. **All projects** — every project as a filterable card grid
4. **Stack** — the technologies used, grouped by kind
5. **About** — copy plus a sticky profile card

## Adding or editing a project

Edit `projects.json`. Cards are rendered from it at runtime — no markup to touch.

```json
{
  "title": "Clean project name",
  "category": "Security",
  "featured": true,
  "desc": "One sentence about what it does",
  "tags": ["Python", "Flask", "SQLite"],
  "github": "https://github.com/DraculaHub786/repo-name",
  "live": "none",
  "image": "/assets/img/projects/name.svg"
}
```

- `featured: true` → appears in the sticky 3D pile in the Featured section
- `featured: false` → grid card only
- `category` must be one of `Security`, `Crypto`, `AI`, `Apps`, `Web`
- `live` takes a URL, or the string `"none"` to hide the Live button
- `image` points at a tile in `assets/img/projects/`

## Categories and filters

| Filter chip | `category` values | Card count |
|-------------|-------------------|------------|
| Security & Crypto | `Security`, `Crypto` | 8 |
| AI & Data | `AI` | 2 |
| Apps & Web | `Apps`, `Web` | 5 |

The filter is reflected in the URL (`?cat=ai`), so a filtered view can be linked
to directly.

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

A server is required — `projects.json` is fetched at runtime, so opening
`index.html` directly from the filesystem will not work.

## Dev tools

Helper scripts in `tools/` drive headless Chrome over the DevTools Protocol.
They need Node and a local Chrome install.

```bash
node tools/verify.js http://localhost:8000/   # 11 automated checks
node tools/audit.js  http://localhost:8000/   # page geometry + image health
node tools/shoot.js  http://localhost:8000/ out/ "name:scrollY[:width]"
node tools/make-tiles.js                       # regenerate the SVG tiles
```

## Accessibility and performance

- Keyboard navigable throughout, visible focus rings
- Respects `prefers-reduced-motion: reduce` — the 3D stack, tilt and reveal
  animations are disabled and content renders immediately
- Lazy-loaded images with fixed `width`/`height` to avoid layout shift
- No JavaScript dependencies
