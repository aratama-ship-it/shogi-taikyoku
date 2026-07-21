const STORAGE_KEY = "tsume-shogi-preferences-v1";
const SUPPORTED_LANGUAGES = new Set(["ja", "en", "fr", "es"]);

function preferredLanguage() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (SUPPORTED_LANGUAGES.has(saved?.language)) return saved.language;
  } catch { /* Local storage can be unavailable. */ }
  const browserLanguage = navigator.language?.slice(0, 2);
  return SUPPORTED_LANGUAGES.has(browserLanguage) ? browserLanguage : "en";
}

function applyLegalLanguage(language) {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-legal-lang]").forEach((panel) => {
    panel.hidden = panel.dataset.legalLang !== language;
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
  const activePanel = document.querySelector(`[data-legal-lang="${language}"]`);
  if (activePanel?.dataset.title) document.title = `${activePanel.dataset.title} — Tsume Shogi`;
}

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.dataset.language;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, language }));
    } catch { /* Local storage can be unavailable. */ }
    applyLegalLanguage(language);
  });
});

applyLegalLanguage(preferredLanguage());
