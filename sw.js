// sw.js - AmazingTravel PWA Service Worker

const CACHE_NAME = 'amazing-travel-v3.1'; 
//fix ios google map 返回主程式問題

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './airports.js' // 確保這個檔案存在於根目錄
];

// 安裝階段
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: 正在預先快取核心檔案');
      // 使用 map 逐個加入，避免其中一個檔案遺失導致全部失敗
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return cache.add(url).catch(err => console.warn(`SW: 無法快取檔案 ${url}:`, err));
        })
      );
    })
  );
  self.skipWaiting();
});

// 啟動與清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW: 清除過期快取版本', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 請求攔截
self.addEventListener('fetch', (event) => {
  // 僅攔截同源的 GET 請求
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 請求成功：更新快取並回傳
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // 請求失敗 (離線)：嘗試從快取讀取
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          
          // 如果連快取都沒有 (例如第一次打開就沒網路)
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});