/*
    pwa.js — undoing what it used to do.

    Installing the site to a home screen and running it offline is a full
    version feature now, so sw.js is gone from this build. Deleting the file
    is not enough: a service worker outlives the page that registered it.
    Anyone who visited before this release still has one installed, and it
    will keep serving them the site it cached — including the food data as it
    stood that day — with no way for them to know why the site never changes.

    So this unregisters any worker it finds and empties the caches it left.
    It runs once per visit and costs nothing when there is nothing to undo.

    This file can be deleted once enough time has passed that no returning
    visitor still carries a worker — a year is generous. Until then it is the
    only thing that frees them.
*/

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.getRegistrations()
            .then(function (registrations) {
                registrations.forEach(function (registration) {
                    registration.unregister();
                });
                // The registration going away does not take its caches with it.
                if (typeof caches !== "undefined" && caches.keys) {
                    return caches.keys().then(function (names) {
                        return Promise.all(names
                            .filter(function (name) { return name.indexOf("food-intolerance-guide") === 0; })
                            .map(function (name) { return caches.delete(name); }));
                    });
                }
            })
            .catch(function () { /* nothing to undo, or the browser will not say */ });
    });
}
