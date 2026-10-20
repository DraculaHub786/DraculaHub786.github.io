# DraculaHub786.github.io

Personal portfolio site — live at **[nlpdigitox.me](https://nlpdigitox.me)**

Built as a static site with plain HTML, CSS and JavaScript. No framework, no build step.

## Structure

```
index.html          Single-page portfolio
styles.css          Theme (cream / light brown / light orange), 3D tilt, responsive
script.js           Filter chips, 3D tilt, skills scroll, scroll reveal
projects.json       All 15 projects — the single source of truth for card content
assets/
  favicon.svg       Browser tab icon
  og.png            1200×630 link-preview image
  img/projects/     Per-project placeholder tiles
404.html            Not-found page
CNAME               Custom domain
robots.txt          Crawler rules + sitemap pointer
sitemap.xml         Search-engine sitemap
```

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

- `featured: true` → large 3D-tilt card in the Featured section
- `featured: false` → smaller card in the filterable grid
- `category` must be one of `Security`, `Crypto`, `AI`, `Apps`, `Web`
  (Security and Crypto share a filter chip; Apps and Web share a chip)
- `live` takes a URL, or the string `"none"` to hide the Live button
- `image` points at a 1200×750 `.webp` screenshot, or the matching `.svg` tile

## Categories and filters

| Filter chip | `category` values | Card count |
|-------------|-------------------|------------|
| Security & Crypto | `Security`, `Crypto` | 9 |
| AI & Data | `AI` | 2 |
| Apps & Web | `Apps`, `Web` | 4 |

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

A server is required — `projects.json` is fetched at runtime, so opening
`index.html` directly from the filesystem will not work.

## Accessibility and performance

- Keyboard navigable throughout, visible focus rings
- Respects `prefers-reduced-motion: reduce` — 3D tilt and reveal animations
  are disabled, content renders immediately
- Lazy-loaded images with fixed `width`/`height` to avoid layout shift
- No JavaScript dependencies
