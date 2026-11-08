/* Flixky — service worker
   Strategi: network-first untuk semua file asal yang sama, supaya setiap
   update langsung sampai ke pengguna; cache hanya jadi cadangan offline.
   Naikkan angka versi ini setiap kali ingin memaksa bersih cache lama. */
const VERSION = "flixky-v1";
const SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png",
  "./icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // Hanya tangani GET dari asal yang sama; Firebase & font dibiarkan langsung ke jaringan
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(() =>
        caches
          .match(event.request)
          .then((hit) => hit || caches.match("./index.html"))
      )
  );
});
