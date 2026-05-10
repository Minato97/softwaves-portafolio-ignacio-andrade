/* ============================================================
   NAVBAR.JS — Comportamiento de la barra de navegación
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const navLinks    = document.querySelectorAll('.navbar-links a, .mobile-menu a[data-section]');
  const sections    = document.querySelectorAll('section[id]');

  // ── Scroll: encoger navbar ────────────────────────────────
  function onScroll() {
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);

    // Back to top
    const backBtn = document.getElementById('back-to-top');
    if (backBtn) backBtn.classList.toggle('visible', window.scrollY > 400);

    // Resaltar enlace activo
    highlightActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Ejecutar al cargar

  // ── Resaltar sección activa ───────────────────────────────
  function highlightActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top    = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current ||
          link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  // ── Hamburger / menú móvil ────────────────────────────────
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cerrar al hacer click en un enlace
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Cerrar al presionar Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Scroll suave para anclas ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Back to top ───────────────────────────────────────────
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
