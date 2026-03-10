/**
 * Rating vote — save a rating to Supabase with localStorage fallback.
 * saveRating(project, rating) → Promise<void>
 */
(function () {
  'use strict';

  const SUPABASE_URL = 'https://gubjxnognmbxkpnjcpju.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Ymp4bm9nbm1ieGtwbmpjcGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MTYzMzEsImV4cCI6MjA4ODQ5MjMzMX0.MZEF3jStBR7qP-ycndU6Q4QvCvzeNnh1cvoSvdiiF_k';

  window.saveRating = function saveRating(project, rating) {
    const url = SUPABASE_URL + '/rest/v1/ratings';
    const body = JSON.stringify({ project: project, rating: Number(rating) });
    return fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: body,
    }).catch(function () {
      try {
        localStorage.setItem('rating_' + project, String(rating));
      } catch (_) {}
    });
  };
})();
