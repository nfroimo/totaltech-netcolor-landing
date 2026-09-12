/* ============================================================
   TotalTech · Netcolor — interacciones
   JavaScript puro, sin dependencias.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Año del footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header: se compacta al scrollear ---------- */
  var header = document.getElementById('siteHeader');
  var ticking = false;

  function onScroll() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 24);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function closeNav() {
    if (!navToggle || !navLinks) return;
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('is-open')) return;
      if (!e.target.closest('#navLinks') && !e.target.closest('#navToggle')) closeNav();
    });
  }

  /* ---------- Reveals al entrar en viewport ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // Escalonado suave entre hermanos del mismo bloque
        var siblings = Array.prototype.slice.call(entry.target.parentNode.children);
        var index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = Math.min(index, 5) * 80 + 'ms';
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Link activo según la sección visible ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var linkMap = {};
  document.querySelectorAll('#navLinks a[href^="#"]').forEach(function (a) {
    linkMap[a.getAttribute('href').slice(1)] = a;
  });

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(linkMap).forEach(function (k) { linkMap[k].classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { threshold: 0.001, rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Video del hero: sonido y ahorro de recursos ---------- */
  var video = document.getElementById('heroVideo');
  var soundToggle = document.getElementById('soundToggle');

  if (video) {
    // Algunos navegadores rechazan el autoplay: no es un error, se ignora.
    var playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === 'function') playAttempt.catch(function () {});

    if (reduceMotion) video.pause();

    if (soundToggle) {
      soundToggle.addEventListener('click', function () {
        video.muted = !video.muted;
        var on = !video.muted;
        soundToggle.setAttribute('aria-pressed', String(on));
        soundToggle.setAttribute('aria-label', on ? 'Silenciar el video' : 'Activar sonido del video');
        if (on && video.paused) video.play().catch(function () {});
      });
    }

    // Pausa cuando el spot no está a la vista; se reanuda al volver.
    if ('IntersectionObserver' in window && !reduceMotion) {
      var videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            video.play().catch(function () {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.2 });
      videoObserver.observe(video);
    }
  }

  /* ---------- FAB de WhatsApp: aparece pasado el hero ---------- */
  var fab = document.getElementById('waFab');
  var hero = document.getElementById('inicio');

  if (fab && hero && 'IntersectionObserver' in window) {
    var fabObserver = new IntersectionObserver(function (entries) {
      fab.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { threshold: 0, rootMargin: '-40% 0px 0px 0px' });
    fabObserver.observe(hero);
  } else if (fab) {
    fab.classList.add('is-visible');
  }

  /* ---------- Carrusel de testimonios (sólo móvil) ---------- */
  var quotes = document.getElementById('quotes');
  var dotsBox = document.getElementById('quoteDots');

  if (quotes && dotsBox) {
    var slides = quotes.querySelectorAll('.quote');

    /* scrollTo({behavior:'smooth'}) no hace nada sobre un contenedor con
       scroll-snap mandatory en Chromium, así que animamos scrollLeft a mano. */
    function glideTo(target, duration) {
      var start = quotes.scrollLeft;
      var delta = target - start;
      if (reduceMotion || Math.abs(delta) < 2) { quotes.scrollLeft = target; return; }

      var t0 = null;
      function step(now) {
        if (t0 === null) t0 = now;
        var p = Math.min((now - t0) / duration, 1);
        var eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        quotes.scrollLeft = start + delta * eased;
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    // Posición de scroll que deja la tarjeta centrada (igual que scroll-snap-align: center)
    function centerFor(slide) {
      var slideRect = slide.getBoundingClientRect();
      var boxRect = quotes.getBoundingClientRect();
      return quotes.scrollLeft + (slideRect.left - boxRect.left) - (boxRect.width - slideRect.width) / 2;
    }

    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Ver testimonio ' + (i + 1) + ' de ' + slides.length);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () { glideTo(centerFor(slide), 450); });
      dotsBox.appendChild(dot);
    });

    var dots = dotsBox.querySelectorAll('button');
    var dotTicking = false;

    quotes.addEventListener('scroll', function () {
      if (dotTicking) return;
      dotTicking = true;
      window.requestAnimationFrame(function () {
        var boxRect = quotes.getBoundingClientRect();
        var center = boxRect.left + boxRect.width / 2;
        var closest = 0;
        var min = Infinity;
        slides.forEach(function (slide, i) {
          var r = slide.getBoundingClientRect();
          var d = Math.abs(r.left + r.width / 2 - center);
          if (d < min) { min = d; closest = i; }
        });
        dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === closest); });
        dotTicking = false;
      });
    }, { passive: true });
  }
})();
