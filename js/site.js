(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  const header = document.querySelector(".top");
  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasViewTransition = "startViewTransition" in document;
  if (hasViewTransition) document.documentElement.classList.add("has-vt");

  const navKind = sessionStorage.getItem("page-nav");
  if (navKind) {
    document.documentElement.dataset.nav = navKind;
    sessionStorage.removeItem("page-nav");
  }

  document.addEventListener("click", (event) => {
    if (reduceMotion || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    let url;
    try {
      url = new URL(link.href, location.href);
    } catch {
      return;
    }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;

    const kind = link.closest(".lang-switch") ? "lang" : "page";
    sessionStorage.setItem("page-nav", kind);
    document.documentElement.dataset.nav = kind;
    if (hasViewTransition) return;

    event.preventDefault();
    document.documentElement.classList.add("is-leaving");
    window.setTimeout(() => {
      location.href = url.href;
    }, kind === "lang" ? 200 : 160);
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) document.documentElement.classList.remove("is-leaving");
  });
  const revealEls = document.querySelectorAll(
    ".moment, .signs, .split, .svc, .clinic, .reason, .faq details, .cta, .service-block"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }
})();
