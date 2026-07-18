"use strict";

const CACHE_NAME = "tsume-shogi-v24";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./legal.css",
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
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === "opaque") return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match("./index.html"));
    }),
  );
});
