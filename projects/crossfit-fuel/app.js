/**
 * CrossFit Fuel — Daily menu generator for CrossFit athletes
 * PRD: day type (WOD / Rest), optional caloric profile & dietary filters, AI or demo menu, food impact, shopping list, shareable card
 */
(function () {
  'use strict';

  const API_KEY_STORAGE = 'crossfit_fuel_anthropic_api_key';
  const MENU_HISTORY_KEY = 'crossfit_fuel_menu_history';
  const MIN_KCAL = 1400;

  // ─── Demo menus (used when no API key) ───
  const DEMO_MENU_WOD = {
    dayType: 'wod',
    totalCalories: 2400,
    meals: [
      {
        mealType: 'breakfast',
        dishName: 'Power Oat Bowl with Banana & Almond Butter',
        ingredients: ['rolled oats', 'banana', 'almond butter', 'honey', 'chia seeds', 'cinnamon'],
        macros: { protein: 18, carbs: 72, fat: 22 },
        fuelStory: 'Oats deliver steady glucose so your energy doesn\'t spike and crash before the WOD. The banana tops off muscle glycogen. Almond butter and chia add staying power — you\'ll feel this at rep 50.',
        impactCopy: 'The oats hit your bloodstream like a slow drip, not a sugar bomb. Your muscles get the refill they need without the crash. That almond butter? It\'s keeping you from bonking when the clock is running. Don\'t skip it.'
      },
      {
        mealType: 'lunch',
        dishName: 'Grilled Chicken & Sweet Potato with Greens',
        ingredients: ['chicken breast', 'sweet potato', 'spinach', 'olive oil', 'lemon', 'garlic'],
        macros: { protein: 42, carbs: 48, fat: 14 },
        fuelStory: 'Chicken restocks the amino pool your muscles used during the WOD. Sweet potato restores glycogen. The greens bring anti-inflammatory compounds — your body is repairing right now.',
        impactCopy: 'That chicken is literally building back what you broke down. Sweet potato hits your glycogen stores like a restock notification — your muscles are waiting for this. The greens are putting out the fire so you can go again tomorrow.'
      },
      {
        mealType: 'dinner',
        dishName: 'Salmon, Rice & Broccoli',
        ingredients: ['salmon fillet', 'jasmine rice', 'broccoli', 'tamari', 'ginger', 'sesame oil'],
        macros: { protein: 38, carbs: 52, fat: 18 },
        fuelStory: 'Salmon\'s omega-3s support recovery and keep inflammation in check. Rice refills glycogen. Broccoli adds fiber and micronutrients that help your body use everything you\'re giving it.',
        impactCopy: 'The salmon is doing the quiet work — recovery, hormones, cell membranes. Rice is your overnight glycogen top-up. You\'re not just eating; you\'re rebuilding.'
      },
      {
        mealType: 'snack',
        dishName: 'Greek Yogurt with Berries & Granola',
        ingredients: ['Greek yogurt', 'mixed berries', 'granola', 'drizzle of honey'],
        macros: { protein: 20, carbs: 32, fat: 8 },
        fuelStory: 'Fast protein and carbs in one hit. Yogurt\'s casein supports muscle protein synthesis; berries add antioxidants. Perfect timing: post-WOD or mid-afternoon slump.',
        impactCopy: 'This is your anabolic window in a bowl. The protein is signaling "build" and the carbs are making sure that signal gets through. The berries are the cleanup crew. Eat it.'
      }
    ]
  };

  const DEMO_MENU_REST = {
    dayType: 'rest',
    totalCalories: 2000,
    meals: [
      {
        mealType: 'breakfast',
        dishName: 'Eggs & Avocado on Sourdough',
        ingredients: ['eggs', 'avocado', 'sourdough bread', 'cherry tomatoes', 'salt', 'pepper'],
        macros: { protein: 22, carbs: 28, fat: 28 },
        fuelStory: 'On rest days you don\'t need the same carb load. Eggs and avocado give you quality fat and protein for satiety and repair without spiking insulin. Your body is in recovery mode.',
        impactCopy: 'You\'re not fueling a WOD today — you\'re maintaining. The eggs are still building; the fat keeps you full and supports hormone production. No need to eat like it\'s game day.'
      },
      {
        mealType: 'lunch',
        dishName: 'Mediterranean Chickpea Bowl',
        ingredients: ['chickpeas', 'cucumber', 'tomato', 'red onion', 'feta', 'olive oil', 'oregano', 'lemon'],
        macros: { protein: 18, carbs: 42, fat: 22 },
        fuelStory: 'Plant-based protein and fat, moderate carbs. Chickpeas provide fiber and steady energy. This is a rest-day plate: satisfying, anti-inflammatory, no performance pressure.',
        impactCopy: 'Your muscles are repairing in the background. This bowl gives them what they need without the heavy lifting. The fiber keeps your gut happy; the fat keeps you satisfied. Rest day done right.'
      },
      {
        mealType: 'dinner',
        dishName: 'Lean Beef Stir-Fry with Vegetables',
        ingredients: ['lean beef', 'bell peppers', 'broccoli', 'snap peas', 'soy sauce', 'rice', 'garlic'],
        macros: { protein: 40, carbs: 38, fat: 12 },
        fuelStory: 'Beef brings creatine and iron; the veggies add volume and micronutrients. Moderate carbs — you\'re not depleting today. This supports repair and keeps you ready for tomorrow.',
        impactCopy: 'Beef is rest-day gold: heme iron, creatine, full amino profile. You\'re not burning through glycogen, so you don\'t need to pile it on. This is repair fuel, not performance fuel.'
      },
      {
        mealType: 'snack',
        dishName: 'Apple Slices with Almond Butter',
        ingredients: ['apple', 'almond butter', 'cinnamon'],
        macros: { protein: 6, carbs: 24, fat: 14 },
        fuelStory: 'Light, real-food snack. Enough to keep hunger at bay without pushing calories past what you need on a rest day. Fiber and fat = steady blood sugar.',
        impactCopy: 'No WOD to fuel. This is just enough to keep you from raiding the pantry. Simple, satisfying, no drama.'
      }
    ]
  };

  // ─── DOM refs ───
  const screenSelector = document.getElementById('screen-selector');
  const screenMenu = document.getElementById('screen-menu');
  const btnWod = document.getElementById('btn-wod');
  const btnRest = document.getElementById('btn-rest');
  const btnGenerate = document.getElementById('btn-generate');
  const btnPersonalize = document.getElementById('btn-personalize');
  const personalizePanel = document.getElementById('personalize-panel');
  const filters = document.getElementById('filters');
  const inputWeight = document.getElementById('input-weight');
  const inputHeight = document.getElementById('input-height');
  const inputGoal = document.getElementById('input-goal');
  const demoHint = document.getElementById('demo-hint');
  const menuCards = document.getElementById('menu-cards');
  const resultDayBadge = document.getElementById('result-day-badge');
  const resultCalorieBadge = document.getElementById('result-calorie-badge');
  const btnShoppingList = document.getElementById('btn-shopping-list');
  const btnShareCard = document.getElementById('btn-share-card');
  const btnNewMenu = document.getElementById('btn-new-menu');
  const shoppingOverlay = document.getElementById('shopping-overlay');
  const shoppingListEl = document.getElementById('shopping-list');
  const shoppingClose = document.getElementById('shopping-close');
  const shareCardWrap = document.getElementById('share-card-wrap');
  const shareCard = document.getElementById('share-card');
  const shareCardDay = document.getElementById('share-card-day');
  const shareCardMeals = document.getElementById('share-card-meals');
  const shareCardMacros = document.getElementById('share-card-macros');
  const apiKeyBtn = document.getElementById('api-key-btn');
  const apiKeyOverlay = document.getElementById('api-key-overlay');
  const apiKeyInput = document.getElementById('api-key-input');
  const apiKeyClose = document.getElementById('api-key-close');
  const apiKeySave = document.getElementById('api-key-save');

  let selectedDay = null; // 'wod' | 'rest'
  let activeFilters = { vegan: false, glutenFree: false, dairyFree: false };
  let lastGeneratedMenu = null;

  // ─── API key ───
  function getApiKey() {
    try {
      return localStorage.getItem(API_KEY_STORAGE) || '';
    } catch (_) {
      return '';
    }
  }

  function setApiKey(key) {
    try {
      if (key && key.trim()) localStorage.setItem(API_KEY_STORAGE, key.trim());
      else localStorage.removeItem(API_KEY_STORAGE);
    } catch (_) {}
  }

  function hasApiKey() {
    return !!getApiKey();
  }

  // ─── Caloric calculation (Mifflin-St Jeor + activity) ───
  function calculateCalories(weightKg, heightCm, goal) {
    // Simplified: assume age 30, male BMR. In production you'd add age/sex.
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * 30 + 5;
    const activity = selectedDay === 'wod' ? 1.55 : 1.2;
    let tdee = bmr * activity;
    if (goal === 'fatLoss') tdee *= 0.85;
    if (goal === 'muscleGain') tdee *= 1.15;
    return Math.max(MIN_KCAL, Math.round(tdee));
  }

  function getCaloricTarget() {
    const w = parseFloat(inputWeight?.value);
    const h = parseFloat(inputHeight?.value);
    if (!w || !h || w < 30 || h < 100) return null;
    const goal = inputGoal?.value || 'performance';
    return calculateCalories(w, h, goal);
  }

  // ─── Day selection ───
  function setDay(day) {
    selectedDay = day;
    if (btnWod) btnWod.classList.toggle('selected', day === 'wod');
    if (btnRest) btnRest.classList.toggle('selected', day === 'rest');
    if (btnWod) btnWod.setAttribute('aria-pressed', day === 'wod' ? 'true' : 'false');
    if (btnRest) btnRest.setAttribute('aria-pressed', day === 'rest' ? 'true' : 'false');
    if (btnGenerate) btnGenerate.disabled = !day;
  }

  btnWod?.addEventListener('click', () => setDay('wod'));
  btnRest?.addEventListener('click', () => setDay('rest'));

  // ─── Personalize panel ───
  btnPersonalize?.addEventListener('click', function () {
    const expanded = personalizePanel?.classList.toggle('hidden');
    this.setAttribute('aria-expanded', !expanded);
  });

  // ─── Filters ───
  filters?.addEventListener('click', function (e) {
    const chip = e.target.closest('.filter-chip[data-filter]');
    if (!chip) return;
    const key = chip.getAttribute('data-filter');
    activeFilters[key] = !activeFilters[key];
    chip.setAttribute('aria-pressed', activeFilters[key] ? 'true' : 'false');
    chip.classList.toggle('active', activeFilters[key]);
  });

  // ─── Generate menu ───
  async function generateMenu() {
    if (!selectedDay || !btnGenerate) return;
    btnGenerate.disabled = true;
    btnGenerate.classList.add('loading');
    if (demoHint) demoHint.classList.add('hidden');

    let menuData = null;
    const restrictions = [];
    if (activeFilters.vegan) restrictions.push('vegan');
    if (activeFilters.glutenFree) restrictions.push('gluten-free');
    if (activeFilters.dairyFree) restrictions.push('dairy-free');
    const calTarget = getCaloricTarget();

    try {
      if (hasApiKey()) {
        menuData = await fetchMenuFromApi(selectedDay, restrictions, calTarget);
      }
      if (!menuData) {
        menuData = selectedDay === 'wod' ? { ...DEMO_MENU_WOD } : { ...DEMO_MENU_REST };
        if (demoHint) demoHint.classList.remove('hidden');
      }
      if (calTarget) menuData.totalCalories = calTarget;
      lastGeneratedMenu = menuData;
      showMenuScreen(menuData);
    } catch (err) {
      console.error(err);
      menuData = selectedDay === 'wod' ? { ...DEMO_MENU_WOD } : { ...DEMO_MENU_REST };
      lastGeneratedMenu = menuData;
      showMenuScreen(menuData);
      if (demoHint) {
        demoHint.textContent = 'Could not reach API. Showing demo menu. Check your API key in settings.';
        demoHint.classList.remove('hidden');
      }
    } finally {
      btnGenerate.classList.remove('loading');
      btnGenerate.disabled = false;
    }
  }

  async function fetchMenuFromApi(dayType, restrictions, calTarget) {
    const apiKey = getApiKey();
    const systemPrompt = `You are a bold, energetic CrossFit nutrition coach. You generate ONE day of meals (breakfast, lunch, dinner, snack) as a single JSON object. No markdown, no code fence — only valid JSON.

Output format (exactly this structure):
{
  "dayType": "wod" or "rest",
  "totalCalories": number,
  "meals": [
    {
      "mealType": "breakfast"|"lunch"|"dinner"|"snack",
      "dishName": "string",
      "ingredients": ["string", ...],
      "macros": { "protein": number, "carbs": number, "fat": number },
      "fuelStory": "2-3 sentences in second person, present tense, high energy: what this meal does for the athlete today.",
      "impactCopy": "2-3 sentences, same voice: 'What this does to you' — bold, audacious, non-clinical. Example: 'The sweet potato hits your glycogen stores like a restock notification — your muscles are literally waiting for this.'"
    }
  ]
}

Rules: No supplements, no brands, no medical claims. Tone: sports editorial, motivating, never dry.`;

    const userPrompt = `Generate a full day of meals for a CrossFit athlete.
- Day type: ${dayType === 'wod' ? 'TRAINING DAY (WOD)' : 'REST DAY (recovery)'}.
${calTarget ? `- Target calories: ${calTarget} kcal. Match total to this.` : '- Target: moderate calories (training ~2400, rest ~2000).'}
${restrictions.length ? `- Dietary restrictions: ${restrictions.join(', ')}. All meals must comply.` : ''}
Return only the JSON object, no other text.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || response.statusText);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) throw new Error('No content in response');

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const raw = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(raw);
  }

  btnGenerate?.addEventListener('click', generateMenu);

  // ─── Show menu screen ───
  function showMenuScreen(menu) {
    if (!screenSelector || !screenMenu) return;
    screenSelector.classList.add('hidden');
    screenMenu.classList.remove('hidden');

    const dayLabel = menu.dayType === 'wod' ? 'CrossFit Day' : 'Rest Day';
    if (resultDayBadge) {
      resultDayBadge.textContent = dayLabel;
      resultDayBadge.className = 'day-badge day-' + menu.dayType;
    }
    if (resultCalorieBadge) resultCalorieBadge.textContent = (menu.totalCalories || 0) + ' kcal';

    menuCards.innerHTML = '';
    (menu.meals || []).forEach(function (m) {
      const card = document.createElement('article');
      card.className = 'meal-card';
      card.setAttribute('data-meal', m.mealType);

      const macros = m.macros || {};
      const macroStr = [macros.protein && 'P: ' + macros.protein + 'g', macros.carbs && 'C: ' + macros.carbs + 'g', macros.fat && 'F: ' + macros.fat + 'g'].filter(Boolean).join(' · ');

      card.innerHTML =
        '<div class="meal-card-header">' +
          '<span class="meal-card-title">' + escapeHtml(capitalize(m.mealType)) + '</span>' +
          (macroStr ? '<span class="meal-card-macros">' + escapeHtml(macroStr) + '</span>' : '') +
        '</div>' +
        '<div class="meal-card-body">' +
          '<div class="meal-card-dish">' + escapeHtml(m.dishName || '') + '</div>' +
          (m.ingredients && m.ingredients.length ? '<div class="meal-card-ingredients">' + escapeHtml(m.ingredients.join(', ')) + '</div>' : '') +
          (m.fuelStory ? '<div class="meal-card-fuel">' + escapeHtml(m.fuelStory) + '</div>' : '') +
          (m.impactCopy ? (
            '<button type="button" class="meal-card-impact-toggle" aria-expanded="false" aria-controls="impact-' + m.mealType + '">' +
              '<span class="arrow">▶</span> What this does to you' +
            '</button>' +
            '<div class="meal-card-impact hidden" id="impact-' + m.mealType + '">' + escapeHtml(m.impactCopy) + '</div>'
          ) : '') +
        '</div>';

      const toggle = card.querySelector('.meal-card-impact-toggle');
      const impactEl = card.querySelector('.meal-card-impact');
      if (toggle && impactEl) {
        toggle.addEventListener('click', function () {
          const open = impactEl.classList.toggle('hidden');
          toggle.setAttribute('aria-expanded', !open);
        });
      }
      menuCards.appendChild(card);
    });
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ─── Shopping list ───
  function buildShoppingList(meals) {
    const byCategory = { Proteins: [], Vegetables: [], Carbs: [], Pantry: [], Extras: [] };
    const seen = new Set();
    const proteinWords = /chicken|beef|salmon|egg|turkey|tofu|tempeh|tuna|pork|shrimp|yogurt|milk|cheese|feta|greek/i;
    const vegWords = /spinach|broccoli|tomato|pepper|onion|cucumber|avocado|kale|lettuce|carrot|sweet potato|snap pea|berry|berries|banana|apple|lemon|lime|garlic|ginger/i;
    const carbWords = /oat|rice|bread|pasta|potato|quinoa|granola|tortilla/i;
    const pantryWords = /oil|vinegar|soy|tamari|honey|salt|pepper|oregano|cinnamon|chia|almond butter|nut butter/i;

    (meals || []).forEach(function (m) {
      (m.ingredients || []).forEach(function (ing) {
        const n = ing.trim().toLowerCase();
        if (!n || seen.has(n)) return;
        seen.add(n);
        let cat = 'Extras';
        if (proteinWords.test(n)) cat = 'Proteins';
        else if (vegWords.test(n)) cat = 'Vegetables';
        else if (carbWords.test(n)) cat = 'Carbs';
        else if (pantryWords.test(n)) cat = 'Pantry';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(ing.trim());
      });
    });

    const order = ['Proteins', 'Vegetables', 'Carbs', 'Pantry', 'Extras'];
    return order.map(function (cat) {
      const items = (byCategory[cat] || []).filter(Boolean);
      return { category: cat, items };
    }).filter(function (g) { return g.items.length > 0; });
  }

  function openShoppingList() {
    if (!lastGeneratedMenu?.meals) return;
    const groups = buildShoppingList(lastGeneratedMenu.meals);
    shoppingListEl.innerHTML = '';
    groups.forEach(function (g) {
      const section = document.createElement('div');
      section.className = 'shopping-category';
      section.innerHTML = '<div class="shopping-category-title">' + escapeHtml(g.category) + '</div>';
      g.items.forEach(function (item) {
        const row = document.createElement('label');
        row.className = 'shopping-item';
        row.innerHTML = '<input type="checkbox"> <span>' + escapeHtml(item) + '</span>';
        section.appendChild(row);
      });
      shoppingListEl.appendChild(section);
    });
    shoppingOverlay?.classList.remove('hidden');
  }

  btnShoppingList?.addEventListener('click', openShoppingList);
  shoppingClose?.addEventListener('click', function () { shoppingOverlay?.classList.add('hidden'); });
  shoppingOverlay?.addEventListener('click', function (e) {
    if (e.target === shoppingOverlay) shoppingOverlay.classList.add('hidden');
  });

  // ─── Shareable card (canvas export, 9:16 Stories-style) ───
  function openShareCard() {
    if (!lastGeneratedMenu) return;
    const dayLabel = lastGeneratedMenu.dayType === 'wod' ? 'CROSSFIT DAY' : 'REST DAY';

    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    const card = document.getElementById('share-card');
    if (!card || !ctx) return;

    // Draw card background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 360, 640);
    ctx.strokeStyle = '#E8FF00';
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, 348, 628);

    ctx.fillStyle = '#666';
    ctx.font = '11px "Space Grotesk", sans-serif';
    ctx.fillText('AI Proto Lab', 20, 30);

    ctx.fillStyle = '#E8FF00';
    ctx.font = 'bold 28px "Bebas Neue", sans-serif';
    ctx.fillText(dayLabel, 20, 70);

    ctx.fillStyle = '#fff';
    ctx.font = '14px "Space Grotesk", sans-serif';
    const meals = (lastGeneratedMenu.meals || []).map(function (m) { return capitalize(m.mealType) + ': ' + (m.dishName || ''); });
    let y = 100;
    meals.forEach(function (line) {
      ctx.fillText(line, 20, y);
      y += 22;
    });

    ctx.fillStyle = '#a0a0a0';
    ctx.font = '12px "Space Grotesk", sans-serif';
    ctx.fillText('Total: ' + (lastGeneratedMenu.totalCalories || 0) + ' kcal', 20, 620);

    const link = document.createElement('a');
    link.download = 'crossfit-fuel-' + dayLabel.toLowerCase().replace(/\s+/, '-') + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  btnShareCard?.addEventListener('click', openShareCard);

  // ─── New menu ───
  btnNewMenu?.addEventListener('click', function () {
    if (screenMenu) screenMenu.classList.add('hidden');
    if (screenSelector) screenSelector.classList.remove('hidden');
  });

  // ─── API key modal ───
  apiKeyBtn?.addEventListener('click', function () {
    if (apiKeyInput) apiKeyInput.value = getApiKey();
    apiKeyOverlay?.classList.remove('hidden');
  });
  apiKeyClose?.addEventListener('click', function () { apiKeyOverlay?.classList.add('hidden'); });
  apiKeyOverlay?.addEventListener('click', function (e) {
    if (e.target === apiKeyOverlay) apiKeyOverlay.classList.add('hidden');
  });
  apiKeySave?.addEventListener('click', function () {
    setApiKey(apiKeyInput?.value || '');
    apiKeyOverlay?.classList.add('hidden');
  });
})();
