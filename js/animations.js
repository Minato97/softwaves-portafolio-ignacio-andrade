/* ============================================================
   ANIMATIONS.JS — Animaciones de entrada con IntersectionObserver
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Fade-in / slide de elementos ─────────────────────────
  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
    fadeObserver.observe(el);
  });

  // ── Barras de habilidades ─────────────────────────────────
  const barObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.skill-bar-fill');
          if (fill) {
            const width = fill.getAttribute('data-width') || '0%';
            fill.style.setProperty('--fill-width', width);
            fill.classList.add('animated');
          }
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.skill-bar-item').forEach(el => {
    barObserver.observe(el);
  });

  // ── Contador animado de estadísticas ─────────────────────
  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    const target   = parseFloat(el.getAttribute('data-count'));
    const suffix   = el.getAttribute('data-suffix') || '';
    const prefix   = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const start    = performance.now();
    const isFloat  = target % 1 !== 0;

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = target * eased;

      el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // ── Typewriter del hero ───────────────────────────────────
  const typewriterEl = document.getElementById('typewriter-text');
  if (typewriterEl) {
    const texts = [
      'Ing. en Electrónica y Computación',
      'Desarrollador Full Stack',
      'Maestrante en Ing. de Software',
      'Emprendedor & Líder',
      'Lic. en Administración',
    ];

    let textIndex  = 0;
    let charIndex  = 0;
    let isDeleting = false;
    const TYPING_SPEED   = 65;
    const DELETING_SPEED = 35;
    const PAUSE_AFTER    = 2000;

    function type() {
      const current = texts[textIndex];

      if (!isDeleting) {
        // Escribir
        typewriterEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(type, PAUSE_AFTER);
          return;
        }
        setTimeout(type, TYPING_SPEED);
      } else {
        // Borrar
        typewriterEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          textIndex  = (textIndex + 1) % texts.length;
        }
        setTimeout(type, DELETING_SPEED);
      }
    }

    setTimeout(type, 1000);
  }

  // ── Stagger delay en grids ────────────────────────────────
  document.querySelectorAll('.projects-grid, .skills-layout, .about-roles-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
      child.classList.add('fade-up');
      fadeObserver.observe(child);
    });
  });

  document.querySelectorAll('.edu-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.12}s`;
      child.classList.add('fade-up');
      fadeObserver.observe(child);
    });
  });

});
