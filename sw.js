// sw.js 必須包含 fetch 事件，瀏覽器才會判定為 PWA
self.addEventListener('fetch', function(event) {
    // 目前為空，僅通過 PWA 安裝檢測
    // 若需要離線瀏覽功能，需在此處加入 Cache 邏輯
});
