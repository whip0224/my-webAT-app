// sw.js
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
});

// 這是最關鍵的一段，必須有 fetch 事件
self.addEventListener('fetch', (event) => {
    // 這裡可以暫時不寫邏輯，但事件必須存在
});
