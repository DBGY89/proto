/**
 * Rating display — get aggregate ratings from Supabase with localStorage fallback.
 * getRatings(project) → Promise<{ average: number, count: number }>
 */
(function () {
  'use strict';

  const SUPABASE_URL = 'https://gubjxnognmbxkpnjcpju.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Ymp4bm9nbm1ieGtwbmpjcGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MTYzMzEsImV4cCI6MjA4ODQ5MjMzMX0.MZEF3jStBR7qP-ycndU6Q4QvCvzeNnh1cvoSvdiiF_k';

  function getRatingsFromLocalStorage(project) {
    const key = 'rating_' + project;
    try {
      const raw = localStorage.getItem(key);
      if (raw == null || raw === '') return { average: 0, count: 0 };
      const value = parseInt(raw, 10);
      if (value >= 1 && value <= 5) return { average: value, count: 1 };
    } catch (_) {}
    return { average: 0, count: 0 };
  }

  window.getRatings = function getRatings(project) {
    const url = SUPABASE_URL + '/rest/v1/ratings?project=eq.' + encodeURIComponent(project) + '&select=rating';
    return fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Supabase request failed');
        return res.json();
      })
      .then(function (rows) {
        if (!Array.isArray(rows) || rows.length === 0) {
          return { average: 0, count: 0 };
        }
        const sum = rows.reduce(function (acc, r) { return acc + (Number(r.rating) || 0); }, 0);
        const count = rows.length;
        const average = count ? sum / count : 0;
        return { average: average, count: count };
      })
      .catch(function () {
        return getRatingsFromLocalStorage(project);
      });
  };
})();
