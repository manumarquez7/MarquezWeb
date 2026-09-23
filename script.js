(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu
  var btn = document.getElementById("mobile-menu-btn");
  var menu = document.getElementById("mobile-menu");
  var icon = document.getElementById("menu-icon");
  var open = false;

  function setMenu(state) {
    open = state;
    if (!btn || !menu) return;
    if (open) {
      menu.classList.remove("hidden");
      requestAnimationFrame(function () {
        menu.classList.remove("opacity-0");
      });
      if (icon) icon.textContent = "close";
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Cerrar menú");
      menu.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    } else {
      menu.classList.add("opacity-0");
      if (icon) icon.textContent = "menu";
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Abrir menú");
      menu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      setTimeout(function () {
        if (!open) menu.classList.add("hidden");
      }, 300);
    }
  }

  if (btn) btn.addEventListener("click", function () { setMenu(!open); });
  document.querySelectorAll(".mobile-link").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  // Navbar scroll
  var nav = document.getElementById("navbar");
  function onScroll() {
    var y = window.scrollY || 0;
    if (nav) {
      if (y > 20) {
        nav.classList.add("shadow-md", "bg-background/95");
        nav.classList.remove("bg-background/90");
      } else {
        nav.classList.remove("shadow-md", "bg-background/95");
        nav.classList.add("bg-background/90");
      }
    }
    var sticky = document.getElementById("sticky-cta");
    if (sticky) {
      if (y > 400) {
        sticky.classList.remove("opacity-0", "pointer-events-none", "translate-y-2");
      } else {
        sticky.classList.add("opacity-0", "pointer-events-none", "translate-y-2");
      }
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // FAQ
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var was = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(function (i) {
        i.classList.remove("open");
        var answer = i.querySelector(".faq-a");
        if (answer) answer.style.maxHeight = "";
        var q = i.querySelector(".faq-q");
        if (q) q.setAttribute("aria-expanded", "false");
      });
      if (!was) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        var answer = item.querySelector(".faq-a");
        if (answer) answer.style.maxHeight = (answer.scrollHeight + 24) + "px";
      }
    });
  });

  window.addEventListener("resize", function () {
    document.querySelectorAll(".faq-item.open .faq-a").forEach(function (answer) {
      answer.style.maxHeight = (answer.scrollHeight + 24) + "px";
    });
  });

  // Small, bounded depth on the hero artwork; no scroll or touch tracking.
  var showcase = document.querySelector(".hero-showcase");
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (showcase) {
    var frame = 0;
    function resetShowcase() {
      cancelAnimationFrame(frame);
      showcase.style.removeProperty("--showcase-x");
      showcase.style.removeProperty("--showcase-y");
      showcase.style.removeProperty("--showcase-shift");
    }
    showcase.addEventListener("pointermove", function (event) {
      if (motion.matches || !finePointer.matches) return;
      var bounds = showcase.getBoundingClientRect();
      var x = (event.clientX - bounds.left) / bounds.width - .5;
      var y = (event.clientY - bounds.top) / bounds.height - .5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        showcase.style.setProperty("--showcase-x", (-y * 3) + "deg");
        showcase.style.setProperty("--showcase-y", (x * 3) + "deg");
        showcase.style.setProperty("--showcase-shift", (y * -5) + "px");
      });
    });
    showcase.addEventListener("pointerleave", resetShowcase);
    motion.addEventListener("change", resetShowcase);
    finePointer.addEventListener("change", resetShowcase);
  }

  // Reveal: observe the start of large sections, including nested cards.
  var nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  if (!("IntersectionObserver" in window)) {
    nodes.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -24px 0px" }
  );
  nodes.forEach(function (el) { io.observe(el); });
  document.documentElement.classList.add("motion-ready");
})();
