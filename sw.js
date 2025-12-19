const CACHE_NAME = 'amazing-travel-v1';
const urlsToCache = [
  './',
  './index.html',
  // 如果你有其他本地圖片或 CSS 檔案也要列在這裡
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
