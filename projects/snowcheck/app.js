/**
 * SnowCheck — Open-Meteo + scoring client-side. AI Proto Lab.
 */
(function () {
  'use strict';

  const STATIONS = {
    baqueira:      { name: 'Baqueira Beret',       lat: 42.70, lon: 0.93,  elevation: 1500, region: 'Pirineo Catalán',  km: 173 },
    masella:       { name: 'La Molina / Masella',  lat: 42.34, lon: 1.98,  elevation: 1700, region: 'Pirineo Catalán',  km: 145 },
    boitaull:      { name: 'Boí Taüll',            lat: 42.53, lon: 0.89,  elevation: 1600, region: 'Pirineo Catalán',  km: 45  },
    formigal:      { name: 'Formigal',              lat: 42.77, lon: -0.40, elevation: 1510, region: 'Pirineo Aragonés', km: 143 },
    cerler:        { name: 'Cerler',                lat: 42.60, lon: 0.53,  elevation: 1500, region: 'Pirineo Aragonés', km: 81  },
    astun:         { name: 'Astún — Candanchú',     lat: 42.79, lon: -0.52, elevation: 1700, region: 'Pirineo Aragonés', km: 101 },
    grandvalira:   { name: 'Grandvalira',           lat: 42.53, lon: 1.73,  elevation: 1710, region: 'Andorra',          km: 210 },
    vallnord:      { name: 'Vallnord — Pal Arinsal', lat: 42.57, lon: 1.48, elevation: 1550, region: 'Andorra',          km: 63  },
    ordino:        { name: 'Ordino Arcalís',        lat: 42.60, lon: 1.54,  elevation: 1940, region: 'Andorra',          km: 30  },
    sierra_nevada: { name: 'Sierra Nevada',         lat: 37.09, lon: -3.39, elevation: 2100, region: 'Sur de España',   km: 112 }
  };

  const WEBCAM_LINKS = {
    baqueira:      'https://www.baqueira.es/estacion/webcams',
    masella:       'https://www.masella.com/es/webcams',
    boitaull:      'https://www.boitaull.com/ca/webcams',
    formigal:      'https://www.aramon.com/estaciones/formigal-panticosa/webcams',
    cerler:        'https://www.aramon.com/estaciones/cerler/webcams',
    astun:         'https://astun.com/webcams',
    grandvalira:   'https://www.grandvalira.com/en/webcams',
    vallnord:      'https://www.vallnord.com/en/webcams',
    ordino:        'https://www.vallnord.com/en/ordino-arcalis/webcams',
    sierra_nevada: 'https://www.sierranevada.es/es/webcams'
  };

  const STATION_IDS = Object.keys(STATIONS);

  const API_BASE = 'https://api.open-meteo.com/v1/forecast';
  const LS_LAST = 'snowcheck_last_station';
  const LS_SLALOM_BEST = 'snowcheck_slalom_best';
  const FETCH_TIMESTAMP = 'snowcheck_fetch_ts';

  function getDayIndex() {
    var btn = document.querySelector('.day-btn.is-active');
    return btn ? parseInt(btn.getAttribute('data-day'), 10) : 0;
  }

  function getDateForDayIndex(daily, dayIndex) {
    if (!daily || !daily.time || !daily.time[dayIndex]) return null;
    return new Date(daily.time[dayIndex] + 'T12:00:00');
  }

  function getDayOfYear(d) {
    var start = new Date(d.getFullYear(), 0, 0);
    var diff = d - start;
    var oneDay = 864e5;
    return Math.floor(diff / oneDay);
  }

  function getDaysSinceSnow(daily, dayIndex) {
    if (!daily || !daily.snowfall_sum) return 99;
    var count = 0;
    for (var i = dayIndex - 1; i >= 0; i--) {
      if (daily.snowfall_sum[i] > 0) return count;
      count++;
    }
    return count;
  }

  function snowScore(day) {
    var snowfall24h = day.snowfall_sum != null ? day.snowfall_sum : 0;
    var snowDepthCm = (day.snow_depth_max != null ? day.snow_depth_max : 0) * 100;
    var tempMin = day.temperature_2m_min != null ? day.temperature_2m_min : 0;
    var s = 20;
    if (snowfall24h > 15) s = 100;
    else if (snowfall24h > 5) s = 75;
    else if (snowfall24h > 0) s = 50;
    if (tempMin > 0) s -= 20;
    if (snowDepthCm > 100) s += 20;
    return Math.max(0, Math.min(100, s));
  }

  function weatherScore(day) {
    var s = 100;
    var wind = day.windspeed_10m_max != null ? day.windspeed_10m_max : 0;
    var precipProb = day.precipitation_probability_max != null ? day.precipitation_probability_max : 0;
    var tempMax = day.temperature_2m_max != null ? day.temperature_2m_max : 0;
    if (wind > 60) s -= 40;
    else if (wind > 40) s -= 20;
    if (precipProb > 70) s -= 15;
    if (tempMax > 6) s -= 25;
    if (tempMax < -15) s -= 10;
    return Math.max(0, Math.min(100, s));
  }

  function crowdScore(date) {
    var s = 100;
    var dow = date.getDay();
    if (dow === 0 || dow === 6) s -= 35;
    else if (dow === 5) s -= 15;
    var doy = getDayOfYear(date);
    var day = date.getDate();
    var month = date.getMonth();
    if (doy >= 355 || doy <= 10) s -= 25;
    if (month === 3 && day >= 10 && day <= 20) s -= 25;
    if (month === 2 && day >= 15 && day <= 20) s -= 25;
    return Math.max(0, Math.min(100, s));
  }

  function baseScore(day) {
    var snowDepthCm = (day.snow_depth_max != null ? day.snow_depth_max : 0) * 100;
    if (snowDepthCm > 150) return 100;
    if (snowDepthCm > 100) return 80;
    if (snowDepthCm > 50) return 55;
    if (snowDepthCm > 20) return 30;
    return 10;
  }

  function totalScore(snow, weather, crowd, base) {
    return Math.round(snow * 0.35 + weather * 0.25 + crowd * 0.25 + base * 0.15);
  }

  function snowTypeText(day, daysSinceSnow) {
    var snowfall24h = day.snowfall_sum != null ? day.snowfall_sum : 0;
    var tempMin = day.temperature_2m_min != null ? day.temperature_2m_min : 0;
    var tempMax = day.temperature_2m_max != null ? day.temperature_2m_max : 0;
    if (snowfall24h > 10) return 'Nieve polvo ❄️';
    if (tempMin < -8 && tempMax < -2) return 'Nieve compactada 🏔️';
    if (tempMax > 2 && daysSinceSnow > 3) return 'Nieve primavera 🌞';
    if (tempMin < -2 && tempMax < 3) return 'Buen estado 👍';
    if (tempMax > 4) return 'Riesgo de barro ⚠️';
    return 'Buen estado 👍';
  }

  function verdict(total) {
    if (total >= 75) return '🟢 ¡Sal ya de casa!';
    if (total >= 50) return '🟡 Día aceptable, con matices';
    return '🔴 Hoy mejor quedarse en casa';
  }

  function buildDayFromDaily(daily, i) {
    return {
      snowfall_sum: daily.snowfall_sum && daily.snowfall_sum[i] != null ? daily.snowfall_sum[i] : 0,
      snow_depth_max: daily.snow_depth_max && daily.snow_depth_max[i] != null ? daily.snow_depth_max[i] : 0,
      temperature_2m_max: daily.temperature_2m_max && daily.temperature_2m_max[i] != null ? daily.temperature_2m_max[i] : 0,
      temperature_2m_min: daily.temperature_2m_min && daily.temperature_2m_min[i] != null ? daily.temperature_2m_min[i] : 0,
      windspeed_10m_max: daily.windspeed_10m_max && daily.windspeed_10m_max[i] != null ? daily.windspeed_10m_max[i] : 0,
      precipitation_probability_max: daily.precipitation_probability_max && daily.precipitation_probability_max[i] != null ? daily.precipitation_probability_max[i] : 0
    };
  }

  function fetchForecast(lat, lon) {
    var params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      daily: 'snowfall_sum,snow_depth_max,temperature_2m_max,temperature_2m_min,windspeed_10m_max,precipitation_probability_max',
      timezone: 'Europe/Madrid',
      forecast_days: '7'
    });
    return fetch(API_BASE + '?' + params.toString()).then(function (r) {
      if (!r.ok) throw new Error('API error');
      return r.json();
    });
  }

  function updateDataSource() {
    var ts = localStorage.getItem(FETCH_TIMESTAMP);
    var el = document.getElementById('dataSource');
    if (!el) return;
    if (!ts) {
      el.textContent = 'Datos: Open-Meteo';
      return;
    }
    var min = Math.floor((Date.now() - parseInt(ts, 10)) / 60000);
    if (min < 1) el.textContent = 'Datos: Open-Meteo · Actualizado ahora';
    else if (min === 1) el.textContent = 'Datos: Open-Meteo · Actualizado hace 1 min';
    else el.textContent = 'Datos: Open-Meteo · Actualizado hace ' + min + ' min';
  }

  function renderResult(stationId, daily, dayIndex) {
    var station = STATIONS[stationId];
    if (!station || !daily || !daily.daily) return;
    var d = daily.daily;
    var date = getDateForDayIndex(d, dayIndex);
    if (!date) return;

    var day = buildDayFromDaily(d, dayIndex);
    var daysSinceSnow = getDaysSinceSnow(d, dayIndex);
    var sSnow = snowScore(day);
    var sWeather = weatherScore(day);
    var sCrowd = crowdScore(date);
    var sBase = baseScore(day);
    var total = totalScore(sSnow, sWeather, sCrowd, sBase);
    var snowType = snowTypeText(day, daysSinceSnow);
    var verdictText = verdict(total);

    var snowDepthCm = (day.snow_depth_max || 0) * 100;
    var snowfall24h = day.snowfall_sum || 0;

    document.getElementById('scoreNumber').textContent = total;
    document.getElementById('stationTitle').textContent = station.name;
    document.getElementById('scoreVerdict').textContent = verdictText;
    document.getElementById('scoreSummary').textContent = snowType;

    var highlight = document.getElementById('snowfallHighlight');
    if (snowfall24h >= 5) {
      highlight.textContent = 'Nevó ' + Math.round(snowfall24h) + ' cm esta noche';
      highlight.classList.remove('hidden');
    } else {
      highlight.classList.add('hidden');
    }

    var meta = document.getElementById('stationMeta');
    var km = station.km;
    var hours = Math.round(km / 90);
    var dayLabel = dayIndex === 0 ? 'Hoy' : 'Mañana';
    meta.textContent = dayLabel + ' · ' + km + ' km · ~' + hours + ' h desde Barcelona';

    document.getElementById('valSnow').textContent = sSnow;
    document.getElementById('valWeather').textContent = sWeather;
    document.getElementById('valCrowd').textContent = sCrowd;
    document.getElementById('valBase').textContent = sBase;
    document.getElementById('barSnow').style.width = sSnow + '%';
    document.getElementById('barWeather').style.width = sWeather + '%';
    document.getElementById('barCrowd').style.width = sCrowd + '%';
    document.getElementById('barBase').style.width = sBase + '%';

    var weekGrid = document.getElementById('weekGrid');
    weekGrid.innerHTML = '';
    var bestIdx = 0;
    var bestScore = -1;
    for (var i = 0; i < 7; i++) {
      var di = buildDayFromDaily(d, i);
      var dt = getDateForDayIndex(d, i);
      var ds = getDaysSinceSnow(d, i);
      var ts = totalScore(snowScore(di), weatherScore(di), crowdScore(dt), baseScore(di));
      if (ts > bestScore) { bestScore = ts; bestIdx = i; }
    }
    var dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    for (var j = 0; j < 7; j++) {
      var dj = buildDayFromDaily(d, j);
      var dtj = getDateForDayIndex(d, j);
      var sc = totalScore(snowScore(dj), weatherScore(dj), crowdScore(dtj), baseScore(dj));
      var card = document.createElement('div');
      card.className = 'day-card' + (j === bestIdx ? ' best-day' : '');
      var dateJ = getDateForDayIndex(d, j);
      var dayName = dateJ ? dayNames[dateJ.getDay()] : '';
      var snowCm = ((dj.snow_depth_max != null ? dj.snow_depth_max : 0) * 100).toFixed(0);
      card.innerHTML =
        '<span class="day-name">' + dayName + '</span>' +
        '<span class="day-score">' + sc + '</span>' +
        '<span class="day-emoji">' + (dj.temperature_2m_max > 4 ? '🌧' : (dj.snowfall_sum > 2 ? '❄️' : '⛅')) + '</span>' +
        '<span class="day-snow">' + snowCm + ' cm</span>' +
        (j === bestIdx ? '<span class="day-badge">MEJOR DÍA</span>' : '');
      weekGrid.appendChild(card);
    }

    var compareGrid = document.getElementById('compareGrid');
    compareGrid.innerHTML = '';
    var others = STATION_IDS.filter(function (id) { return id !== stationId; });
    var shuffled = others.slice().sort(function () { return Math.random() - 0.5; });
    var two = shuffled.slice(0, 2);
    var comparePromises = two.map(function (id) {
      return fetchForecast(STATIONS[id].lat, STATIONS[id].lon).then(function (res) {
        var dd = res.daily;
        var day0 = buildDayFromDaily(dd, dayIndex);
        var date0 = getDateForDayIndex(dd, dayIndex);
        var sc = totalScore(snowScore(day0), weatherScore(day0), crowdScore(date0), baseScore(day0));
        var snowCm = ((day0.snow_depth_max || 0) * 100).toFixed(0);
        var tempMin = (day0.temperature_2m_min != null ? day0.temperature_2m_min : 0).toFixed(0);
        return { id: id, name: STATIONS[id].name, score: sc, snow: snowCm, tempMin: tempMin, km: STATIONS[id].km };
      });
    });
    Promise.all(comparePromises).then(function (rows) {
      rows.forEach(function (r) {
        var div = document.createElement('div');
        div.className = 'compare-card';
        div.innerHTML =
          '<div class="compare-name">' + r.name + '</div>' +
          '<div class="compare-row">Score: <span class="compare-score">' + r.score + '</span>/100</div>' +
          '<div class="compare-row">Nieve: ' + r.snow + ' cm · Mín: ' + r.tempMin + '°C · ' + r.km + ' km</div>';
        compareGrid.appendChild(div);
      });
    });

    var webcamGrid = document.getElementById('webcamGrid');
    var url = WEBCAM_LINKS[stationId] || '#';
    webcamGrid.innerHTML = '';
    ['Pista principal', 'Refugio', 'Base'].forEach(function (label) {
      var w = document.createElement('div');
      w.className = 'webcam-card';
      w.innerHTML = '<span class="webcam-label">' + label + '</span><a href="' + url + '" target="_blank" rel="noopener">Ver webcams</a>';
      webcamGrid.appendChild(w);
    });

    document.getElementById('resultWrap').classList.remove('hidden');
    document.getElementById('placeholderResult').classList.add('hidden');
    localStorage.setItem(LS_LAST, stationId);
    updateLastStationButton();
  }

  function updateLastStationButton() {
    var last = localStorage.getItem(LS_LAST);
    var wrap = document.getElementById('lastStationWrap');
    var btn = document.getElementById('lastStationBtn');
    if (!wrap || !btn) return;
    if (!last || !STATIONS[last]) {
      wrap.classList.add('hidden');
      return;
    }
    btn.textContent = 'Ver otra vez ' + STATIONS[last].name;
    wrap.classList.remove('hidden');
  }

  function runCheck() {
    var stationId = document.getElementById('stationSelect').value;
    if (!stationId || !STATIONS[stationId]) return;
    var station = STATIONS[stationId];
    var btn = document.getElementById('checkBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Cargando…'; }
    var dayIndex = getDayIndex();
    fetchForecast(station.lat, station.lon)
      .then(function (data) {
        localStorage.setItem(FETCH_TIMESTAMP, String(Date.now()));
        renderResult(stationId, data, dayIndex);
        updateDataSource();
      })
      .catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Consultar'; }
        alert('No se pudo cargar el pronóstico. Revisa la conexión.');
      })
      .then(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Consultar'; }
      });
  }

  function initShare() {
    var shareBtn = document.getElementById('shareBtn');
    if (!shareBtn) return;
    shareBtn.addEventListener('click', function () {
      var num = document.getElementById('scoreNumber').textContent;
      var title = document.getElementById('stationTitle').textContent;
      var verdictEl = document.getElementById('scoreVerdict');
      var dayLabel = getDayIndex() === 0 ? 'hoy' : 'mañana';
      var text = title + ' ' + dayLabel + ': ' + num + '/100 — ' + (verdictEl ? verdictEl.textContent : '') + ' ❄️ (SnowCheck)';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          shareBtn.textContent = '¡Copiado!';
          shareBtn.classList.add('copied');
          setTimeout(function () {
            shareBtn.textContent = 'Compartir';
            shareBtn.classList.remove('copied');
          }, 2000);
        });
      }
    });
  }

  function initDayToggle() {
    document.querySelectorAll('.day-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.day-btn').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
      });
    });
  }

  function initLastStation() {
    var btn = document.getElementById('lastStationBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var last = localStorage.getItem(LS_LAST);
      if (last && STATIONS[last]) {
        document.getElementById('stationSelect').value = last;
        runCheck();
      }
    });
  }

  function initSlalom() {
    var openBtn = document.getElementById('easterEggBtn');
    var modal = document.getElementById('gameModal');
    var closeBtn = document.querySelector('.js-close-game');
    var canvas = document.getElementById('slalomCanvas');
    var restartBtn = document.getElementById('gameRestart');
    var scoreDisplay = document.getElementById('scoreDisplay');
    var bestDisplay = document.getElementById('bestDisplay');
    if (!openBtn || !modal || !canvas || !restartBtn) return;

    var ctx = canvas.getContext('2d');
    var W = 340;
    var H = 480;
    var skierW = 24;
    var skierH = 32;
    var gateW = 80;
    var gateSpeed = 2;
    var treeW = 24;
    var skierX = W / 2 - skierW / 2;
    var skierY = H - skierH - 20;
    var gates = [];
    var trees = [];
    var score = 0;
    var best = parseInt(localStorage.getItem(LS_SLALOM_BEST), 10) || 0;
    var running = false;
    var animId = null;
    var left = false;
    var right = false;

    function setBest(v) {
      best = v;
      localStorage.setItem(LS_SLALOM_BEST, String(best));
      if (bestDisplay) bestDisplay.textContent = best;
    }
    if (bestDisplay) bestDisplay.textContent = best;

    function spawnGate() {
      var side = gates.length % 2 === 0 ? 0 : 1;
      var x = side === 0 ? 40 : W - 40 - gateW;
      gates.push({ x: x, y: -40, w: gateW, h: 30, color: gates.length % 2 === 0 ? '#e74c3c' : '#3498db', passed: false });
    }

    function spawnTree() {
      if (Math.random() < 0.35) {
        trees.push({ x: Math.random() * (W - treeW), y: -30, w: treeW, h: 40 });
      }
    }

    function inGate(sx, sy, g) {
      var overlapY = g.y < sy + skierH && g.y + g.h > sy;
      var overlapX = sx + skierW > g.x && sx < g.x + g.w;
      return overlapY && overlapX;
    }
    function gatePassedBelow(g, sy) {
      return g.y + g.h < sy;
    }

    function collidesSkierTree(t, sx, sy) {
      return sx + skierW > t.x && sx < t.x + t.w && sy + skierH > t.y && sy < t.y + t.h;
    }

    function gameOver() {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      if (score > best) setBest(score);
    }

    var lastSpawn = 0;
    var frameCount = 0;
    function loop() {
      if (!running) return;
      animId = requestAnimationFrame(loop);
      frameCount++;
      ctx.fillStyle = '#f0f6fa';
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#dce4ec';
      ctx.lineWidth = 2;
      for (var i = 0; i < W; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, H);
        ctx.stroke();
      }

      if (left) skierX = Math.max(0, skierX - 6);
      if (right) skierX = Math.min(W - skierW, skierX + 6);

      var now = frameCount;
      if (now - lastSpawn > 45) {
        lastSpawn = now;
        spawnGate();
        spawnTree();
        gateSpeed = Math.min(6, gateSpeed + 0.08);
      }

      gates = gates.filter(function (g) {
        g.y += gateSpeed;
        if (g.y > H) return false;
        if (!g.passed && inGate(skierX, skierY, g)) {
          g.passed = true;
          score += 10;
          if (scoreDisplay) scoreDisplay.textContent = score;
        }
        if (gatePassedBelow(g, skierY) && !g.passed) {
          gameOver();
          return false;
        }
        return true;
      });

      trees.forEach(function (t) {
        t.y += gateSpeed;
        if (collidesSkierTree(t, skierX, skierY)) gameOver();
      });
      trees = trees.filter(function (t) { return t.y < H; });

      gates.forEach(function (g) {
        ctx.fillStyle = g.color;
        ctx.fillRect(g.x, g.y, g.w, g.h);
      });
      trees.forEach(function (t) {
        ctx.fillStyle = '#1b5e20';
        ctx.fillRect(t.x, t.y, t.w, t.h);
      });
      ctx.fillStyle = '#3d8da6';
      ctx.fillRect(skierX, skierY, skierW, skierH);
    }

    function startGame() {
      gates = [];
      trees = [];
      score = 0;
      gateSpeed = 2;
      lastSpawn = 0;
      frameCount = 0;
      skierX = W / 2 - skierW / 2;
      skierY = H - skierH - 20;
      if (scoreDisplay) scoreDisplay.textContent = '0';
      running = true;
      loop();
    }

    openBtn.addEventListener('click', function () {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      startGame();
    });
    closeBtn.addEventListener('click', function () {
      gameOver();
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        gameOver();
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
    restartBtn.addEventListener('click', startGame);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); left = true; }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); right = true; }
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        gameOver();
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keyup', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') right = false;
    });
  }

  document.getElementById('checkBtn').addEventListener('click', runCheck);
  initDayToggle();
  initLastStation();
  initShare();
  updateDataSource();
  updateLastStationButton();
  initSlalom();
})();
