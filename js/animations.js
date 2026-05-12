/* ============================================================
   ANIMATIONS.JS — Animaciones que se repiten cada vez que
   el elemento entra al viewport (no solo la primera vez).
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ════════════════════════════════════════════════════════════
     UTILIDADES
  ════════════════════════════════════════════════════════════ */

  /**
   * Crea un IntersectionObserver que:
   *  - Agrega 'visible' cuando el elemento entra al viewport
   *  - Quita 'visible' cuando sale → permite repetir la animación
   */
  function makeObserver(threshold = 0.15, rootMargin = '0px 0px -60px 0px') {
    return new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold, rootMargin });
  }

  const obsDefault = makeObserver(0.12);
  const obsSlow    = makeObserver(0.08, '0px 0px -30px 0px');
  const obsStrict  = makeObserver(0.30);

  /** Agrega clase de animación + delay a hijos de un contenedor y los observa */
  function animateChildren(parent, selector, animClass, delayStep, observer, offset = 0) {
    const els = selector
      ? Array.from(parent.querySelectorAll(selector))
      : Array.from(parent.children);
    els.forEach((el, i) => {
      el.classList.add(animClass);
      el.style.transitionDelay = `${(i + offset) * delayStep}s`;
      observer.observe(el);
    });
  }

  /* ── Ripple en botones ──────────────────────────────────── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const r    = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.className = 'ripple';
      r.style.cssText = `
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top  - size / 2}px
      `;
      btn.appendChild(r);
      r.addEventListener('animationend', () => r.remove());
    });
  });

  /* ════════════════════════════════════════════════════════════
     ELEMENTOS CON CLASES ORIGINALES DEL HTML
     (fade-up / fade-left / fade-right definidas en base.css)
  ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
    obsDefault.observe(el);
  });

  /* ════════════════════════════════════════════════════════════
     SECTION HEADERS — divisores + label con glow
  ════════════════════════════════════════════════════════════ */

  document.querySelectorAll('.section-divider').forEach(el => {
    obsDefault.observe(el);
  });

  // Glow en el label: como es animación CSS (no transición),
  // hay que quitarla, forzar reflow y volver a añadirla cada vez.
  document.querySelectorAll('.section-label').forEach(label => {
    new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          label.classList.remove('glowing');
          void label.offsetWidth;            // fuerza reflow para reiniciar @keyframes
          label.classList.add('glowing');
        } else {
          label.classList.remove('glowing');
        }
      });
    }, { threshold: 0.8 }).observe(label);
  });

  /* ════════════════════════════════════════════════════════════
     HERO — parallax de orbes con el mouse
  ════════════════════════════════════════════════════════════ */
  const hero = document.getElementById('hero');
  if (hero) {
    const orbs     = hero.querySelectorAll('.hero-orb');
    const STRENGTH = [18, 12, 22];
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const cx   = (e.clientX - rect.left) / rect.width  - 0.5;
      const cy   = (e.clientY - rect.top)  / rect.height - 0.5;
      orbs.forEach((orb, i) => {
        const s = STRENGTH[i] || 15;
        orb.style.transform = `translate(${cx * s}px, ${cy * s}px)`;
      });
    });
    hero.addEventListener('mouseleave', () => {
      orbs.forEach(orb => { orb.style.transform = ''; });
    });
  }

  /* ════════════════════════════════════════════════════════════
     ABOUT
  ════════════════════════════════════════════════════════════ */
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const rolesGrid = aboutSection.querySelector('.about-roles-grid');
    if (rolesGrid) animateChildren(rolesGrid, null, 'anim-zoom', 0.10, obsDefault);

    aboutSection.querySelectorAll('.stat-item').forEach((el, i) => {
      el.classList.add('anim-pop');
      el.style.transitionDelay = `${i * 0.12}s`;
      obsStrict.observe(el);
    });

    aboutSection.querySelectorAll('.info-item').forEach((el, i) => {
      el.classList.add('anim-slide-left');
      el.style.transitionDelay = `${i * 0.09}s`;
      obsDefault.observe(el);
    });

    const hackBadge = aboutSection.querySelector('.hackathon-badge');
    if (hackBadge) {
      hackBadge.classList.add('anim-zoom');
      hackBadge.style.transitionDelay = '0.5s';
      obsDefault.observe(hackBadge);
    }
  }

  /* ════════════════════════════════════════════════════════════
     EXPERIENCE — línea que se dibuja + items alternos + dots
  ════════════════════════════════════════════════════════════ */
  const expSection = document.getElementById('experience');
  if (expSection) {
    const timeline = expSection.querySelector('.timeline');

    // Línea vertical: se dibuja al entrar, se resetea al salir
    if (timeline) {
      new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            timeline.classList.add('line-visible');
          } else {
            timeline.classList.remove('line-visible');
          }
        });
      }, { threshold: 0.05 }).observe(timeline);
    }

    expSection.querySelectorAll('.timeline-item').forEach((item, i) => {
      const card = item.querySelector('.timeline-card');
      const dot  = item.querySelector('.timeline-dot');

      if (card) {
        const isRight = item.classList.contains('right');
        card.classList.add(isRight ? 'anim-slide-right' : 'anim-slide-left');
        card.style.transitionDelay = `${i * 0.15 + 0.2}s`;
        obsSlow.observe(card);
      }

      if (dot) {
        // Dot: pop al entrar, reset al salir (para repetir)
        new IntersectionObserver(function (entries) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setTimeout(() => dot.classList.add('dot-visible'), i * 150 + 100);
            } else {
              dot.classList.remove('dot-visible');
            }
          });
        }, { threshold: 0.8 }).observe(dot);
      }
    });
  }

  /* ════════════════════════════════════════════════════════════
     SKILLS — categorías + tags pop
  ════════════════════════════════════════════════════════════ */
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const categories = skillsSection.querySelectorAll('.skill-category');

    categories.forEach((cat, i) => {
      cat.classList.add('anim-zoom');
      cat.style.transitionDelay = `${i * 0.10}s`;
      obsDefault.observe(cat);
    });

    categories.forEach(cat => {
      cat.querySelectorAll('.skill-tag').forEach((tag, i) => {
        tag.classList.add('anim-pop');
        tag.style.transitionDelay = `${i * 0.06 + 0.3}s`;
        obsDefault.observe(tag);
      });
    });

    skillsSection.querySelectorAll('.business-skill-item').forEach((el, i) => {
      el.classList.add('anim-rotate-in');
      el.style.transitionDelay = `${i * 0.08 + 0.2}s`;
      obsDefault.observe(el);
    });

    skillsSection.querySelectorAll('.language-item').forEach((el, i) => {
      el.classList.add('anim-slide-left');
      el.style.transitionDelay = `${i * 0.15}s`;
      obsDefault.observe(el);
    });
  }

  /* ════════════════════════════════════════════════════════════
     PROJECTS — filtros + tarjetas
  ════════════════════════════════════════════════════════════ */
  const projSection = document.getElementById('projects');
  if (projSection) {
    projSection.querySelectorAll('.filter-btn').forEach((btn, i) => {
      btn.classList.add('anim-fade-down');
      btn.style.transitionDelay = `${i * 0.07}s`;
      obsDefault.observe(btn);
    });

    projSection.querySelectorAll('.project-card').forEach((card, i) => {
      card.classList.add('anim-zoom');
      card.style.transitionDelay = `${i * 0.09}s`;
      obsDefault.observe(card);
    });
  }

  /* ════════════════════════════════════════════════════════════
     EDUCATION — tarjetas alternadas + hackathon flip
  ════════════════════════════════════════════════════════════ */
  const eduSection = document.getElementById('education');
  if (eduSection) {
    eduSection.querySelectorAll('.edu-card').forEach((card, i) => {
      card.classList.add(i % 2 === 0 ? 'anim-slide-left' : 'anim-slide-right');
      card.style.transitionDelay = `${i * 0.13}s`;
      obsDefault.observe(card);
    });

    eduSection.querySelectorAll('.hackathon-card').forEach((card, i) => {
      card.classList.add('anim-flip');
      card.style.transitionDelay = `${i * 0.15}s`;
      obsDefault.observe(card);
    });
  }

  /* ════════════════════════════════════════════════════════════
     SOFTWAVES — pillares + card especial + stats
  ════════════════════════════════════════════════════════════ */
  const swSection = document.getElementById('softwaves');
  if (swSection) {
    swSection.querySelectorAll('.sw-pillar').forEach((p, i) => {
      p.classList.add('anim-fade-up');
      p.style.transitionDelay = `${i * 0.12 + 0.2}s`;
      obsDefault.observe(p);
    });

    swSection.querySelectorAll('.sw-stat').forEach((s, i) => {
      s.classList.add('anim-pop');
      s.style.transitionDelay = `${i * 0.12 + 0.4}s`;
      obsDefault.observe(s);
    });

    swSection.querySelectorAll('.sw-chip').forEach((c, i) => {
      c.classList.add('anim-pop');
      c.style.transitionDelay = `${i * 0.10 + 0.6}s`;
      obsDefault.observe(c);
    });

    // Card con animación especial que se reinicia cada vez
    const swCard = swSection.querySelector('.sw-card');
    if (swCard) {
      swCard.style.opacity = '0';
      new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            swCard.classList.remove('card-animated');
            void swCard.offsetWidth;           // reinicia la animación CSS
            swCard.style.opacity = '0';
            setTimeout(() => swCard.classList.add('card-animated'), 200);
          } else {
            swCard.classList.remove('card-animated');
            swCard.style.opacity = '0';
          }
        });
      }, { threshold: 0.25 }).observe(swCard);
    }
  }

  /* ════════════════════════════════════════════════════════════
     CONTACT — métodos + formulario + campos
  ════════════════════════════════════════════════════════════ */
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.querySelectorAll('.contact-method').forEach((el, i) => {
      el.classList.add('anim-slide-left');
      el.style.transitionDelay = `${i * 0.12}s`;
      obsDefault.observe(el);
    });

    contactSection.querySelectorAll('.contact-social-link').forEach((el, i) => {
      el.classList.add('anim-pop');
      el.style.transitionDelay = `${i * 0.10 + 0.3}s`;
      obsDefault.observe(el);
    });

    const formWrap = contactSection.querySelector('.contact-form-wrap');
    if (formWrap) {
      formWrap.classList.add('anim-slide-right');
      obsDefault.observe(formWrap);
    }

    contactSection.querySelectorAll('.form-group').forEach((g, i) => {
      g.classList.add('anim-fade-up');
      g.style.transitionDelay = `${i * 0.08 + 0.3}s`;
      obsDefault.observe(g);
    });
  }

  /* ════════════════════════════════════════════════════════════
     FOOTER — columnas
  ════════════════════════════════════════════════════════════ */
  const footer = document.getElementById('footer');
  if (footer) {
    footer.querySelectorAll('.footer-brand, .footer-col').forEach((col, i) => {
      col.classList.add('anim-fade-up');
      col.style.transitionDelay = `${i * 0.12}s`;
      obsDefault.observe(col);
    });

    const footerBottom = footer.querySelector('.footer-bottom');
    if (footerBottom) {
      footerBottom.classList.add('anim-fade-up');
      footerBottom.style.transitionDelay = '0.4s';
      obsDefault.observe(footerBottom);
    }
  }

  /* ════════════════════════════════════════════════════════════
     CONTADORES — se reinician al entrar de nuevo al viewport
  ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('[data-count]').forEach(el => {
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';

    new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.remove('counter-done');
          animateCounter(el);
        } else {
          // Resetea el texto para que el contador arranque desde 0 la próxima vez
          el.textContent = prefix + '0' + suffix;
          el.classList.remove('counter-done');
        }
      });
    }, { threshold: 0.5 }).observe(el);
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
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = target * eased;
      el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.classList.add('counter-done');
      }
    }
    requestAnimationFrame(update);
  }

  /* ════════════════════════════════════════════════════════════
     TYPEWRITER DEL HERO (corre siempre, no depende de scroll)
  ════════════════════════════════════════════════════════════ */
  const typewriterEl = document.getElementById('typewriter-text');
  if (typewriterEl) {
    const texts = [
      'Ing. en Electrónica y Computación',
      'Desarrollador Full Stack',
      'Maestrante en Ing. de Software',
      'Emprendedor & Líder',
      'Lic. en Administración',
    ];
    let textIndex = 0, charIndex = 0, isDeleting = false;
    const TYPING_SPEED = 65, DELETING_SPEED = 35, PAUSE_AFTER = 2200;

    function type() {
      const current = texts[textIndex];
      if (!isDeleting) {
        typewriterEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(type, PAUSE_AFTER);
          return;
        }
        setTimeout(type, TYPING_SPEED);
      } else {
        typewriterEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          textIndex  = (textIndex + 1) % texts.length;
        }
        setTimeout(type, DELETING_SPEED);
      }
    }
    setTimeout(type, 1200);
  }

  /* ════════════════════════════════════════════════════════════
     PARTÍCULAS FLOTANTES — se lanzan cada vez que se entra
  ════════════════════════════════════════════════════════════ */
  function spawnParticle(section) {
    const p    = document.createElement('div');
    const size = Math.random() * 6 + 3;
    const left = Math.random() * 90 + 5;
    const dur  = Math.random() * 4 + 5;
    const del  = Math.random() * 2;
    const colors = [
      'rgba(1, 75, 160, 0.45)',
      'rgba(127, 0, 178, 0.45)',
      'rgba(255, 255, 0, 0.40)',
    ];
    p.className = 'section-particle';
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%; bottom:0;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay:${del}s;
      animation-duration:${dur}s;
    `;
    section.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }

  ['#about', '#skills', '#softwaves'].forEach(sel => {
    const section = document.querySelector(sel);
    if (!section) return;
    let intervalId = null;

    new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let count = 0;
          intervalId = setInterval(() => {
            spawnParticle(section);
            if (++count >= 10) clearInterval(intervalId);
          }, 280);
        } else {
          if (intervalId) { clearInterval(intervalId); intervalId = null; }
        }
      });
    }, { threshold: 0.2 }).observe(section);
  });

});
