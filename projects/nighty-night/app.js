(function () {
  'use strict';

  var CHARACTERS = {
    bunny: { name: 'Bunny', emoji: '🐰' },
    bear: { name: 'Bear', emoji: '🐻' },
    kitty: { name: 'Kitty', emoji: '🐱' },
    puppy: { name: 'Puppy', emoji: '🐶' },
    owl: { name: 'Owl', emoji: '🦉' }
  };

  // Stories for little kids. {name} is replaced with the character. theme: moon | friend | cozy. length: short (3-4) | long (5-7).
  var STORIES = [
    { theme: 'moon', length: 'short', lines: [
      'One night, {name} looked out the window.',
      'The moon was big and round and friendly.',
      '{name} said, "Good night, moon!"',
      'Then {name} went to bed and slept all night.'
    ]},
    { theme: 'moon', length: 'short', lines: [
      'The stars came out. {name} waved at them.',
      '{name} lay down and pulled the blanket up.',
      'The stars twinkled. {name} smiled.',
      'And then {name} fell asleep. The end.'
    ]},
    { theme: 'moon', length: 'long', lines: [
      'When the sky turned dark, {name} went to the window.',
      'The moon was smiling. The stars were blinking.',
      '{name} said good night to the moon and every star.',
      'Then {name} got into bed with a happy heart.',
      'Under the soft blanket, {name} closed their eyes.',
      'Sweet dreams, little one. Good night.'
    ]},
    { theme: 'friend', length: 'short', lines: [
      '{name} had a favorite teddy.',
      'Every night {name} gave the teddy a hug.',
      'Then {name} and teddy went to sleep together.',
      'What a good night!'
    ]},
    { theme: 'friend', length: 'short', lines: [
      '{name} and a little friend played all day.',
      'When it got dark, they were both tired.',
      'They shared a pillow and a warm blanket.',
      'Good night, friends!'
    ]},
    { theme: 'friend', length: 'long', lines: [
      '{name} had a best friend who loved to play.',
      'At bedtime they both put on pajamas.',
      'They brushed their teeth and hopped into bed.',
      'They told each other one small secret.',
      'Then they closed their eyes and dreamed together.',
      'The end. Sleep tight, you two!'
    ]},
    { theme: 'cozy', length: 'short', lines: [
      'Once upon a time, {name} was very sleepy.',
      '{name} found a soft blanket and a fluffy pillow.',
      '{name} closed their eyes and had sweet dreams.',
      'Good night, {name}!'
    ]},
    { theme: 'cozy', length: 'short', lines: [
      '{name} had a long, happy day.',
      'Now it was time to rest.',
      '{name} curled up in a cozy spot.',
      'Soon {name} was fast asleep. Shhh!'
    ]},
    { theme: 'cozy', length: 'short', lines: [
      'Little {name} was tired and ready for bed.',
      '{name} brushed their teeth and put on pajamas.',
      'Then {name} hopped under the covers.',
      'Sleep tight, {name}!'
    ]},
    { theme: 'cozy', length: 'short', lines: [
      'It was dark and quiet. {name} felt safe.',
      '{name} closed their eyes and thought happy thoughts.',
      'Soon {name} was dreaming of nice things.',
      'Good night, little one.'
    ]},
    { theme: 'cozy', length: 'short', lines: [
      '{name} yawned a big yawn.',
      '"Time for bed," said {name}.',
      'So {name} went to bed and fell asleep.',
      'Sweet dreams!'
    ]},
    { theme: 'cozy', length: 'long', lines: [
      '{name} had the coziest bed in the whole world.',
      'Soft sheets, a fluffy pillow, and a warm blanket.',
      '{name} got in and wiggled their toes.',
      'Then {name} pulled the blanket up to their chin.',
      'The room was quiet. {name} felt so safe.',
      'Eyes closed. Sweet dreams. Good night.'
    ]}
  ];

  var characterOptions = document.getElementById('character-options');
  var themeOptions = document.getElementById('theme-options');
  var lengthOptions = document.getElementById('length-options');
  var btnGenerate = document.getElementById('btn-generate');
  var storyPlaceholder = document.getElementById('story-placeholder');
  var storyCard = document.getElementById('story-card');
  var storyBody = document.getElementById('story-body');
  var storyEnd = document.getElementById('story-end');
  var btnAgain = document.getElementById('btn-again');
  var themeToggle = document.getElementById('theme-toggle');
  var htmlRoot = document.getElementById('html-root');

  var selectedCharacter = null;
  var selectedTheme = null;  // null = any
  var selectedLength = 'short';

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function setCharacter(key) {
    selectedCharacter = key;
    if (!characterOptions) return;
    characterOptions.querySelectorAll('.option-chip[data-character]').forEach(function (btn) {
      var val = btn.getAttribute('data-character');
      btn.classList.toggle('selected', val === key);
      btn.setAttribute('aria-pressed', val === key ? 'true' : 'false');
    });
    if (btnGenerate) btnGenerate.disabled = !key;
  }

  function setTheme(key) {
    selectedTheme = key;
    if (!themeOptions) return;
    themeOptions.querySelectorAll('.option-chip[data-theme]').forEach(function (btn) {
      var val = btn.getAttribute('data-theme');
      btn.classList.toggle('selected', val === key);
      btn.setAttribute('aria-pressed', val === key ? 'true' : 'false');
    });
  }

  function setLength(key) {
    selectedLength = key;
    if (!lengthOptions) return;
    lengthOptions.querySelectorAll('.option-chip[data-length]').forEach(function (btn) {
      var val = btn.getAttribute('data-length');
      btn.classList.toggle('selected', val === key);
      btn.setAttribute('aria-pressed', val === key ? 'true' : 'false');
    });
  }

  function getFilteredStories() {
    return STORIES.filter(function (s) {
      var matchTheme = !selectedTheme || s.theme === selectedTheme;
      var matchLength = s.length === selectedLength;
      return matchTheme && matchLength;
    });
  }

  function getStoryText(name) {
    var candidates = getFilteredStories();
    if (candidates.length === 0) candidates = STORIES;
    var story = pickRandom(candidates);
    return story.lines.map(function (line) {
      return line.replace(/\{name\}/g, name);
    }).join('\n\n');
  }

  function generate() {
    if (!selectedCharacter) return;
    var character = CHARACTERS[selectedCharacter];
    if (!character) return;

    var text = getStoryText(character.name);
    storyBody.textContent = text;

    storyPlaceholder.classList.add('hidden');
    storyCard.classList.remove('hidden');
  }

  function reset() {
    storyCard.classList.add('hidden');
    storyPlaceholder.classList.remove('hidden');
    storyBody.textContent = '';
  }

  // ─── Theme (dark/light) ───
  var STORAGE_KEY = 'nighty-night-theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      if (theme) localStorage.setItem(STORAGE_KEY, theme);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function applyTheme(theme, persist) {
    if (!htmlRoot) return;
    var value = theme || 'dark';
    htmlRoot.setAttribute('data-theme', value);
    if (persist) setStoredTheme(value);
  }

  function toggleTheme() {
    var current = htmlRoot.getAttribute('data-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  }

  (function initTheme() {
    var stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored, false);
    } else {
      var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      applyTheme(prefersLight ? 'light' : 'dark', false);
    }
  })();

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // ─── Event listeners ───
  if (characterOptions) {
    characterOptions.addEventListener('click', function (e) {
      var btn = e.target.closest('.option-chip[data-character]');
      if (btn) setCharacter(btn.getAttribute('data-character'));
    });
  }

  if (themeOptions) {
    themeOptions.addEventListener('click', function (e) {
      var btn = e.target.closest('.option-chip[data-theme]');
      if (btn) setTheme(btn.getAttribute('data-theme'));
    });
  }

  if (lengthOptions) {
    lengthOptions.addEventListener('click', function (e) {
      var btn = e.target.closest('.option-chip[data-length]');
      if (btn) setLength(btn.getAttribute('data-length'));
    });
  }

  if (btnGenerate) btnGenerate.addEventListener('click', generate);
  if (btnAgain) btnAgain.addEventListener('click', reset);

  // Default length selection
  setLength('short');
})();
