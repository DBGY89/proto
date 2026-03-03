(function () {
  'use strict';

  if (window.__bubblesExtLoaded) return;
  window.__bubblesExtLoaded = true;

  // ─── Config ───
  const GAME_DURATION = 45000;
  const SPAWN_INTERVAL_START = 800;
  const SPAWN_INTERVAL_END = 300;
  const FRENZY_START = 15000;
  const FRENZY_DURATION = 10000;
  const SPECIAL_CHANCE = 0.15;
  const SPECIAL_POINTS = 3;
  const GLITTER_COUNT = 45;
  const GLITTER_COLORS = ['#b24dff', '#d9a0ff', '#ff6eaa', '#ffd700', '#66f7ff', '#ffffff'];

  // ─── Shadow DOM setup ───
  const host = document.createElement('div');
  host.id = 'bubbles-ext-host';
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = `
    :host {
      all: initial;
    }

    .overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      pointer-events: none;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    .overlay[hidden] { display: none; }

    /* ─── HUD ─── */
    .hud {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: rgba(10, 10, 26, .88);
      backdrop-filter: blur(10px);
      border: 1px solid #00f0ff;
      border-radius: 10px;
      box-shadow: 0 0 16px rgba(0, 240, 255, .2);
      pointer-events: none;
      animation: hudIn .4s cubic-bezier(.23,1,.32,1) both;
    }

    .hud[hidden] { display: none; }

    .hud-label {
      font-size: 14px;
      font-weight: 700;
      color: #9090b0;
      text-transform: uppercase;
      letter-spacing: .06em;
    }

    .hud-score {
      font-size: 20px;
      font-weight: 700;
      color: #00f0ff;
      font-variant-numeric: tabular-nums;
      text-shadow: 0 0 10px rgba(0,240,255,.5);
    }

    @keyframes hudIn {
      from { opacity: 0; transform: translateY(-12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ─── Timer bar ─── */
    .timer-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      height: 4px;
      width: 100%;
      background: #00f0ff;
      box-shadow: 0 0 12px #00f0ff;
      transform-origin: left;
      transform: scaleX(1);
      z-index: 2147483647;
      pointer-events: none;
    }

    .timer-bar[hidden] { display: none; }

    /* ─── Soap bubble ─── */
    .bubble {
      position: absolute;
      border-radius: 50%;
      cursor: pointer;
      pointer-events: all;
      animation: floatUp var(--dur) linear forwards;
      will-change: transform, opacity;
      background:
        radial-gradient(circle at 25% 25%, rgba(255,255,255,.35) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(173,216,255,.12) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(200,225,255,.06) 0%, rgba(180,210,255,.03) 100%);
      border: 1px solid rgba(180, 220, 255, .3);
      box-shadow:
        inset 0 0 20px rgba(200, 230, 255, .08),
        0 0 8px rgba(160, 210, 255, .15);
    }

    .bubble::before {
      content: '';
      position: absolute;
      top: 12%;
      left: 15%;
      width: 35%;
      height: 25%;
      background: radial-gradient(ellipse, rgba(255,255,255,.5) 0%, transparent 70%);
      border-radius: 50%;
      transform: rotate(-25deg);
    }

    .bubble::after {
      content: '';
      position: absolute;
      bottom: 18%;
      right: 15%;
      width: 20%;
      height: 12%;
      background: radial-gradient(ellipse, rgba(200,230,255,.25) 0%, transparent 70%);
      border-radius: 50%;
      transform: rotate(15deg);
    }

    /* ─── Special bubble ─── */
    .bubble--special {
      border: 2px solid rgba(255, 255, 255, .7);
      animation:
        floatUp var(--dur) linear forwards,
        shimmer .6s ease-in-out infinite,
        pulse .4s ease-in-out infinite alternate;
      box-shadow:
        inset 0 0 30px rgba(255, 200, 255, .25),
        0 0 25px rgba(200, 100, 255, .6),
        0 0 50px rgba(180, 80, 255, .4),
        0 0 80px rgba(255, 100, 200, .25),
        0 0 120px rgba(100, 200, 255, .15);
    }

    .bubble--special::before {
      width: 110%;
      height: 110%;
      top: -5%;
      left: -5%;
      border-radius: 50%;
      background: conic-gradient(
        from 0deg,
        rgba(255, 50, 120, .3),
        rgba(255, 215, 0, .3),
        rgba(0, 240, 255, .3),
        rgba(178, 77, 255, .3),
        rgba(255, 50, 120, .3)
      );
      animation: rainbowSpin 1s linear infinite;
    }

    .bubble--special::after {
      width: 100%;
      height: 100%;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 25%, rgba(255,255,255,.7) 0%, transparent 40%);
    }

    @keyframes shimmer {
      0%, 100% {
        box-shadow:
          inset 0 0 30px rgba(255, 200, 255, .25),
          0 0 25px rgba(200, 100, 255, .6),
          0 0 50px rgba(180, 80, 255, .4),
          0 0 80px rgba(255, 100, 200, .25),
          0 0 120px rgba(100, 200, 255, .15);
      }
      33% {
        box-shadow:
          inset 0 0 30px rgba(200, 255, 230, .25),
          0 0 25px rgba(0, 240, 200, .6),
          0 0 50px rgba(0, 200, 255, .4),
          0 0 80px rgba(100, 255, 200, .25),
          0 0 120px rgba(200, 255, 100, .15);
      }
      66% {
        box-shadow:
          inset 0 0 30px rgba(255, 220, 180, .25),
          0 0 25px rgba(255, 180, 50, .6),
          0 0 50px rgba(255, 100, 150, .4),
          0 0 80px rgba(255, 50, 120, .25),
          0 0 120px rgba(255, 200, 100, .15);
      }
    }

    @keyframes pulse {
      from { scale: 1; }
      to   { scale: 1.08; }
    }

    @keyframes rainbowSpin {
      to { transform: rotate(360deg); }
    }

    /* ─── Glitter ─── */
    .glitter {
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      pointer-events: none;
      animation: glitterBurst var(--gdur) ease-out forwards;
      z-index: 2147483647;
    }

    @keyframes glitterBurst {
      0% { opacity: 1; transform: translate(0, 0) scale(1); }
      100% { opacity: 0; transform: translate(var(--gx), var(--gy)) scale(0); }
    }

    @keyframes floatUp {
      0%   { translate: 0 0; opacity: .9; }
      80%  { opacity: .7; }
      100% { translate: 0 calc(-100vh - 120px); opacity: 0; }
    }

    @keyframes pop {
      0%   { transform: scale(1); opacity: 1; }
      50%  { transform: scale(1.5); opacity: .5; }
      100% { transform: scale(0); opacity: 0; }
    }

    @keyframes scoreFloat {
      0%   { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(-40px) scale(1.3); }
    }

    .score-pop {
      position: absolute;
      font-size: 14px;
      font-weight: 700;
      pointer-events: none;
      animation: scoreFloat .6s cubic-bezier(.23,1,.32,1) forwards;
      z-index: 2147483647;
    }

    .score-pop--normal {
      color: #ffd700;
      text-shadow: 0 0 8px rgba(255,215,0,.5);
    }

    .score-pop--special {
      color: #b24dff;
      text-shadow: 0 0 10px rgba(178,77,255,.5);
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;

  shadow.appendChild(style);

  // ─── Build DOM inside shadow ───
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.hidden = true;
  shadow.appendChild(overlay);

  const hud = document.createElement('div');
  hud.className = 'hud';
  hud.hidden = true;

  const hudLabel = document.createElement('span');
  hudLabel.className = 'hud-label';
  hudLabel.textContent = 'Score';

  const hudScore = document.createElement('span');
  hudScore.className = 'hud-score';
  hudScore.textContent = '0';

  hud.appendChild(hudLabel);
  hud.appendChild(hudScore);
  shadow.appendChild(hud);

  const timerBar = document.createElement('div');
  timerBar.className = 'timer-bar';
  timerBar.hidden = true;
  shadow.appendChild(timerBar);

  // ─── Audio ───
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playPop(special) {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(special ? 600 : 400, now);
    osc.frequency.exponentialRampToValueAtTime(special ? 1200 : 800, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(special ? 200 : 100, now + 0.12);

    filter.type = 'bandpass';
    filter.frequency.value = special ? 900 : 600;
    filter.Q.value = 1.5;

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (special ? 0.25 : 0.15));

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (special ? 0.25 : 0.15));

    if (special) {
      const sparkle = ctx.createOscillator();
      const sparkGain = ctx.createGain();
      sparkle.type = 'triangle';
      sparkle.frequency.setValueAtTime(2000, now + 0.05);
      sparkle.frequency.exponentialRampToValueAtTime(4000, now + 0.15);
      sparkle.frequency.exponentialRampToValueAtTime(1500, now + 0.3);
      sparkGain.gain.setValueAtTime(0.08, now + 0.05);
      sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      sparkle.connect(sparkGain);
      sparkGain.connect(ctx.destination);
      sparkle.start(now + 0.05);
      sparkle.stop(now + 0.35);
    }
  }

  // ─── Game state ───
  let score = 0;
  let spawnTimer = null;
  let endTimer = null;
  let startTime = 0;
  let running = false;
  let scoreInterval = null;

  function isInFrenzy() {
    const elapsed = Date.now() - startTime;
    return elapsed >= FRENZY_START && elapsed < FRENZY_START + FRENZY_DURATION;
  }

  function start() {
    if (running) return;
    running = true;
    score = 0;
    hudScore.textContent = '0';

    overlay.querySelectorAll('.bubble, .glitter, .score-pop').forEach(el => el.remove());

    overlay.hidden = false;
    hud.hidden = false;
    timerBar.hidden = false;

    startTime = Date.now();
    timerBar.style.transition = 'none';
    timerBar.style.transform = 'scaleX(1)';

    requestAnimationFrame(() => {
      timerBar.style.transition = `transform ${GAME_DURATION}ms linear`;
      timerBar.style.transform = 'scaleX(0)';
    });

    scheduleSpawn();
    endTimer = setTimeout(end, GAME_DURATION);

    scoreInterval = setInterval(() => {
      chrome.runtime.sendMessage({ type: 'score-update', score });
    }, 200);
  }

  function end() {
    running = false;
    clearTimeout(spawnTimer);
    clearTimeout(endTimer);
    clearInterval(scoreInterval);

    overlay.querySelectorAll('.bubble').forEach(el => el.remove());

    timerBar.hidden = true;
    hud.hidden = true;
    overlay.hidden = true;

    chrome.runtime.sendMessage({ type: 'game-over', score });
  }

  function stop() {
    if (!running) return;
    running = false;
    clearTimeout(spawnTimer);
    clearTimeout(endTimer);
    clearInterval(scoreInterval);

    overlay.querySelectorAll('.bubble, .glitter, .score-pop').forEach(el => el.remove());

    timerBar.hidden = true;
    hud.hidden = true;
    overlay.hidden = true;
  }

  // ─── Spawning ───

  function scheduleSpawn() {
    if (!running) return;
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / GAME_DURATION, 1);
    const baseInterval = SPAWN_INTERVAL_START - (SPAWN_INTERVAL_START - SPAWN_INTERVAL_END) * progress;
    const frenzy = isInFrenzy();
    const interval = frenzy ? baseInterval / 3 : baseInterval;

    spawnTimer = setTimeout(() => {
      if (!running) return;
      spawnBubble();
      if (frenzy) {
        spawnBubble();
        spawnBubble();
      }
      scheduleSpawn();
    }, interval + Math.random() * (frenzy ? 60 : 200));
  }

  function spawnBubble() {
    const el = document.createElement('div');
    const isSpecial = Math.random() < SPECIAL_CHANCE;
    el.className = isSpecial ? 'bubble bubble--special' : 'bubble';
    el.dataset.special = isSpecial ? '1' : '';

    const frenzy = isInFrenzy();
    const size = 40 + Math.random() * 50;
    const x = Math.random() * (window.innerWidth - size);
    const dur = frenzy ? 2 + Math.random() * 2 : 3 + Math.random() * 3;

    el.style.cssText = `
      left: ${x}px;
      bottom: -${size}px;
      width: ${size}px;
      height: ${size}px;
      --dur: ${dur}s;
    `;

    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      pop(el);
    });

    el.addEventListener('animationend', () => el.remove());

    overlay.appendChild(el);
  }

  // ─── Pop ───

  function pop(el) {
    if (!running) return;
    const isSpecial = el.dataset.special === '1';
    const points = isSpecial ? SPECIAL_POINTS : 1;
    score += points;
    hudScore.textContent = score;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    playPop(isSpecial);
    showScoreFloat(cx, rect.top, points, isSpecial);

    if (isSpecial) {
      spawnGlitter(cx, cy);
    }

    el.style.animation = 'pop .25s ease-out forwards';
    el.style.pointerEvents = 'none';
    setTimeout(() => el.remove(), 300);
  }

  function showScoreFloat(x, y, points, special) {
    const el = document.createElement('div');
    el.className = special ? 'score-pop score-pop--special' : 'score-pop score-pop--normal';
    el.textContent = `+${points}`;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    overlay.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }

  // ─── Glitter ───

  function spawnGlitter(cx, cy) {
    for (let i = 0; i < GLITTER_COUNT; i++) {
      const particle = document.createElement('div');
      particle.className = 'glitter';

      const angle = (Math.PI * 2 * i) / GLITTER_COUNT + (Math.random() - 0.5) * 0.5;
      const dist = 60 + Math.random() * 140;
      const gx = Math.cos(angle) * dist;
      const gy = Math.sin(angle) * dist;
      const dur = 0.5 + Math.random() * 0.6;
      const size = 3 + Math.random() * 8;
      const color = GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)];

      particle.style.cssText = `
        left: ${cx}px;
        top: ${cy}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        --gx: ${gx}px;
        --gy: ${gy}px;
        --gdur: ${dur}s;
      `;

      overlay.appendChild(particle);
      setTimeout(() => particle.remove(), dur * 1000 + 50);
    }
  }

  // ─── Message listener ───

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'start') {
      start();
      sendResponse({ ok: true });
    } else if (msg.type === 'stop') {
      stop();
      sendResponse({ ok: true });
    } else if (msg.type === 'ping') {
      sendResponse({ running, score });
    }
  });
})();
