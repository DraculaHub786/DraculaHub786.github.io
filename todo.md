# What I found, straight answer

## Does it work in my sandbox?

Yes. I ran your real code (cloned from the repo) in headless Chromium on `python -m http.server 8085`.

| Test | Result |
|---|---|
| Normal browser settings | Journey scroll animates, reveals work, 3D ribbon renders |
| Browser reporting "reduce motion" (emulated) | Static page: journey becomes a stacked column, no scroll animation. **Same symptom you see** |
| Grid → 3D Ribbon (original code) | Ribbon collapses to a flat line. **Real bug, reproduced** |
| After my patch | Ribbon stays 1130×558 through repeated toggles; `?motion=full` animates even when the browser reports reduce motion |

## Can I find what's wrong from the code?

I did, and there are two separate things:

1. **Ribbon flat line** is a genuine bug in your code. Cause: `container.className` was overwritten, which lost the stage height, and a hidden container shrank the canvas to 1px. It is fixed in `portfolio-fix.patch`.
2. **Static scroll sections** are not a bug. `script.js` deliberately reads `prefers-reduced-motion` and your CSS deliberately switches to a static layout. Your logged-in browser's own console says `osReduceMotion: true`, so the page is doing exactly what it was written to do. The code cannot tell *why* that browser says `true`. That depends on your machine.

## Is there a related known case?

I searched. I did not find a documented case of "one profile of the same browser reports reduce-motion while another does not". What I did find are the real mechanisms that can make a browser report `true`:

- **OS setting** (Windows: Animation effects off; macOS: Reduce motion).
- **A Chrome launch flag**: `--force-prefers-reduced-motion`. If one browser window or shortcut was started with it, that instance reports `true`.
- **DevTools emulation** (Rendering tab). Chromium can simulate reduced motion without changing the OS, and it can be left on by accident.
- **Firefox**: `ui.prefersReducedMotion` in `about:config`.
- **Extensions** that inject CSS or override the setting.

So I can't point to a matching case, and I won't pretend to. These are the candidates, and one quick check separates them.

## 30-second check that likely finds it

1. In the **logged-in** browser, open `chrome://version` (Edge: `edge://version`).
2. Look at the **Command Line** line. If it contains `--force-prefers-reduced-motion`, that is the cause.
3. Do the same in the logged-out browser and compare.
4. Also compare the browser **name and version**. They may be different browsers.
5. If the flag isn't there, open DevTools (F12) → ⋮ → More tools → **Rendering** → *Emulate CSS media feature prefers-reduced-motion* → check it says "No emulation".
6. Then disable all extensions and reload.

## Making the site work regardless (recommended)

Because your visitors' settings are outside your control, apply the patch and deploy:

```bash
git apply portfolio-fix.patch
git add -A
git commit -m "Fix ribbon collapse; add ?motion=full override"
git push
```

Then open `https://nlpdigitox.me/?motion=full` once in the affected browser. This is remembered.

If you want the scroll animations to run **for everyone by default** (ignoring reduce motion), I can change that. The tradeoff: visitors who enabled reduced motion for health reasons would still get the horizontal scroll and 3D effects. A footer toggle for reduced motion is the usual middle ground.