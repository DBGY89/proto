(function () {
  'use strict';

  var MOVIES = {
    'pulp-fiction': {
      name: 'Pulp Fiction',
      year: '1994',
      palette: ['#1A1A1A', '#D4A84B', '#8B0000', '#2C1810', '#F5E6C8']
    },
    'forrest-gump': {
      name: 'Forrest Gump',
      year: '1994',
      palette: ['#2D5016', '#8B4513', '#87CEEB', '#F5DEB3', '#FFFFFF']
    },
    'big-fish': {
      name: 'Big Fish',
      year: '2003',
      palette: ['#E8C547', '#2E5E3A', '#8B7355', '#D4A574', '#1C2841']
    },
    'grand-budapest-hotel': {
      name: 'The Grand Budapest Hotel',
      year: '2014',
      palette: ['#E8B4B8', '#6C5B7B', '#C9A959', '#F8F4E3', '#2C1810']
    },
    'amelie': {
      name: 'Amélie',
      year: '2001',
      palette: ['#2D5016', '#C41E3A', '#DEB887', '#8B4513', '#FFE4B5']
    },
    'blade-runner-2049': {
      name: 'Blade Runner 2049',
      year: '2017',
      palette: ['#E07C4C', '#1A1A2E', '#16213E', '#0F3460', '#E8D5B7']
    },
    'la-la-land': {
      name: 'La La Land',
      year: '2016',
      palette: ['#1E3A5F', '#D4AF37', '#C41E3A', '#2D2D2D', '#F5F5DC']
    },
    'her': {
      name: 'Her',
      year: '2013',
      palette: ['#E07C4C', '#D4A574', '#8B7355', '#2C1810', '#F5E6C8']
    },
    'the-matrix': {
      name: 'The Matrix',
      year: '1999',
      palette: ['#003300', '#00FF00', '#001100', '#0D1F0D', '#00CC00']
    },
    'moonrise-kingdom': {
      name: 'Moonrise Kingdom',
      year: '2012',
      palette: ['#F4D03F', '#E67E22', '#2C3E50', '#ECF0F1', '#C0392B']
    }
  };

  var movieSelect = document.getElementById('movie-select');
  var palettePlaceholder = document.getElementById('palette-placeholder');
  var paletteWrap = document.getElementById('palette-wrap');
  var paletteTitle = document.getElementById('palette-title');
  var swatchesEl = document.getElementById('swatches');

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
        setTimeout(function () {
          btn.textContent = orig;
          btn.classList.remove('swatch-copy--done');
        }, 1200);
      }
    });
  }

  function renderPalette(movieId) {
    var movie = MOVIES[movieId];
    if (!movie) {
      palettePlaceholder.hidden = false;
      paletteWrap.hidden = true;
      return;
    }

    palettePlaceholder.hidden = true;
    paletteWrap.hidden = false;
    paletteTitle.textContent = movie.name + ' (' + movie.year + ')';
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

      copyBtn.addEventListener('click', function () {
        copyHex(hex);
        var parent = copyBtn.closest('.swatch');
        if (parent) {
          parent.classList.add('swatch--copied');
          setTimeout(function () { parent.classList.remove('swatch--copied'); }, 500);
        }
      });

      swatch.appendChild(copyBtn);
      swatchesEl.appendChild(swatch);
    });
  }

  function onMovieChange() {
    var id = movieSelect.value;
    renderPalette(id || null);
  }

  if (movieSelect) movieSelect.addEventListener('change', onMovieChange);
})();
