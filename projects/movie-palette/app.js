(function () {
  'use strict';

  /* Palettes from the most iconic posters people remember */
  var MOVIES = {
    'pulp-fiction': { name: 'Pulp Fiction', year: '1994', palette: ['#0D0D0D', '#F5C518', '#B22222', '#2A2A2A', '#F8F0E3'] },
    'forrest-gump': { name: 'Forrest Gump', year: '1994', palette: ['#2E7D32', '#5DADE2', '#FFFFFF', '#8B4513', '#D4E157'] },
    'big-fish': { name: 'Big Fish', year: '2003', palette: ['#E8B923', '#1B5E20', '#5D4037', '#FFF8E1', '#2E7D32'] },
    'grand-budapest-hotel': { name: 'The Grand Budapest Hotel', year: '2014', palette: ['#E8B4B8', '#5C4B7B', '#C9A227', '#F5F0E6', '#9C27B0'] },
    'amelie': { name: 'Amélie', year: '2001', palette: ['#2E7D32', '#C62828', '#1A1A1A', '#8D6E63', '#FFEBEE'] },
    'john-wick': { name: 'John Wick', year: '2014', palette: ['#0D0D0D', '#8B0000', '#2A2A2A', '#B22222', '#D4AF37'] },
    'la-la-land': { name: 'La La Land', year: '2016', palette: ['#1565C0', '#FFC107', '#FFFFFF', '#0D47A1', '#FFD54F'] },
    'her': { name: 'Her', year: '2013', palette: ['#E64A19', '#E8A0A0', '#5D4037', '#BCAAA4', '#FFF3E0'] },
    'the-matrix': { name: 'The Matrix', year: '1999', palette: ['#00FF41', '#0D0D0D', '#001A00', '#00E676', '#1B5E20'] },
    'moonrise-kingdom': { name: 'Moonrise Kingdom', year: '2012', palette: ['#F9A825', '#E65100', '#C62828', '#1A237E', '#FFF8E1'] },
    'the-fall': { name: 'The Fall', palette: ['#006064', '#D84315', '#0D47A1', '#4A148C', '#C9A227'] },
    'gladiator': { name: 'Gladiator', year: '2000', palette: ['#8B4513', '#D4A574', '#C9A227', '#5D4037', '#1A0A0A'] }
  };

  var movieSelect = document.getElementById('movie-select');
  var palettePlaceholder = document.getElementById('palette-placeholder');
  var paletteWrap = document.getElementById('palette-wrap');
  var paletteTitle = document.getElementById('palette-title');
  var swatchesEl = document.getElementById('swatches');
  var downloadBtn = document.getElementById('download-palette');
  var currentMovieId = null;

  function getLuminance(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255;
    var g = parseInt(hex.slice(3, 5), 16) / 255;
    var b = parseInt(hex.slice(5, 7), 16) / 255;
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function copyHex(hex) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) return;
    navigator.clipboard.writeText(hex).then(function () {
      var btn = document.querySelector('[data-copy-hex="' + hex + '"]');
      if (btn) {
        var orig = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('swatch-copy--done');
        setTimeout(function () { btn.textContent = orig; btn.classList.remove('swatch-copy--done'); }, 1200);
      }
      var parent = btn && btn.closest('.swatch');
      if (parent) {
        parent.classList.add('swatch--copied');
        setTimeout(function () { parent.classList.remove('swatch--copied'); }, 500);
      }
    });
  }

  function renderPalette(movieId) {
    var movie = MOVIES[movieId];
    if (!movie) {
      palettePlaceholder.hidden = false;
      paletteWrap.hidden = true;
      currentMovieId = null;
      if (downloadBtn) downloadBtn.hidden = true;
      return;
    }
    currentMovieId = movieId;
    palettePlaceholder.hidden = true;
    paletteWrap.hidden = false;
    paletteTitle.textContent = movie.year ? movie.name + ' (' + movie.year + ')' : movie.name;
    swatchesEl.innerHTML = '';
    movie.palette.forEach(function (hex, i) {
      var isDark = getLuminance(hex) < 0.4;
      var swatch = document.createElement('div');
      swatch.className = 'swatch';
      swatch.style.setProperty('--swatch-color', hex);
      swatch.style.animationDelay = (i * 0.08) + 's';
      var copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'swatch-copy ' + (isDark ? 'swatch-copy--light' : 'swatch-copy--dark');
      copyBtn.setAttribute('data-copy-hex', hex);
      copyBtn.textContent = hex;
      copyBtn.setAttribute('aria-label', 'Copy ' + hex);
      copyBtn.addEventListener('click', function () { copyHex(hex); });
      swatch.appendChild(copyBtn);
      swatchesEl.appendChild(swatch);
    });

    if (downloadBtn) downloadBtn.hidden = false;
  }

  function downloadPaletteAsJpeg(movieId) {
    var movie = MOVIES[movieId];
    if (!movie) return;

    var width = 800;
    var height = 420;
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#e8e8f0';
    ctx.font = '28px \"Space Grotesk\", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    var title = movie.year ? movie.name + ' (' + movie.year + ')' : movie.name;
    ctx.fillText(title, 28, 28);

    var swatchCount = movie.palette.length;
    var marginX = 32;
    var top = 120;
    var swatchHeight = 180;
    var gap = 12;
    var totalWidth = width - marginX * 2;
    var swatchWidth = (totalWidth - gap * (swatchCount - 1)) / swatchCount;

    movie.palette.forEach(function (hex, index) {
      var x = marginX + index * (swatchWidth + gap);
      ctx.fillStyle = hex;
      ctx.fillRect(x, top, swatchWidth, swatchHeight);

      ctx.fillStyle = getLuminance(hex) < 0.4 ? 'rgba(255,255,255,0.9)' : 'rgba(10,10,26,0.9)';
      ctx.font = '14px \"Space Grotesk\", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(hex, x + swatchWidth / 2, top + swatchHeight / 2);
    });

    var dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    var link = document.createElement('a');
    link.href = dataUrl;
    link.download = (movie.name + '-palette').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (movieSelect) movieSelect.addEventListener('change', function () { renderPalette(movieSelect.value || null); });
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      if (!currentMovieId) return;
      downloadPaletteAsJpeg(currentMovieId);
    });
  }
})();
