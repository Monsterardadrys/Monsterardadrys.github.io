/*
    Service worker — makes the whole site work offline.

    Everything is precached on install. VERSION is part of the cache name, so
    bumping it on a release throws the old cache away and refetches the lot.
    That is the only step needed when deploying: bump VERSION.
*/

const VERSION = "v1.02";
const CACHE = "food-intolerance-guide-" + VERSION;

const ASSETS = [
    "./",
    "index.html",
    "app.html",
    "articles.html",
    "without.html",
    "meal.html",
    "about.html",
    "contact.html",
    "sources.html",
    "method.html",
    "styles.css",
    "foods-data.js",
    "nutrition-data.js",
    "articles-data.js",
    "script.js",
    "articles.js",
    "trait-foods.js",
    "without.js",
    "disclaimer.js",
    "meal.js",
    "save-load.js",
    "landing.js",
    "nav.js",
    "pwa.js",
    "manifest.webmanifest",
    "favicon.ico",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "icons/icon-maskable-512.png",
    "icons/apple-touch-icon.png",
    "fonts/lora-upright-latin.woff2",
    "fonts/lora-upright-latin-ext.woff2",
    "fonts/lora-italic-latin.woff2",
    "fonts/lora-italic-latin-ext.woff2",
    "fonts/source-sans-pro-400-latin.woff2",
    "fonts/source-sans-pro-400-latin-ext.woff2",
    "fonts/source-sans-pro-600-latin.woff2",
    "fonts/source-sans-pro-600-latin-ext.woff2"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE)
            .then(function (cache) { return cache.addAll(ASSETS); })
            .then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys()
            .then(function (names) {
                return Promise.all(names.map(function (name) {
                    return name === CACHE ? null : caches.delete(name);
                }));
            })
            .then(function () { return self.clients.claim(); })
    );
});

/*
    Stale-while-revalidate: answer from the cache straight away, then quietly
    refresh it in the background. Pages load instantly and offline, and a
    deploy that didn't bump VERSION still reaches the user on the next visit.
*/
self.addEventListener("fetch", function (event) {
    const request = event.request;

    if (request.method !== "GET") return;
    if (new URL(request.url).origin !== self.location.origin) return;

    event.respondWith(
        caches.open(CACHE).then(function (cache) {
            return cache.match(request).then(function (cached) {
                const network = fetch(request).then(function (response) {
                    if (response && response.ok) cache.put(request, response.clone());
                    return response;
                }).catch(function () {
                    // Offline. Fall back to whatever we have; for a page the
                    // user hasn't visited before, that's the landing page.
                    return cached || (request.mode === "navigate"
                        ? cache.match("index.html")
                        : undefined);
                });

                return cached || network;
            });
        })
    );
});
