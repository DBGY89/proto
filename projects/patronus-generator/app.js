(function () {
  'use strict';

  var PATRONUS_MAP = {
    sofa_humor: [
      { emoji: '🐱', name: 'Cat', desc: 'You don\'t chase the crown — the crown is the couch. Everyone else is just visiting your kingdom.' },
      { emoji: '🐹', name: 'Hamster', desc: 'Nap, snack, run in a circle, repeat. You\'ve cracked the code and you\'re not sharing.' }
    ],
    sofa_silence: [
      { emoji: '🦉', name: 'Owl', desc: 'By day you\'re "maybe busy." By night you\'re the one who actually read the group chat.' },
      { emoji: '🦇', name: 'Bat', desc: 'You thrive when the world goes quiet. Also when the snacks come out. Coincidence? No.' }
    ],
    sofa_hug: [
      { emoji: '🐕', name: 'Dog', desc: 'You\'d take a bullet for your people. You\'d also steal their spot on the sofa. Priorities.' },
      { emoji: '🐰', name: 'Hare', desc: 'Soft to the touch, chaos in motion. You hug hard and then vanish into the next drama.' }
    ],
    sofa_stare: [
      { emoji: '🐈‍⬛', name: 'Black cat', desc: 'One look and the room knows who\'s in charge. You didn\'t say a word. You didn\'t have to.' },
      { emoji: '🐍', name: 'Serpent', desc: 'You don\'t rush. You wait. Then you take the last slice. Nobody saw it coming. Everyone saw it coming.' }
    ],
    nature_humor: [
      { emoji: '🦊', name: 'Fox', desc: 'Too clever for the woods, too wild for the suburbs. You make it work and look good doing it.' },
      { emoji: '🐒', name: 'Monkey', desc: 'You find the punchline in everything. Sometimes you are the punchline. You\'re fine with both.' }
    ],
    nature_silence: [
      { emoji: '🦌', name: 'Stag', desc: 'You don\'t need to announce yourself. You walk in and the vibe shifts. That\'s not arrogance — it\'s math.' },
      { emoji: '🦫', name: 'Beaver', desc: 'While others debate the plan, you\'ve already built the dam. Quiet efficiency is your love language.' }
    ],
    nature_hug: [
      { emoji: '🦦', name: 'Otter', desc: 'You hold hands while you sleep so nobody floats away. The world needs more of that. And more of you.' },
      { emoji: '🐼', name: 'Panda', desc: 'You eat, you nap, you hug. If that\'s not a full personality, we don\'t want a full personality.' }
    ],
    nature_stare: [
      { emoji: '🐺', name: 'Wolf', desc: 'You don\'t raise your voice. You lower the temperature. One look and the meeting runs on time.' },
      { emoji: '🦅', name: 'Eagle', desc: 'You see the full picture while everyone\'s still squabbling over the corner piece. It shows.' }
    ],
    party_humor: [
      { emoji: '🐬', name: 'Dolphin', desc: 'You\'re the one who gets everyone dancing. Also the one who remembers who needs a ride home. Legend.' },
      { emoji: '🦜', name: 'Parrot', desc: 'You repeat the best bits until they stick. Some call it annoying. Those people have no joy.' }
    ],
    party_silence: [
      { emoji: '🦅', name: 'Phoenix', desc: 'You left at 11. You\'re back at midnight, reborn. Nobody knows how. You don\'t explain. You just glow.' },
      { emoji: '🦋', name: 'Butterfly', desc: 'You flit in, make an impression, flit out. Next week they\'re still talking about you. As intended.' }
    ],
    party_hug: [
      { emoji: '🦄', name: 'Unicorn', desc: 'Rare, a bit extra, and everyone wants a photo. You lean in. That\'s not vanity — that\'s generosity.' },
      { emoji: '🐘', name: 'Elephant', desc: 'You never forget. You never let them forget either. Your hugs are memorable. So are your receipts.' }
    ],
    party_stare: [
      { emoji: '🐉', name: 'Dragon', desc: 'The music stops. You didn\'t say anything. You didn\'t have to. That\'s not intimidation — that\'s presence.' },
      { emoji: '🦁', name: 'Lion', desc: 'You don\'t ask for the aux. You take it. The room is better for it. They\'ll admit it later.' }
    ],
    kitchen_humor: [
      { emoji: '🦝', name: 'Raccoon', desc: 'You know exactly what\'s in the fridge at 2 a.m. and you\'re not sorry. You made it work. It\'s art.' },
      { emoji: '🐧', name: 'Penguin', desc: 'Formal on the outside, pure chaos within. You bring the vibe and the leftovers. Both are appreciated.' }
    ],
    kitchen_silence: [
      { emoji: '🦔', name: 'Hedgehog', desc: 'You\'ve built a fortress of snacks and silence. Someone\'s at the door? You\'re "in a meeting."' },
      { emoji: '🐢', name: 'Tortoise', desc: 'Slow is smooth, smooth is fast. You got there. Everyone else is still arguing about the route.' }
    ],
    kitchen_hug: [
      { emoji: '🐻', name: 'Bear', desc: 'You could crush them. You choose to crush them with love. And maybe a shared plate. That\'s power.' },
      { emoji: '🦙', name: 'Llama', desc: 'You stand tall, you spit when necessary, and you show up for the people who matter. Icon behaviour.' }
    ],
    kitchen_stare: [
      { emoji: '🦁', name: 'Lion', desc: 'That\'s your chair. That\'s your snack. You didn\'t say it. They knew. Leadership.' },
      { emoji: '🐯', name: 'Tiger', desc: 'You walk in. The room recalibrates. You didn\'t ask for that. You earned it. Now pass the dip.' }
    ]
  };

  var optionsQ1 = document.getElementById('options-q1');
  var optionsQ2 = document.getElementById('options-q2');
  var btnReveal = document.getElementById('btn-reveal');
  var patronusVoid = document.getElementById('patronus-void');
  var patronusRevealed = document.getElementById('patronus-revealed');
  var patronusEmoji = document.getElementById('patronus-emoji');
  var patronusName = document.getElementById('patronus-name');
  var patronusDesc = document.getElementById('patronus-desc');
  var shareWrap = document.getElementById('share-wrap');
  var shareX = document.getElementById('share-x');
  var shareWa = document.getElementById('share-wa');
  var shareCopy = document.getElementById('share-copy');

  var state = { q1: null, q2: null };
  var currentPatronus = null;

  function getSelected(key) {
    return state[key];
  }

  function setSelected(key, value) {
    state[key] = value;
    updateChips();
    updateRevealButton();
  }

  function updateChips() {
    [optionsQ1, optionsQ2].forEach(function (container, i) {
      var q = i + 1;
      var key = q === 1 ? 'q1' : 'q2';
      var selected = state[key];
      if (!container) return;
      Array.prototype.forEach.call(container.querySelectorAll('.option-chip'), function (btn) {
        var val = btn.getAttribute('data-value');
        btn.classList.toggle('selected', val === selected);
        btn.setAttribute('aria-pressed', val === selected ? 'true' : 'false');
      });
    });
  }

  function updateRevealButton() {
    if (!btnReveal) return;
    var both = state.q1 && state.q2;
    btnReveal.disabled = !both;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function reveal() {
    var q1 = getSelected('q1');
    var q2 = getSelected('q2');
    if (!q1 || !q2) return;

    var key = q1 + '_' + q2;
    var options = PATRONUS_MAP[key] || PATRONUS_MAP.sofa_humor;
    var patronus = Array.isArray(options) ? pickRandom(options) : options;

    currentPatronus = patronus;
    patronusEmoji.textContent = patronus.emoji;
    patronusName.textContent = patronus.name;
    patronusDesc.textContent = patronus.desc;

    updateShareLinks(patronus);
    if (patronusVoid) patronusVoid.hidden = true;
    if (patronusRevealed) patronusRevealed.hidden = false;
    if (shareWrap) shareWrap.hidden = false;
  }

  function getShareText(patronus) {
    return 'My Patronus is a ' + patronus.name + ' ' + patronus.emoji + ' — ' + patronus.desc;
  }

  function getShareUrl() {
    return typeof window !== 'undefined' && window.location ? window.location.href : '';
  }

  function updateShareLinks(patronus) {
    var text = encodeURIComponent(getShareText(patronus) + ' Discover yours: ' + getShareUrl());
    if (shareX) {
      shareX.href = 'https://twitter.com/intent/tweet?text=' + text;
    }
    if (shareWa) {
      shareWa.href = 'https://wa.me/?text=' + text;
    }
  }

  function copyShareLink() {
    if (!currentPatronus) return;
    var text = getShareText(currentPatronus) + ' Discover yours: ' + getShareUrl();
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      if (shareCopy) {
        var origLabel = shareCopy.getAttribute('aria-label');
        shareCopy.setAttribute('aria-label', 'Copied!');
        setTimeout(function () { shareCopy.setAttribute('aria-label', origLabel || 'Copy link'); }, 1500);
      }
    });
  }

  if (optionsQ1) {
    optionsQ1.addEventListener('click', function (e) {
      var btn = e.target.closest('.option-chip[data-q="1"]');
      if (btn) setSelected('q1', btn.getAttribute('data-value'));
    });
  }

  if (optionsQ2) {
    optionsQ2.addEventListener('click', function (e) {
      var btn = e.target.closest('.option-chip[data-q="2"]');
      if (btn) setSelected('q2', btn.getAttribute('data-value'));
    });
  }

  if (btnReveal) btnReveal.addEventListener('click', reveal);
  if (shareCopy) shareCopy.addEventListener('click', copyShareLink);

  updateRevealButton();
})();
