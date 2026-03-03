(function () {
  'use strict';

  const GAME_DURATION = 45000;

  const viewIdle = document.getElementById('view-idle');
  const viewPlaying = document.getElementById('view-playing');
  const viewDone = document.getElementById('view-done');
  const btnPlay = document.getElementById('btn-play');
  const btnStop = document.getElementById('btn-stop');
  const btnAgain = document.getElementById('btn-again');
  const liveScore = document.getElementById('live-score');
  const finalScore = document.getElementById('final-score');
  const timerFill = document.getElementById('timer-fill');

  let timerStart = 0;
  let timerRAF = null;

  function showView(view) {
    viewIdle.hidden = true;
    viewPlaying.hidden = true;
    viewDone.hidden = true;
    view.hidden = false;
  }

  function sendToTab(msg, cb) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, msg, cb || (() => {}));
      }
    });
  }

  function startGame() {
    showView(viewPlaying);
    liveScore.textContent = '0';
    timerFill.style.transition = 'none';
    timerFill.style.transform = 'scaleX(1)';

    sendToTab({ type: 'start' });

    timerStart = Date.now();
    requestAnimationFrame(() => {
      timerFill.style.transition = `transform ${GAME_DURATION}ms linear`;
      timerFill.style.transform = 'scaleX(0)';
    });
  }

  function stopGame() {
    cancelAnimationFrame(timerRAF);
    sendToTab({ type: 'stop' });
    showView(viewIdle);
  }

  function onGameOver(score) {
    cancelAnimationFrame(timerRAF);
    finalScore.textContent = score;
    showView(viewDone);
  }

  // ─── Score updates from content script ───
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'score-update') {
      liveScore.textContent = msg.score;
    } else if (msg.type === 'game-over') {
      onGameOver(msg.score);
    }
  });

  // ─── Check if game is already running when popup opens ───
  sendToTab({ type: 'ping' }, (res) => {
    if (chrome.runtime.lastError || !res) return;
    if (res.running) {
      liveScore.textContent = res.score;
      showView(viewPlaying);
    }
  });

  btnPlay.addEventListener('click', startGame);
  btnStop.addEventListener('click', stopGame);
  btnAgain.addEventListener('click', startGame);
})();
