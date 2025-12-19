// 1. 每次更新 index.html 後，請手動修改這裡的版本號 (例如 v1.0.2 -> v1.0.3)
const CACHE_NAME = 'amazing-travel-v1.0.2';

// 2. 列出需要離線快取的檔案
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://cdn.tailwindcss.com' // 快取外部的 CSS 框架
];

// 安裝階段：將檔案寫入手機快取
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: 檔案已快取');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // 強制跳過等待，立刻更新
});

// 激活階段：清理掉舊版本的快取（節省空間並避免讀到舊資料）
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SW: 清理舊快取', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 攔截請求：如果沒網路，就從快取拿檔案
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 若快取有資料就回傳，否則發送網路請求
      return response || fetch(event.request);
    })
  );
});
