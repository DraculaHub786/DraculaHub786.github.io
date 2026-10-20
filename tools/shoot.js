/* Screenshot helper: drives headless Chrome over CDP to capture the site at
   arbitrary scroll positions and viewport widths.
   usage: node tools/shoot.js <url> <outDir> <name:scrollY[:width]> ... */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9222 + Math.floor(Math.random() * 500);

const url = process.argv[2] || 'http://localhost:8765/';
const outDir = process.argv[3] || 'shots';
const specs = process.argv.slice(4).map(s => {
  const [name, y, w, pre] = s.split(':');
  return { name, y: Number(y) || 0, w: Number(w) || 1440, pre: pre || '' };
});

fs.mkdirSync(outDir, { recursive: true });

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=' + path.join(require('os').tmpdir(), 'cdp-' + PORT),
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
  throw new Error('Chrome did not expose a debugging target');
}

function cdp(ws) {
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    }
  });
  return (method, params = {}) => new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
}

(async () => {
  const wsUrl = await getTarget();
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.addEventListener('open', r));
  const send = cdp(ws);

  await send('Page.enable');
  await send('Runtime.enable');

  for (const spec of specs) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: spec.w, height: spec.w < 700 ? 812 : 900, deviceScaleFactor: 1, mobile: spec.w < 700
    });
    await send('Page.navigate', { url });
    await sleep(2600);

    // Force lazy images in, then settle the whole page so measurements and
    // captures reflect the final layout rather than a mid-load state.
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager');
                   document.documentElement.style.scrollBehavior='auto';
                   window.scrollTo(0, document.body.scrollHeight);`
    });
    await sleep(2000);

    await send('Runtime.evaluate', {
      expression: `document.documentElement.style.scrollBehavior='auto';
                   window.scrollTo(0, ${spec.y});
                   window.dispatchEvent(new Event('scroll'));`
    });
    await sleep(1400);

    if (spec.pre) {
      await send('Runtime.evaluate', { expression: spec.pre });
      await sleep(700);
    }

    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const file = path.join(outDir, `${spec.name}.png`);
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
    console.log('wrote', file);
  }

  ws.close();
  chrome.kill();
  process.exit(0);
})().catch(err => { console.error(err); chrome.kill(); process.exit(1); });
