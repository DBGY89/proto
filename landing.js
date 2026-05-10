/**
 * AI Proto Lab — Landing interactions + Snake game
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
  const tabProjectsBtn = document.querySelector('[data-landing-tab="projects"]');
  const tabToolsBtn = document.querySelector('[data-landing-tab="tools"]');
  const tabPostersBtn = document.querySelector('[data-landing-tab="posters"]');

  const allPanels = [
    { id: 'projects', panel: panelProjects, btn: tabProjectsBtn },
    { id: 'tools',    panel: panelTools,    btn: tabToolsBtn },
    { id: 'posters',  panel: panelPosters,  btn: tabPostersBtn },
  ];

  function getActivePanel() {
    const active = allPanels.find((t) => t.panel && !t.panel.hidden);
    return active ? active.panel : panelProjects;
  }

  function getTeaseCards() {
    const panel = getActivePanel();
    if (!panel) return [];
    return Array.from(panel.querySelectorAll('.card:not(.card--hidden)'));
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

  let teaseIndex = 0;
  let userTeaseCard = null;

  function setOnlyTease(card) {
    document.querySelectorAll('.card.card--tease').forEach((c) => c.classList.remove('card--tease'));
    if (card) card.classList.add('card--tease');
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
    document.querySelectorAll('.card.card--tease').forEach((c) => c.classList.remove('card--tease'));
    teaseIndex = 0;
    if (which !== 'posters') posterHub.reset();
    else posterHub.startCarouselIfPick();
    initRevealForActivePanel();

    // Hide snake entirely on the Posters tab
    const onPosters = which === 'posters';
    document.body.classList.toggle('landing-tab-posters-active', onPosters);
    const snakeCanvas = document.getElementById('snake-canvas');
    const snakeHud    = document.getElementById('snake-hud');
    const snakeRevive = document.getElementById('snake-revive');
    if (snakeCanvas) snakeCanvas.style.display = onPosters ? 'none' : '';
    if (snakeHud && onPosters)    snakeHud.hidden    = true;
    if (snakeRevive && onPosters) snakeRevive.hidden = true;
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
  //  Tease: una sola tarjeta iluminada a la vez; aleatorio si nadie toca; al hover/focus esa es la prioridad
  //  (solo tarjetas de la pestaña activa; initRevealForActivePanel al cambiar de tab)
  // ───────────────────────────────────────────
  const TEASE_INTERVAL_MS = 3000;
  const TEASE_FIRST_MS = 2000;

  function teaseNextCard() {
    if (userTeaseCard) return;
    const visible = getTeaseCards();
    if (visible.length === 0) return;
    setOnlyTease(visible[teaseIndex]);
    teaseIndex = (teaseIndex + 1) % visible.length;
  }

  function clearUserTease() {
    userTeaseCard = null;
    teaseNextCard();
  }

  let teaseTimer;
  if (!reducedMotion && getTeaseCards().length > 0) {
    setTimeout(() => {
      teaseNextCard();
      teaseTimer = setInterval(teaseNextCard, TEASE_INTERVAL_MS);
    }, TEASE_FIRST_MS);
  }

  // ───────────────────────────────────────────
  //  3D tilt on card hover; iluminar solo la tarjeta señalada
  // ───────────────────────────────────────────
  document.querySelectorAll('.card:not(.card--hidden)').forEach((card) => {
    if (card.classList.contains('card--soon')) return;
    card.addEventListener('mouseenter', () => {
      userTeaseCard = card;
      setOnlyTease(card);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      clearUserTease();
    });
    card.addEventListener('focusin', () => {
      userTeaseCard = card;
      setOnlyTease(card);
    });
    card.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!card.contains(document.activeElement)) clearUserTease();
      }, 0);
    });
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateY(${x * 8}deg) rotateX(${y * -8}deg)`;
    });
  });

  // ───────────────────────────────────────────
  //  Snake — lives directly on the page
  //  No asking, no overlay. Play or lose.
  // ───────────────────────────────────────────
  const canvas    = document.getElementById('snake-canvas');
  const ctx       = canvas.getContext('2d');
  const hud       = document.getElementById('snake-hud');
  const scoreEl   = document.getElementById('snake-score');
  const reviveBtn = document.getElementById('snake-revive');

  // roundRect polyfill
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (typeof r === 'number') r = [r, r, r, r];
      const [tl] = r;
      this.moveTo(x + tl, y);
      this.lineTo(x + w - tl, y);
      this.quadraticCurveTo(x + w, y, x + w, y + tl);
      this.lineTo(x + w, y + h - tl);
      this.quadraticCurveTo(x + w, y + h, x + w - tl, y + h);
      this.lineTo(x + tl, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - tl);
      this.lineTo(x, y + tl);
      this.quadraticCurveTo(x, y, x + tl, y);
      this.closePath();
      return this;
    };
  }

  const CELL = 22;
  let COLS, ROWS, snake, dir, nextDir, food, score, gameLoop, running;

  function sizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    COLS = Math.floor(window.innerWidth  / CELL);
    ROWS = Math.floor(window.innerHeight / CELL);
  }

  function initSnake() {
    sizeCanvas();
    const cx = Math.floor(COLS / 2);
    const cy = Math.floor(ROWS / 2);
    snake = [
      { x: cx,     y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy },
    ];
    dir     = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score   = 0;
    scoreEl.textContent = '0';
    running = false;
    placeFood();
  }

  function placeFood() {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
    food = pos;
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Food — pulsing neon orb
    const t = Date.now() / 200;
    const pulse = 0.85 + Math.sin(t) * 0.2;
    const glow = 12 + Math.sin(t * 1.3) * 10;
    const cx = food.x * CELL + CELL / 2;
    const cy = food.y * CELL + CELL / 2;
    const r = (CELL / 2.6) * pulse;

    ctx.shadowColor = '#ff2d78';
    ctx.shadowBlur = glow;
    ctx.fillStyle = '#ff2d78';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = '#ff6eaa';
    ctx.shadowBlur = glow * 0.6;
    ctx.fillStyle = 'rgba(255, 110, 170, 0.6)';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Snake body
    snake.forEach((seg, i) => {
      const t = 1 - i / snake.length;
      const g = Math.round(240 * t);
      const b = Math.round(255 * t);
      ctx.fillStyle = 'rgba(0,' + g + ',' + b + ',.92)';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur  = i === 0 ? 12 : 5;

      const pad = 1;
      ctx.beginPath();
      ctx.roundRect(
        seg.x * CELL + pad,
        seg.y * CELL + pad,
        CELL - pad * 2,
        CELL - pad * 2,
        4
      );
      ctx.fill();
    });

    ctx.shadowBlur = 0;
  }

  function step() {
    dir = { ...nextDir };
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) return die();
    if (snake.some((s) => s.x === head.x && s.y === head.y)) return die();

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = score;
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function launch() {
    initSnake();
    hud.hidden = false;
    reviveBtn.hidden = true;
    running = true;
    draw();
    // Mobile: serpiente a la mitad de velocidad (220 ms por paso en vez de 110)
    var stepMs = window.matchMedia('(max-width: 640px)').matches ? 220 : 110;
    gameLoop = setInterval(step, stepMs);
  }

  function die() {
    running = false;
    clearInterval(gameLoop);

    // Peak-End: brief death flash so the moment has emotional closure
    const head = snake[0];
    ctx.fillStyle = '#ff2d78';
    ctx.shadowColor = '#ff2d78';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(head.x * CELL + CELL / 2, head.y * CELL + CELL / 2, CELL * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    let fade = 1;
    const fadeOut = setInterval(() => {
      fade -= 0.08;
      if (fade <= 0) {
        clearInterval(fadeOut);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        hud.hidden = true;
        reviveBtn.hidden = false;
        return;
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalAlpha = fade;
      draw();
      ctx.globalAlpha = 1;
    }, 40);
  }

  reviveBtn.addEventListener('click', () => launch());

  // Trigger: 10s or scroll past projects — whichever first
  let snakeLaunched = false;

  function triggerSnake() {
    if (snakeLaunched) return;
    if (panelPosters && !panelPosters.hidden) return;
    snakeLaunched = true;
    launch();
  }

  const snakeTimer = setTimeout(triggerSnake, 10000);

  if ('IntersectionObserver' in window) {
    const proj = document.getElementById('projects');
    const projObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting && e.boundingClientRect.top < 0) {
            clearTimeout(snakeTimer);
            setTimeout(triggerSnake, 800);
            projObs.disconnect();
          }
        });
      },
      { threshold: 0 }
    );
    if (proj) projObs.observe(proj);
  }

  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!snakeLaunched) return;
      sizeCanvas();
      if (running) draw();
    }, 150);
  });

  // ─── Keyboard controls ───
  document.addEventListener('keydown', (e) => {
    if (!running) return;
    const key = e.key;
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(key)) {
      e.preventDefault();
    }
    switch (key) {
      case 'ArrowUp':    case 'w': case 'W': if (dir.y !== 1)  nextDir = { x: 0,  y:-1 }; break;
      case 'ArrowDown':  case 's': case 'S': if (dir.y !== -1) nextDir = { x: 0,  y: 1 }; break;
      case 'ArrowLeft':  case 'a': case 'A': if (dir.x !== 1)  nextDir = { x:-1,  y: 0 }; break;
      case 'ArrowRight': case 'd': case 'D': if (dir.x !== -1) nextDir = { x: 1,  y: 0 }; break;
    }
  });

  // ─── Touch / swipe for mobile ───
  let touchX = 0, touchY = 0;

  document.addEventListener('touchstart', (e) => {
    if (!running) return;
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (running) e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchend', (e) => {
    if (!running) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && dir.x !== -1) nextDir = { x: 1,  y: 0 };
      else if (dx < 0 && dir.x !== 1) nextDir = { x:-1, y: 0 };
    } else {
      if (dy > 0 && dir.y !== -1) nextDir = { x: 0, y: 1 };
      else if (dy < 0 && dir.y !== 1) nextDir = { x: 0, y:-1 };
    }
  }, { passive: true });

})();
