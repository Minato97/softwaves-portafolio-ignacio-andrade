/* ============================================================
   PROJECTS.JS — Filtro de proyectos y formulario de contacto
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Filtro de proyectos ───────────────────────────────────
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Actualizar botón activo
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      projectCards.forEach((card, index) => {
        const categories = card.getAttribute('data-category') || '';
        const matches    = filter === 'all' || categories.includes(filter);

        if (matches) {
          card.classList.remove('hidden');
          // Stagger de aparición
          card.style.animationDelay = `${index * 0.05}s`;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ── Formulario de contacto ────────────────────────────────
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('.form-submit-btn');
      const originalText = btn.innerHTML;

      // Estado de cargando
      btn.innerHTML = '<span>Enviando...</span>';
      btn.disabled  = true;

      // Simular envío (aquí conectar con un backend o Formspree)
      setTimeout(function () {
        showFormSuccess();
        btn.innerHTML = originalText;
        btn.disabled  = false;
        form.reset();
      }, 1500);
    });
  }

  function showFormSuccess() {
    const wrap    = document.querySelector('.contact-form-wrap');
    const success = document.createElement('div');
    success.className = 'form-success-msg';
    success.innerHTML = `
      <div class="success-icon">✓</div>
      <h3>¡Mensaje enviado!</h3>
      <p>Gracias por escribirme. Te responderé a la brevedad.</p>
    `;

    // Estilos en línea para el mensaje de éxito
    success.style.cssText = `
      text-align: center;
      padding: 2rem;
      animation: fade-in-up 0.5s ease forwards;
    `;

    const formEl = wrap.querySelector('.contact-form');
    formEl.style.display = 'none';
    wrap.appendChild(success);

    // Volver al formulario después de 4 segundos
    setTimeout(function () {
      wrap.removeChild(success);
      formEl.style.display = '';
    }, 4000);
  }

});
