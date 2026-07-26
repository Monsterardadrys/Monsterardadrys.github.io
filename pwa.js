/*
    Registers the service worker (see sw.js) so the site is installable and
    works offline. Loaded on every public page; does nothing on browsers
    without service worker support.
*/

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        // updateViaCache: "none" makes the browser always revalidate sw.js,
        // so a new release is picked up on the next visit rather than a day later.
        navigator.serviceWorker
            .register("sw.js", { scope: "./", updateViaCache: "none" })
            .catch(function () { /* offline support is optional — never break the page */ });
    });
}
