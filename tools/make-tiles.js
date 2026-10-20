/* Generates the 16:9 project tiles in assets/img/projects/ */
const fs = require('fs');
const path = require('path');

const W = 320, H = 180;

const PALETTE = {
  security: ['#8A6A45', '#E8913A'],
  crypto:   ['#C08A2E', '#E8B84A'],
  ai:       ['#6B5B95', '#9B6BC4'],
  apps:     ['#3E7C9B', '#5FA8C4'],
  web:      ['#2F7D6B', '#4FA894']
};

const TILES = [
  { file: 'honeypot-map',       cat: 'security', label: 'Security',   glyph: `
    <circle cx="160" cy="82" r="40" opacity=".28"/><circle cx="160" cy="82" r="24" opacity=".45"/>
    <circle cx="160" cy="82" r="6" fill="#fff" opacity=".95"/>
    <path d="M160 30v18M160 116v18M108 82h18M194 82h18" opacity=".7" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    <path d="M160 62l9 20-9 20-9-20z" fill="#fff" opacity=".9"/>` },
  { file: 'sentinel-terminal',  cat: 'security', label: 'Security',   glyph: `
    <rect x="104" y="44" width="112" height="76" rx="7" fill="rgba(0,0,0,.42)"/>
    <circle cx="118" cy="58" r="3.5" fill="#fff" opacity=".8"/>
    <circle cx="130" cy="58" r="3.5" fill="#fff" opacity=".5"/>
    <rect x="118" y="72" width="60" height="6" rx="3" fill="#fff" opacity=".55"/>
    <rect x="118" y="86" width="82" height="6" rx="3" fill="#fff" opacity=".3"/>
    <rect x="118" y="100" width="44" height="6" rx="3" fill="#fff" opacity=".2"/>` },
  { file: 'skilgap-ai',         cat: 'ai',       label: 'AI & Data',  glyph: `
    <rect x="122" y="40" width="60" height="80" rx="6" fill="rgba(255,255,255,.16)"/>
    <rect x="134" y="56" width="36" height="5" rx="2.5" fill="#fff" opacity=".6"/>
    <rect x="134" y="70" width="28" height="5" rx="2.5" fill="#fff" opacity=".4"/>
    <circle cx="186" cy="94" r="22" fill="none" stroke="#fff" stroke-width="3" opacity=".85"/>
    <path d="M202 110l14 14" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".85"/>` },
  { file: 'nlp-digitox',        cat: 'apps',     label: 'Apps',       glyph: `
    <rect x="130" y="34" width="60" height="102" rx="11" fill="rgba(255,255,255,.18)"/>
    <rect x="139" y="44" width="42" height="58" rx="4" fill="rgba(0,0,0,.2)"/>
    <path d="M160 110l-9 8v-8z" fill="#fff" opacity=".9"/>
    <circle cx="160" cy="124" r="4" fill="#fff" opacity=".5"/>` },
  { file: 'decentral-chat',     cat: 'apps',     label: 'Apps',       glyph: `
    <path d="M104 54h76a10 10 0 0110 10v30a10 10 0 01-10 10h-32l-18 14v-14h-26a10 10 0 01-10-10V64a10 10 0 0110-10z" fill="rgba(255,255,255,.22)"/>
    <path d="M156 90h60a10 10 0 0110 10v26a10 10 0 01-10 10h-12v12l-16-12h-32a10 10 0 01-10-10v-26a10 10 0 0110-10z" fill="rgba(0,0,0,.3)"/>
    <path d="M118 74h48M118 86h30" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>` },
  { file: 'hotel-management',   cat: 'web',      label: 'Web',        glyph: `
    <rect x="112" y="40" width="96" height="88" rx="6" fill="rgba(255,255,255,.16)"/>
    <path d="M112 60h96" stroke="#fff" stroke-width="2" opacity=".5"/>
    <g fill="#fff" opacity=".8">
      <rect x="124" y="70" width="14" height="12" rx="2"/><rect x="146" y="70" width="14" height="12" rx="2"/><rect x="168" y="70" width="14" height="12" rx="2"/><rect x="190" y="70" width="8" height="12" rx="2"/>
      <rect x="124" y="90" width="14" height="12" rx="2"/><rect x="146" y="90" width="14" height="12" rx="2"/><rect x="168" y="90" width="14" height="12" rx="2"/>
    </g>
    <rect x="150" y="108" width="22" height="20" rx="3" fill="#fff" opacity=".9"/>` },
  { file: 'siem-platform',      cat: 'security', label: 'Security',   glyph: `
    <path d="M100 92h22l10-26 16 52 12-34 10 20 8-12h42" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
    <circle cx="100" cy="92" r="4" fill="#fff"/><circle cx="220" cy="92" r="4" fill="#fff"/>` },
  { file: 'aqi-health',         cat: 'ai',       label: 'AI & Data',  glyph: `
    <path d="M160 118c-26 0-42-18-42-38 0-16 12-28 26-30 4-14 16-22 28-18 10 4 16 14 16 24 12 4 20 16 20 28 0 20-18 34-48 34z" fill="rgba(255,255,255,.2)"/>
    <path d="M160 118V64M160 84l-16-12M160 98l18-14" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".75"/>` },
  { file: 'streamgrab',         cat: 'apps',     label: 'Apps',       glyph: `
    <path d="M160 40v52" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".9"/>
    <path d="M134 68l26 26 26-26" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
    <path d="M112 108v12a10 10 0 0010 10h76a10 10 0 0010-10v-12" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".6"/>` },
  { file: 'error-sound',        cat: 'apps',     label: 'Apps',       glyph: `
    <path d="M124 68h20l24-20v76l-24-20h-20a6 6 0 01-6-6V74a6 6 0 016-6z" fill="rgba(255,255,255,.9)"/>
    <path d="M186 68a26 26 0 010 36" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".7"/>
    <path d="M202 56a44 44 0 010 60" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>` },
  { file: 'crypto-wallet',      cat: 'crypto',   label: 'Crypto',     glyph: `
    <rect x="104" y="50" width="112" height="74" rx="9" fill="rgba(255,255,255,.18)"/>
    <path d="M104 68h112" stroke="#fff" stroke-width="2" opacity=".4"/>
    <circle cx="188" cy="96" r="11" fill="#fff" opacity=".9"/>
    <circle cx="188" cy="96" r="4" fill="rgba(0,0,0,.35)"/>` },
  { file: 'crypto-simulation',  cat: 'crypto',   label: 'Crypto',     glyph: `
    <rect x="140" y="70" width="40" height="34" rx="6" fill="rgba(255,255,255,.9)"/>
    <path d="M150 70V58a10 10 0 0120 0v12" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".85"/>
    <circle cx="160" cy="86" r="4" fill="rgba(0,0,0,.4)"/>
    <path d="M160 90v7" stroke="rgba(0,0,0,.4)" stroke-width="3" stroke-linecap="round"/>` },
  { file: 'crypto-algorithms',  cat: 'crypto',   label: 'Crypto',     glyph: `
    <g fill="#fff" opacity=".75">
      <rect x="118" y="56" width="12" height="12" rx="2"/><rect x="140" y="56" width="12" height="12" rx="2"/><rect x="162" y="56" width="12" height="12" rx="2"/><rect x="184" y="56" width="12" height="12" rx="2"/>
      <rect x="118" y="78" width="12" height="12" rx="2" opacity=".55"/><rect x="140" y="78" width="12" height="12" rx="2" opacity=".55"/><rect x="162" y="78" width="12" height="12" rx="2" opacity=".55"/><rect x="184" y="78" width="12" height="12" rx="2" opacity=".55"/>
    </g>
    <rect x="118" y="100" width="78" height="12" rx="2" fill="#fff" opacity=".35"/>` },
  { file: 'password-cracking',  cat: 'crypto',   label: 'Crypto',     glyph: `
    <circle cx="132" cy="88" r="26" fill="none" stroke="#fff" stroke-width="4" opacity=".9"/>
    <path d="M152 106l38 38" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>
    <path d="M124 80l16 16M140 80l-16 16" stroke="rgba(0,0,0,.35)" stroke-width="3" stroke-linecap="round"/>` },
  { file: 'secure-file-sharing',cat: 'security', label: 'Security',   glyph: `
    <path d="M100 56h44l12 12h64a8 8 0 018 8v46a8 8 0 01-8 8h-120a8 8 0 01-8-8V64a8 8 0 018-8z" fill="rgba(255,255,255,.2)"/>
    <path d="M160 96v-8a10 10 0 0120 0v8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
    <rect x="152" y="96" width="36" height="26" rx="5" fill="#fff" opacity=".9"/>` }
];

const dir = path.join(__dirname, '..', 'assets', 'img', 'projects');
fs.mkdirSync(dir, { recursive: true });

// SVG is XML: an unescaped "&" makes the whole file fail to parse and the
// image renders as a broken icon. Escape every label before interpolating.
const xml = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

TILES.forEach((t, i) => {
  const [c1, c2] = PALETTE[t.cat];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${xml(t.label)}">
  <defs>
    <linearGradient id="bg${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="gl${i}" cx="30%" cy="20%" r="75%">
      <stop offset="0%" stop-color="#fff" stop-opacity=".22"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg${i})"/>
  <rect width="${W}" height="${H}" fill="url(#gl${i})"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">${t.glyph}</g>
  <text x="18" y="${H - 16}" font-family="Inter,system-ui,sans-serif" font-size="10" font-weight="600" letter-spacing="1.6" fill="#fff" opacity=".62">${xml(t.label.toUpperCase())}</text>
  <text x="${W - 18}" y="${H - 16}" text-anchor="end" font-family="Georgia,serif" font-size="12" font-weight="600" fill="#fff" opacity=".38">D786</text>
</svg>
`;
  fs.writeFileSync(path.join(dir, `${t.file}.svg`), svg);
});

console.log(`Wrote ${TILES.length} tiles to assets/img/projects/`);
