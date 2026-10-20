/* ==========================================================================
   DraculaHub786 — Portfolio interactions
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

/* Filter groups, and the label each card wears — kept in step with the
   category label baked into the tile artwork. */
const CATEGORY_LABEL = {
  Security: 'Security',
  Crypto:   'Crypto',
  AI:       'AI & Data',
  Apps:     'Apps',
  Web:      'Web'
};

const labelOf = (p) => CATEGORY_LABEL[p.category] || p.category;

const SKILL_GROUPS = [
  { name: 'Languages',         icon: 'M8 6l-5 6 5 6M16 6l5 6-5 6',               members: ['Python', 'JavaScript', 'TypeScript', 'Dart', 'Go', 'HTML', 'Flutter'] },
  { name: 'Backend & UI',      icon: 'M4 7h16M4 12h16M4 17h10',                   members: ['Flask', 'FastAPI', 'Next.js', 'React', 'Socket.IO', 'Streamlit'] },
  { name: 'Data & Infra',      icon: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z',        members: ['MongoDB', 'Firestore', 'Docker', 'Nginx', 'Ethereum', 'Hugging Face'] },
  { name: 'Security & Crypto', icon: 'M12 3l7 3v6c0 4.2-3 7.4-7 9-4-1.8-7-9-7-9V6l7-3z', members: ['cryptography', 'encryption', 'hashing', 'security', 'WebRTC'] },
  { name: 'Tooling',           icon: 'M14 7a4 4 0 11-4 4l-6 6v2h2l6-6a4 4 0 014-6z', members: ['CLI', 'VS Code', 'yt-dlp', 'automation'] },
  { name: 'Product Work',      icon: 'M12 3l2.5 5.5L20 10l-4 4 .9 5.5L12 16.9 7.1 19.5 8 14l-4-4 5.5-1.5z', members: ['downloading', 'wellbeing', 'AI concierge', 'web'] }
];

const state = {
  projects: [],
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

/* --------------------------------------------------------------------------
   Utilities
   -------------------------------------------------------------------------- */
const esc = (str) => String(str)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const groupOf = (p) => FILTER_MAP[p.category] || 'security';
const hasLive = (p) => p.live && p.live !== 'none';

const arrowIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
async function boot() {
  try {
    const res = await fetch('/projects.json');
    const json = await res.json();
    state.projects = json.projects;
  } catch (err) {
    console.error('Could not load projects.json', err);
    return;
  }

  renderDeck();
  renderStack();
  renderCards();
  renderSkillGroups();
  countFilters();

  setupFilters();
  setupDeepLink();
  setupStack();
  setupReveal();
  setupNav();
}

/* --------------------------------------------------------------------------
   Hero deck — three mini cards fanned in 3D
   -------------------------------------------------------------------------- */
function renderDeck() {
  const deck = $('#deck');
  if (!deck) return;
  const picks = state.projects.filter(p => p.featured).slice(0, 3);
  deck.innerHTML = picks.map(p => `
    <div class="deck__card">
      <img class="deck__img" src="${p.image}" alt="" width="380" height="186" loading="eager" decoding="async">
      <div class="deck__body">
        <p class="deck__title">${esc(p.title)}</p>
        <p class="deck__meta">${esc(labelOf(p))} · ${esc(p.tags[0])}</p>
      </div>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   Featured — sticky 3D stack
   -------------------------------------------------------------------------- */
function renderStack() {
  const stack = $('#featuredStack');
  if (!stack) return;
  const featured = state.projects.filter(p => p.featured);

  stack.innerHTML = featured.map((p, i) => `
    <article class="stack-item">
      <div class="stack-item__body">
        <div class="stack-item__media">
          <span class="stack-item__num">${String(i + 1).padStart(2, '0')}</span>
          <img src="${p.image}" alt="${esc(p.title)} preview" width="320" height="180" loading="lazy" decoding="async">
        </div>
        <div class="stack-item__panel">
          <p class="stack-item__cat">${esc(labelOf(p))}</p>
          <h3 class="stack-item__title">${esc(p.title)}</h3>
          <p class="stack-item__desc">${esc(p.desc)}</p>
          <ul class="tags">
            ${p.tags.map(t => `<li class="tag">${esc(t)}</li>`).join('')}
          </ul>
          <div class="stack-item__links">
            <a class="link-btn" href="${p.github}" target="_blank" rel="noopener">Source ${arrowIcon}</a>
            ${hasLive(p) ? `<a class="link-btn link-btn--live" href="${p.live}" target="_blank" rel="noopener">Live demo ${arrowIcon}</a>` : ''}
          </div>
        </div>
      </div>
    </article>
  `).join('') + '<div class="stack__tail" aria-hidden="true"></div>';
}

/* --------------------------------------------------------------------------
   Project cards grid — every project
   -------------------------------------------------------------------------- */
function renderCards() {
  const wrap = $('#cards');
  if (!wrap) return;

  wrap.innerHTML = state.projects.map(p => `
    <article class="card" data-group="${groupOf(p)}" data-title="${esc(p.title)}">
      <div class="card__media">
        <span class="card__badge">${p.featured ? 'Featured' : esc(labelOf(p))}</span>
        ${hasLive(p) ? '<span class="card__live">Live</span>' : ''}
        <img src="${p.image}" alt="${esc(p.title)} preview" width="1200" height="675" loading="lazy" decoding="async">
      </div>
      <div class="card__body">
        <h3 class="card__title">${esc(p.title)}</h3>
        <p class="card__desc">${esc(p.desc)}</p>
        <ul class="tags">${p.tags.map(t => `<li class="tag">${esc(t)}</li>`).join('')}</ul>
        <div class="card__foot">
          <a class="card__gh" href="${p.github}" target="_blank" rel="noopener">View source ${arrowIcon}</a>
          ${hasLive(p) ? `<a class="card__gh" href="${p.live}" target="_blank" rel="noopener">Live ${arrowIcon}</a>` : ''}
        </div>
      </div>
    </article>
  `).join('');
}

/* --------------------------------------------------------------------------
   Filters
   -------------------------------------------------------------------------- */
function countFilters() {
  const counts = { all: state.projects.length, security: 0, ai: 0, apps: 0 };
  state.projects.forEach(p => { counts[groupOf(p)] += 1; });
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
      chips.forEach(c => {
        const on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
    });
  });
}

function applyFilter(filter) {
  const cards = $$('#cards .card');
  let shown = 0;
  cards.forEach(card => {
    const match = filter === 'all' || card.dataset.group === filter;
    card.hidden = !match;
    if (match) shown += 1;
  });
  const empty = $('#cardsEmpty');
  if (empty) empty.hidden = shown !== 0;

  const url = new URL(window.location);
  if (filter === 'all') url.searchParams.delete('cat');
  else url.searchParams.set('cat', filter);
  window.history.replaceState({}, '', url);
}

function setupDeepLink() {
  const cat = new URLSearchParams(window.location.search).get('cat');
  if (!cat) return;
  const chip = $(`.chip[data-filter="${cat}"]`);
  if (chip) chip.click();
}

/* --------------------------------------------------------------------------
   Sticky stack scroll driver — cards recede in 3D as the next one docks
   -------------------------------------------------------------------------- */
function setupStack() {
  const stack = $('#featuredStack');
  if (!stack) return;
  const items = $$('.stack-item', stack);
  if (!items.length || state.reducedMotion) return;

  const DOCK = 92;
  const work = $('.section--work');
  let metrics = [];
  let workDockY = null;
  let queued = false;

  function measure() {
    const stackTop = stack.getBoundingClientRect().top + window.scrollY;
    metrics = items.map(item => ({
      dockY: stackTop + item.offsetTop - DOCK
    }));
    // The "All projects" sheet takes over from the final card, so the last
    // card recedes in 3D the same way the others do when a successor docks.
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
        p = (y - (nextDock - vh * 0.55)) / (vh * 0.8);
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

  wrap.innerHTML = groups.map(g => `
    <div class="skill-card">
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
   Scroll reveal
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
   Nav — stuck shadow, mobile menu, active section
   -------------------------------------------------------------------------- */
function setupNav() {
  const nav = $('.nav');
  const toggle = $('#navToggle');
  const links = $('#navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
    });
    links.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
      }
    });
  }

  if (nav) {
    const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Highlight the section currently in view. Only same-page anchors are
  // candidates — an off-site href would throw inside querySelector.
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
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }
}

document.addEventListener('DOMContentLoaded', boot);
