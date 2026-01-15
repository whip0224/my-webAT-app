// sw.js - Service Worker

// 1. 修改這裡的版本號 (例如 v1 -> v2) 來強制使用者更新
const CACHE_NAME = 'amazing-travel-v2';

// 2. 指定要快取的檔案
const ASSETS_TO_CACHE = [
  './',                // 根目錄
  './index.html',      // 主程式
  './manifest.json',   // PWA 設定檔
  // 如果你有放 icon 圖檔，也要加進來，例如：
  // './icon-192.png',
  // './icon-512.png'
];

// 安裝 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: 快取檔案中...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // 強制立即接管頁面
  self.skipWaiting();
});

// 啟動 Service Worker (清除舊快取)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          // 如果發現舊版本的快取 (例如 v1)，就刪除它
          if (key !== CACHE_NAME) {
            console.log('SW: 移除舊快取', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // 讓 PWA 立即控制所有打開的分頁
  return self.clients.claim();
});

// 攔截網路請求 (Network First, fallback to Cache)
// 策略：優先用網路讀取最新版，沒網路才用快取
self.addEventListener('fetch', (event) => {
  // 忽略非 GET 請求或外部連結 (例如 Google Maps / Firebase / API)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 網路請求成功，複製一份進快取，然後回傳
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // 網路失敗 (離線)，回傳快取內容
        return caches.match(event.request);
      })
  );
});