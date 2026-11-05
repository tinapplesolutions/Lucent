/* Lucent service worker: the app and the whole dictionary work offline. */
const VERSION = 'lucent-v1.1.0';
const SHELL = ['./', 'index.html', 'app.js', 'content.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png',
  'fonts/cormorant-garamond-latin-400-normal.woff2', 'fonts/cormorant-garamond-latin-400-italic.woff2', 'fonts/cormorant-garamond-latin-500-normal.woff2',
  'fonts/cormorant-garamond-latin-500-italic.woff2', 'fonts/cormorant-garamond-latin-600-normal.woff2', 'fonts/cormorant-garamond-latin-ext-400-normal.woff2',
  'fonts/cormorant-garamond-latin-ext-400-italic.woff2', 'fonts/cormorant-garamond-latin-ext-500-normal.woff2', 'fonts/cormorant-garamond-latin-ext-500-italic.woff2',
  'fonts/inter-latin-300-normal.woff2', 'fonts/inter-latin-400-normal.woff2', 'fonts/inter-latin-500-normal.woff2', 'fonts/inter-latin-600-normal.woff2',
  'fonts/inter-latin-ext-400-normal.woff2'];
const DICT = 'lucent-dict-v2';
const AUDIO = 'lucent-audio';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => (k.startsWith('lucent-v') && k !== VERSION) || (k.startsWith('lucent-dict-') && k !== DICT)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data && e.data.type === 'skip-waiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) {
    if (/dictionaryapi\.dev\/media|gstatic\.com\/dictionary/.test(url.href)) e.respondWith(cacheFirst(e.request, AUDIO, true));
    return;
  }
  if (/\/data\//.test(url.pathname)) { e.respondWith(cacheFirst(e.request, DICT)); return; }
  e.respondWith(staleWhileRevalidate(e.request, VERSION));
});
async function cacheFirst(req, name, opaque) {
  const c = await caches.open(name);
  const hit = await c.match(req, { ignoreSearch: true });
  if (hit) return hit;
  try {
    const res = await fetch(opaque ? new Request(req.url, { mode: 'no-cors' }) : req);
    if (res.ok || res.type === 'opaque') c.put(req, res.clone());
    return res;
  } catch { return new Response('', { status: 504 }); }
}
async function staleWhileRevalidate(req, name) {
  const c = await caches.open(name);
  const hit = await c.match(req, { ignoreSearch: true });
  const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => null);
  return hit || (await net) || (await c.match('index.html')) || new Response('Offline', { status: 503 });
}

/* Save the whole dictionary for offline use, one file at a time (keeps memory low). */
let downloading = {};
self.addEventListener('message', e => {
  const m = e.data || {};
  if (m.type !== 'download' || !m.urls || downloading[m.key]) return;
  downloading[m.key] = true;
  e.waitUntil((async () => {
    const c = await caches.open(m.cache || DICT);
    let done = 0, ok = true;
    for (let i = 0; i < m.urls.length; i++) {
      const url = new URL(m.urls[i], self.registration.scope).href;
      try {
        if (!(await c.match(url))) { const res = await fetch(url); if (!res.ok) throw 0; await c.put(url, res); }
        done++;
      } catch { ok = false; }
      if (i % 5 === 4 || i === m.urls.length - 1) broadcast({ type: 'dl-progress', key: m.key, done });
    }
    broadcast({ type: 'dl-done', key: m.key, done, ok });
    downloading[m.key] = false;
  })());
});
async function broadcast(msg) { (await self.clients.matchAll({ includeUncontrolled: true })).forEach(c => c.postMessage(msg)); }
