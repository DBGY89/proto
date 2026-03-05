(function () {
  'use strict';

  const DATA = window.SALAD_BAR_DATA;
  if (!DATA || !DATA.ingredients.length || !DATA.dressings.length) return;

  const gridEl = document.getElementById('ingredient-grid');
  const hintEl = document.getElementById('picker-hint');
  const summarySection = document.getElementById('summary-section');
  const summaryTextEl = document.getElementById('summary-text');
  const dressingPlaceholder = document.getElementById('dressing-placeholder');
  const dressingCard = document.getElementById('dressing-card');
  const dressingNameEl = document.getElementById('dressing-name');
  const recipeIngredientsEl = document.getElementById('recipe-ingredients');
  const recipeStepsEl = document.getElementById('recipe-steps');
  const chefTipEl = document.getElementById('chef-tip');
  const chefTipTextEl = document.getElementById('chef-tip-text');

  const CHEF_TIPS = [
    "If your salad is boring, it's almost never the lettuce. It's the dressing. Go bold.",
    "Psychology hack: serve it on a plate you love. Eating with your eyes is real.",
    "Garlic bites more when you mince it fine. Crush it with the flat of the knife if you want flavor without the tears.",
    "Golden rule: if you wouldn't eat it on its own, don't put it in the salad.",
    "Good olive oil doesn't get cooked. Save it for the cold finish. Let it shine.",
    "Restaurant secret: salt goes in the dressing, not on the leaves. Try it once.",
    "Rock-hard avocado? Bag it with a banana. In 24 hours it'll apologize.",
    "Dried herbs at the start, fresh at the end. Fresh at the start = sad salad.",
    "Lemon at the end is the salad's glow-up. Don't cook it. Don't mix it in too early.",
    "Tomato straight from the fridge tastes like nothing. Pull it out 20 min before. Future you will thank you.",
  ];

  let selected = new Set();
  let demoMode = true;
  let demoIntervalId = null;
  let demoHighlightId = null;

  function byCategory(a, b) {
    const order = { base: 0, veggie: 1, extra: 2, protein: 3 };
    return (order[a.category] ?? 4) - (order[b.category] ?? 4);
  }

  function isChipSelected(ing) {
    if (demoMode) return ing.id === demoHighlightId;
    return selected.has(ing.id);
  }

  function renderPicker() {
    gridEl.innerHTML = '';
    DATA.ingredients.slice().sort(byCategory).forEach(function (ing) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ingredient-chip' + (isChipSelected(ing) ? ' selected' : '');
      btn.textContent = ing.name;
      btn.setAttribute('data-id', ing.id);
      btn.addEventListener('click', function () {
        if (demoMode) {
          demoMode = false;
          demoHighlightId = null;
          if (demoIntervalId) clearInterval(demoIntervalId);
          demoIntervalId = null;
          selected.add(ing.id);
        } else {
          if (selected.has(ing.id)) selected.delete(ing.id);
          else selected.add(ing.id);
        }
        renderPicker();
        updateSummary();
        updateDressing();
      });
      gridEl.appendChild(btn);
    });
  }

  function updateSummary() {
    if (demoMode || selected.size === 0) {
      summarySection.classList.add('hidden');
      hintEl.textContent = 'Pick at least one ingredient.';
      return;
    }
    summarySection.classList.remove('hidden');
    hintEl.textContent = 'Click one to remove it.';
    const list = DATA.ingredients
      .filter(function (i) { return selected.has(i.id); })
      .sort(byCategory)
      .map(function (i) { return i.name; });
    summaryTextEl.textContent = list.join(', ');
  }

  function pickDressing() {
    if (selected.size === 0) return null;
    const tags = new Set();
    DATA.ingredients.forEach(function (ing) {
      if (selected.has(ing.id)) ing.tags.forEach(function (t) { tags.add(t); });
    });
    const tagList = Array.from(tags);
    const scored = DATA.dressings.map(function (d) {
      let score = 0;
      d.goesWith.forEach(function (t) {
        if (tagList.includes(t)) score++;
      });
      return { dressing: d, score };
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored[0].dressing;
  }

  function updateDressing() {
    if (demoMode || selected.size === 0) {
      dressingPlaceholder.classList.remove('hidden');
      dressingCard.classList.add('hidden');
      chefTipEl.classList.add('hidden');
      return;
    }
    const dressing = pickDressing();
    if (!dressing) {
      dressingPlaceholder.classList.remove('hidden');
      dressingCard.classList.add('hidden');
      chefTipEl.classList.add('hidden');
      return;
    }
    dressingPlaceholder.classList.add('hidden');
    dressingCard.classList.remove('hidden');
    dressingNameEl.textContent = dressing.name;
    recipeIngredientsEl.innerHTML = dressing.recipe.ingredients
      .map(function (s) { return '<li>' + s + '</li>'; })
      .join('');
    recipeStepsEl.innerHTML = dressing.recipe.steps
      .map(function (s) { return '<li>' + s + '</li>'; })
      .join('');

    var tip = CHEF_TIPS[Math.floor(Math.random() * CHEF_TIPS.length)];
    chefTipTextEl.textContent = tip;
    chefTipEl.classList.remove('hidden');
  }

  function runDemoTick() {
    var pick = DATA.ingredients[Math.floor(Math.random() * DATA.ingredients.length)];
    demoHighlightId = pick.id;
    renderPicker();
  }

  function startDemo() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    renderPicker();
    updateSummary();
    updateDressing();
    setTimeout(runDemoTick, 500);
    demoIntervalId = setInterval(runDemoTick, 1200);
  }

  renderPicker();
  updateSummary();
  updateDressing();
  startDemo();
})();
