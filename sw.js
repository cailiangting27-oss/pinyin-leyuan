// 离线缓存：改了文件就把版本号加 1
const V = 'pinyin-leyuan-1';
const FILES = ['./', 'index.html', 'styles.css', 'app.js', 'data.js', 'vendor/pinyin-pro.js', 'manifest.webmanifest', 'icons/icon-180.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))); self.clients.claim(); });
// 先走网络，断网才用缓存，保证更新马上生效
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
