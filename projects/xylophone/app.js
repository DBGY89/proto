(function () {
  'use strict';

  var NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B', "C′"];
  var FREQS = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

  var SONGS = {
    dynamite: {
      name: 'Dynamite',
      artist: 'BTS',
      noteLength: 320,
      notes: [4, 4, 5, 6, 6, 5, 4, 3, 2, 2, 3, 4, 4, 3, 3, 4, 4, 5, 6, 6, 5, 4, 3, 2, 2, 3, 4, 3, 2, 2]
    },
    butter: {
      name: 'Butter',
      artist: 'BTS',
      noteLength: 340,
      notes: [5, 4, 3, 4, 5, 5, 5, 4, 4, 4, 5, 6, 5, 4, 3, 2, 3, 4, 4, 3, 3]
    },
    'how-you-like-that': {
      name: 'How You Like That',
      artist: 'BLACKPINK',
      noteLength: 380,
      notes: [2, 2, 2, 3, 4, 4, 4, 3, 2, 0, 2, 2, 3, 4, 4, 3, 2, 2]
    },
    'ddu-du': {
      name: 'DDU-DU DDU-DU',
      artist: 'BLACKPINK',
      noteLength: 300,
      notes: [4, 4, 5, 4, 3, 2, 2, 3, 4, 4, 3, 2, 2, 3, 4, 5, 4, 4]
    },
    'boy-with-luv': {
      name: 'Boy With Luv',
      artist: 'BTS',
      noteLength: 360,
      notes: [5, 6, 5, 4, 4, 3, 4, 5, 5, 4, 3, 2, 3, 4, 4, 3, 2, 2]
    },
    'kill-this-love': {
      name: 'Kill This Love',
      artist: 'BLACKPINK',
      noteLength: 400,
      notes: [4, 4, 4, 3, 2, 2, 3, 4, 4, 3, 2, 0, 2, 3, 4, 4]
    },
    psycho: {
      name: 'Psycho',
      artist: 'Red Velvet',
      noteLength: 420,
      notes: [3, 4, 5, 5, 5, 4, 3, 4, 4, 3, 2, 3, 4, 4, 3, 3]
    },
    'love-scenario': {
      name: 'Love Scenario',
      artist: 'iKON',
      noteLength: 380,
      notes: [4, 5, 6, 5, 4, 3, 4, 4, 3, 2, 3, 4, 3, 2, 2]
    }
  };

  var audioCtx = null;
  var currentSongId = null;
  var songNotes = [];
  var currentStep = 0;
  var highlightTimeouts = [];
  var isPlaying = false;

  var el = {
    songSelect: document.getElementById('song-select'),
    btnPlay: document.getElementById('btn-play'),
    btnReplay: document.getElementById('btn-replay'),
    speedRadios: document.querySelectorAll('input[name="speed"]'),
    instructionBox: document.getElementById('instruction-box'),
    instructionText: document.getElementById('instruction-text'),
    instructionProgress: document.getElementById('instruction-progress'),
    xyloKeys: document.getElementById('xylo-keys')
  };

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playNote(index) {
    if (index < 0 || index > 7) return;
    var ctx = getAudioContext();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = FREQS[index];
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  }

  function playNoteBacking(index) {
    if (index < 0 || index > 7) return;
    var ctx = getAudioContext();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.value = FREQS[index];
    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.55);
  }

  function getSpeed() {
    var r = document.querySelector('input[name="speed"]:checked');
    return r ? parseFloat(r.value) : 1;
  }

  function buildKeys() {
    el.xyloKeys.innerHTML = '';
    for (var i = 0; i < 8; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'xylo-key';
      btn.setAttribute('data-note', String(i));
      btn.setAttribute('aria-label', 'Key ' + NOTE_NAMES[i]);
      btn.textContent = i + 1;
      btn.addEventListener('click', function (e) {
        var n = parseInt(e.currentTarget.getAttribute('data-note'), 10);
        playNote(n);
      });
      el.xyloKeys.appendChild(btn);
    }
  }

  function getKeyElement(noteIndex) {
    return el.xyloKeys.querySelector('.xylo-key[data-note="' + noteIndex + '"]');
  }

  function clearHint() {
    el.xyloKeys.querySelectorAll('.xylo-key.hint').forEach(function (k) {
      k.classList.remove('hint');
    });
  }

  function setInstruction(msg, progress, highlight) {
    el.instructionText.textContent = msg;
    el.instructionText.classList.toggle('highlight', !!highlight);
    if (progress != null) {
      el.instructionProgress.textContent = progress;
      el.instructionProgress.hidden = false;
    } else {
      el.instructionProgress.hidden = true;
    }
  }

  function clearHighlightSequence() {
    isPlaying = false;
    highlightTimeouts.forEach(function (id) { clearTimeout(id); });
    highlightTimeouts = [];
    clearHint();
  }

  function runHighlightSequence(songId) {
    var song = SONGS[songId];
    if (!song) return;
    clearHighlightSequence();
    currentSongId = songId;
    songNotes = song.notes.slice();
    isPlaying = true;
    var notes = song.notes;
    var baseMs = song.noteLength || 350;
    var speed = getSpeed();
    var noteMs = Math.round(baseMs / speed);
    var total = notes.length;

    el.btnPlay.disabled = true;
    el.btnReplay.hidden = true;
    setInstruction("The melody plays softly in the background—tap the lit key to play it loud.", "0 / " + total, true);

    function scheduleStep(step) {
      if (!isPlaying || step >= total) {
        isPlaying = false;
        clearHint();
        el.btnPlay.disabled = false;
        el.btnReplay.hidden = false;
        setInstruction("Done. Hit Replay to go again, or pick another tune.", null, true);
        return;
      }
      clearHint();
      var note = notes[step];
      var keyEl = getKeyElement(note);
      if (keyEl) keyEl.classList.add('hint');
      playNoteBacking(note);
      setInstruction("Tap key " + NOTE_NAMES[note] + " (key " + (note + 1) + ")", (step + 1) + " / " + total, true);
      var next = setTimeout(function () { scheduleStep(step + 1); }, noteMs);
      highlightTimeouts.push(next);
    }

    var first = setTimeout(function () { scheduleStep(0); }, 600);
    highlightTimeouts.push(first);
  }

  function onSongChange() {
    var id = el.songSelect.value;
    if (!id) {
      clearHighlightSequence();
      currentSongId = null;
      songNotes = [];
      el.btnPlay.disabled = true;
      el.btnReplay.hidden = true;
      setInstruction("Pick a song, choose your speed, then hit Play. The melody plays softly—you bring it to life.", null, false);
      return;
    }
    el.btnPlay.disabled = false;
    setInstruction("Ready. Hit Play—the melody will guide you softly. Tap each lit key to play it loud.", null, false);
    el.btnReplay.hidden = true;
  }

  function onPlay() {
    var id = el.songSelect.value;
    if (!id) return;
    runHighlightSequence(id);
  }

  function onReplay() {
    if (currentSongId) runHighlightSequence(currentSongId);
  }

  if (el.songSelect) el.songSelect.addEventListener('change', onSongChange);
  if (el.btnPlay) el.btnPlay.addEventListener('click', onPlay);
  if (el.btnReplay) el.btnReplay.addEventListener('click', onReplay);

  buildKeys();
  el.btnPlay.disabled = true;
  setInstruction("Pick a song, choose your speed, then hit Play. The melody plays softly—you bring it to life.", null, false);
})();
