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
  if (!root || !slider) return;

  const after = root.querySelector(".before-after__media--after");
  if (!after) return;

  const update = () => {
    const value = Number(slider.value || 55);
    after.style.clipPath = `inset(0 0 0 ${value}%)`;
  };

  slider.addEventListener("input", update);
  update();
}

initThemeToggle();
initWhatsAppLinks();
initYear();
initBeforeAfter();

