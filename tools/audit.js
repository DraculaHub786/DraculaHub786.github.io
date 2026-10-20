/* Audit helper: loads the site in headless Chrome, reports section geometry,
   image health and console/network errors.
   usage: node tools/audit.js [url] [width] */
const { spawn } = require('child_process');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9700 + Math.floor(Math.random() * 300);
const url = process.argv[2] || 'http://localhost:8765/';
const W = Number(process.argv[3]) || 1440;

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=' + path.join(require('os').tmpdir(), 'cdp-audit-' + PORT),
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
  const events = [];
  ws.addEventListener('message', ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method) {
      events.push(msg);
    }
  });
  return { send: (method, params = {}) => new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  }), events };
}

const PROBE = `(() => {
  const q = s => document.querySelector(s);
  const r = s => { const e = q(s); return e ? e.getBoundingClientRect() : null; };
  const y = el => el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;

  const sections = {};
  for (const id of ['featured','work','stack','about']) {
    const el = document.getElementById(id);
    if (el) sections[id] = { top: y(el), height: Math.round(el.getBoundingClientRect().height) };
  }

  const cards = Array.from(document.querySelectorAll('.stack-item')).map((el, i) => {
    const b = el.getBoundingClientRect();
    return { i, top: Math.round(b.top + window.scrollY), height: Math.round(b.height) };
  });

  const imgs = Array.from(document.images).map(im => ({
    src: im.getAttribute('src'),
    complete: im.complete,
    natural: im.naturalWidth,
    loading: im.loading,
    broken: im.complete && im.naturalWidth === 0
  }));

  const grid = Array.from(document.querySelectorAll('#cards .card')).map(el => ({
    t: el.querySelector('.card__title').textContent,
    top: Math.round(el.getBoundingClientRect().top + window.scrollY),
    h: Math.round(el.getBoundingClientRect().height)
  }));

  const fonts = Array.from(document.fonts).map(f => f.family + ' ' + f.status);
  const cs = getComputedStyle(document.querySelector('.hero__title'));

  return JSON.stringify({
    scrollHeight: document.documentElement.scrollHeight,
    innerHeight: window.innerHeight,
    sections, cards, imgs, grid,
    fonts: [...new Set(fonts)],
    heroFont: cs.fontFamily,
    heroSize: cs.fontSize,
    bodyFont: getComputedStyle(document.body).fontFamily
  }, null, 1);
})()`;

(async () => {
  const wsUrl = await getTarget();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.addEventListener('open', r));
  const { send, events } = cdp(ws);

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Log.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 700 });
  await send('Page.navigate', { url });
  await sleep(3000);

  // Force every lazy image to load, then let it settle.
  await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');
                 window.scrollTo(0, document.body.scrollHeight);`
  });
  await sleep(2500);
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0);' });
  await sleep(1200);

  const res = await send('Runtime.evaluate', { expression: PROBE, returnByValue: true });
  console.log(res.result.value);

  const failed = events.filter(e =>
    (e.method === 'Network.loadingFailed') ||
    (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') ||
    (e.method === 'Log.entryAdded' && e.params.entry.level === 'error'));
  console.log('\n--- errors ---');
  console.log(failed.length ? JSON.stringify(failed, null, 1) : 'none');

  ws.close();
  chrome.kill();
  process.exit(0);
})().catch(e => { console.error(e); chrome.kill(); process.exit(1); });
