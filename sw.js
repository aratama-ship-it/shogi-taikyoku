"use strict";

const CACHE_NAME = "tsume-shogi-v31";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./legal.css",
  "./legal.mjs",
  "./privacy.html",
  "./support.html",
  "./app.mjs",
  "./ad-config.mjs",
  "./ad-policy.mjs",
  "./ad-manager.mjs",
  "./answer-line.mjs",
  "./answer-review.mjs",
  "./game-core.mjs",
  "./puzzles.mjs",
  "./puzzle-i18n.mjs",
  "./random-puzzle.mjs",
  "./manifest.webmanifest",
  "./og.png",
  "./assets/washi-paper-v1.jpg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const refreshOnVisit = event.request.mode === "navigate"
    || ["script", "style"].includes(event.request.destination)
    || /\.(?:html|mjs|css|webmanifest)$/.test(url.pathname);

  if (refreshOnVisit) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type !== "opaque") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html"))),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response && response.status === 200 && response.type !== "opaque") {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    })),
  );
});
