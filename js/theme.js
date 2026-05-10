/* ============================================================
   THEME.JS — Manejo de modo claro / oscuro
   ============================================================ */

(function () {
  const THEME_KEY = 'portfolio-theme';
  const htmlEl = document.documentElement;

  // Detectar preferencia inicial
  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Aplicar tema al elemento <html>
  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateToggleBtn(theme);
  }

  // Actualizar ícono del botón
  function updateToggleBtn(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    btn.title = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  }

  // Alternar tema
  function toggleTheme() {
    const current = htmlEl.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Aplicar tema inmediatamente (evita flash)
  applyTheme(getInitialTheme());

  // Registrar evento cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
      updateToggleBtn(htmlEl.getAttribute('data-theme'));
    }

    // Escuchar cambios del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  });
})();
