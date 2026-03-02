/**
 * Etsy Listing Generator — UI logic (no API yet)
 */

// ─── Category options: add more here to extend the dropdown ───
const CATEGORY_OPTIONS = [
  { value: 'decorativos', label: 'Printables Decorativos', icon: '🖼️' },
  { value: 'educativos', label: 'Printables Educativos', icon: '📚' },
  { value: 'juegos', label: 'Printables Juegos', icon: '🎮' },
];

// ─── DOM refs ───
const form = document.getElementById('generator-form');
const categoryDropdown = document.getElementById('category-dropdown');
const categoryTrigger = document.getElementById('category-trigger');
const categoryMenu = document.getElementById('category-menu');
const dropdownValueEl = categoryTrigger?.querySelector('.dropdown-value');
const btnGenerate = document.getElementById('btn-generate');
const titleContent = document.getElementById('title-content');
const titleCharCount = document.getElementById('title-char-count');

// ─── Build category dropdown options ───
function renderCategoryOptions() {
  if (!categoryMenu) return;
  categoryMenu.innerHTML = CATEGORY_OPTIONS.map(
    (opt) =>
      `<button type="button" class="dropdown-option" role="option" data-value="${opt.value}" data-label="${opt.icon} ${opt.label}">${opt.icon} ${opt.label}</button>`
  ).join('');
}

function getSelectedCategory() {
  return categoryDropdown?.dataset.value || '';
}

function setSelectedCategory(value, label) {
  if (!categoryDropdown || !dropdownValueEl) return;
  categoryDropdown.dataset.value = value;
  dropdownValueEl.textContent = label || 'Selecciona una categoría';
  dropdownValueEl.classList.toggle('placeholder', !value);
  const hidden = document.getElementById('category-value');
  if (hidden) hidden.value = value;
  categoryMenu?.querySelectorAll('.dropdown-option').forEach((opt) => {
    opt.setAttribute('aria-selected', opt.dataset.value === value ? 'true' : 'false');
  });
}

// ─── Custom dropdown behavior ───
function openDropdown() {
  categoryDropdown?.classList.add('is-open');
  categoryTrigger?.setAttribute('aria-expanded', 'true');
  categoryMenu?.removeAttribute('hidden');
  categoryMenu?.querySelector('.dropdown-option')?.focus();
}

function closeDropdown() {
  categoryDropdown?.classList.remove('is-open');
  categoryTrigger?.setAttribute('aria-expanded', 'false');
  categoryMenu?.setAttribute('hidden', '');
  // Don't refocus trigger so user can tab/click to next field without being stuck on dropdown
}

function toggleDropdown() {
  const isOpen = categoryDropdown?.classList.contains('is-open');
  if (isOpen) closeDropdown();
  else openDropdown();
}

categoryTrigger?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleDropdown();
});

categoryMenu?.addEventListener('click', (e) => {
  const option = e.target.closest('.dropdown-option');
  if (!option) return;
  e.preventDefault();
  const value = option.dataset.value;
  const label = option.textContent.trim();
  setSelectedCategory(value, label);
  const nextField = document.getElementById('keyword');
  if (nextField) nextField.focus();
  closeDropdown();
  if (hasGeneratedOnce) runGeneration();
});

document.addEventListener('click', (e) => {
  if (!categoryDropdown?.classList.contains('is-open')) return;
  if (categoryDropdown.contains(e.target)) return;
  closeDropdown();
});

document.addEventListener('keydown', (e) => {
  if (!categoryDropdown?.classList.contains('is-open')) return;
  if (e.key === 'Escape') {
    closeDropdown();
    e.preventDefault();
  }
});

// ─── Title character count (max 140) ───
function updateTitleCharCount() {
  if (!titleContent || !titleCharCount) return;
  const len = titleContent.textContent.length;
  titleCharCount.textContent = len;
  titleCharCount.closest('.char-count')?.classList.toggle('is-over', len > 140);
}

if (titleContent) {
  updateTitleCharCount();
  // If we ever make title editable, add input listener here
}

// ─── Copy buttons ───
document.querySelectorAll('.btn-copy').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const targetId = btn.dataset.copyTarget;
    const el = document.getElementById(targetId);
    if (!el) return;

    let text;
    if (btn.classList.contains('btn-copy-tags')) {
      text = Array.from(el.querySelectorAll('.tag')).map((t) => t.textContent.trim()).join(', ');
    } else {
      text = el.textContent.trim();
    }

    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add('is-copied');
      btn.setAttribute('aria-label', 'Copiado');
      setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.setAttribute('aria-label', btn.querySelector('.btn-copy-text')?.textContent || 'Copiar');
      }, 2000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  });
});

// ─── Content generator: genera título, tags y descripción en el navegador (sin API) ───
function generateContent(formData) {
  const keyword = (formData.keyword || '').trim() || 'printable wall art';
  const shortDesc = (formData.shortDesc || '').trim() || 'Digital art print for home decor.';
  const style = (formData.style || '').trim() || 'minimalist, modern';
  const language = formData.language || 'es';
  const category = formData.category || 'decorativos';

  const isEn = language === 'en';

  // Title: keyword in first 40 chars, then variation, use case, format, context. Max 140.
  const kwShort = keyword.slice(0, 35);
  const formatTerm = isEn ? 'Digital Download' : 'Descarga digital';
  const styleBits = style.split(/[,;]/).map((s) => s.trim()).filter(Boolean).slice(0, 2);
  const variation = styleBits[0] || (isEn ? 'minimalist' : 'minimalista');
  const useCase = category === 'decorativos' ? (isEn ? 'wall decor' : 'decoración pared')
    : category === 'educativos' ? (isEn ? 'learning poster' : 'póster educativo')
    : (isEn ? 'print and play' : 'imprimir y jugar');
  const context = category === 'decorativos' ? (isEn ? 'living room, bedroom' : 'salón, dormitorio')
    : category === 'educativos' ? (isEn ? 'classroom, kids room' : 'aula, habitación infantil')
    : (isEn ? 'family game night' : 'juegos en familia');
  let title = [kwShort, variation, useCase, formatTerm, context].filter(Boolean).join(', ');
  if (title.length > 140) title = title.slice(0, 137) + '...';
  if (title.length < 100 && keyword.length > 0) title = [keyword, variation, useCase, formatTerm, context].filter(Boolean).join(', ').slice(0, 140);

  // Tags: 13 tags, frases completas de 2–3 palabras, max 20 chars (nunca cortar por la mitad de una palabra)
  const MAX_TAG_LEN = 20;
  const tagPool = [];
  function addTag(phrase) {
    const s = String(phrase).toLowerCase().trim();
    if (!s || tagPool.includes(s)) return;
    if (s.length <= MAX_TAG_LEN) {
      tagPool.push(s);
      return;
    }
    // Si es largo, añadir solo si podemos acortar por palabras completas
    const words = s.split(/\s+/);
    let short = '';
    for (const w of words) {
      const next = short ? short + ' ' + w : w;
      if (next.length <= MAX_TAG_LEN) short = next;
      else break;
    }
    if (short && short.length >= 2 && !tagPool.includes(short)) tagPool.push(short);
  }

  // Keyword: solo si cabe entera o como frase corta por palabras completas
  addTag(keyword);
  const kwWords = keyword.split(/\s+/).filter(Boolean);
  if (kwWords.length >= 2) {
    const twoWords = kwWords.slice(0, 2).join(' ');
    if (twoWords.length <= MAX_TAG_LEN) addTag(twoWords);
    const revTwo = [kwWords[1], kwWords[0]].join(' ');
    if (revTwo.length <= MAX_TAG_LEN && revTwo !== keyword) addTag(revTwo);
  }

  // Estilo: frases completas
  styleBits.forEach((b) => {
    const p = (b + ' print').trim();
    if (p.length <= MAX_TAG_LEN) addTag(p);
  });
  const stylePoster = (styleBits[0] || variation) + ' poster';
  if (stylePoster.length <= MAX_TAG_LEN) addTag(stylePoster);

  addTag(useCase);
  const contextFirst = context.split(',')[0].trim();
  if (contextFirst.length <= MAX_TAG_LEN) addTag(contextFirst);

  // Por categoría: frases predefinidas que siempre tienen sentido y caben en 20 chars
  if (category === 'decorativos') {
    addTag(isEn ? 'wall art' : 'arte pared');
    addTag(isEn ? 'home decor' : 'decoración hogar');
    addTag(isEn ? 'art print' : 'lámina decorativa');
  }
  if (category === 'educativos') {
    addTag(isEn ? 'educational poster' : 'póster educativo');
    addTag(isEn ? 'kids learning' : 'aprendizaje niños');
    addTag(isEn ? 'classroom poster' : 'póster aula');
  }
  if (category === 'juegos') {
    addTag(isEn ? 'party game' : 'juego fiesta');
    addTag(isEn ? 'family game' : 'juego familia');
    addTag(isEn ? 'print and play' : 'imprimir y jugar');
  }

  addTag(isEn ? 'digital download' : 'descarga digital');
  addTag(isEn ? 'instant download' : 'descarga instantánea');
  addTag(isEn ? 'gift for mom' : 'regalo mamá');
  addTag(isEn ? 'nursery gift' : 'regalo bebé');
  addTag(isEn ? 'printable art' : 'imprimible decoración');

  const fallbacks = isEn
    ? ['printable decor', 'wall print', 'home print', 'gift idea', 'room decor']
    : ['lámina imprimible', 'arte pared', 'imprimible hogar', 'idea regalo', 'póster decorativo'];
  for (const fb of fallbacks) {
    if (tagPool.length >= 13) break;
    if (fb.length <= MAX_TAG_LEN && !tagPool.includes(fb)) tagPool.push(fb);
  }
  const tags = tagPool.slice(0, 13);

  // Description: bloques SEO, valor, técnico, cierre (250–400 palabras)
  const descParagraphs = buildDescription(keyword, shortDesc, styleBits, variation, category, isEn);
  const descriptionHtml = descParagraphs.map((p) => '<p>' + p.replace(/\n/g, '<br>') + '</p>').join('');

  return { title, tags, descriptionHtml };
}

function buildDescription(keyword, shortDesc, styleBits, variation, category, isEn) {
  const kwCap = keyword ? (keyword.charAt(0).toUpperCase() + keyword.slice(1)) : '';
  const styleStr = styleBits.length ? styleBits.join(', ') : variation;
  const theme = deriveThemeFromBrief(shortDesc, category, isEn);

  if (isEn) {
    const block1 = (kwCap ? kwCap + '. ' : '') + theme.hook + ' ' + theme.audience + ' ' + theme.use;
    const block2Decor = 'This design fits a living room, bedroom, hallway, bathroom, or gallery wall. ' + styleStr + ' style that blends with most interiors. Focus on the look and feel: clean, easy to frame, and ready to hang.';
    const block2Edu = 'Great for classroom, kids room, homeschool, nursery, or playroom. Useful for parents and teachers. The main value is how it helps: learning, routine, or visual support. Fits any age range you need.';
    const block2Game = 'Print and play — no extra pieces required. Fun for family game night, parties, or road trips. You can note the recommended age and number of players in your listing. Just print, cut if needed, and play.';
    const block2 = category === 'decorativos' ? block2Decor : category === 'educativos' ? block2Edu : block2Game;
    const block3 = '✔️ Files included: PDF, JPG, PNG. Sizes: 4x6, 5x7, 8x10, A4, A3. 300 DPI, print-ready. After purchase you\'ll receive an instant download link. No physical item is shipped.';
    const block4 = 'Personal use only, not for commercial use. Thank you for visiting — check our shop for more printables.';
    return [block1, block2, block3, block4];
  }

  const block1 = (kwCap ? kwCap + '. ' : '') + theme.hook + ' ' + theme.audience + ' ' + theme.use;
  const block2Decor = 'Encaja en salón, dormitorio, pasillo, baño o galería. Estilo ' + styleStr + ' que combina con la mayoría de interiores. Céntrate en la estética y el ambiente: limpio, fácil de enmarcar y listo para colgar.';
  const block2Edu = 'Ideal para aula, habitación infantil, homeschool, guardería o cuarto de juegos. Útil para padres y profesores. El valor está en la utilidad: aprendizaje, rutinas o soporte visual. Adaptable al rango de edad que indiques.';
  const block2Game = 'Imprimir y jugar: no hace falta nada más. Ideal para noche de juegos en familia, fiestas o viajes. Puedes indicar la edad recomendada y el número de jugadores. Solo imprimir, cortar si aplica y jugar.';
  const block2 = category === 'decorativos' ? block2Decor : category === 'educativos' ? block2Edu : block2Game;
  const block3 = '✔️ Archivos incluidos: PDF, JPG, PNG. Tamaños: 4x6, 5x7, 8x10, A4, A3. 300 DPI, listo para imprimir. Tras la compra recibirás el enlace de descarga al instante. No se envía ningún producto físico.';
  const block4 = 'Solo uso personal, no comercial. Gracias por visitarnos — echa un vistazo a la tienda para más imprimibles.';
  return [block1, block2, block3, block4];
}

function deriveThemeFromBrief(shortDesc, category, isEn) {
  const text = (shortDesc || '').trim().toLowerCase();
  const hasKids = /\b(niños?|kids?|child|infantil|nursery|baby)\b/i.test(text) || /\b(niñ|kid|child|baby)\b/i.test(text);
  const hasRoutine = /\b(rutina|routine|habit|recordatorio|reminder|horario|schedule)\b/i.test(text);
  const hasLearning = /\b(aprender|learn|educativ|teaching|aula|classroom)\b/i.test(text);
  const hasGame = /\b(juego|game|jugador|player|party|fiesta)\b/i.test(text);
  const hasHygiene = /\b(lavar|brush|dientes|teeth|cepillar|hygiene|higiene)\b/i.test(text);
  const hasDecor = /\b(decor|decoración|wall|pared|habitación|room)\b/i.test(text);

  if (isEn) {
    const hook = category === 'decorativos'
      ? 'A printable that adds personality to your space.'
      : category === 'educativos'
        ? (hasHygiene ? 'A visual aid to support daily routines like brushing teeth.' : hasLearning ? 'A clear, visual resource for learning and routines.' : 'A practical printable for learning and everyday routines.')
        : 'A print-and-play activity for shared moments.';
    const audience = hasKids ? 'Ideal for families, kids’ rooms, or educators.' : 'Perfect for anyone who wants a clear, useful printable.';
    const use = category === 'decorativos'
      ? 'Use it to refresh a wall, create a gallery, or give as a thoughtful gift.'
      : category === 'educativos'
        ? 'Use it in the bathroom, bedroom, classroom, or playroom.'
        : 'Ideal for game nights, trips, or parties — just print and play.';
    return { hook, audience, use };
  }

  const hook = category === 'decorativos'
    ? 'Un imprimible que da personalidad a tu espacio.'
    : category === 'educativos'
      ? (hasHygiene ? 'Un soporte visual para rutinas como lavarse los dientes.' : hasLearning ? 'Un recurso claro y visual para aprender y rutinas.' : 'Un imprimible práctico para el aprendizaje y el día a día.')
      : 'Una actividad para imprimir y jugar en familia o con amigos.';
  const audience = hasKids ? 'Ideal para familias, habitación infantil o educadores.' : 'Perfecto para quien busque un imprimible claro y útil.';
  const use = category === 'decorativos'
    ? 'Úsalo para renovar una pared, crear una galería o regalarlo.'
    : category === 'educativos'
      ? 'Úsalo en el baño, dormitorio, aula o cuarto de juegos.'
      : 'Ideal para noches de juegos, viajes o fiestas: solo imprimir y jugar.';
  return { hook, audience, use };
}

function applyGeneratedContent(result) {
  const titleEl = document.getElementById('title-content');
  const tagsContainer = document.getElementById('tags-content');
  const descEl = document.getElementById('desc-content');
  if (titleEl) {
    titleEl.textContent = result.title;
    updateTitleCharCount();
  }
  if (tagsContainer) {
    tagsContainer.innerHTML = result.tags.map((t) => '<span class="tag">' + escapeHtml(t) + '</span>').join('');
  }
  if (descEl) descEl.innerHTML = result.descriptionHtml;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getFormData() {
  return {
    category: document.getElementById('category-value')?.value || '',
    keyword: document.getElementById('keyword')?.value || '',
    shortDesc: document.getElementById('short-desc')?.value || '',
    style: document.getElementById('style')?.value || '',
    language: document.querySelector('input[name="language"]:checked')?.value || 'es',
  };
}

function runGeneration() {
  const formData = getFormData();
  const result = generateContent(formData);
  applyGeneratedContent(result);
}

let hasGeneratedOnce = false;
let regenerateDebounceTimer = null;

function scheduleRegenerate() {
  if (!hasGeneratedOnce) return;
  if (regenerateDebounceTimer) clearTimeout(regenerateDebounceTimer);
  regenerateDebounceTimer = setTimeout(() => {
    regenerateDebounceTimer = null;
    runGeneration();
  }, 400);
}

// ─── Generate button ───
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (btnGenerate.classList.contains('is-loading')) return;

  hasGeneratedOnce = true;

  const formData = getFormData();

  btnGenerate.classList.add('is-loading');
  btnGenerate.disabled = true;

  await new Promise((r) => setTimeout(r, 600));

  const result = generateContent(formData);
  applyGeneratedContent(result);

  btnGenerate.classList.remove('is-loading');
  btnGenerate.disabled = false;
});

// ─── Regenerar al cambiar cualquier input (solo después de haber generado al menos una vez) ───
document.getElementById('keyword')?.addEventListener('input', scheduleRegenerate);
document.getElementById('short-desc')?.addEventListener('input', scheduleRegenerate);
document.getElementById('style')?.addEventListener('input', scheduleRegenerate);
document.querySelectorAll('input[name="language"]').forEach((radio) => {
  radio.addEventListener('change', () => { if (hasGeneratedOnce) runGeneration(); });
});

// ─── Rules modal (content from generator-rules.js) ───
const rulesModal = document.getElementById('rules-modal');
const rulesContent = document.getElementById('rules-content');
const btnRules = document.getElementById('btn-rules');
const rulesClose = document.getElementById('rules-close');
const rulesBackdrop = document.getElementById('rules-backdrop');

function renderRulesContent() {
  if (!rulesContent || typeof GENERATOR_RULES === 'undefined') return;
  const r = GENERATOR_RULES;
  const frag = document.createDocumentFragment();

  function section(title, list) {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'rules-section';
    sectionEl.innerHTML =
      '<h3 class="rules-section-title">' + escapeHtml(title) + '</h3><ul class="rules-list">' +
      list.map((item) => '<li>' + escapeHtml(item) + '</li>').join('') +
      '</ul>';
    frag.appendChild(sectionEl);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  section('Título (máx. ' + r.title.maxChars + ' caracteres)', r.title.rules);

  const tagSection = document.createElement('div');
  tagSection.className = 'rules-section';
  tagSection.innerHTML =
    '<h3 class="rules-section-title">Tags (exactamente ' +
    r.tags.count +
    ')</h3><ul class="rules-list">' +
    r.tags.rules.map((item) => '<li>' + escapeHtml(item) + '</li>').join('') +
    '</ul><p class="rules-dimensions-title" style="margin-top:0.75rem;font-weight:600;">Cubrir estas dimensiones:</p><ul class="rules-dimensions">' +
    r.tags.dimensions.map((d) => '<li>' + escapeHtml(d.count + ': ' + d.name) + '</li>').join('') +
    '</ul>';
  frag.appendChild(tagSection);

  const descSection = document.createElement('div');
  descSection.className = 'rules-section';
  let descHtml =
    '<h3 class="rules-section-title">Descripción (' +
    r.description.minWords +
    '-' +
    r.description.maxWords +
    ' palabras)</h3>';
  if (r.description.inputUsage && r.description.inputUsage.length) {
    descHtml += '<p class="rules-block-title">Uso del campo «Descripción breve del producto»</p><ul class="rules-list">';
    r.description.inputUsage.forEach((point) => (descHtml += '<li>' + escapeHtml(point) + '</li>'));
    descHtml += '</ul>';
  }
  r.description.blocks.forEach((block) => {
    descHtml += '<p class="rules-block-title">' + escapeHtml(block.name) + '</p><ul class="rules-list">';
    block.points.forEach((p) => (descHtml += '<li>' + escapeHtml(p) + '</li>'));
    descHtml += '</ul>';
  });
  descHtml += '<p class="rules-block-title" style="margin-top:0.75rem;">Formato:</p><ul class="rules-list">';
  r.description.rules.forEach((rule) => (descHtml += '<li>' + escapeHtml(rule) + '</li>'));
  descHtml += '</ul>';
  descSection.innerHTML = descHtml;
  frag.appendChild(descSection);

  const cohSection = document.createElement('div');
  cohSection.className = 'rules-section rules-coherence';
  cohSection.innerHTML =
    '<h3 class="rules-section-title">Coherencia entre los tres campos</h3><ul class="rules-list">' +
    r.coherence.map((c) => '<li>' + escapeHtml(c) + '</li>').join('') +
    '</ul>';
  frag.appendChild(cohSection);

  const catSection = document.createElement('div');
  catSection.className = 'rules-section rules-category';
  let catHtml = '<h3 class="rules-section-title">Reglas por categoría</h3>';
  Object.keys(r.categorySpecific).forEach((key) => {
    const cat = r.categorySpecific[key];
    catHtml +=
      '<p class="rules-block-title">' +
      escapeHtml(cat.title) +
      '</p><ul class="rules-list">' +
      cat.rules.map((rule) => '<li>' + escapeHtml(rule) + '</li>').join('') +
      '</ul>';
  });
  catSection.innerHTML = catHtml;
  frag.appendChild(catSection);

  rulesContent.innerHTML = '';
  rulesContent.appendChild(frag);
}

function openRulesModal() {
  if (!rulesModal) return;
  rulesModal.hidden = false;
  rulesModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  rulesClose?.focus();
}

function closeRulesModal() {
  if (!rulesModal) return;
  rulesModal.hidden = true;
  rulesModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  btnRules?.focus();
}

btnRules?.addEventListener('click', openRulesModal);
rulesClose?.addEventListener('click', closeRulesModal);
rulesBackdrop?.addEventListener('click', closeRulesModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && rulesModal && !rulesModal.hidden) {
    closeRulesModal();
    e.preventDefault();
  }
});

// ─── Init ───
renderCategoryOptions();
setSelectedCategory('', '');
if (typeof GENERATOR_RULES !== 'undefined') renderRulesContent();
