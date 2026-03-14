/**
 * Rating vote — save a rating to Supabase with localStorage fallback.
 * One vote per device per project: device_id in localStorage, enforced client-side
 * and optionally in Supabase with UNIQUE(project, device_id) + upsert.
 * saveRating(project, rating) → Promise<void>
 */
(function () {
  'use strict';

  const SUPABASE_URL = 'https://gubjxnognmbxkpnjcpju.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Ymp4bm9nbm1ieGtwbmpjcGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MTYzMzEsImV4cCI6MjA4ODQ5MjMzMX0.MZEF3jStBR7qP-ycndU6Q4QvCvzeNnh1cvoSvdiiF_k';
  const DEVICE_ID_KEY = 'rating_device_id';
  const RATING_PREFIX = 'rating_';

  function getOrCreateDeviceId() {
    try {
      var id = localStorage.getItem(DEVICE_ID_KEY);
      if (id && id.length > 20) return id;
      id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      localStorage.setItem(DEVICE_ID_KEY, id);
      return id;
    } catch (_) {
      return 'anon-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    }
  }

  var debugRatings = typeof window !== 'undefined' && window.location && window.location.search.indexOf('rating-debug=1') !== -1;

  window.saveRating = function saveRating(project, rating) {
    var storageKey = RATING_PREFIX + project;
    try {
      if (localStorage.getItem(storageKey)) {
        if (debugRatings) console.log('[rating] Already voted for', project, '- skipping POST');
        return Promise.resolve();
      }
    } catch (_) {}
    var deviceId = getOrCreateDeviceId();
    var url = SUPABASE_URL + '/rest/v1/ratings';
    var body = JSON.stringify({
      project: project,
      rating: Number(rating),
      device_id: deviceId,
    });
    if (debugRatings) console.log('[rating] Sending vote to Supabase:', project, '→', rating);
    return fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal,resolution=merge-duplicates',
      },
      body: body,
    }).then(function (res) {
      if (res.ok) {
        try {
          localStorage.setItem(storageKey, String(rating));
        } catch (_) {}
        if (debugRatings) console.log('[rating] OK: vote saved for', project);
      } else {
        if (debugRatings) {
          res.text().then(function (text) {
            console.warn('[rating] Supabase', res.status, res.statusText, 'for', project, '—', text);
          });
        }
      }
    }).catch(function (err) {
      try {
        localStorage.setItem(storageKey, String(rating));
      } catch (_) {}
      if (debugRatings) console.warn('[rating] Request failed for', project, err);
    });
  };
})();
