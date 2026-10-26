const VERSION = 'crack-and-cup-pos-v2';
const SHELL = [
  './',
  'app.min.js',
  'assets/fonts/Anton.woff2',
  'assets/fonts/BigShoulders-Bold.ttf',
  'assets/fonts/PermanentMarker.woff2',
  'assets/icons/apple-touch-icon.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
  'assets/img/logo-gray.png',
  'assets/img/menu/adobo.png',
  'assets/img/menu/bf-fillet.png',
  'assets/img/menu/bf-hotdog.png',
  'assets/img/menu/bf-hungarian.png',
  'assets/img/menu/bf-poppers.png',
  'assets/img/menu/bf-spam.png',
  'assets/img/menu/bf-tapa.png',
  'assets/img/menu/bf-tocino.png',
  'assets/img/menu/chicken-ala-king.png',
  'assets/img/menu/fried-chicken.png',
  'assets/img/menu/garlic-butter-chicken.png',
  'assets/img/menu/pork-liempo.png',
  'assets/img/menu/pork-tonkatsu.png',
  'assets/img/menu/sisig.png',
  'assets/img/menu/wings-buffalo.png',
  'assets/img/menu/wings-chili.png',
  'assets/img/menu/wings-honey.png',
  'assets/img/menu/wings-parm.png',
  'assets/img/menu/wings-teri.png',
  'assets/qr/facebook.png',
  'assets/qr/instagram.png',
  'css/app.min.css',
  'index.html',
  'manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    try {
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') return cache.match('./index.html');
      throw err;
    }
  })());
});
