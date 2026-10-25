/**
 * AI Proto Lab — Landing interactions
 */

(function () {
  'use strict';

  // ───────────────────────────────────────────
  //  Proyectos visibles en la landing (solo estos se muestran en producción)
  //  Quita o comenta el id para ocultar; añádelo para publicar.
  // ───────────────────────────────────────────
  const PUBLIC_PROJECTS = [
    'money-flow',
    'panda-diplomacy',
    'bubbles',
    'salad-bar',
    'movie-palette',
    'design-system-generator',
    'crossfit-fuel',
    'learn-hangul',
    'piano-maestro',
    'pawmap',
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const posterHub = {
    reset: function () {},
    startCarouselIfPick: function () {},
  };

  // Ocultar tarjetas de proyectos no publicados
  document.querySelectorAll('.card[data-project]').forEach((card) => {
    const id = card.getAttribute('data-project');
    if (!PUBLIC_PROJECTS.includes(id)) {
      card.classList.add('card--hidden');
    }
  });

  // ───────────────────────────────────────────
  //  Card ratings: show localStorage immediately, then update from Supabase when it loads
  // ───────────────────────────────────────────
  function setRatingLabel(el, res) {
    if (!el || !res || res.count === 0) return;
    var label = res.count === 1 ? ' rating' : ' ratings';
    el.textContent = '★ ' + res.average.toFixed(1) + ' · ' + res.count + label;
  }
  document.querySelectorAll('.card-rating[data-project]').forEach(function (el) {
    var project = el.getAttribute('data-project');
    if (!project) return;
    if (typeof getRatingsSync === 'function') {
      var local = getRatingsSync(project);
      if (local.count > 0) setRatingLabel(el, local);
    }
    if (typeof getRatings === 'function') {
      getRatings(project).then(function (res) {
        setRatingLabel(el, res);
      }).catch(function () {});
    }
  });

  // ───────────────────────────────────────────
  //  Projects | Tools | Posters tabs
  // ───────────────────────────────────────────
  const panelProjects = document.getElementById('panel-projects');
  const panelTools = document.getElementById('panel-tools');
  const panelPosters = document.getElementById('panel-posters');
  const panelSops = document.getElementById('panel-sops');
  const tabProjectsBtn = document.querySelector('[data-landing-tab="projects"]');
  const tabToolsBtn = document.querySelector('[data-landing-tab="tools"]');
  const tabPostersBtn = document.querySelector('[data-landing-tab="posters"]');
  const tabSopsBtn = document.querySelector('[data-landing-tab="sops"]');

  const allPanels = [
    { id: 'projects', panel: panelProjects, btn: tabProjectsBtn },
    { id: 'tools',    panel: panelTools,    btn: tabToolsBtn },
    { id: 'posters',  panel: panelPosters,  btn: tabPostersBtn },
    { id: 'sops',     panel: panelSops,     btn: tabSopsBtn },
  ];

  function getActivePanel() {
    const active = allPanels.find((t) => t.panel && !t.panel.hidden);
    return active ? active.panel : panelProjects;
  }

  if (reducedMotion) {
    document.querySelectorAll('.card:not(.card--hidden), .poster-card, .poster-entry').forEach((c) => c.classList.add('is-visible'));
  }

  let cardObserver = null;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            cardObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
  }

  function initRevealForActivePanel() {
    if (reducedMotion) return;
    const panel = getActivePanel();
    if (!panel) return;
    const panelCards = panel.querySelectorAll('.card:not(.card--hidden), .poster-card, .poster-entry');
    if (!cardObserver) {
      panelCards.forEach((c) => c.classList.add('is-visible'));
      return;
    }
    panelCards.forEach((c) => {
      if (!c.classList.contains('is-visible')) {
        cardObserver.observe(c);
      }
    });
  }

  function activateLandingTab(which) {
    allPanels.forEach(({ id, panel, btn }) => {
      const isActive = id === which;
      if (panel) {
        panel.hidden = !isActive;
        panel.classList.toggle('is-active', isActive);
      }
      if (btn) {
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
        btn.tabIndex = isActive ? 0 : -1;
      }
    });
    if (which !== 'posters') posterHub.reset();
    else posterHub.startCarouselIfPick();
    initRevealForActivePanel();

    // Hide hero subtitle on the Posters tab
    document.body.classList.toggle('landing-tab-posters-active', which === 'posters');

    // Hide hero subtitle and footer copy on the SOPs tab
    document.body.classList.toggle('landing-tab-sops-active', which === 'sops');
  }

  const landingTabRow = document.querySelector('.landing-tabs-row');
  if (landingTabRow) {
    landingTabRow.addEventListener('click', (e) => {
      const t = e.target;
      const btn = t && t.closest ? t.closest('[data-landing-tab]') : null;
      if (!btn) return;
      const which = btn.getAttribute('data-landing-tab');
      if (allPanels.some((p) => p.id === which)) activateLandingTab(which);
    });
  }

  allPanels.forEach(({ id, btn }, i) => {
    if (!btn) return;
    btn.addEventListener('keydown', (e) => {
      let targetIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = (i + 1) % allPanels.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = (i - 1 + allPanels.length) % allPanels.length;
      }
      if (targetIndex !== -1) {
        const target = allPanels[targetIndex];
        activateLandingTab(target.id);
        if (target.btn) target.btn.focus();
      }
    });
  });

  // ───────────────────────────────────────────
  //  Posters: carousel cards → full-screen detail per series (#poster-detail-*)
  // ───────────────────────────────────────────
  (function initPosterHub() {
    const posterHubRoot = document.getElementById('poster-hub');
    const pickLayer = document.getElementById('poster-layer-pick');

    if (!posterHubRoot || !pickLayer) return;

    const SCREEN_LOCK_CLASS = 'poster-group-screen-open';
    const AUTO_MS = 5000;

    const detailPanels = Array.from(posterHubRoot.querySelectorAll('.poster-group-screen'));
    const carouselStopFns = [];

    /** @returns {HTMLElement|null} */
    function getVisibleDetailPanel() {
      return detailPanels.find(function (p) {
        return !p.hidden;
      }) || null;
    }

    function lockBodyScroll() {
      document.body.classList.add(SCREEN_LOCK_CLASS);
    }

    function unlockBodyScroll() {
      document.body.classList.remove(SCREEN_LOCK_CLASS);
    }

    function hideAllDetailPanels() {
      detailPanels.forEach(function (p) {
        p.hidden = true;
      });
    }

    function stopAllCarousels() {
      carouselStopFns.forEach(function (fn) {
        fn();
      });
    }

    function revealDetailCards(panel) {
      panel.querySelectorAll('.poster-card').forEach(function (c) {
        c.classList.add('is-visible');
      });
    }

    let lastCarouselFocused = null;

    function closeDetail() {
      if (!getVisibleDetailPanel()) return;
      hideAllDetailPanels();
      pickLayer.hidden = false;
      unlockBodyScroll();
      stopAllCarousels();
      carouselControllersStartPick();
      if (lastCarouselFocused) lastCarouselFocused.focus();
      else {
        var firstCarousel = pickLayer.querySelector('[data-poster-carousel]');
        if (firstCarousel) firstCarousel.focus();
      }
    }

    posterHub.reset = function () {
      hideAllDetailPanels();
      pickLayer.hidden = false;
      unlockBodyScroll();
      stopAllCarousels();
    };

    function carouselControllersStartPick() {
      pickLayer.querySelectorAll('[data-poster-carousel]').forEach(function (el, idx) {
        if (carouselControllers[idx] && carouselControllers[idx].start) carouselControllers[idx].start();
      });
    }

    const carouselControllers = [];

    posterHub.startCarouselIfPick = function () {
      if (getVisibleDetailPanel()) return;
      carouselControllersStartPick();
    };

    pickLayer.querySelectorAll('[data-poster-carousel]').forEach(function (carouselEl) {
      var track = carouselEl.querySelector('.poster-carousel-track');
      var slides = carouselEl.querySelectorAll('.poster-carousel-slide');
      var prevBtn = carouselEl.querySelector('.poster-carousel-btn--prev');
      var nextBtn = carouselEl.querySelector('.poster-carousel-btn--next');
      if (!track || slides.length === 0) return;

      var n = slides.length;
      var index = 0;
      var autoplayTimer = null;

      function stopAutoplay() {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      }

      function startAutoplay() {
        stopAutoplay();
        if (reducedMotion || n < 2 || getVisibleDetailPanel()) return;
        autoplayTimer = setInterval(function () {
          goTo(index + 1);
        }, AUTO_MS);
      }

      carouselStopFns.push(stopAutoplay);

      track.style.width = n * 100 + '%';
      slides.forEach(function (s) {
        s.style.width = 100 / n + '%';
      });

      function goTo(i) {
        index = ((i % n) + n) % n;
        track.style.transform = 'translateX(-' + index * (100 / n) + '%)';
      }

      carouselControllers.push({ start: startAutoplay });

      if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          goTo(index - 1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          goTo(index + 1);
        });
      }

      carouselEl.addEventListener('keydown', function (e) {
        if (n < 2) return;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goTo(index - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goTo(index + 1);
        }
      });

      var touchStartX = 0;
      carouselEl.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });

      carouselEl.addEventListener('touchend', function (e) {
        if (n < 2) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) < 40) return;
        if (dx > 0) goTo(index - 1);
        else goTo(index + 1);
      }, { passive: true });
    });

    posterHubRoot.addEventListener('click', function (e) {
      var back = e.target.closest('[data-poster-back]');
      if (back) {
        closeDetail();
        return;
      }
      if (e.target.closest('.poster-carousel-btn')) return;

      var opener = e.target.closest('[data-poster-open-detail]');
      if ((!opener || !posterHubRoot.contains(opener)) && pickLayer.contains(e.target)) {
        var card = e.target.closest('.poster-entry');
        if (card && pickLayer.contains(card)) opener = card.querySelector('[data-poster-open-detail]');
      }
      if (!opener || !posterHubRoot.contains(opener)) return;
      var targetId = opener.getAttribute('data-poster-detail-target');
      if (!targetId) return;
      var panel = document.getElementById(targetId);
      if (!panel || !detailPanels.includes(panel)) return;

      stopAllCarousels();
      var openedEntry = opener.closest('.poster-entry');
      lastCarouselFocused = openedEntry ? openedEntry.querySelector('[data-poster-carousel]') : null;

      hideAllDetailPanels();
      pickLayer.hidden = true;
      panel.hidden = false;
      panel.scrollTop = 0;
      lockBodyScroll();
      revealDetailCards(panel);
      var fb = panel.querySelector('[data-poster-back]');
      if (fb) fb.focus();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!panelPosters || panelPosters.hidden) return;
      if (!getVisibleDetailPanel()) return;
      closeDetail();
    });
  })();

  initRevealForActivePanel();

  // ───────────────────────────────────────────
  //  3D tilt on card hover
  //  (card ↔ building highlight and the auto-tease live in seoul-scene.js, via .card--tease)
  // ───────────────────────────────────────────
  document.querySelectorAll('.card:not(.card--hidden)').forEach((card) => {
    if (card.classList.contains('card--soon')) return;
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateY(${x * 8}deg) rotateX(${y * -8}deg)`;
    });
  });

})();
