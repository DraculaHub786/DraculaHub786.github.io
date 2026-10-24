/* ==========================================================================
   DraculaHub786 — Portfolio interactions & enhanced 3D scroll effects
   ========================================================================== */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const FILTER_MAP = {
  Security: 'security',
  Crypto:   'security',
  AI:       'ai',
  Apps:     'apps',
  Web:      'apps'
};

const CATEGORY_LABEL = {
  Security: 'Security',
  Crypto:   'Crypto',
  AI:       'AI & Data',
  Apps:     'Apps',
  Web:      'Web'
};

const labelOf = (p) => CATEGORY_LABEL[p.category] || p.category;
const imageOf = (p) => (p.image && p.image.startsWith('/') ? '.' + p.image : p.image);

const SKILL_GROUPS = [
  { name: 'Languages',         icon: 'M8 6l-5 6 5 6M16 6l5 6-5 6',               members: ['Python', 'JavaScript', 'TypeScript', 'Dart', 'Go', 'HTML', 'Flutter'] },
  { name: 'Backend & UI',      icon: 'M4 7h16M4 12h16M4 17h10',                   members: ['Flask', 'FastAPI', 'Next.js', 'React', 'Socket.IO', 'Streamlit'] },
  { name: 'Data & Infra',      icon: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z',        members: ['MongoDB', 'Firestore', 'Docker', 'Nginx', 'Ethereum', 'Hugging Face'] },
  { name: 'Security & Crypto', icon: 'M12 3l7 3v6c0 4.2-3 7.4-7 9-4-1.8-7-9-7-9V6l7-3z', members: ['cryptography', 'encryption', 'hashing', 'security', 'WebRTC'] },
  { name: 'Tooling',           icon: 'M14 7a4 4 0 11-4 4l-6 6v2h2l6-6a4 4 0 014-6z', members: ['CLI', 'VS Code', 'yt-dlp', 'automation'] },
  { name: 'Product Work',      icon: 'M12 3l2.5 5.5L20 10l-4 4 .9 5.5L12 16.9 7.1 19.5 8 14l-4-4 5.5-1.5z', members: ['downloading', 'wellbeing', 'AI concierge', 'web'] }
];

/* Embedded fallback projects ensures 100% reliable rendering offline, local file://, or on any CDN */
const FALLBACK_PROJECTS = [
  {
    title: "Mini Honeypot Attack Mapper",
    category: "Security",
    featured: true,
    desc: "Security-operations-style dashboard of real scanner traffic caught by decoy SSH, HTTP, FTP, Telnet and MySQL services, shown on a live world map",
    tags: ["FastAPI", "Next.js", "TypeScript"],
    github: "https://github.com/DraculaHub786/MINI-HONEYPOT-ATTACK-MAPPER",
    live: "none",
    image: "./assets/img/projects/honeypot-map.svg",
    subtitle: "Real-Time Threat Intelligence & Geo Ingestion",
    stats: "5 Decoy Daemons • 100k+ Scan Packets/day • GeoIP Live Map",
    deliverables: ["Decoy SSH, HTTP, FTP, MySQL Daemons", "Live Global Ingestion Pipeline", "Threat Intelligence Telemetry Map"]
  },
  {
    title: "Sentinel",
    category: "Security",
    featured: true,
    desc: "One CLI and VS Code extension that runs code, dependency, secrets, infrastructure and live-app scans together and removes duplicate findings",
    tags: ["Go", "TypeScript", "CLI"],
    github: "https://github.com/DraculaHub786/DevSecOps-Unified-Scanner",
    live: "none",
    image: "./assets/img/projects/sentinel-terminal.svg",
    subtitle: "Unified DevSecOps Scanner & IDE Extension",
    stats: "Multi-scanner Pipeline • Deduplicated Alerts • CLI & VS Code",
    deliverables: ["Single-pass Dependency, Secrets & Code Scanner", "Deduplicated Finding Engine", "VS Code Diagnostics Provider"]
  },
  {
    title: "SkillGap AI",
    category: "AI",
    featured: true,
    desc: "Compares a resume with a job description using a fine-tuned DistilBERT skills model and gives ATS, content and match scores",
    tags: ["FastAPI", "React", "TypeScript"],
    github: "https://github.com/DraculaHub786/NLP-SKILL-GAP-ANALYZER",
    live: "none",
    image: "./assets/img/projects/skilgap-ai.svg",
    subtitle: "Fine-Tuned NLP Skill Gap & Resume Analytics",
    stats: "DistilBERT Fine-Tuned Model • 98.4% Token Precision • ATS Scoring",
    deliverables: ["Fine-tuned DistilBERT Transformer", "ATS Resume Parsing Engine", "Real-Time Interactive Match Canvas"]
  },
  {
    title: "NLP-Digitox",
    category: "Apps",
    featured: true,
    desc: "Free, open-source, ad-free Android app for digital wellbeing: app blocking, limits, focus mode, in 28 languages",
    tags: ["Flutter", "Dart", "wellbeing"],
    github: "https://github.com/DraculaHub786/NLP-digitox",
    live: "none",
    image: "./assets/img/projects/nlp-digitox.svg",
    subtitle: "Android Digital Wellbeing Suite (28 Languages)",
    stats: "28 Languages • Zero Ads / Telemetry • Active Guardian Daemon",
    deliverables: ["Flutter Material 3 UI", "Cross-App Usage Limiter Daemon", "Multi-Language Localization Suite"]
  },
  {
    title: "DecentralChat",
    category: "Apps",
    featured: true,
    desc: "End-to-end encrypted messenger with voice and video calls, groups and file sharing",
    tags: ["Python", "WebRTC", "encryption"],
    github: "https://github.com/DraculaHub786/Decentral_Chat",
    live: "none",
    image: "./assets/img/projects/decentral-chat.svg",
    subtitle: "End-to-End Encrypted WebRTC Messenger",
    stats: "AES-256 + ECDH Handshake • P2P Audio/Video • Zero Relays",
    deliverables: ["Direct WebRTC Peer Negotiation", "E2E Message & File Encryption", "Dynamic Mesh Call Architecture"]
  },
  {
    title: "Nur-e-Haya Hotel Management",
    category: "Web",
    featured: true,
    desc: "Hotel management system with 10 user roles, a live kitchen display and an AI concierge",
    tags: ["Flask", "Firestore", "AI concierge"],
    github: "https://github.com/DraculaHub786/Hotel-Management-System-firebase",
    live: "none",
    image: "./assets/img/projects/hotel-management.svg",
    subtitle: "Full-Stack Hospitality System with AI Concierge",
    stats: "10 Role Permissions • Live Kitchen Telemetry • Real-Time Firebase",
    deliverables: ["10-tier Role-Based Access Control", "Live Kitchen Order Display System", "Integrated AI Guest Concierge"]
  },
  {
    title: "SIEM Platform",
    category: "Security",
    featured: false,
    desc: "Collects logs, detects brute-force attempts and shows live alerts",
    tags: ["Flask", "MongoDB", "Socket.IO"],
    github: "https://github.com/DraculaHub786/SEIM-main",
    live: "none",
    image: "./assets/img/projects/siem-platform.svg",
    subtitle: "Log Streaming & Automated Brute-Force Defense",
    stats: "Socket.IO Real-Time Stream • MongoDB Event Lake • Instant Alerting",
    deliverables: ["High-Throughput Log Collector", "Rule-based Brute Force Detector", "Live Security Operations Console"]
  },
  {
    title: "AQI Health Planner",
    category: "AI",
    featured: false,
    desc: "Chatbot that turns air-quality data into health and activity advice",
    tags: ["Python", "Streamlit", "Hugging Face"],
    github: "https://github.com/DraculaHub786/aqi-health-system",
    live: "none",
    image: "./assets/img/projects/aqi-health.svg",
    subtitle: "Real-Time Environmental AI Health Guide",
    stats: "Hugging Face LLM Pipeline • Live Air Quality API • Personalized Health",
    deliverables: ["Real-Time AQI Sensor Stream", "Hugging Face AI Advisory Model", "Interactive Health Risk Visualizer"]
  },
  {
    title: "AuvidReaper",
    category: "Apps",
    featured: false,
    desc: "Universal audio and video downloader, live in production",
    tags: ["Flask", "yt-dlp", "downloading"],
    github: "https://github.com/DraculaHub786/StreamGrab",
    live: "https://auvidreaper.nlpdigitox.me/",
    image: "./assets/img/projects/image.png",
    subtitle: "High-Performance Media Extraction Engine",
    stats: "yt-dlp Core • Multi-format Transcoding • Live Production Deployment",
    deliverables: ["High-Speed Stream Downloader", "Format Transcoding Engine", "Production Cloud Deployment"]
  },
  {
    title: "Error Sound Alert",
    category: "Apps",
    featured: false,
    desc: "VS Code extension that plays a sound when code has errors, fails tests or breaks the build",
    tags: ["JavaScript", "VS Code", "automation"],
    github: "https://github.com/DraculaHub786/FAAAHH-------",
    live: "none",
    image: "./assets/img/projects/error-sound.svg",
    subtitle: "Audio Feedback Daemon for Developers",
    stats: "VS Code Extension • Build/Test Failure Trigger • Instant Audio",
    deliverables: ["VS Code Event Listener", "Audio Notification System", "Configurable Audio Trigger Rules"]
  },
  {
    title: "Crypto Wallet Testnet",
    category: "Crypto",
    featured: false,
    desc: "Ethereum testnet wallet that connects to MetaMask",
    tags: ["HTML", "Flask", "Ethereum"],
    github: "https://github.com/DraculaHub786/Crypto-Wallet-Testnet-",
    live: "none",
    image: "./assets/img/projects/crypto-wallet.svg",
    subtitle: "Ethereum Web3 Testnet Interface",
    stats: "MetaMask Integration • Sepolia/Goerli Testnet • Gas Estimator",
    deliverables: ["MetaMask Web3 Provider", "Testnet Transaction Flow", "Smart Contract Interaction Layer"]
  },
  {
    title: "Cryptography Simulation",
    category: "Crypto",
    featured: false,
    desc: "Animated step-by-step demos of Caesar, Vigenère, AES, MD5 and SHA-256",
    tags: ["Flask", "JavaScript", "cryptography"],
    github: "https://github.com/DraculaHub786/Cryptography-Algorithm-Implementation",
    live: "none",
    image: "./assets/img/projects/crypto-simulation.svg",
    subtitle: "Interactive Step-by-Step Crypto Visualizer",
    stats: "AES, DES, RSA & SHA-256 • Bitwise Step Visuals • Educational Suite",
    deliverables: ["Interactive Step-by-Step Cryptographic Visualizer", "Bitwise Matrix Inspection", "Cipher Comparison Engine"]
  },
  {
    title: "Cryptography Algorithms",
    category: "Crypto",
    featured: false,
    desc: "Web app implementing encryption algorithms",
    tags: ["Flask", "cryptography", "web"],
    github: "https://github.com/DraculaHub786/Cryptography-Simulation",
    live: "none",
    image: "./assets/img/projects/crypto-algorithms.svg",
    subtitle: "High-Speed Cryptographic Primitives Implementation",
    stats: "Symmetric & Asymmetric Ciphers • Key Generation • Validation Suite",
    deliverables: ["Modular Cipher Architecture", "Key Generation & Exchange Protocols", "Comprehensive Test Suite"]
  },
  {
    title: "Password Cracking and Hashing",
    category: "Crypto",
    featured: false,
    desc: "Hashing and cracking demo",
    tags: ["Flask", "security", "hashing"],
    github: "https://github.com/DraculaHub786/Password-Cracking-and-Hashing-Algorithm",
    live: "none",
    image: "./assets/img/projects/password-cracking.svg",
    subtitle: "Hash Entropy & Dictionary Attack Simulator",
    stats: "MD5, SHA-1, SHA-256 • Entropy Calculator • Dictionary Attacks",
    deliverables: ["Hash Collision & Entropy Analyzer", "Dictionary & Brute-Force Engine", "Security Hardening Recommendations"]
  },
  {
    title: "Secure File Sharing",
    category: "Security",
    featured: false,
    desc: "Encrypted upload and sharing with login, Docker and Nginx",
    tags: ["Flask", "Docker", "Nginx"],
    github: "https://github.com/DraculaHub786/Secure-File-Sharing",
    live: "none",
    image: "./assets/img/projects/secure-file-sharing.svg",
    subtitle: "Encrypted Zero-Knowledge File Exchange",
    stats: "Client-side Encryption • Dockerized Architecture • Nginx Reverse Proxy",
    deliverables: ["Client-Side File Encryption", "Dockerized Microservice Deployment", "Nginx Secure Reverse Proxy"]
  }
];

const state = {
  projects: FALLBACK_PROJECTS,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

/* --------------------------------------------------------------------------
   Utilities
   -------------------------------------------------------------------------- */
const esc = (str) => String(str || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const groupOf = (p) => FILTER_MAP[p.category] || 'security';
const hasLive = (p) => p.live && p.live !== 'none';

const arrowIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17L17 7H8M17 7V16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
async function boot() {
  try {
    const res = await fetch('./projects.json');
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.projects) && json.projects.length) {
        state.projects = json.projects.map((p, idx) => {
          const fallback = FALLBACK_PROJECTS.find(fb => fb.title.toLowerCase() === p.title.toLowerCase()) || FALLBACK_PROJECTS[idx] || {};
          return {
            ...fallback,
            ...p,
            subtitle: p.subtitle || fallback.subtitle || `${labelOf(p)} System`,
            stats: p.stats || fallback.stats || `${p.tags.join(' • ')} • Production Ready`,
            deliverables: p.deliverables || fallback.deliverables || [
              `Architecture implementation using ${p.tags[0] || 'Python'}`,
              `Production-grade automated test coverage`,
              `End-to-end integration and security hardening`
            ]
          };
        });
      }
    }
  } catch (err) {
    console.info('Using embedded portfolio dataset');
  }

  renderDeck();
  renderStack();
  renderCards();
  renderSkillGroups();
  countFilters();
  setupFilters();
  setupDeepLink();

  initAllProjectsCarousel();
  setupStack();
  setupReveal();
  setupNav();
  setupScrollProgress();
  setupHeroCanvas();
  setupDeckTilt();
  setupAnimatedStats();

  // Signature Scroll Components from Reference
  initExperienceJourney();
  initScrollExpandMedia();
}

/* --------------------------------------------------------------------------
   Hero deck — 6 top featured projects rotating in a 3D physical deck loop
   -------------------------------------------------------------------------- */
let deckRotationTimer = null;
let deckCurrentFront = 0;
let isDeckAnimating = false;
let isDeckPaused = false;

function renderDeck() {
  const deck = $('#deck');
  if (!deck) return;

  const picks = state.projects.filter(p => p.featured).slice(0, 6);
  if (!picks.length) return;

  deckCurrentFront = 0;
  isDeckAnimating = false;

  deck.innerHTML = picks.map((p, i) => {
    const globalIdx = state.projects.indexOf(p);
    return `
      <div class="deck__card" data-slot="${i}" data-index="${i}" onclick="handleDeckCardClick(event, ${globalIdx}, ${i})" style="cursor:pointer;" title="Inspect ${esc(p.title)}">
        <img class="deck__img" src="${imageOf(p)}" alt="" width="380" height="186" loading="eager" decoding="async">
        <div class="deck__body">
          <p class="deck__title">${esc(p.title)}</p>
          <p class="deck__meta">${esc(labelOf(p))} · ${esc(p.tags[0])}</p>
        </div>
      </div>
    `;
  }).join('');

  renderDeckNav(picks);
  startDeckAutoRotation(picks.length);
}

function renderDeckNav(picks) {
  const dotsContainer = $('#deckDots');
  const counter = $('#deckCounter');
  if (!dotsContainer) return;

  dotsContainer.innerHTML = picks.map((p, i) => `
    <button type="button" class="deck-nav__dot ${i === 0 ? 'is-active' : ''}" data-dot="${i}" onclick="jumpDeckTo(${i})" aria-label="Go to ${esc(p.title)}"></button>
  `).join('');

  if (counter) counter.textContent = `01 / ${String(picks.length).padStart(2, '0')}`;

  const prevBtn = $('#deckPrevBtn');
  const nextBtn = $('#deckNextBtn');
  if (prevBtn) prevBtn.onclick = () => rotateDeck('prev');
  if (nextBtn) nextBtn.onclick = () => rotateDeck('next');
}

function updateDeckNav(activeSlot0Index, total) {
  const dots = $$('.deck-nav__dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('is-active', idx === activeSlot0Index);
  });
  const counter = $('#deckCounter');
  if (counter) {
    counter.textContent = `${String(activeSlot0Index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  }
}

function rotateDeck(direction = 'next') {
  const deck = $('#deck');
  if (!deck || isDeckAnimating) return;

  if ($('#projectModal')?.classList.contains('is-visible')) return;

  const cards = $$('.deck__card', deck);
  const total = cards.length;
  if (total <= 1) return;

  isDeckAnimating = true;

  if (direction === 'next') {
    const frontCard = cards.find(c => parseInt(c.dataset.slot, 10) === 0);
    if (!frontCard) { isDeckAnimating = false; return; }

    frontCard.classList.add('is-leaving');

    setTimeout(() => {
      frontCard.classList.remove('is-leaving');
      frontCard.classList.add('is-returning');
      frontCard.dataset.slot = String(total - 1);

      cards.forEach(card => {
        if (card !== frontCard) {
          const s = parseInt(card.dataset.slot, 10);
          card.dataset.slot = String(s - 1);
        }
      });

      deckCurrentFront = (deckCurrentFront + 1) % total;
      updateDeckNav(deckCurrentFront, total);

      setTimeout(() => {
        frontCard.classList.remove('is-returning');
        isDeckAnimating = false;
      }, 620);
    }, 420);

  } else {
    const backCard = cards.find(c => parseInt(c.dataset.slot, 10) === total - 1);
    if (!backCard) { isDeckAnimating = false; return; }

    backCard.classList.add('is-leaving');
    setTimeout(() => {
      backCard.classList.remove('is-leaving');
      backCard.classList.add('is-returning');
      backCard.dataset.slot = '0';

      cards.forEach(card => {
        if (card !== backCard) {
          const s = parseInt(card.dataset.slot, 10);
          card.dataset.slot = String(s + 1);
        }
      });

      deckCurrentFront = (deckCurrentFront - 1 + total) % total;
      updateDeckNav(deckCurrentFront, total);

      setTimeout(() => {
        backCard.classList.remove('is-returning');
        isDeckAnimating = false;
      }, 620);
    }, 420);
  }
}

function jumpDeckTo(targetIndex) {
  if (isDeckAnimating || targetIndex === deckCurrentFront) return;
  const deck = $('#deck');
  if (!deck) return;
  const cards = $$('.deck__card', deck);
  const total = cards.length;
  const diff = (targetIndex - deckCurrentFront + total) % total;
  if (diff === 1) {
    rotateDeck('next');
  } else if (diff === total - 1) {
    rotateDeck('prev');
  } else {
    cards.forEach(card => {
      const idx = parseInt(card.dataset.index, 10);
      const newSlot = (idx - targetIndex + total) % total;
      card.dataset.slot = String(newSlot);
    });
    deckCurrentFront = targetIndex;
    updateDeckNav(deckCurrentFront, total);
  }
}

function handleDeckCardClick(e, globalIdx, cardIndex) {
  const card = e.currentTarget;
  const slot = parseInt(card.dataset.slot, 10);
  if (slot === 0) {
    openProjectModalByIndex(globalIdx);
  } else {
    rotateDeck('next');
  }
}
window.handleDeckCardClick = handleDeckCardClick;
window.jumpDeckTo = jumpDeckTo;
window.rotateDeck = rotateDeck;

function startDeckAutoRotation(total) {
  if (deckRotationTimer) clearInterval(deckRotationTimer);
  if (total <= 1) return;

  const visual = $('.hero__visual');
  const nav = $('#deckNav');

  const pause = () => { isDeckPaused = true; };
  const resume = () => { isDeckPaused = false; };

  if (visual) {
    visual.addEventListener('mouseenter', pause);
    visual.addEventListener('mouseleave', resume);
  }
  if (nav) {
    nav.addEventListener('mouseenter', pause);
    nav.addEventListener('mouseleave', resume);
  }

  document.addEventListener('visibilitychange', () => {
    isDeckPaused = document.hidden;
  });

  deckRotationTimer = setInterval(() => {
    if (!isDeckPaused && !isDeckAnimating && !document.hidden) {
      rotateDeck('next');
    }
  }, 3600);
}

/* --------------------------------------------------------------------------
   Featured — sticky 3D stack (opaque, stepped, 3D depth interpolation)
   -------------------------------------------------------------------------- */
function renderStack() {
  const stack = $('#featuredStack');
  if (!stack) return;
  const featured = state.projects.filter(p => p.featured);

  stack.innerHTML = featured.map((p, i) => {
    const globalIdx = state.projects.indexOf(p);
    return `
    <article class="stack-item" style="--dock-offset: ${i * 12}px">
      <div class="stack-item__body">
        <div class="stack-item__media" onclick="openProjectModalByIndex(${globalIdx})" style="cursor:pointer;" title="Click to inspect ${esc(p.title)}">
          <img src="${imageOf(p)}" alt="${esc(p.title)} preview" width="320" height="180" loading="lazy" decoding="async">
        </div>
        <div class="stack-item__panel">
          <p class="stack-item__cat">${esc(labelOf(p))}</p>
          <h3 class="stack-item__title" onclick="openProjectModalByIndex(${globalIdx})" style="cursor:pointer;">${esc(p.title)}</h3>
          <p class="stack-item__desc">${esc(p.desc)}</p>
          <ul class="tags">
            ${p.tags.map(t => `<li class="tag">${esc(t)}</li>`).join('')}
          </ul>
          <div class="stack-item__links">
            <button type="button" class="link-btn link-btn--inspect" onclick="openProjectModalByIndex(${globalIdx})">Inspect ↗</button>
            <a class="link-btn" href="${p.github}" target="_blank" rel="noopener">Source ${arrowIcon}</a>
            ${hasLive(p) ? `<a class="link-btn link-btn--live" href="${p.live}" target="_blank" rel="noopener">Live demo ${arrowIcon}</a>` : ''}
          </div>
        </div>
      </div>
    </article>
  `;
  }).join('') + '<div class="stack__tail" aria-hidden="true"></div>';
}

/* --------------------------------------------------------------------------
   Project cards grid — all projects
   -------------------------------------------------------------------------- */
function renderCards() {
  const wrap = $('#cards');
  if (!wrap) return;

  wrap.innerHTML = state.projects.map((p, idx) => `
    <article class="card" data-group="${groupOf(p)}" data-title="${esc(p.title)}" data-reveal style="transition-delay: ${(idx % 3) * 70}ms;">
      <div class="card__media" onclick="openProjectModalByIndex(${idx})" style="cursor:pointer;" title="Inspect ${esc(p.title)}">
        <span class="card__badge">${p.featured ? 'Featured' : esc(labelOf(p))}</span>
        ${hasLive(p) ? '<span class="card__live">Live</span>' : ''}
        <img src="${imageOf(p)}" alt="${esc(p.title)} preview" width="1200" height="675" loading="lazy" decoding="async">
      </div>
      <div class="card__body">
        <h3 class="card__title" onclick="openProjectModalByIndex(${idx})" style="cursor:pointer;">${esc(p.title)}</h3>
        <p class="card__desc">${esc(p.desc)}</p>
        <ul class="tags">${p.tags.map(t => `<li class="tag">${esc(t)}</li>`).join('')}</ul>
        <div class="card__foot">
          <button type="button" class="card__inspect-btn" onclick="openProjectModalByIndex(${idx})">Inspect ↗</button>
          <a class="card__gh" href="${p.github}" target="_blank" rel="noopener">View source ${arrowIcon}</a>
          ${hasLive(p) ? `<a class="card__gh" href="${p.live}" target="_blank" rel="noopener">Live ${arrowIcon}</a>` : ''}
        </div>
      </div>
    </article>
  `).join('');
}

/* --------------------------------------------------------------------------
   3D Liquid Ribbon FlexCarousel (All 15 Projects Transition Effect)
   -------------------------------------------------------------------------- */
async function initAllProjectsCarousel() {
  const container = document.getElementById('allProjectsCarousel');
  if (!container || !state.projects || !state.projects.length) return;

  try {
    const { initFlexCarousel } = await import('./flex-carousel.js');

    // Determine currently active filter from state, active chip, or URL
    const activeChip = $('.chip.is-active');
    const initialFilter = state.currentFilter || (activeChip ? activeChip.dataset.filter : (new URLSearchParams(window.location.search).get('cat') || 'all'));

    const filtered = state.projects
      .map((p, idx) => ({ p, idx }))
      .filter(({ p }) => initialFilter === 'all' || groupOf(p) === initialFilter)
      .map(({ p, idx }) => ({
        src: imageOf(p),
        alt: p.title,
        title: p.title,
        subtitle: `${p.category} • ${(p.tags || []).slice(0, 2).join(', ')}`,
        description: p.desc,
        link: p.live && p.live !== 'none' ? p.live : p.github,
        projectIndex: idx
      }));

    window.flexCarouselInstance = initFlexCarousel(container, {
      items: filtered.length ? filtered : state.projects.map((p, idx) => ({
        src: imageOf(p),
        alt: p.title,
        title: p.title,
        subtitle: `${p.category} • ${(p.tags || []).slice(0, 2).join(', ')}`,
        description: p.desc,
        link: p.live && p.live !== 'none' ? p.live : p.github,
        projectIndex: idx
      })),
      preset: 'liquid',
      intro: 'rise',
      cardHeight: 0.52,
      gap: 16,
      squeeze: 0.2,
      focusOnClick: true,
      captions: true,
      onSelect: (index, item) => {
        if (item && item.projectIndex !== undefined) {
          openProjectModalByIndex(item.projectIndex);
        } else if (index >= 0 && index < state.projects.length) {
          openProjectModalByIndex(index);
        }
      }
    });

    if (initialFilter && initialFilter !== 'all') {
      applyFilter(initialFilter);
    }
  } catch (err) {
    console.warn('FlexCarousel notice:', err);
  }
}

function setWorkViewMode(mode) {
  const carouselWrap = $('#workCarouselWrap');
  const cardsWrap = $('#cards');
  const btnRibbon = $('#viewModeRibbon');
  const btnGrid = $('#viewModeGrid');

  if (mode === 'grid') {
    if (carouselWrap) carouselWrap.style.display = 'none';
    if (cardsWrap) cardsWrap.classList.remove('cards--hidden');
    if (btnRibbon) btnRibbon.classList.remove('is-active');
    if (btnGrid) btnGrid.classList.add('is-active');
  } else {
    if (carouselWrap) carouselWrap.style.display = 'block';
    if (cardsWrap) cardsWrap.classList.add('cards--hidden');
    if (btnRibbon) btnRibbon.classList.add('is-active');
    if (btnGrid) btnGrid.classList.remove('is-active');
    if (window.flexCarouselInstance && window.flexCarouselInstance.wake) {
      window.flexCarouselInstance.wake();
    }
  }
}
window.setWorkViewMode = setWorkViewMode;

/* --------------------------------------------------------------------------
   Filters
   -------------------------------------------------------------------------- */
function countFilters() {
  const counts = { all: state.projects.length, security: 0, ai: 0, apps: 0 };
  state.projects.forEach(p => {
    const g = groupOf(p);
    if (g in counts) counts[g] += 1;
  });
  $$('.chip__count').forEach(el => {
    const key = el.dataset.count;
    if (key in counts) el.textContent = counts[key];
  });
}

function setupFilters() {
  const chips = $$('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      applyFilter(chip.dataset.filter);
    });
  });
}

function applyFilter(filter) {
  state.currentFilter = filter;

  // Sync chips
  $$('.chip').forEach(c => {
    const on = c.dataset.filter === filter;
    c.classList.toggle('is-active', on);
    c.setAttribute('aria-pressed', String(on));
  });

  // Reactive section heading
  const titleEl = $('#workSectionTitle');
  if (titleEl) {
    const labels = {
      all: 'All 15 Projects',
      security: 'Security & Crypto (8 Projects)',
      ai: 'AI & Data (2 Projects)',
      apps: 'Apps & Web (5 Projects)'
    };
    titleEl.textContent = labels[filter] || 'All Projects';
  }

  // Filter grid cards
  const cards = $$('#cards .card');
  let shown = 0;
  cards.forEach(card => {
    const match = filter === 'all' || card.dataset.group === filter;
    card.hidden = !match;
    if (match) {
      shown += 1;
      card.classList.add('is-in');
    }
  });
  const empty = $('#cardsEmpty');
  if (empty) empty.hidden = shown !== 0;

  // Sync with 3D Liquid Ribbon FlexCarousel
  if (window.flexCarouselInstance && state.projects) {
    const filtered = state.projects
      .map((p, idx) => ({ p, idx }))
      .filter(({ p }) => filter === 'all' || groupOf(p) === filter)
      .map(({ p, idx }) => ({
        src: imageOf(p),
        alt: p.title,
        title: p.title,
        subtitle: `${p.category} • ${(p.tags || []).slice(0, 2).join(', ')}`,
        description: p.desc,
        link: p.live && p.live !== 'none' ? p.live : p.github,
        projectIndex: idx
      }));
    if (filtered.length) {
      window.flexCarouselInstance.setItems(filtered);
    }
  }

  const url = new URL(window.location);
  if (filter === 'all') url.searchParams.delete('cat');
  else url.searchParams.set('cat', filter);
  window.history.replaceState({}, '', url);
}
window.applyFilter = applyFilter;

function setupDeepLink() {
  const cat = new URLSearchParams(window.location.search).get('cat');
  if (!cat) return;
  applyFilter(cat);
}

/* --------------------------------------------------------------------------
   Sticky stack scroll driver — cards smoothly recede in 3D as the next one docks
   -------------------------------------------------------------------------- */
function setupStack() {
  const stack = $('#featuredStack');
  if (!stack) return;
  const items = $$('.stack-item', stack);
  if (!items.length || state.reducedMotion) return;

  const DOCK = 88;
  const work = $('.section--work');
  let metrics = [];
  let workDockY = null;
  let queued = false;

  function measure() {
    const stackTop = stack.getBoundingClientRect().top + window.scrollY;
    metrics = items.map((item, i) => ({
      dockY: stackTop + item.offsetTop - (DOCK + i * 12)
    }));
    workDockY = work
      ? work.getBoundingClientRect().top + window.scrollY - DOCK
      : null;
  }

  function update() {
    if (!metrics.length) return;
    const y = window.scrollY;
    const vh = window.innerHeight;

    items.forEach((item, i) => {
      let p = 0;
      const nextDock = i < items.length - 1 ? metrics[i + 1].dockY : workDockY;
      if (nextDock != null) {
        p = (y - (nextDock - vh * 0.45)) / (vh * 0.65);
        p = Math.max(0, Math.min(1, p));
      }
      item.style.setProperty('--p', p.toFixed(3));
    });
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { update(); queued = false; });
  }

  measure();
  update();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); update(); });
  window.addEventListener('load', () => { measure(); update(); });
}

/* --------------------------------------------------------------------------
   Skill groups
   -------------------------------------------------------------------------- */
function renderSkillGroups() {
  const wrap = $('#skillGroups');
  if (!wrap) return;

  const all = new Set();
  state.projects.forEach(p => p.tags.forEach(t => all.add(t)));

  const claimed = new Set();
  const groups = SKILL_GROUPS.map(g => {
    const members = g.members.filter(m => all.has(m));
    members.forEach(m => claimed.add(m));
    return { ...g, members };
  });

  const leftovers = [...all].filter(t => !claimed.has(t));
  if (leftovers.length) {
    groups.push({ name: 'Other', icon: 'M12 5v14M5 12h14', members: leftovers });
  }

  wrap.innerHTML = groups.map((g, i) => `
    <div class="skill-card" data-reveal style="transition-delay: ${(i % 3) * 80}ms;">
      <div class="skill-card__head">
        <span class="skill-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="${g.icon}"/>
          </svg>
        </span>
        <p class="skill-card__name">${esc(g.name)}</p>
      </div>
      <ul class="skill-list">
        ${g.members.map(m => `<li>${esc(m)}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   Scroll reveal (3D perspective transitions)
   -------------------------------------------------------------------------- */
function setupReveal() {
  const targets = $$('[data-reveal]');

  if (state.reducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  targets.forEach(el => io.observe(el));
}

/* --------------------------------------------------------------------------
   Nav — stuck shadow, mobile menu, active section tracking
   -------------------------------------------------------------------------- */
function setupNav() {
  const nav = $('.nav');

  if (nav) {
    const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const navLinks = $$('.nav__links a').filter(a => (a.getAttribute('href') || '').startsWith('#'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }
}

/* --------------------------------------------------------------------------
   Scroll progress indicator
   -------------------------------------------------------------------------- */
function setupScrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = `scaleX(${progress})`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* --------------------------------------------------------------------------
   3D Ambient Canvas in Hero (Smooth 3D constellation & depth particle field)
   -------------------------------------------------------------------------- */
function setupHeroCanvas() {
  const canvas = $('#heroCanvas');
  if (!canvas || state.reducedMotion) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  const NUM_POINTS = 38;
  const points = [];
  const FOCAL_LENGTH = 320;

  for (let i = 0; i < NUM_POINTS; i++) {
    points.push({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 450,
      z: (Math.random() - 0.5) * 400,
      size: Math.random() * 2 + 1.2
    });
  }

  let rotX = 0;
  let rotY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  const hero = $('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = nx * 0.45;
      targetRotX = -ny * 0.35;
    });
    hero.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    rotX += (targetRotX - rotX) * 0.04;
    rotY += (targetRotY - rotY) * 0.04;

    const cosY = Math.cos(rotY + performance.now() * 0.00018);
    const sinY = Math.sin(rotY + performance.now() * 0.00018);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    const projected = [];
    const cx = width * 0.72;
    const cy = height * 0.48;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      let x1 = p.x * cosY - p.z * sinY;
      let z1 = p.z * cosY + p.x * sinY;
      let y1 = p.y * cosX - z1 * sinX;
      let z2 = z1 * cosX + p.y * sinX + 380;

      if (z2 <= 20) continue;

      const scale = FOCAL_LENGTH / z2;
      const px = cx + x1 * scale;
      const py = cy + y1 * scale;
      const alpha = Math.min(1, Math.max(0.12, (scale - 0.4) * 1.2));

      projected.push({ x: px, y: py, size: p.size * scale, alpha, z: z2 });
    }

    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const p1 = projected[i];
        const p2 = projected[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const lineAlpha = (1 - dist / 120) * 0.22 * Math.min(p1.alpha, p2.alpha);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(180, 95, 45, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      ctx.beginPath();
      ctx.fillStyle = `rgba(224, 102, 44, ${p.alpha * 0.75})`;
      ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* --------------------------------------------------------------------------
   Hero deck interactive 3D mouse parallax
   -------------------------------------------------------------------------- */
function setupDeckTilt() {
  const visual = $('.hero__visual');
  const deck = $('#deck');
  if (!visual || !deck || state.reducedMotion) return;

  visual.addEventListener('mousemove', (e) => {
    const rect = visual.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    const tiltX = (6 - ny * 18).toFixed(2);
    const tiltY = (-14 + nx * 24).toFixed(2);

    deck.style.setProperty('--deck-tilt-x', `${tiltX}deg`);
    deck.style.setProperty('--deck-tilt-y', `${tiltY}deg`);
  });

  visual.addEventListener('mouseleave', () => {
    deck.style.setProperty('--deck-tilt-x', `6deg`);
    deck.style.setProperty('--deck-tilt-y', `-14deg`);
  });
}

/* --------------------------------------------------------------------------
   About card subtle 3D tilt
   -------------------------------------------------------------------------- */
function setupAboutTilt() {
  const container = $('#sem-media-container');
  if (!container || state.reducedMotion) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    container.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${(-ny * 6).toFixed(2)}deg) rotateY(${(nx * 6).toFixed(2)}deg)`;
  });

  container.addEventListener('mouseleave', () => {
    container.style.transform = 'translate(-50%, -50%)';
  });
}

/* --------------------------------------------------------------------------
   Animated statistics numbers on scroll
   -------------------------------------------------------------------------- */
function setupAnimatedStats() {
  const items = $$('.stats__item dt[data-target]');
  if (!items.length || state.reducedMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * target);
        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  items.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Interactive Modals & Toast Handlers
   ========================================================================== */
function openProjectModalByIndex(idx) {
  const project = state.projects[idx];
  if (project) openProjectModal(project);
}
window.openProjectModalByIndex = openProjectModalByIndex;

function openProjectModal(project) {
  if (!project) return;

  const modal = $('#projectModal');
  const card = $('#projectModalCard');
  if (!modal || !card) return;

  $('#modalProjectCategory').textContent = labelOf(project);
  $('#modalProjectTitle').textContent = project.title;
  $('#modalProjectImg').src = imageOf(project);
  $('#modalProjectImg').alt = project.title;
  $('#modalProjectDesc').textContent = project.desc;
  $('#modalProjectStats').textContent = project.stats || `${project.tags.join(' • ')} • Production Ready`;

  const deliverablesList = $('#modalProjectDeliverables');
  const deliverablesWrap = $('#modalProjectDeliverablesWrap');
  if (deliverablesList && deliverablesWrap) {
    const list = project.deliverables || [
      `Complete implementation in ${project.tags[0]}`,
      `Automated validation test suite`,
      `End-to-end security and production hardening`
    ];
    deliverablesList.innerHTML = list.map(item => `<li>${esc(item)}</li>`).join('');
  }

  const tagsWrap = $('#modalProjectTags');
  if (tagsWrap) {
    tagsWrap.innerHTML = project.tags.map(t => `<span class="modal-tag">${esc(t)}</span>`).join('');
  }

  const actionsWrap = $('#modalProjectActions');
  if (actionsWrap) {
    actionsWrap.innerHTML = `
      <a class="btn btn--solid" href="${project.github}" target="_blank" rel="noopener">
        View Source Code ${arrowIcon}
      </a>
      ${hasLive(project) ? `
        <a class="btn btn--ghost" href="${project.live}" target="_blank" rel="noopener">
          Live Demo ↗
        </a>
      ` : ''}
    `;
  }

  modal.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
}
window.openProjectModal = openProjectModal;

function closeProjectModal() {
  const modal = $('#projectModal');
  if (modal) {
    modal.classList.remove('is-visible');
    document.body.style.overflow = '';
  }
}
window.closeProjectModal = closeProjectModal;

function openContactModal() {
  const modal = $('#contactModal');
  if (modal) {
    modal.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }
}
window.openContactModal = openContactModal;

function closeContactModal() {
  const modal = $('#contactModal');
  if (modal) {
    modal.classList.remove('is-visible');
    document.body.style.overflow = '';
  }
}
window.closeContactModal = closeContactModal;

async function handleContactSubmit(e) {
  e.preventDefault();
  const submitBtn = $('#contactSubmitBtn');
  const nameInput = $('#contactName');
  const emailInput = $('#contactEmail');
  const typeInput = $('#contactType');
  const messageInput = $('#contactMessage');

  const name = nameInput ? nameInput.value.trim() : '';
  const senderEmail = emailInput ? emailInput.value.trim() : '';
  const domain = typeInput ? typeInput.value : 'General Inquiry';
  const message = messageInput ? messageInput.value.trim() : '';

  if (!name || !senderEmail || !message) {
    showToast('Please fill out your name, email, and message.');
    return;
  }

  const recipient = 'afjalansari29162@gmail.com';
  const subjectText = `[Portfolio Inquiry] ${domain} - from ${name}`;
  const compiledBody = 
`Hello Afjal,

You received a new inquiry from your portfolio (DraculaHub786.github.io):

• Sender Name: ${name}
• Sender Email: ${senderEmail}
• Project Domain: ${domain}

• Message:
${message}

--------------------------------------------------
Sent from DraculaHub786 Portfolio`;

  const mailtoUri = `mailto:${recipient}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(compiledBody)}`;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
  }

  let sentDirectly = false;
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: senderEmail,
        domain: domain,
        message: message,
        _subject: subjectText,
        _template: 'table'
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success === 'true' || data.success === true || response.status === 200) {
        sentDirectly = true;
      }
    }
  } catch (err) {
    console.warn('Direct delivery unavailable, triggering mail client fallback:', err);
  }

  if (sentDirectly) {
    showToast(`Message sent to ${recipient}! Thank you, ${name}.`);
  } else {
    // Open email client with pre-compiled message
    window.location.href = mailtoUri;
    showToast(`Compiled message for ${recipient}! Opening email client...`);
  }

  if ($('#contactForm')) $('#contactForm').reset();
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
  closeContactModal();
}
window.handleContactSubmit = handleContactSubmit;

function copyEmail() {
  const email = 'afjalansari29162@gmail.com';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(email).then(() => {
      showToast(`Email copied: ${email}`);
    }).catch(() => {
      showToast(`Contact: ${email}`);
    });
  } else {
    showToast(`Contact: ${email}`);
  }
}
window.copyEmail = copyEmail;

function showToast(message) {
  const container = $('#toastContainer');
  if (!container) return;

  const item = document.createElement('div');
  item.className = 'toast-item';
  item.innerHTML = `<span class="toast-item-dot"></span><span>${esc(message)}</span>`;
  container.appendChild(item);

  requestAnimationFrame(() => {
    item.classList.add('is-active');
  });

  setTimeout(() => {
    item.classList.remove('is-active');
    setTimeout(() => item.remove(), 320);
  }, 3600);
}
window.showToast = showToast;

function toggleMobileMenu() {
  const drawer = $('#mobileDrawer');
  if (drawer) {
    drawer.classList.toggle('is-open');
  }
}
window.toggleMobileMenu = toggleMobileMenu;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
    closeContactModal();
    const drawer = $('#mobileDrawer');
    if (drawer && drawer.classList.contains('is-open')) drawer.classList.remove('is-open');
  }
});



/* ==========================================================================
   23. Horizontal Spatial Journey Canvas ("Where I've Built")
   ========================================================================== */
function initExperienceJourney() {
  const section = $('#journey');
  const stage = $('#exp-horizontal-stage');
  if (!section || !stage) return;

  const tickerTop = $('#exp-ticker-top');
  const tickerBottom = $('#exp-ticker-bottom');
  const hudProgress = $('#exp-hud-progress');
  const hudPhase = $('#exp-hud-phase');
  const dateBgs = $$('.exp-date-bg', stage);
  const jumpButtons = $$('.exp-jump-btn');

  let currentTranslateX = 0;
  let targetTranslateX = 0;
  let currentProgress = 0;
  let targetProgress = 0;
  let isTicking = false;

  function getMetrics() {
    const totalDist = section.offsetHeight - window.innerHeight;
    const stageWidth = stage.scrollWidth;
    const maxTranslate = Math.max(0, stageWidth - window.innerWidth);
    return { totalDist, maxTranslate };
  }

  let metrics = getMetrics();
  window.addEventListener('resize', () => {
    metrics = getMetrics();
    if (state.reducedMotion) stage.style.transform = 'none';
  }, { passive: true });

  function renderFrame() {
    isTicking = false;
    if (state.reducedMotion) return;

    currentProgress += (targetProgress - currentProgress) * 0.09;
    currentTranslateX += (targetTranslateX - currentTranslateX) * 0.09;

    stage.style.transform = `translate3d(${currentTranslateX.toFixed(2)}px, 0, 0)`;

    dateBgs.forEach(dateEl => {
      const offset = -currentTranslateX * 0.18;
      dateEl.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0)`;
    });

    if (tickerTop) {
      tickerTop.style.transform = `translate3d(${(currentTranslateX * 0.3).toFixed(1)}px, 0, 0)`;
    }
    if (tickerBottom) {
      tickerBottom.style.transform = `translate3d(${(-currentTranslateX * 0.25).toFixed(1)}px, 0, 0)`;
    }

    if (hudProgress) {
      hudProgress.style.width = `${(currentProgress * 100).toFixed(1)}%`;
    }

    if (hudPhase) {
      if (currentProgress < 0.28) {
        hudPhase.textContent = "SECURITY & HONEYPOTS";
      } else if (currentProgress < 0.55) {
        hudPhase.textContent = "DEVSECOPS & SCANNERS";
      } else if (currentProgress < 0.82) {
        hudPhase.textContent = "APPLIED AI & NLP";
      } else {
        hudPhase.textContent = "DIGITAL WELLBEING & APPS";
      }
    }

    jumpButtons.forEach(btn => {
      const btnProgress = parseFloat(btn.dataset.progress || '0');
      const isCurrent = Math.abs(currentProgress - btnProgress) < 0.18;
      btn.classList.toggle('is-active', isCurrent);
    });

    if (Math.abs(targetTranslateX - currentTranslateX) > 0.1 || Math.abs(targetProgress - currentProgress) > 0.001) {
      isTicking = true;
      requestAnimationFrame(renderFrame);
    }
  }

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const scrolled = -rect.top;
    if (metrics.totalDist <= 0) return;

    const raw = scrolled / metrics.totalDist;
    targetProgress = Math.min(Math.max(raw, 0), 1);
    targetTranslateX = -targetProgress * metrics.maxTranslate;

    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(renderFrame);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  jumpButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const p = parseFloat(btn.dataset.progress || '0');
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: sectionTop + p * metrics.totalDist,
        behavior: 'smooth'
      });
    });
  });

  onScroll();
}

/* ==========================================================================
   24. Scroll-Expand Media Component (Cinematic Threat Model & Ethos)
   ========================================================================== */
function initScrollExpandMedia() {
  const section = $('#about');
  if (!section) return;

  const bg = $('#semBg');
  const mediaContainer = $('#sem-media-container');
  const mediaBlur = $('#sem-media-blur');
  const mediaContent = $('#sem-media-content');
  const titleFirst = $('#sem-title-first');
  const titleRest = $('#sem-title-rest');
  const dateTag = $('#sem-date');
  const scrollPrompt = $('#sem-scroll-prompt');

  const ASPECT_RATIO = 16 / 9;
  let rafScheduled = false;

  function applyFrame(progress) {
    if (state.reducedMotion) return;

    const isMobile = window.innerWidth < 768;
    const startW = isMobile ? 280 : 320;
    const startH = isMobile ? 360 : 420;

    const maxW = Math.min(window.innerWidth * 0.94, 1200);
    const maxH = Math.min(window.innerHeight * 0.86, maxW / ASPECT_RATIO);
    const endW = maxW;
    const endH = maxH;

    const currentW = startW + progress * (endW - startW);
    const currentH = startH + progress * (endH - startH);
    const textTranslateX = (progress * (isMobile ? 160 : 135)).toFixed(1);

    if (mediaContainer) {
      mediaContainer.style.width = `${currentW.toFixed(1)}px`;
      mediaContainer.style.height = `${currentH.toFixed(1)}px`;
      const borderAlpha = (0.2 + (1 - progress) * 0.35).toFixed(2);
      mediaContainer.style.borderColor = `rgba(255, 255, 255, ${borderAlpha})`;
    }

    if (mediaBlur) {
      if (progress < 0.6) {
        mediaBlur.style.visibility = 'visible';
        mediaBlur.style.opacity = Math.max(0, 1 - progress * 1.8).toFixed(3);
      } else {
        mediaBlur.style.opacity = '0';
        mediaBlur.style.visibility = 'hidden';
      }
    }

    if (bg) {
      bg.style.opacity = Math.max(0.2, 1 - progress * 0.8).toFixed(3);
    }

    const titleOpacity = Math.max(0, 1 - progress * 1.5).toFixed(3);
    if (titleFirst) {
      titleFirst.style.transform = `translateX(-${textTranslateX}vw) translateZ(0)`;
      titleFirst.style.opacity = titleOpacity;
    }
    if (titleRest) {
      titleRest.style.transform = `translateX(${textTranslateX}vw) translateZ(0)`;
      titleRest.style.opacity = titleOpacity;
    }

    const subOpacity = Math.max(0, 1 - progress * 2.5).toFixed(3);
    if (dateTag) {
      dateTag.style.transform = `translateX(-${textTranslateX}vw)`;
      dateTag.style.opacity = subOpacity;
    }
    if (scrollPrompt) {
      scrollPrompt.style.transform = `translateX(${textTranslateX}vw)`;
      scrollPrompt.style.opacity = subOpacity;
    }

    if (mediaContent) {
      if (progress >= 0.78) {
        const contentProgress = Math.min(1, (progress - 0.78) / 0.22);
        mediaContent.style.opacity = contentProgress.toFixed(3);
        mediaContent.style.transform = `translateY(${((1 - contentProgress) * 14).toFixed(1)}px)`;
        mediaContent.style.pointerEvents = contentProgress > 0.5 ? 'auto' : 'none';
      } else {
        mediaContent.style.opacity = '0';
        mediaContent.style.transform = 'translateY(14px)';
        mediaContent.style.pointerEvents = 'none';
      }
    }
  }

  function renderFrame() {
    rafScheduled = false;
    const rect = section.getBoundingClientRect();
    const totalDist = section.offsetHeight - window.innerHeight;
    if (totalDist <= 0) return;

    const scrolled = -rect.top;
    let target = 0;
    if (scrolled > 0) {
      const raw = scrolled / totalDist;
      target = Math.min(Math.max(raw / 0.92, 0), 1);
    }

    applyFrame(target);
  }

  function onScroll() {
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(renderFrame);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', renderFrame, { passive: true });
  renderFrame();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

