const CACHE_NAME = "pokecards-static-v2";
const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/img/pwa-192x192.png",
  "/img/pwa-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  
  // Estrategia para datos dinámicos (APIs, datos que cambian frecuentemente)
  if (url.pathname.startsWith('/api/') || url.pathname.includes('pokemon') || url.pathname.includes('card')) {
    // Network First para datos dinámicos
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Solo cachear respuestas exitosas
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone)).catch(() => {});
          }
          return response;
        })
        .catch(() => {
          // Fallback a caché si la red falla
          return caches.match(request);
        })
    );
  }
  // Estrategia para recursos estáticos (imágenes, etc.)
  else if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|woff|woff2)$/)) {
    // Cache First para recursos estáticos
    event.respondWith(
      caches.match(request)
        .then((cached) => {
          if (cached) {
            return cached;
          }
          return fetch(request)
            .then((response) => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone)).catch(() => {});
              }
              return response;
            });
        })
    );
  }
  // // Estrategia para páginas HTML
  // else {
  //   // Stale While Revalidate para páginas
  //   event.respondWith(
  //     caches.match(request)
  //       .then((cached) => {
  //         const networkFetch = fetch(request)
  //           .then((response) => {
  //             if (response.ok) {
  //               const responseClone = response.clone();
  //               caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone)).catch(() => {});
  //             }
  //             return response;
  //           })
  //           .catch(() => cached);
          
  //         return cached || networkFetch;
  //       })
  //   );
  // }
});


