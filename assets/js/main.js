(function () {
  "use strict";

  /* ===== Navbar background on scroll ===== */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ===== Mobile menu ===== */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const closeMenu = () => {
    links.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

  /* ===== Reveal on scroll ===== */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const siblings = [...(el.parentElement?.children || [])].filter((c) =>
              c.classList.contains("reveal")
            );
            const idx = siblings.indexOf(el);
            el.style.transitionDelay = (idx > 0 ? Math.min(idx, 5) * 0.08 : 0) + "s";
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ===== Footer year ===== */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ===== Contact form (AJAX submit) ===== */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", async (e) => {
      const action = form.getAttribute("action") || "";
      // If Formspree endpoint not configured yet, fall back to default POST behaviour.
      if (action.includes("your-form-id") || !action) {
        e.preventDefault();
        status.textContent =
          "Forma još nije povezana s mailom. Do tada nam se javi na 099 661 4375 ili Instagram.";
        status.className = "form-status is-err";
        return;
      }
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Šaljem…";
      status.textContent = "";
      status.className = "form-status";

      try {
        const res = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          form.reset();
          status.textContent = "Hvala! Prijava je poslana — javljamo se uskoro. 💪";
          status.className = "form-status is-ok";
        } else {
          throw new Error("Bad response");
        }
      } catch (err) {
        status.textContent =
          "Greška pri slanju. Nazovi nas na 099 661 4375 ili pošalji poruku na Instagram.";
        status.className = "form-status is-err";
      } finally {
        btn.disabled = false;
        btn.textContent = original;
      }
    });
  }
})();
