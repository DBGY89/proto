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
    'bubbles',
    'salad-bar',
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ocultar tarjetas de proyectos no publicados
  document.querySelectorAll('.card[data-project]').forEach((card) => {
    const id = card.getAttribute('data-project');
    if (!PUBLIC_PROJECTS.includes(id)) {
      card.classList.add('card--hidden');
    }
  });

  // ───────────────────────────────────────────
  //  Reveal-on-scroll for cards
  // ───────────────────────────────────────────
  const cards = document.querySelectorAll('.card:not(.card--hidden)');

  if (reducedMotion) {
    cards.forEach((c) => c.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((c) => obs.observe(c));
  } else {
    cards.forEach((c) => c.classList.add('is-visible'));
  }

  // ───────────────────────────────────────────
  //  Tease: iluminar una tarjeta al azar para incitar a clicar (mismo efecto que hover)
  // ───────────────────────────────────────────
  const TEASE_DURATION_MS = 1800;
  const TEASE_INTERVAL_MS = 3500;

  function teaseRandomCard() {
    const visible = Array.from(document.querySelectorAll('.card:not(.card--hidden)'));
    if (visible.length === 0) return;
    const card = visible[Math.floor(Math.random() * visible.length)];
    card.classList.add('card--tease');
    setTimeout(() => card.classList.remove('card--tease'), TEASE_DURATION_MS);
  }

  let teaseTimer;
  if (!reducedMotion && cards.length > 0) {
    teaseTimer = setInterval(teaseRandomCard, TEASE_INTERVAL_MS);
    // Primera iluminación un poco después de que las tarjetas sean visibles
    setTimeout(teaseRandomCard, TEASE_INTERVAL_MS * 0.8);
  }

  // ───────────────────────────────────────────
  //  3D tilt on card hover
  // ───────────────────────────────────────────
  cards.forEach((card) => {
    if (card.classList.contains('card--soon')) return;
    card.addEventListener('mouseenter', () => card.classList.remove('card--tease'));
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateY(${x * 8}deg) rotateX(${y * -8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
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
    gameLoop = setInterval(step, 110);
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

  // Trigger: 30s or scroll past projects — whichever first
  let snakeLaunched = false;

  function triggerSnake() {
    if (snakeLaunched) return;
    snakeLaunched = true;
    launch();
  }

  const snakeTimer = setTimeout(triggerSnake, 30000);

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
