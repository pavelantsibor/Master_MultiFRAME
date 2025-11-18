// Service Worker для оффлайн работы приложения MultiFrame
const CACHE_NAME = 'multiframe-offline-v2';
const urlsToCache = [
  './',
  './index.html',
  './viewer.html',
  './app.js',
  './viewer.js',
  './styles.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './logo-multiframe.png',
  './calculation.png',
  './play.png',
  './sound.png',
  './presentation.png',
  './certification.png',
  './picture.png'
];

// Установка Service Worker и кэширование основных файлов
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching basic files');
        // Кэшируем только основные файлы, медиа будут кэшироваться по требованию
        return cache.addAll(urlsToCache.filter(url => {
          // Исключаем большие медиа файлы из начального кэша
          return !url.match(/\.(mp4|jpg|jpeg|png|pdf)$/i);
        }));
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('Service Worker: Cache failed:', error);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Сразу начинаем контролировать клиентов
  self.clients.claim();
});

// Обработка запросов - стратегия "Cache First" для оффлайн работы
self.addEventListener('fetch', event => {
  // Игнорируем запросы не-GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем из кэша, если есть
        if (response) {
          return response;
        }
        
        // Иначе загружаем из сети
        return fetch(event.request)
          .then(response => {
            // Проверяем что ответ валидный
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Клонируем ответ для кэша
            const responseToCache = response.clone();

            // Кэшируем все запросы (включая медиа)
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch(error => {
            console.log('Service Worker: Fetch failed:', error);
            // Если запрос не удался и это HTML, возвращаем индексную страницу
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }
            throw error;
          });
      })
  );
});

