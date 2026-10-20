/* Final verification: deep links, reduced motion, keyboard access, filters.
   usage: node tools/verify.js [url] */
const { spawn } = require('child_process');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9400 + Math.floor(Math.random() * 200);
const base = process.argv[2] || 'http://localhost:8765/';

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=' + path.join(require('os').tmpdir(), 'cdp-verify-' + PORT),
  'about:blank'
], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getTarget() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find(t => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch (_) {}
    await sleep(250);
  }
  throw new Error('no debug target');
}

function cdp(ws) {
  let id = 0;
  const pending = new Map();
  const errors = [];
  ws.addEventListener('message', ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(msg.params.exceptionDetails.text + ' ' +
        (msg.params.exceptionDetails.exception?.description || ''));
    } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      errors.push('console.error: ' + msg.params.args.map(a => a.value ?? a.description).join(' '));
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  send.errors = errors;
  return send;
}

const ev = async (send, expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' :: ' + expression);
  return r.result.value;
};

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
};

(async () => {
  const wsUrl = await getTarget();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.addEventListener('open', r));
  const send = cdp(ws);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  const load = async (url) => {
    await send('Page.navigate', { url });
    await sleep(2200);
    await ev(send, `document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');
                     window.scrollTo(0, document.body.scrollHeight);`);
    await sleep(1600);
    await ev(send, 'window.scrollTo(0,0);');
    await sleep(600);
  };

  // --- 1. Deep link ?cat=ai applies the filter -------------------------
  await load(base + '?cat=ai');
  let r = await ev(send, `(() => {
    const shown = Array.from(document.querySelectorAll('#cards .card')).filter(c => !c.hidden);
    const active = document.querySelector('.chip.is-active');
    return { n: shown.length, chip: active && active.dataset.filter, url: location.search };
  })()`);
  check('deep link ?cat=ai filters the grid', r.n === 2 && r.chip === 'ai', `${r.n} cards, chip=${r.chip}, url=${r.url}`);

  // --- 2. Filter chip counts match reality ------------------------------
  await load(base);
  r = await ev(send, `(() => {
    const out = {};
    for (const key of ['all','security','ai','apps']) {
      document.querySelector('.chip[data-filter=' + key + ']').click();
      out[key] = {
        visible: Array.from(document.querySelectorAll('#cards .card')).filter(c => !c.hidden).length,
        label: document.querySelector('[data-count=' + key + ']').textContent
      };
    }
    document.querySelector('.chip[data-filter=all]').click();
    return out;
  })()`);
  const countsOk = Object.values(r).every(v => String(v.visible) === v.label);
  check('chip counts match the visible card count', countsOk, JSON.stringify(r));

  // --- 3. Every project renders a card ---------------------------------
  r = await ev(send, `(() => {
    const cards = document.querySelectorAll('#cards .card');
    const stack = document.querySelectorAll('.stack-item');
    const skills = document.querySelectorAll('.skill-card');
    return { cards: cards.length, stack: stack.length, skills: skills.length,
             links: Array.from(cards).every(c => !!c.querySelector('a[href*="github.com"]')) };
  })()`);
  check('15 grid cards + 6 stack cards + 6 skill groups', r.cards === 15 && r.stack === 6 && r.skills === 6, JSON.stringify(r));
  check('every card links to its GitHub source', r.links);

  // --- 4. No broken images, no horizontal overflow ----------------------
  r = await ev(send, `(() => {
    const broken = Array.from(document.images).filter(i => i.complete && i.naturalWidth === 0).map(i => i.src);
    return { broken, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  })()`);
  check('no broken images', r.broken.length === 0, r.broken.join(', '));
  check('no horizontal overflow at 1440px', r.overflow <= 0, 'overflow=' + r.overflow);

  // --- 5. Reduced motion path ------------------------------------------
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await load(base);
  r = await ev(send, `(() => {
    const items = Array.from(document.querySelectorAll('.stack-item'));
    const revealed = Array.from(document.querySelectorAll('[data-reveal]'));
    return {
      transforms: items.map(i => getComputedStyle(i).transform),
      hidden: revealed.filter(e => getComputedStyle(e).opacity === '0').length
    };
  })()`);
  check('reduced motion disables the 3D stack transform',
    r.transforms.every(t => t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)'), r.transforms[0]);
  check('reduced motion reveals all content', r.hidden === 0, r.hidden + ' still hidden');
  await send('Emulation.setEmulatedMedia', { features: [] });

  // --- 6. Mobile overflow ----------------------------------------------
  for (const w of [375, 768]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: 812, deviceScaleFactor: 1, mobile: w < 700 });
    await load(base);
    const o = await ev(send, 'document.documentElement.scrollWidth - document.documentElement.clientWidth');
    check(`no horizontal overflow at ${w}px`, o <= 0, 'overflow=' + o);
  }

  ws.close();
  chrome.kill();
  check('no uncaught JS errors', send.errors.length === 0, send.errors.join(' | '));
  const failed = results.filter(x => !x.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error(e); chrome.kill(); process.exit(1); });
