(function () {
  'use strict';

  const GAME_DURATION = 30000;
  const SPAWN_INTERVAL_START = 800;
  const SPAWN_INTERVAL_END = 300;
  const FRENZY_START = 12000;
  const FRENZY_DURATION = 6000;
  const SPECIAL_CHANCE = 0.15;
  const SPECIAL_POINTS = 3;
  const GLITTER_COUNT = 45;
  const GLITTER_COLORS = ['#b24dff', '#d9a0ff', '#ff6eaa', '#ffd700', '#66f7ff', '#ffffff'];

  const gameArea = document.getElementById('game-area');
  const splash = document.getElementById('splash');
  const gameOver = document.getElementById('game-over');
  const scoreEl = document.getElementById('score');
  const finalScoreEl = document.getElementById('final-score');
  const scoreDisplay = document.getElementById('score-display');
  const timerBar = document.getElementById('timer-bar');
  const btnStart = document.getElementById('btn-start');
  const btnRestart = document.getElementById('btn-restart');

  let score = 0;
  let spawnTimer = null;
  let endTimer = null;
  let startTime = 0;
  let running = false;

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

  function isInFrenzy() {
    const elapsed = Date.now() - startTime;
    return elapsed >= FRENZY_START && elapsed < FRENZY_START + FRENZY_DURATION;
  }

  function start() {
    if (running) return;
    getAudioCtx();
    running = true;
    score = 0;
    scoreEl.textContent = '0';

    splash.hidden = true;
    gameOver.hidden = true;
    scoreDisplay.hidden = false;
    gameArea.classList.add('is-playing');

    gameArea.querySelectorAll('.bubble, .glitter, .score-pop').forEach(el => el.remove());

    startTime = Date.now();
    timerBar.classList.add('active');
    timerBar.style.transition = 'none';
    timerBar.style.transform = 'scaleX(1)';
    requestAnimationFrame(() => {
      timerBar.style.transition = `transform ${GAME_DURATION}ms linear`;
      timerBar.style.transform = 'scaleX(0)';
    });

    scheduleSpawn();
    endTimer = setTimeout(end, GAME_DURATION);
  }

  function end() {
    running = false;
    clearTimeout(spawnTimer);
    clearTimeout(endTimer);

    gameArea.querySelectorAll('.bubble').forEach(el => el.remove());
    gameArea.classList.remove('is-playing');
    scoreDisplay.hidden = true;
    timerBar.classList.remove('active');

    finalScoreEl.textContent = score;
    gameOver.hidden = false;
  }

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

    el.addEventListener('animationend', () => el.remove());

    gameArea.appendChild(el);
  }

  gameArea.addEventListener('pointerdown', (e) => {
    if (!running) return;
    const targets = document.elementsFromPoint(e.clientX, e.clientY);
    const bubble = targets.find((el) => el.classList && el.classList.contains('bubble'));
    if (bubble) {
      e.preventDefault();
      e.stopPropagation();
      pop(bubble);
    }
  }, { passive: false });

  function pop(el) {
    if (!running) return;
    if (el.dataset.popped === '1') return;
    el.dataset.popped = '1';
    const isSpecial = el.dataset.special === '1';
    const points = isSpecial ? SPECIAL_POINTS : 1;
    score += points;
    scoreEl.textContent = score;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    playPop(isSpecial);
    showScoreFloat(cx, rect.top, points, isSpecial);
    if (isSpecial) spawnGlitter(cx, rect.top + rect.height / 2);

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
    gameArea.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }

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
        left: ${cx}px; top: ${cy}px;
        width: ${size}px; height: ${size}px;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        --gx: ${gx}px; --gy: ${gy}px; --gdur: ${dur}s;
      `;
      gameArea.appendChild(particle);
      setTimeout(() => particle.remove(), dur * 1000 + 50);
    }
  }

  btnStart.addEventListener('click', start);
  btnRestart.addEventListener('click', start);
})();
