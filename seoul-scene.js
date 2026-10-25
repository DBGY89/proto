/**
 * AI Proto Lab — Hero: Seoul at night (canvas 2D)
 * Front-row buildings = visible project cards in #panel-projects, in DOM order.
 * The construction site with the crane is the course (BUILD YOURS).
 */

(function () {
  'use strict';

  const canvas = document.getElementById('seoul-scene');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const COURSE_URL = 'https://aiprotolab.es/sops/shipitsolo/';
  const PARALLAX = 1;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ACC = { pink: '#ff2d78', cyan: '#00f0ff', purple: '#b24dff' };
  const NEON = ['#ff2d78', '#00f0ff', '#b24dff', '#ffd700'];
  const HG = ['편의점', '노래방', '치킨', '24시', '카페', 'PC방', '약국', '호프', '분식', '포차', '라면', '서울', '김밥'];
  // Relative heights of the project buildings (× ground line)
  const HS = [.62, .72, .52, .42, .36, .38, .45, .56, .7, .6];

  // ───────────────────────────────────────────
  //  Projects: read from the visible cards so the skyline matches the grid
  //  (landing.js hides unpublished cards before this deferred script runs)
  // ───────────────────────────────────────────
  const projects = Array.from(
    document.querySelectorAll('#panel-projects .card[data-project]:not(.card--hidden)')
  ).map((card) => {
    const accent = card.classList.contains('card--pink') ? 'pink'
      : card.classList.contains('card--purple') ? 'purple' : 'cyan';
    const titleEl = card.querySelector('.card-title');
    const id = card.getAttribute('data-project');
    return {
      id,
      card,
      title: titleEl ? titleEl.textContent.trim() : id.toUpperCase(),
      color: ACC[accent],
      href: card.getAttribute('href') || '/' + id + '/',
    };
  });
  if (projects.length === 0) return;

  // ───────────────────────────────────────────
  //  State — active = sceneHover ?? cardHover ?? tease
  //  sceneHover: project index | 'course' | null · cardHover / tease: project index | null
  //  The active project's card gets .card--tease (same look as hover), and its building lights up.
  // ───────────────────────────────────────────
  const state = { sceneHover: null, cardHover: null, tease: null };
  const getActive = () => state.sceneHover ?? state.cardHover ?? state.tease;
  const isAuto = () => state.sceneHover == null && state.cardHover == null;
  const projectsPanel = document.getElementById('panel-projects');
  const onProjectsTab = () => !projectsPanel || !projectsPanel.hidden;

  const R = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const hexA = (h, a) => {
    const n = parseInt(h.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  };
  // Desaturate a neon colour towards #5a5c80 (secondary hangul signs)
  const mute = (h, k) => {
    const n = parseInt(h.slice(1), 16), g = [0x5a, 0x5c, 0x80];
    return '#' + [n >> 16, (n >> 8) & 255, n & 255]
      .map((c, i) => Math.round(c * (1 - k) + g[i] * k).toString(16).padStart(2, '0')).join('');
  };

  const S = {
    W: 0, H: 0, g: 0, P: 1, mx: 0, my: 0, tx: 0, ty: 0, scroll: 0,
    layers: [], stars: [], labels: [], sparks: [], visible: true, focus: 0,
    par: reduce ? 0 : PARALLAX, cross: !reduce,
  };

  // ───────────────────────────────────────────
  //  Cached sprites: glows, hangul signs, name labels
  // ───────────────────────────────────────────
  const glowCache = {};
  const glow = (col, r) => {
    const k = col + r;
    if (glowCache[k]) return glowCache[k];
    const cv = document.createElement('canvas');
    cv.width = cv.height = r * 2;
    const x = cv.getContext('2d'), gr = x.createRadialGradient(r, r, 0, r, r, r);
    gr.addColorStop(0, col);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gr;
    x.fillRect(0, 0, r * 2, r * 2);
    return (glowCache[k] = cv);
  };

  const mkSign = (text, col0, fs) => {
    const col = mute(col0, .45);
    const ch = [...text], pad = fs * 0.45, w = fs + pad * 2, h = ch.length * fs * 1.12 + pad * 2, m = 14, P = S.P;
    const cv = document.createElement('canvas');
    cv.width = (w + m * 2) * P;
    cv.height = (h + m * 2) * P;
    const x = cv.getContext('2d');
    x.scale(P, P);
    x.fillStyle = 'rgba(8,8,24,.9)'; x.fillRect(m, m, w, h);
    x.shadowColor = col; x.shadowBlur = 4; x.strokeStyle = col; x.lineWidth = 1.2; x.strokeRect(m, m, w, h);
    x.fillStyle = col; x.font = `700 ${fs}px "Noto Sans KR",sans-serif`; x.textAlign = 'center'; x.textBaseline = 'top';
    ch.forEach((t, i) => x.fillText(t, m + w / 2, m + pad + i * fs * 1.12));
    x.shadowBlur = 0; x.globalAlpha = 0.12; x.fillStyle = '#fff';
    ch.forEach((t, i) => x.fillText(t, m + w / 2, m + pad + i * fs * 1.12));
    return { cv, w: w + m * 2, h: h + m * 2, m, bw: w, bh: h };
  };

  const mkLabel = (text, col, fs) => {
    const P = S.P, m = 18, t = document.createElement('canvas').getContext('2d');
    const font = text === '한글' ? `700 ${fs + 3}px "Noto Sans KR",sans-serif` : `700 ${fs}px "Space Grotesk",sans-serif`;
    t.font = font;
    const tw = t.measureText(text).width + text.length * fs * .08;
    const w = tw + fs * 1.6, h = fs * 2.3;
    const cv = document.createElement('canvas');
    cv.width = (w + m * 2) * P;
    cv.height = (h + m * 2) * P;
    const x = cv.getContext('2d');
    x.scale(P, P);
    x.fillStyle = 'rgba(6,6,20,.94)'; x.fillRect(m, m, w, h);
    x.shadowColor = col; x.shadowBlur = 16; x.strokeStyle = col; x.lineWidth = 2; x.strokeRect(m, m, w, h);
    x.font = font; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = col;
    if ('letterSpacing' in x) x.letterSpacing = (fs * .08) + 'px';
    x.fillText(text, m + w / 2, m + h / 2 + 1); x.fillText(text, m + w / 2, m + h / 2 + 1);
    x.shadowBlur = 0; x.globalAlpha = .55; x.fillStyle = '#fff'; x.fillText(text, m + w / 2, m + h / 2 + 1);
    return { cv, w: w + m * 2, h: h + m * 2, m, vw: w, vh: h };
  };

  // ───────────────────────────────────────────
  //  Layers
  // ───────────────────────────────────────────
  const addWindows = (b, o) => {
    const cols = Math.floor((b.w - 8) / o.ws), rows = Math.floor((b.h - 12) / o.ws);
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
      if (Math.random() < o.density) {
        b.win.push({ x: 6 + k * o.ws, y: 10 + r * o.ws, on: Math.random() < 0.65, col: Math.random() < 0.25 ? '#ffe9b8' : pick(NEON) });
      }
    }
  };

  // Scale factor so a height (px above ground) fits under the hero text; 1 on desktop
  const fit = (h) => Math.min(1, S.avail / h);

  const mkLayer = (o) => {
    const bs = [], k = fit(o.hMax * S.g);
    let x = -90;
    while (x < S.W + 90) {
      const b = { x, w: R(o.wMin, o.wMax), h: R(o.hMin, o.hMax) * S.g * k, edge: pick(NEON), win: [] };
      addWindows(b, o);
      if (o.signs && Math.random() < o.signs && b.h > S.g * 0.3) {
        const img = mkSign(pick(HG), pick(NEON), o.fs);
        if (img.bh < b.h * 0.6) b.sign = { img, side: Math.random() < 0.5, dy: R(12, b.h * 0.2), glitch: 0, ph: R(0, 6) };
      }
      bs.push(b);
      x += b.w + R(o.gMin, o.gMax);
    }
    return { ...o, bs };
  };

  // Near layer: one slot per project; the construction site takes 2 slots, second to last
  const mkProjectLayer = (o) => {
    const N = projects.length, CI = N - 1, slot = S.W / (N + 2), bs = [];
    const ANTENNA = [1, 8], STORE = 6, hScale = S.mobile ? .92 : 1;
    const baseH = (i) => HS[i % HS.length] * S.g * hScale;
    // Tallest roof must stay under the hero text; antennas (38px incl. light) don't scale, so reserve them.
    // One factor for all buildings keeps their relative heights.
    const k = Math.min(1, ...projects.map((p, i) => (S.avail - (ANTENNA.includes(i) ? 38 : 0)) / baseH(i)));
    // Crane: keep its height, shorten the building under it if needed (sign hangs from the jib, never cropped)
    const craneH = Math.max(84, S.g * .17);
    const courseH = Math.min(.3 * S.g, Math.max(.16 * S.g, S.avail - craneH - 26));
    let u = 0;
    for (let s = 0; s <= N; s++) {
      if (s === CI) {
        const w = Math.min(210, slot * 2 * .72);
        const cb = { x: u * slot + (slot * 2 - w) / 2, w, h: courseH, craneH, edge: '#ffd700', pid: 'course', lit: 0, win: [], construction: true };
        for (let y = cb.h * .5 + 10; y < cb.h - 6; y += o.ws) for (let x = 6; x < w - 10; x += o.ws) {
          if (Math.random() < .5) cb.win.push({ x, y, col: Math.random() < .5 ? '#ffe9b8' : '#ffd700' });
        }
        bs.push(cb); S.cb = cb; u += 2;
        continue;
      }
      const i = s > CI ? s - 1 : s, pr = projects[i], w = Math.max(26, Math.min(130, slot * .66));
      const b = { x: u * slot + (slot - w) / 2, w, h: baseH(i) * k, edge: pr.color, pid: i, lit: 0, win: [] };
      u += 1;
      addWindows(b, o);
      if (!S.mobile && Math.random() < .55) {
        const img = mkSign(pick(HG), pick(NEON), o.fs);
        if (img.bh < b.h * .55) b.sign = { img, side: i % 2 === 0, dy: R(30, b.h * .3), glitch: 0, ph: R(0, 6) };
      }
      bs.push(b);
    }
    const byPid = (id) => bs.find((b) => b.pid === id) || {};
    ANTENNA.forEach((id) => { byPid(id).antenna = true; });
    byPid(STORE).store = true;
    return { ...o, bs };
  };

  // Desktop (> 600px): keep the title and subtitle clear of every roof without resizing the scene.
  // a) sink the whole skyline towards the ground (max 4% of the hero);
  // b) only if still needed, trim the roofs that remain under the text, by the minimum amount.
  // Roofs are checked at rest horizontally; the vertical margin covers the mouse parallax (12·d px up).
  const clearHeroText = () => {
    const sub = document.querySelector('.hero-subtitle');
    if (!sub) return;
    const gap = parseFloat(getComputedStyle(sub).fontSize) * 1.5;
    // One box per rendered line of text (real glyph width, not the 440px max-width box).
    // x from the line rects (the entry animation only moves text vertically), y from layout.
    const hero = canvas.getBoundingClientRect(), boxes = [];
    for (const el of [document.querySelector('.hero-title'), sub]) {
      if (!el) continue;
      const er = el.getBoundingClientRect(), top = layoutTop(el), rg = document.createRange();
      rg.selectNodeContents(el);
      for (const r of rg.getClientRects()) {
        if (r.width < 1) continue;
        boxes.push({ x0: r.left - hero.left, x1: r.right - hero.left, y1: top + (r.bottom - er.top) + gap });
      }
    }
    // Highest point a roof may reach for an item spanning x0..x1 at depth d: below every text box it sits under.
    // null = not under the text.
    const limit = (x0, x1, d) => {
      let y = null;
      for (const bx of boxes) if (x1 > bx.x0 && x0 < bx.x1) y = Math.max(y ?? -Infinity, bx.y1 + 12 * d * PARALLAX);
      return y;
    };
    // Items: roofs (antennas, signs and the crane included) and the tower, as height above ground
    const items = [];
    S.layers.forEach((L) => L.bs.forEach((b) => {
      if (b.construction) {
        const hookX = b.x + b.w * .36, jR = b.x + b.w * .86 + Math.max(26, b.w * .28);
        items.push({ x0: Math.min(b.x, hookX - S.courseLab.vw / 2), x1: Math.max(b.x + b.w, jR), d: L.d, above: () => b.h + b.craneH + 26 });
        return;
      }
      items.push({ b, x0: b.x, x1: b.x + b.w, d: L.d, above: () => b.h + (b.antenna ? 38 : 0) });
      if (b.sign) {
        const im = b.sign.img, sx = b.sign.side ? b.x + b.w - im.bw * .45 : b.x - im.bw * .55;
        items.push({ b, x0: sx, x1: sx + im.bw, d: L.d, above: () => (b.sign ? b.h - b.sign.dy : 0) });
      }
    }));
    const tx = S.W * .72;
    items.push({ x0: tx - 15, x1: tx + 15, d: .08, above: () => S.hill - 20 + S.towerH + 36 });
    // Px an item pokes into the text area (≤ 0 = clear; items not under the text never count)
    const over = (it) => {
      const y = limit(it.x0, it.x1, it.d);
      return y === null ? -Infinity : it.above() - (S.g - y);
    };
    // a) sink the skyline: buildings keep their size, the ground line moves down
    const need = Math.max(0, ...items.map(over));
    S.g += Math.min(need, S.H * .04);
    // b) trim what still overlaps (only plain buildings; crane, sign and tower are never cropped)
    S.trimmed = 0;
    for (const it of items) {
      const o = over(it);
      if (o <= 0 || !it.b) continue;
      const b = it.b;
      b.h -= o;
      b.win = b.win.filter((w) => w.y < b.h - 12);
      if (b.sign && b.sign.dy + b.sign.img.bh > b.h) delete b.sign;
      S.trimmed++;
    }
  };

  const build = () => {
    const r = canvas.getBoundingClientRect();
    S.W = r.width; S.H = r.height; S.P = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = S.W * S.P; canvas.height = S.H * S.P;
    S.g = S.H * 0.92; S.mobile = S.W < 700;
    S.avail = Infinity;
    // Phones (≤ 600px): roofs stay at least 1.5em below the subtitle
    const sub = document.querySelector('.hero-subtitle');
    if (S.W <= 600 && sub) {
      const gap = parseFloat(getComputedStyle(sub).fontSize) * 1.5;
      S.avail = Math.max(S.g * .3, S.g - (layoutTop(sub) + sub.offsetHeight) - gap);
    }
    // Namsan: hill + tower + antenna light ≈ .72g + 16px above ground
    S.towerK = Math.min(1, (S.avail - 16) / (S.g * .72));
    S.hill = S.g * .3 * S.towerK; S.towerH = S.g * .42 * S.towerK; S.railH = S.g * .18;
    const m = S.mobile ? 0.8 : 1;
    S.labels = projects.map((p) => mkLabel(p.title, p.color, S.mobile ? 11 : 13));
    S.courseLab = mkLabel('BUILD YOURS', '#ffd700', S.mobile ? 13 : 16);
    S.layers = [
      mkLayer({ d: 0.15, hMin: .22, hMax: .5, wMin: 26 * m, wMax: 60 * m, gMin: 0, gMax: 6, ws: 9, density: .28, wa: .35, body: '#0f1030', ea: .18 }),
      mkLayer({ d: 0.45, hMin: .28, hMax: .66, wMin: 46 * m, wMax: 92 * m, gMin: 4, gMax: 22, ws: 12, density: .34, wa: .6, body: '#131436', ea: .3, signs: .35, fs: 11 }),
      mkProjectLayer({ d: 0.9, ws: S.mobile ? 10 : 16, density: .42, wa: .85, body: '#17183e', ea: .55, fs: S.mobile ? 13 : 16, near: true }),
    ];
    S.sparks = [];
    S.stall = S.W * 0.2;
    S.stars = Array.from({ length: S.mobile ? 30 : 70 }, () => ({ x: R(0, S.W), y: R(0, S.g * 0.5), a: R(.2, .8), p: R(0, 6) }));
    if (S.W > 600) clearHeroText();

    // Gradients only depend on size: build once per resize
    const { W, g } = S;
    S.sky = ctx.createLinearGradient(0, 0, 0, g);
    S.sky.addColorStop(0, '#04051a'); S.sky.addColorStop(.7, '#0f0e34'); S.sky.addColorStop(1, '#2a1240');
    S.haze = ctx.createLinearGradient(0, g * .55, 0, g);
    S.haze.addColorStop(0, 'rgba(255,45,120,0)'); S.haze.addColorStop(1, 'rgba(255,45,120,.12)');
    S.groundLine = ctx.createLinearGradient(0, 0, W, 0);
    S.groundLine.addColorStop(0, 'rgba(255,45,120,0)'); S.groundLine.addColorStop(.2, 'rgba(255,45,120,.7)');
    S.groundLine.addColorStop(.5, 'rgba(0,240,255,.8)'); S.groundLine.addColorStop(.8, 'rgba(178,77,255,.7)');
    S.groundLine.addColorStop(1, 'rgba(178,77,255,0)');
    S.groundGlow = ctx.createLinearGradient(0, g, 0, g + 26);
    S.groundGlow.addColorStop(0, 'rgba(0,240,255,.12)'); S.groundGlow.addColorStop(1, 'rgba(0,240,255,0)');
  };

  // Top of an element relative to the hero, from layout (ignores the fadeInDown transform)
  const layoutTop = (el) => {
    let y = 0;
    for (let n = el; n && n !== canvas.parentElement; n = n.offsetParent) y += n.offsetTop;
    return y;
  };

  // Parallax offset per layer depth d
  const off = (d) => [-S.mx * d * 40 * S.par, -S.my * d * 12 * S.par - S.scroll * d * 0.25];

  // ───────────────────────────────────────────
  //  Drawing
  // ───────────────────────────────────────────
  const drawLayer = (L, t) => {
    const [ox, oy] = off(L.d);
    ctx.save(); ctx.translate(ox, oy);
    const ww = L.ws * .45, wh = L.ws * .36;
    let site = null;
    for (const b of L.bs) {
      if (b.construction) { site = b; continue; }
      const top = S.g - b.h, lit = b.lit || 0;
      if (lit > .02) ctx.drawImage(glow(hexA(b.edge, .32 * lit), 90), b.x + b.w / 2 - b.w, top - 30, b.w * 2, b.h + 60);
      ctx.fillStyle = L.body; ctx.fillRect(b.x, top, b.w, b.h + 80);
      if (lit > .02) { ctx.fillStyle = hexA(b.edge, .1 * lit); ctx.fillRect(b.x, top, b.w, b.h + 80); }
      ctx.globalAlpha = Math.min(1, L.ea + lit * .45); ctx.strokeStyle = b.edge; ctx.lineWidth = 1 + lit;
      if (lit > .05) { ctx.shadowColor = b.edge; ctx.shadowBlur = 14 * lit; }
      ctx.strokeRect(b.x + .5, top + .5, b.w - 1, b.h + 80); ctx.shadowBlur = 0;
      const dim = L.near ? 1 - .45 * S.focus * (1 - lit) : 1;
      ctx.globalAlpha = Math.min(1, L.wa * dim + lit * .2);
      for (const w of b.win) if (w.on || lit > .5) { ctx.fillStyle = w.col; ctx.fillRect(b.x + w.x, top + w.y, ww, wh); }
      ctx.globalAlpha = 1;
      if (b.antenna) {
        const ax = b.x + b.w * .5;
        ctx.strokeStyle = '#2b2d5c'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax, top); ctx.lineTo(ax, top - 26); ctx.stroke();
        if (reduce || (t % 1600) < 520) { ctx.drawImage(glow('rgba(255,40,60,.9)', 12), ax - 12, top - 38); ctx.fillStyle = '#ff3b4f'; ctx.fillRect(ax - 1.5, top - 28, 3, 3); }
      }
      if (b.store) {
        const sh = 26, sy = S.g - sh;
        ctx.drawImage(glow('rgba(140,240,255,.18)', 60), b.x + b.w / 2 - 60, sy - 40, 120, 120);
        ctx.globalAlpha = .55;
        ctx.fillStyle = '#9fc6cf'; ctx.fillRect(b.x + 6, sy, b.w - 12, sh);
        ctx.fillStyle = '#4fa9b4'; ctx.fillRect(b.x + 4, sy - 9, b.w - 8, 7); ctx.globalAlpha = 1;
        ctx.fillStyle = '#05303a'; ctx.font = '700 10px "Space Grotesk",sans-serif'; ctx.textBaseline = 'middle'; ctx.fillText('24 편의점', b.x + 10, sy + sh / 2);
      }
      if (b.sign) {
        const s = b.sign, im = s.img;
        if (!reduce && !s.glitch && Math.random() < .0022) s.glitch = t + R(200, 900);
        let a = .9 + .1 * Math.sin(t * .02 + s.ph);
        if (s.glitch) { if (t < s.glitch) a = Math.random() < .5 ? .12 : 1; else s.glitch = 0; }
        const jx = reduce ? 0 : Math.sin(t * .09 + s.ph) * .35;
        const sx = (s.side ? b.x + b.w - im.bw * .45 : b.x - im.bw * .55) - im.m + jx;
        ctx.globalAlpha = a * .6 * (L.near ? dim : 1); ctx.drawImage(im.cv, sx, top + s.dy - im.m, im.w, im.h); ctx.globalAlpha = 1;
      }
    }
    // Construction site last, so the BUILD YOURS sign is never covered by its neighbour on narrow screens
    if (site) drawConstruction(site, t);
    if (L.near) {
      drawStall(t);
      for (const b of L.bs) {
        if (b.lit <= .02 || b.construction) continue;
        const lab = S.labels[b.pid], top = S.g - b.h - (b.antenna ? 30 : 0);
        let lx = b.x + b.w / 2 - lab.w / 2;
        lx = Math.max(-ox - lab.m + 6, Math.min(S.W - ox - lab.w + lab.m - 6, lx));
        let ly = top - lab.h + lab.m - 8 - (1 - b.lit) * 6;
        if (S.W <= 600) {
          // Phones: never above subtitle bottom + 1.5em (the line the roofs already respect)
          ly = Math.max(ly, S.g - S.avail - oy - lab.m);
          // …and never over BUILD YOURS: if it would touch the sign, leave it out
          const sb = S.signBox, vx = lx + lab.m, vy = ly + lab.m;
          if (sb && vx < sb.x1 && vx + lab.vw > sb.x0 && vy < sb.y1 && vy + lab.vh > sb.y0) continue;
        }
        const fl = !reduce && b.tgt > 0 && b.lit < b.tgt * .85 && Math.random() < .35 ? .35 : 1;
        ctx.globalAlpha = b.lit * fl; ctx.drawImage(lab.cv, lx, ly, lab.w, lab.h); ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
  };

  const drawConstruction = (b, t) => {
    const lit = b.lit, x = b.x, w = b.w, top = S.g - b.h, doneTop = S.g - b.h * .5, Y = '#ffd700', lab = S.courseLab;
    const craneH = b.craneH, mastX = x + w * .86, cTop = top - craneH, jibY = cTop + 8;
    const hookX = x + w * .36, jL = hookX - 22, jR = mastX + Math.max(26, w * .28);
    ctx.drawImage(glow(hexA(Y, .1 + .22 * lit), 100), x - w * .5, cTop - 20, w * 2, b.h + craneH + 60);
    // Finished lower half
    ctx.fillStyle = '#17183e'; ctx.fillRect(x, doneTop, w, S.g - doneTop + 80);
    ctx.globalAlpha = .5 + .4 * lit; ctx.strokeStyle = Y; ctx.lineWidth = 1; ctx.strokeRect(x + .5, doneTop + .5, w - 1, S.g - doneTop + 80);
    ctx.globalAlpha = .75 + .25 * lit; for (const wn of b.win) { ctx.fillStyle = wn.col; ctx.fillRect(x + wn.x, top + wn.y, 7, 5); }
    // Steel frame: 4 columns × 3 floors, amber bracing, string lights
    const fh = (doneTop - top) / 3, bw = (w - 4) / 4;
    ctx.globalAlpha = 1; ctx.strokeStyle = '#3d4080'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (let k = 0; k <= 4; k++) { const X = x + 2 + k * bw; ctx.moveTo(X, doneTop); ctx.lineTo(X, top); }
    for (let f = 0; f <= 3; f++) { const yy = top + f * fh; ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); }
    ctx.stroke();
    ctx.strokeStyle = hexA(Y, .3 + .35 * lit); ctx.lineWidth = 1; ctx.beginPath();
    for (let f = 0; f < 3; f++) for (let k = 0; k < 4; k++) {
      const X = x + 2 + k * bw, Y0 = top + f * fh;
      if ((f + k) % 2) { ctx.moveTo(X, Y0); ctx.lineTo(X + bw, Y0 + fh); } else { ctx.moveTo(X + bw, Y0); ctx.lineTo(X, Y0 + fh); }
    }
    ctx.stroke();
    for (let f = 0; f < 3; f++) {
      const yy = top + f * fh;
      for (let X = x + 4; X < x + w - 2; X += 9) {
        ctx.globalAlpha = (reduce ? .8 : .55 + .45 * Math.sin(t * .006 + X * .7 + f)) * (.6 + .4 * lit);
        ctx.fillStyle = '#ffe9b8'; ctx.fillRect(X - 1, yy + 2, 2, 2);
      }
    }
    // Tower crane
    ctx.globalAlpha = .9; ctx.strokeStyle = '#c99a1a'; ctx.lineWidth = 1; ctx.beginPath();
    ctx.moveTo(mastX - 3, S.g); ctx.lineTo(mastX - 3, cTop); ctx.moveTo(mastX + 3, S.g); ctx.lineTo(mastX + 3, cTop);
    for (let y = S.g, s = 0; y > cTop + 8; y -= 8, s++) { ctx.moveTo(mastX + (s % 2 ? 3 : -3), y); ctx.lineTo(mastX + (s % 2 ? -3 : 3), y - 8); }
    ctx.moveTo(jL, jibY); ctx.lineTo(jR, jibY); ctx.moveTo(jL, jibY + 5); ctx.lineTo(mastX, jibY + 5);
    for (let X = jL, s = 0; X < mastX - 4; X += 8, s++) { ctx.moveTo(X, jibY + (s % 2 ? 0 : 5)); ctx.lineTo(X + 8, jibY + (s % 2 ? 5 : 0)); }
    ctx.moveTo(mastX, cTop - 14); ctx.lineTo(jL + 10, jibY); ctx.moveTo(mastX, cTop - 14); ctx.lineTo(jR, jibY); ctx.moveTo(mastX, cTop - 14); ctx.lineTo(mastX, jibY);
    ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = '#2a2d62'; ctx.fillRect(jR - 14, jibY, 14, 10);
    ctx.fillStyle = '#23255a'; ctx.fillRect(mastX - 7, jibY + 5, 14, 10); ctx.fillStyle = '#ffd98a'; ctx.fillRect(mastX - 5, jibY + 7, 6, 4);
    if (reduce || t % 1400 < 480) { ctx.drawImage(glow('rgba(255,40,60,.9)', 12), mastX - 12, cTop - 26); ctx.fillStyle = '#ff3b4f'; ctx.fillRect(mastX - 1.5, cTop - 16, 3, 3); }
    ctx.fillStyle = '#3d4080'; ctx.fillRect(hookX - 5, jibY + 3, 10, 4);
    // BUILD YOURS sign hanging from the hook: sway + soft pulse, no random flicker
    const sway = reduce ? 0 : Math.sin(t * .0011) * .05 + lit * Math.sin(t * .005) * .02;
    // Sign box (+6px for the sway), so phone name labels can keep clear of it
    S.signBox = { x0: hookX - lab.vw / 2 - 6, x1: hookX + lab.vw / 2 + 6, y0: jibY + 25 - 6, y1: jibY + 25 + lab.vh + 6 };
    ctx.save(); ctx.translate(hookX, jibY + 7); ctx.rotate(sway);
    ctx.strokeStyle = '#6a6da8'; ctx.lineWidth = 1; ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, 9); ctx.lineTo(-lab.vw * .35, 18); ctx.moveTo(0, 9); ctx.lineTo(lab.vw * .35, 18); ctx.stroke();
    const pulse = reduce ? .5 : .5 + .5 * Math.sin(t * .0021);
    ctx.drawImage(glow(hexA(Y, .4 + .14 * pulse + .2 * lit), 70), -lab.w * .6, -6, lab.w * 1.2, lab.h + 30);
    ctx.globalAlpha = 1;
    ctx.drawImage(lab.cv, -lab.w / 2, 18 - lab.m, lab.w, lab.h);
    ctx.globalAlpha = .1 + .1 * pulse + .15 * lit; ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(lab.cv, -lab.w / 2, 18 - lab.m, lab.w, lab.h);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.restore();
    // Welding sparks
    for (const p of S.sparks) { ctx.globalAlpha = Math.max(0, p.l); ctx.fillStyle = p.l > .6 ? '#fff' : Y; ctx.fillRect(p.x, p.y, 1.6, 1.6); }
    ctx.globalAlpha = 1;
    b.geo = { x0: Math.min(x, hookX - lab.vw / 2), x1: Math.max(x + w, jR), y0: cTop - 16 };
  };

  // 포장마차 street stall
  const drawStall = (t) => {
    const x = S.stall, y = S.g, w = 64;
    ctx.drawImage(glow('rgba(245,160,60,.55)', 70), x + w / 2 - 70, y - 70, 140, 120);
    ctx.fillStyle = '#e4572e'; ctx.beginPath(); ctx.moveTo(x - 6, y - 30); ctx.lineTo(x + w / 2, y - 44); ctx.lineTo(x + w + 6, y - 30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,190,110,.85)'; ctx.fillRect(x, y - 30, w, 30);
    ctx.fillStyle = '#3a1c08'; ctx.font = '700 11px "Noto Sans KR",sans-serif'; ctx.textBaseline = 'middle'; ctx.fillText('포장마차', x + 8, y - 15);
    if (!reduce) {
      for (let i = 0; i < 3; i++) {
        const p = ((t / 2400) + i / 3) % 1;
        ctx.globalAlpha = (1 - p) * .25; ctx.fillStyle = '#fff'; ctx.beginPath();
        ctx.arc(x + 20 + i * 10 + Math.sin(p * 6 + i) * 4, y - 46 - p * 30, 3 + p * 5, 0, 7); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };

  // Namsan Tower on its hill
  const drawTower = (t) => {
    const [ox, oy0] = off(.08), oy = oy0 + S.scroll * .08 * .25 - S.scroll * .04;
    const hill = S.hill, cx = S.W * .72 + ox, hillTop = S.g + 20 - hill + oy, th = S.towerH;
    ctx.fillStyle = '#0c0d27'; ctx.beginPath(); ctx.ellipse(cx, S.g + 20 + oy, S.W * .3, hill, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#1a1b46'; ctx.fillRect(cx - 4, hillTop - th * .7, 8, th * .7); ctx.fillRect(cx - 2, hillTop - th, 4, th * .3);
    ctx.strokeStyle = 'rgba(178,77,255,.55)'; ctx.lineWidth = 1; ctx.strokeRect(cx - 4, hillTop - th * .7, 8, th * .7);
    ctx.fillStyle = '#1e2050'; ctx.fillRect(cx - 15, hillTop - th * .74, 30, 12);
    ctx.fillStyle = '#b24dff'; ctx.globalAlpha = .8; ctx.fillRect(cx - 15, hillTop - th * .74 + 4, 30, 2.5); ctx.globalAlpha = 1;
    ctx.drawImage(glow('rgba(178,77,255,.35)', 40), cx - 40, hillTop - th * .74 - 34, 80, 80);
    ctx.strokeStyle = '#2a2c60'; ctx.beginPath(); ctx.moveTo(cx, hillTop - th); ctx.lineTo(cx, hillTop - th - 22); ctx.stroke();
    if (reduce || (t % 1800) < 600) { ctx.drawImage(glow('rgba(255,40,60,.95)', 14), cx - 14, hillTop - th - 36); ctx.fillStyle = '#ff4155'; ctx.fillRect(cx - 1.5, hillTop - th - 24, 3, 3); }
  };

  // Elevated rail: crosses every 19s in 7.5s
  const drawTrain = (t) => {
    const [ox, oy] = off(S.layers[1].d), yT = S.g - S.railH + oy;
    ctx.fillStyle = '#1a1b42'; ctx.fillRect(-100, yT, S.W + 200, 5);
    for (let x = ((ox % 140) + 140) % 140 - 140; x < S.W + 140; x += 140) ctx.fillRect(x, yT, 6, S.g - yT + 60);
    if (!S.cross) return;
    const loc = t % 19000;
    if (loc > 7500) return;
    const x0 = -440 + (loc / 7500) * (S.W + 880) + ox;
    for (let k = 0; k < 4; k++) {
      const cx = x0 - k * 104;
      ctx.fillStyle = '#23255a'; ctx.fillRect(cx, yT - 18, 100, 16);
      ctx.fillStyle = '#00f0ff'; ctx.fillRect(cx, yT - 18, 100, 1.5);
      ctx.fillStyle = '#ffd98a'; for (let w = 8; w < 92; w += 13) ctx.fillRect(cx + w, yT - 13, 7, 6);
    }
    ctx.drawImage(glow('rgba(210,250,255,.8)', 26), x0 + 86, yT - 36);
  };

  const draw = (t) => {
    const { W, H, g, P } = S;
    ctx.setTransform(P, 0, 0, P, 0, 0);
    ctx.fillStyle = S.sky; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#dfe3ff';
    for (const s of S.stars) { ctx.globalAlpha = reduce ? s.a : s.a * (.6 + .4 * Math.sin(t * .002 + s.p)); ctx.fillRect(s.x, s.y, 1.2, 1.2); }
    ctx.globalAlpha = 1;
    drawTower(t);
    ctx.fillStyle = 'rgba(8,8,30,.25)'; ctx.fillRect(0, 0, W, g + 60);
    drawLayer(S.layers[0], t);
    ctx.fillStyle = 'rgba(8,8,30,.3)'; ctx.fillRect(0, 0, W, g + 60);
    drawLayer(S.layers[1], t); drawTrain(t);
    ctx.fillStyle = S.haze; ctx.fillRect(0, g * .55, W, g * .45);
    drawLayer(S.layers[2], t);
    // Ground: neon line + cyan glow below
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, g, W, H - g);
    ctx.fillStyle = S.groundLine; ctx.fillRect(0, g, W, 1.5);
    ctx.fillStyle = S.groundGlow; ctx.fillRect(0, g, W, 26);
  };

  // ───────────────────────────────────────────
  //  Hover state → building light
  // ───────────────────────────────────────────
  const updateLit = (k) => {
    const A = getActive(), near = S.layers[2];
    if (!near) return;
    const auto = isAuto(), peak = auto ? .42 : 1;
    for (const b of near.bs) { b.tgt = b.pid === A ? peak : 0; b.lit += (b.tgt - b.lit) * k; }
    S.focus += ((A != null ? (auto ? .25 : 1) : 0) - S.focus) * k;
  };

  // Reduced motion: no loop, redraw a static frame on every state change
  const redraw = () => { if (reduce) { updateLit(1); draw(0); } };

  // Only the active project's card carries .card--tease
  const syncCards = () => {
    const A = getActive();
    projects.forEach((p, i) => p.card.classList.toggle('card--tease', i === A));
  };

  const setState = (patch) => {
    if (Object.keys(patch).every((k) => state[k] === patch[k])) return;
    Object.assign(state, patch);
    syncCards();
    redraw();
  };

  const setSceneHover = (id) => setState({ sceneHover: id });

  // ───────────────────────────────────────────
  //  Card → building: hover or focus on a card lights its building
  // ───────────────────────────────────────────
  projects.forEach((p, i) => {
    const enter = () => setState({ cardHover: i });
    const leave = () => { if (state.cardHover === i) setState({ cardHover: null }); };
    p.card.addEventListener('mouseenter', enter);
    p.card.addEventListener('mouseleave', leave);
    p.card.addEventListener('focusin', enter);
    p.card.addEventListener('focusout', (e) => { if (!p.card.contains(e.relatedTarget)) leave(); });
  });

  // Leaving the Projects tab drops card hover and tease
  if (projectsPanel && 'MutationObserver' in window) {
    new MutationObserver(() => {
      if (!onProjectsTab()) setState({ cardHover: null, tease: null });
    }).observe(projectsPanel, { attributes: true, attributeFilter: ['hidden'] });
  }

  // ───────────────────────────────────────────
  //  Auto-tease: after 2s, every 3s, one project at a time (dimmer than a real hover).
  //  Paused while the user hovers a building or a card, and outside the Projects tab.
  // ───────────────────────────────────────────
  if (!reduce) {
    let ti = -1;
    const teaseStep = () => {
      if (!isAuto() || !onProjectsTab()) return;
      ti = (ti + 1) % projects.length;
      setState({ tease: ti });
    };
    setTimeout(() => { teaseStep(); setInterval(teaseStep, 3000); }, 2000);
  }

  const hit = (cx, cy) => {
    const near = S.layers[2];
    if (!near) return null;
    const [ox, oy] = off(near.d), px = cx - ox, py = cy - oy;
    for (const b of near.bs) {
      if (b.construction) {
        const G = b.geo;
        if (G && px >= G.x0 && px <= G.x1 && py >= G.y0 && py <= S.g + 4) return 'course';
      } else if (px >= b.x - 4 && px <= b.x + b.w + 4 && py >= S.g - b.h - 34 && py <= S.g + 4) {
        return b.pid;
      }
    }
    return null;
  };

  const local = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };

  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const id = hit(...local(e));
    canvas.style.cursor = id != null ? 'pointer' : 'default';
    setSceneHover(id);
  });

  // Touch pointers "leave" as soon as the finger lifts: ignore it, or the first tap would never stick
  canvas.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'touch') return;
    canvas.style.cursor = 'default';
    setSceneHover(null);
  });

  // Touch: first tap lights the building, second tap navigates. Tap on empty sky clears.
  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const id = hit(...local(e));
    if (id == null) {
      if (e.pointerType === 'touch') setSceneHover(null);
      return;
    }
    if (e.pointerType === 'touch' && state.sceneHover !== id) { setSceneHover(id); return; }
    window.location.href = id === 'course' ? COURSE_URL : projects[id].href;
  });

  // ───────────────────────────────────────────
  //  Loop: single rAF, paused when the hero is off-screen or the tab is hidden
  // ───────────────────────────────────────────
  let last = performance.now();
  const frame = (t) => {
    requestAnimationFrame(frame);
    if (!S.visible || document.hidden) { last = t; return; }
    const dt = Math.min(50, t - last);
    last = t;
    S.mx += (S.tx - S.mx) * .06; S.my += (S.ty - S.my) * .06;
    S.scroll += (Math.min(window.scrollY, S.H) - S.scroll) * .2;
    updateLit(.16);
    for (const L of S.layers) {
      if (Math.random() < .6) { const b = pick(L.bs); if (b.win.length) { const w = pick(b.win); w.on = !w.on; } }
    }
    if (S.cb && Math.random() < .025) {
      const cb = S.cb, sx = cb.x + R(4, cb.w - 4), sy = S.g - cb.h + R(0, cb.h * .5);
      for (let k = 0; k < 7; k++) S.sparks.push({ x: sx, y: sy, vx: R(-.08, .08), vy: R(-.1, .02), l: 1 });
    }
    for (const p of S.sparks) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += .0004 * dt; p.l -= dt * .0018; }
    S.sparks = S.sparks.filter((p) => p.l > 0);
    draw(t);
  };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { S.visible = e.isIntersecting; }).observe(canvas);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { build(); redraw(); }, 150);
  });

  build();
  if (reduce) {
    redraw();
  } else {
    window.addEventListener('mousemove', (e) => {
      S.tx = e.clientX / window.innerWidth * 2 - 1;
      S.ty = e.clientY / window.innerHeight * 2 - 1;
    }, { passive: true });
    requestAnimationFrame(frame);
  }
  // Rebuild once webfonts are in, so canvas signs/labels use Space Grotesk & Noto Sans KR
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { build(); redraw(); });
})();
