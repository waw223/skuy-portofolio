const DEFAULT_WA_NUMBER = "6281234567890";
const DEFAULT_WA_TEXT =
  "Halo Skuy! Saya mau pesan jasa edit. Ini brief singkat saya:%0A%0A- Jenis edit (foto/video): %0A- Referensi: %0A- Deadline: %0A- Budget (opsional): ";

function getStorageTheme() {
  try {
    return localStorage.getItem("skuy_theme");
  } catch {
    return null;
  }
}

function setStorageTheme(value) {
  try {
    localStorage.setItem("skuy_theme", value);
  } catch {
    // ignore
  }
}

function applyTheme(theme) {
  if (!theme) return;
  document.documentElement.setAttribute("data-theme", theme);
}

function initThemeToggle() {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;

  const stored = getStorageTheme();
  if (stored) applyTheme(stored);

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    setStorageTheme(next);
  });
}

function buildWaLink(number, text) {
  const cleanNumber = (number || "").replace(/[^\d]/g, "");
  const base = "https://wa.me/";
  const params = new URLSearchParams();
  params.set("text", text || "");
  return `${base}${cleanNumber}?${params.toString()}`;
}

function initWhatsAppLinks() {
  const number =
    document.querySelector("meta[name='skuy-wa-number']")?.content ||
    DEFAULT_WA_NUMBER;
  const text =
    document.querySelector("meta[name='skuy-wa-text']")?.content ||
    decodeURIComponent(DEFAULT_WA_TEXT);

  const links = document.querySelectorAll("[data-wa-link]");
  for (const a of links) {
    a.href = buildWaLink(number, text);
    a.target = "_blank";
  }
}

function initYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initBeforeAfter() {
  const root = document.querySelector("[data-before-after]");
  const slider = document.querySelector("[data-before-after-slider]");
  const handle = document.querySelector("[data-before-after-handle]");
  if (!root || !slider) return;

  const after = root.querySelector(".before-after__media--after");
  if (!after) return;

  if (!slider.value) slider.value = "50";

  const update = () => {
    const value = Number(slider.value || 50);
    after.style.clipPath = `inset(0 0 0 ${value}%)`;
    if (handle) handle.style.left = `${value}%`;
  };

  slider.addEventListener("input", update);
  update();
}

function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  const close = () => {
    toggle.classList.remove("is-open");
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Buka menu");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function initScrollProgress() {
  const bar = document.querySelector("[data-scroll-progress]");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initActiveNav() {
  const links = document.querySelectorAll(".nav a");
  const sections = [...links]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = () => {
    const scrollY = window.scrollY + 120;
    let current = sections[0];

    for (const section of sections) {
      if (section.offsetTop <= scrollY) current = section;
    }

    links.forEach((link) => {
      const match = link.getAttribute("href") === `#${current.id}`;
      link.classList.toggle("is-active", match);
    });
  };

  window.addEventListener("scroll", setActive, { passive: true });
  setActive();
}

function initReelVideos() {
  const cards = document.querySelectorAll(".reel-card__media");
  if (!cards.length) return;

  cards.forEach((media) => {
    const video = media.querySelector(".reel-card__video");
    const btn = media.querySelector(".reel-card__btn");
    if (!video || !btn) return;

    const play = async () => {
      try {
        await video.play();
        media.classList.add("is-playing");
        btn.textContent = "❚❚";
        btn.setAttribute("aria-label", "Jeda video");
      } catch {
        // autoplay blocked or file missing
      }
    };

    const pause = () => {
      video.pause();
      media.classList.remove("is-playing");
      btn.textContent = "▶";
      btn.setAttribute("aria-label", "Putar video");
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (video.paused) play();
      else pause();
    });

    media.addEventListener("click", () => {
      if (video.paused) play();
      else pause();
    });

    // preview on hover for pointer devices
    media.addEventListener('mouseenter', () => {
      if (window.matchMedia('(hover: hover)').matches) play();
    });
    media.addEventListener('mouseleave', () => {
      if (window.matchMedia('(hover: hover)').matches) pause();
    });

    video.addEventListener("ended", pause);
  });
}

function initReelEmbeds() {
  const buttons = document.querySelectorAll('.reel-card__embed');
  const modal = document.getElementById('embed-modal');
  if (!buttons.length || !modal) return;
  const iframe = modal.querySelector('iframe');
  const closeEls = modal.querySelectorAll('[data-embed-close]');

  const open = (url) => {
    iframe.src = url;
    modal.setAttribute('aria-hidden', 'false');
  };

  const close = () => {
    modal.setAttribute('aria-hidden', 'true');
    iframe.src = '';
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-embed-url');
      if (!url) return;
      open(url);
    });
  });

  closeEls.forEach((el) => el.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close();
  });
}

function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".card, .work, .pricing, .quote, .faq details, .section__head, .cta, .reels-block"
  );

  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

initThemeToggle();
initWhatsAppLinks();
initYear();
initBeforeAfter();
initMobileNav();
initScrollProgress();
initActiveNav();
initReelEmbeds();
initReelVideos();
initScrollReveal();
