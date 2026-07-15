document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navDrawer = document.getElementById("navDrawer");
  const navOverlay = document.getElementById("navOverlay");
  const navDrawerClose = document.getElementById("navDrawerClose");

  if (!header || !hamburgerBtn || !navDrawer) return;

  function openDrawer() {
    navDrawer.classList.add("open");
    if (navOverlay) navOverlay.classList.add("open");
    hamburgerBtn.classList.add("open");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    navDrawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    navDrawer.classList.remove("open");
    if (navOverlay) navOverlay.classList.remove("open");
    hamburgerBtn.classList.remove("open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    navDrawer.setAttribute("aria-hidden", "true");
  }

  hamburgerBtn.addEventListener("click", function () {
    if (navDrawer.classList.contains("open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (navDrawerClose) navDrawerClose.addEventListener("click", closeDrawer);
  if (navOverlay) navOverlay.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  navDrawer.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeDrawer);
  });

  // Header is fixed, so reserve the equivalent space at the top of the page.
  function syncHeaderHeight() {
    document.body.style.paddingTop = header.offsetHeight + "px";
  }
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight);

  // Hide the header on scroll-down, reveal it on scroll-up or near the top.
  let lastScrollY = window.scrollY;
  let ticking = false;
  const SCROLL_DELTA = 6;

  function onScroll() {
    const currentY = window.scrollY;

    if (!navDrawer.classList.contains("open")) {
      if (currentY <= 10) {
        header.classList.remove("header--hidden");
      } else if (currentY > lastScrollY + SCROLL_DELTA) {
        header.classList.add("header--hidden");
      } else if (currentY < lastScrollY - SCROLL_DELTA) {
        header.classList.remove("header--hidden");
      }
    }

    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
});
