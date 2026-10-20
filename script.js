/* --------------------------------------------------------------
   Portfolio interactions — DraculaHub786
   -------------------------------------------------------------- */

// Global state
const state = {
  projects: [],
  currentFilter: 'all',
  skills: new Set(),
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

/* Category → filter group mapping
   Security & Crypto = 'security'
   AI & Data        = 'ai'
   Apps & Web       = 'apps'
*/
const FILTER_MAP = {
  'Security': 'security',
  'Crypto': 'security',
  'AI': 'ai',
  'Apps': 'apps',
  'Web': 'apps'
};

/* --------------------------------------------------------------
   Helpers
   -------------------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* --------------------------------------------------------------
   Load projects.json
   -------------------------------------------------------------- */
async function loadProjects() {
  try {
    const res = await fetch('/projects.json');
    const data = await res.json();
    state.projects = data.projects;
    // Extract unique skills
    state.projects.forEach(p => p.tags.forEach(t => state.skills.add(t)));
    renderFeatured();
    renderGrid();
    renderSkills();
  } catch (e) {
    console.error('Failed to load projects.json', e);
  }
}

/* --------------------------------------------------------------
   Render Featured Cards (6 large 3D cards)
   -------------------------------------------------------------- */
function renderFeatured() {
  const container = $('.featured-grid');
  if (!container) return;

  const featured = state.projects.filter(p => p.featured);
  container.innerHTML = featured.map(p => featuredCardHTML(p)).join('');

  // Attach 3D tilt listeners
  $$('.featured-card').forEach(card => {
    if (state.reducedMotion) return;
    let currentX = 0, currentY = 0;
    const onMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      currentX += (deltaX - currentX) * 0.15;
      currentY += (deltaY - currentY) * 0.15;
      card.style.transform = `perspective(1000px) rotateY(${currentX * 8}deg) rotateX(${-currentY * 8}deg)`;
    };
    const onMouseLeave = () => {
      currentX = 0; currentY = 0;
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    };
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

function featuredCardHTML(p) {
  const liveBtn = p.live && p.live !== 'none'
    ? `<a href="${p.live}" target="_blank" rel="noopener" class="live-btn">🔗 Live Demo</a>`
    : `<span class="live-btn" disabled>No live demo</span>`;
  const filterGroup = FILTER_MAP[p.category] || 'security';

  return `
    <article class="featured-card" role="listitem" tabindex="0" data-filter-group="${filterGroup}" data-title="${escapeHTML(p.title)}">
      <img
        class="featured-img"
        src="${p.image}"
        alt="${escapeHTML(p.title)} screenshot"
        loading="lazy"
        width="1200"
        height="750"
      >
      <div class="card-overlay">
        <h3>${escapeHTML(p.title)}</h3>
        <p>${escapeHTML(p.desc)}</p>
        <div class="card-tags">
          ${p.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
        </div>
        ${liveBtn}
      </div>
      <footer class="card-footer">
        <span class="category-badge">${escapeHTML(p.category)}</span>
        <a href="${p.github}" target="_blank" rel="noopener" class="github-link">GitHub ↗</a>
      </footer>
    </article>
  `;
}

/* --------------------------------------------------------------
   Render Grid Cards (9 filterable cards)
   -------------------------------------------------------------- */
function renderGrid() {
  const container = $('.grid-cards');
  if (!container) return;
  container.innerHTML = state.projects
    .filter(p => !p.featured)
    .map(p => gridCardHTML(p))
    .join('');
}

function gridCardHTML(p) {
  const filterGroup = FILTER_MAP[p.category] || 'security';
  return `
    <article class="grid-card" role="listitem" data-filter-group="${filterGroup}" tabindex="0" data-title="${escapeHTML(p.title)}">
      <img
        class="grid-img"
        src="${p.image}"
        alt="${escapeHTML(p.title)} screenshot"
        loading="lazy"
        width="480"
        height="270"
      >
      <div class="card-overlay">
        <h4>${escapeHTML(p.title)}</h4>
        <p>${escapeHTML(p.desc)}</p>
        <div class="card-tags">
          ${p.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
        </div>
        ${p.live && p.live !== 'none' ? `<a href="${p.live}" target="_blank" rel="noopener" class="live-btn">🔗 Live</a>` : ''}
      </div>
      <footer class="card-footer">
        <span class="category-badge">${escapeHTML(p.category)}</span>
        <a href="${p.github}" target="_blank" rel="noopener" class="github-link">GitHub ↗</a>
      </footer>
    </article>
  `;
}

/* --------------------------------------------------------------
   Filter Chips
   -------------------------------------------------------------- */
function setupFilterChips() {
  const chips = $$('.filter-chips .chip, .nav-right .filter-btn');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      applyFilter(filter);
      chips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-pressed', 'true');
    });
  });
}

function applyFilter(filter) {
  state.currentFilter = filter;
  const allCards = $$('.featured-card, .grid-card');
  allCards.forEach(card => {
    const match = filter === 'all' || card.dataset.filterGroup === filter;
    card.style.display = match ? 'block' : 'none';
    card.setAttribute('aria-hidden', !match);
  });
  // Update URL for deep linking
  const url = new URL(window.location);
  if (filter === 'all') url.searchParams.delete('cat');
  else url.searchParams.set('cat', filter);
  window.history.replaceState({}, '', url);
}

/* --------------------------------------------------------------
   Skills Strip Scroll
   -------------------------------------------------------------- */
function renderSkills() {
  const container = $('.skills-pills');
  if (!container) return;
  const sortedSkills = [...state.skills].sort();
  container.innerHTML = sortedSkills.map(s => `<span class="skill-tag" role="option" tabindex="0">${escapeHTML(s)}</span>`).join('');
}

function setupSkillsScroll() {
  const wrapper = $('.skills-wrapper');
  const prev = $('.skill-prev');
  const next = $('.skill-next');
  if (!wrapper || !prev || !next) return;

  const step = 300;

  prev.addEventListener('click', () => {
    wrapper.scrollBy({ left: -step, behavior: 'smooth' });
  });
  next.addEventListener('click', () => {
    wrapper.scrollBy({ left: step, behavior: 'smooth' });
  });

  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') wrapper.scrollBy({ left: step, behavior: 'smooth' });
    if (e.key === 'ArrowLeft') wrapper.scrollBy({ left: -step, behavior: 'smooth' });
  });

  wrapper.addEventListener('scroll', () => {
    prev.disabled = wrapper.scrollLeft <= 0;
    next.disabled = wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 2;
  });
  wrapper.dispatchEvent(new Event('scroll'));
}

/* --------------------------------------------------------------
   Scroll Reveal (IntersectionObserver)
   -------------------------------------------------------------- */
function setupScrollReveal() {
  if (state.reducedMotion) {
    $$('[data-reveal]').forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  $$('[data-reveal]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 500ms ease, transform 500ms ease';
    observer.observe(el);
  });
}

/* CSS for revealed state - added dynamically */
const style = document.createElement('style');
style.textContent = `
  [data-reveal].revealed { opacity: 1 !important; transform: translateY(0) !important; }
`;
document.head.appendChild(style);

/* --------------------------------------------------------------
   Navbar shadow on scroll
   -------------------------------------------------------------- */
function setupNavbarScroll() {
  const nav = $('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) nav.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
    else nav.style.boxShadow = 'none';
  });
}

/* --------------------------------------------------------------
   Reduce motion handling
   -------------------------------------------------------------- */
function setupReduceMotion() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', e => {
    state.reducedMotion = e.matches;
    if (e.matches) {
      document.body.style.transition = 'none';
      $$('[data-reveal]').forEach(el => el.classList.add('revealed'));
      $$('.featured-card').forEach(c => c.style.transform = 'none');
    }
  });
}

/* --------------------------------------------------------------
   URL deep linking for filters
   -------------------------------------------------------------- */
function handleDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (cat && ['security', 'ai', 'apps'].includes(cat)) {
    const chip = document.querySelector(`.chip[data-filter="${cat}"]`) || document.querySelector(`.nav-right .filter-btn[data-filter="${cat}"]`);
    if (chip) chip.click();
  }
}

/* --------------------------------------------------------------
   Utility: escape HTML
   -------------------------------------------------------------- */
function escapeHTML(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* --------------------------------------------------------------
   Init
   -------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async () => {
  await loadProjects();
  setupFilterChips();
  setupSkillsScroll();
  setupScrollReveal();
  setupNavbarScroll();
  setupReduceMotion();
  handleDeepLink();
});