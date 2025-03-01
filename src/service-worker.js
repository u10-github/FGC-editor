// キャッシュ名（バージョンアップ時に変更）
const CACHE_NAME = 'fgc-command-editor-v1';

// キャッシュするアセット
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// インストール時にアセットをキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('キャッシュを開きました');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        // skipWaitingで新しいサービスワーカーをすぐにアクティブにする
        return self.skipWaiting();
      })
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('古いキャッシュを削除:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // 新しいサービスワーカーが制御を開始
      return self.clients.claim();
    })
  );
});

// フェッチリクエストの処理
self.addEventListener('fetch', event => {
  // ナビゲーションリクエスト（HTMLページ）の場合はネットワークファーストで処理
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/index.html');
        })
    );
    return;
  }
  
  // 通常のリソースはキャッシュファーストで処理
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // キャッシュに存在する場合はそれを返す
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // ネットワークリクエスト
        return fetch(event.request).then(response => {
          // 有効なレスポンスでない場合はそのまま返す
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // レスポンスのクローンを作成（レスポンスは一度しか使えないため）
          const responseToCache = response.clone();
          
          // レスポンスをキャッシュに保存
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        });
      })
      .catch(error => {
        console.error('フェッチに失敗:', error);
        // フォントやアイコンのリクエストの場合、オフライン時に代替を提供
        if (event.request.url.includes('fonts.googleapis.com') || 
            event.request.url.includes('fonts.gstatic.com')) {
          // フォントの場合は何も返さない（ブラウザがフォールバックを適用）
          return new Response('', { status: 200, statusText: 'OK' });
        }
      })
  );
}); 