/**
 * CrossFit Fuel — Curated menu bank, no AI. Tags, macro bar, meal blocks.
 *
 * Lógica de fuelStory (por qué cada comida encaja en el día elegido):
 *
 * — DÍA ENTRENO (WOD): El cuerpo necesita carbos para llenar glucógeno y rendir,
 *   proteína para reparar músculo, y timing claro (pre = ligero y rápido; post = ventana recuperación).
 *   Cada fuelStory debe: (1) decir QUÉ aporta el plato al cuerpo y (2) POR QUÉ eso importa
 *   cuando entrenas (energía para el WOD, rellenar glucógeno después, reparar músculo, ventana post‑WOD).
 *
 * — DÍA DESCANSO (REST): No hay sesión que alimentar, así que menos carbos y más foco en
 *   reparación, saciedad y antiinflamatorio. Cada fuelStory debe: (1) decir QUÉ aporta y (2) POR QUÉ
 *   es bueno en día de descanso (reparar sin sobrealimentar, saciedad, menos picos de glucosa, listo para mañana).
 */
(function () {
  'use strict';

  const TAGS_WOD = [
    'High Carbs',
    'Protein Every Meal',
    'Pre-WOD Fuel',
    'Post-WOD Recovery'
  ];
  const TAGS_REST = [
    'Healthy Fats',
    'Anti-inflammatory',
    'Gut Health',
    'Recovery Focus'
  ];
  const MACRO_WOD = { carbs: 50, protein: 30, fat: 20 };
  const MACRO_REST = { carbs: 35, protein: 30, fat: 35 };

  // ─── Curated menu bank ───
  const MENUS_WOD = [
    {
      dayType: 'wod',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Tomato toast with olive oil & scrambled egg',
          ingredients: ['sourdough or wholemeal bread', 'ripe tomato', 'extra virgin olive oil', 'egg', 'salt', 'garlic (optional)'],
          fuelStory: 'On training days your muscles need glycogen to perform. Toast and tomato give quick carbs; olive oil and egg add fat and protein. Simple, fast and very Mediterranean.',
          kcal: 420,
          portions: [
            { amount: 2, unit: 'slices', name: 'bread' },
            { amount: 1, unit: '', name: 'tomato' },
            { amount: 1, unit: '', name: 'egg' }
          ],
          method: ['Toast bread. Grate or mash tomato on top; drizzle olive oil and a little salt. Scramble the egg; serve alongside or on the toast.']
        },
        {
          mealType: 'snackPreWod',
          dishName: 'Banana with a handful of dates',
          ingredients: ['banana', 'dates'],
          timingHint: '60–90 min before training',
          fuelStory: 'Before the WOD you need quick fuel without a full stomach. This gives fast, digestible carbs to top off glycogen so you have energy when the clock starts, and nothing weighing you down.',
          kcal: 180,
          portions: [
            { amount: 1, unit: '', name: 'banana' },
            { amount: 4, unit: '', name: 'dates' }
          ],
          method: ['Have banana and dates 60–90 min before training.']
        },
        {
          mealType: 'lunch',
          dishName: 'Grilled chicken with roasted peppers, spinach & lemon',
          ingredients: ['chicken breast', 'bell peppers', 'spinach', 'extra virgin olive oil', 'lemon', 'garlic', 'oregano'],
          fuelStory: 'After training your body is repairing. Chicken restocks the amino acids your muscles used; peppers and spinach add vitamins and antioxidants. Olive oil and lemon tie it together the Mediterranean way.',
          kcal: 520,
          portions: [
            { amount: 150, unit: 'g', name: 'chicken breast' },
            { amount: 1, unit: 'large', name: 'bell pepper' },
            { amount: 1, unit: 'cup', name: 'spinach' }
          ],
          method: ['Grill or pan-fry chicken with a little oregano. Roast or char the pepper; slice. Sauté spinach with garlic and olive oil. Plate chicken, peppers and spinach; finish with lemon.']
        },
        {
          mealType: 'snackPostWod',
          dishName: 'Greek Yogurt with Berries & Granola',
          ingredients: ['Greek yogurt', 'mixed berries', 'granola', 'drizzle of honey'],
          timingHint: 'Within 30 min after training',
          fuelStory: 'In the first 30–60 min after the WOD your body absorbs protein and carbs best. Yogurt\'s casein supports muscle repair; berries add antioxidants. This hits the recovery window so you rebuild instead of just getting full.',
          kcal: 350,
          portions: [
            { amount: 170, unit: 'g', name: 'Greek yogurt' },
            { amount: 0.5, unit: 'cup', name: 'mixed berries' },
            { amount: 0.25, unit: 'cup', name: 'granola' }
          ],
          method: ['Scoop yogurt into a bowl. Top with berries and granola; drizzle honey if you like.']
        },
        {
          mealType: 'dinner',
          dishName: 'Baked salmon with rice, lemon & green beans',
          ingredients: ['salmon fillet', 'rice', 'green beans', 'extra virgin olive oil', 'lemon', 'garlic', 'herbs'],
          fuelStory: 'Training day dinner has two jobs: refill glycogen and support overnight repair. Salmon\'s omega-3s curb inflammation; rice restocks glycogen; green beans add fibre and folate. Classic Mediterranean combo.',
          kcal: 580,
          portions: [
            { amount: 150, unit: 'g', name: 'salmon fillet' },
            { amount: 180, unit: 'g', name: 'cooked rice' },
            { amount: 100, unit: 'g', name: 'green beans' }
          ],
          method: ['Cook rice. Steam or boil green beans. Bake or pan-fry salmon with olive oil, lemon and herbs. Plate rice, salmon and beans; drizzle with lemon.']
        }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Spanish-style potato & egg tortilla with bread',
          ingredients: ['potato', 'eggs', 'onion', 'olive oil', 'salt', 'bread'],
          fuelStory: 'On training days breakfast must fuel the session. Potato and bread give carbs for glycogen; eggs add protein. A classic Mediterranean start that sits well before training.',
          kcal: 480,
          portions: [
            { amount: 150, unit: 'g', name: 'potato' },
            { amount: 2, unit: '', name: 'eggs' },
            { amount: 1, unit: 'slice', name: 'bread' }
          ],
          method: ['Slice potato and onion; fry gently in olive oil until tender. Beat eggs; add to pan and cook until set. Serve a wedge with bread.']
        },
        {
          mealType: 'snackPreWod',
          dishName: 'Rice cakes with peanut butter & banana',
          ingredients: ['rice cakes', 'peanut butter', 'banana'],
          timingHint: '45–60 min before training',
          fuelStory: 'Pre-WOD you need carbs that digest fast and don\'t sit heavy. Rice cakes and banana give quick glucose; a little peanut butter avoids a sugar crash. So you\'re fueled for the rower or barbell without stomach issues.',
          kcal: 220,
          portions: [
            { amount: 2, unit: '', name: 'rice cakes' },
            { amount: 1, unit: 'tbsp', name: 'peanut butter' }
          ],
          method: ['Spread peanut butter on rice cakes. Add banana slices. Eat 45–60 min before training.']
        },
        {
          mealType: 'lunch',
          dishName: 'Chicken, rice & vegetable bowl with olive oil & lemon',
          ingredients: ['chicken breast', 'rice', 'courgette', 'tomato', 'olive oil', 'lemon', 'herbs'],
          fuelStory: 'After (or between) training your body needs protein to repair and carbs to refill glycogen. Chicken and rice deliver both; courgette and tomato add volume and antioxidants. Olive oil and lemon keep it Mediterranean.',
          kcal: 540,
          portions: [
            { amount: 140, unit: 'g', name: 'chicken breast' },
            { amount: 180, unit: 'g', name: 'cooked rice' }
          ],
          method: ['Cook chicken and rice. Sauté courgette and tomato with herbs. Build bowl with rice, sliced chicken and veg; dress with olive oil and lemon.']
        },
        {
          mealType: 'snackPostWod',
          dishName: 'Chocolate milk-style shake',
          ingredients: ['cow milk or soy milk', 'cocoa powder', 'banana'],
          timingHint: 'Within 30 min after training',
          fuelStory: 'Right after the WOD your muscles are primed to take in protein and carbs. Milk and banana replace glycogen and kick off repair in one drink, no chewing, just recovery.',
          kcal: 320,
          portions: [
            { amount: 250, unit: 'ml', name: 'milk' },
            { amount: 1, unit: '', name: 'banana' }
          ],
          method: ['Blend milk, banana and cocoa until smooth. Drink within 30 min after training.']
        },
        {
          mealType: 'dinner',
          dishName: 'Baked chicken with peppers, rice & lemon',
          ingredients: ['chicken thigh or breast', 'bell peppers', 'onion', 'rice', 'olive oil', 'lemon', 'oregano', 'garlic'],
          fuelStory: 'Training-day dinner should restock glycogen and support overnight repair. Chicken and rice deliver protein and carbs; peppers and lemon keep it Mediterranean and easy to digest.',
          kcal: 600,
          portions: [
            { amount: 160, unit: 'g', name: 'chicken' },
            { amount: 180, unit: 'g', name: 'cooked rice' }
          ],
          method: ['Cook rice. Bake chicken with peppers, onion, olive oil, garlic and oregano until golden. Serve with rice and a squeeze of lemon.']
        }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Spanish tortilla with spinach & bread',
          ingredients: ['potato', 'eggs', 'spinach', 'onion', 'olive oil', 'bread'],
          fuelStory: 'On a training day you need carbs for the session and protein for repair. Potato and bread give glycogen; eggs add protein. A classic Mediterranean breakfast that fuels the WOD.',
          kcal: 500,
          portions: [
            { amount: 150, unit: 'g', name: 'potato' },
            { amount: 2, unit: '', name: 'eggs' },
            { amount: 1, unit: 'slice', name: 'bread' }
          ],
          method: ['Slice potato and onion; fry gently in olive oil until tender. Wilt spinach; beat in eggs and cook until set. Serve a wedge with bread.']
        },
        {
          mealType: 'snackPreWod',
          dishName: 'Toast with jam',
          ingredients: ['white or sourdough bread', 'jam'],
          timingHint: '30–45 min before training',
          fuelStory: 'Right before the WOD you need quick glucose without fiber or bulk. Toast and jam give fast carbs so your muscles have fuel when you need it, and your stomach stays light.',
          kcal: 180,
          portions: [
            { amount: 2, unit: 'slices', name: 'bread' }
          ],
          method: ['Toast bread. Spread jam. Eat 30–45 min before training.']
        },
        {
          mealType: 'lunch',
          dishName: 'Salmon with farro, tomato & basil',
          ingredients: ['salmon fillet', 'farro', 'cherry tomatoes', 'basil', 'olive oil', 'lemon', 'garlic'],
          fuelStory: 'After training you need to refill glycogen and calm inflammation. Salmon\'s omega-3s help recovery; farro restocks carbs; tomato and basil add antioxidants. Mediterranean in one bowl.',
          kcal: 560,
          portions: [
            { amount: 140, unit: 'g', name: 'salmon' },
            { amount: 160, unit: 'g', name: 'cooked farro' }
          ],
          method: ['Cook farro. Bake or pan-fry salmon. Toss warm farro with tomatoes, basil, garlic, olive oil and lemon. Plate with salmon.']
        },
        {
          mealType: 'snackPostWod',
          dishName: 'Greek yogurt with honey & walnuts',
          ingredients: ['Greek yogurt', 'honey', 'walnuts'],
          timingHint: '30–60 min after training',
          fuelStory: 'In the recovery window, protein and carbs together boost muscle repair and glycogen refill. Yogurt and honey deliver both; walnuts add a bit of fat. So you kick off recovery without a heavy meal.',
          kcal: 320,
          portions: [
            { amount: 170, unit: 'g', name: 'Greek yogurt' },
            { amount: 15, unit: 'g', name: 'walnuts' }
          ],
          method: ['Scoop yogurt into a bowl. Drizzle honey and top with walnuts.']
        },
        {
          mealType: 'dinner',
          dishName: 'Prawns with garlic, lemon, rice & green beans',
          ingredients: ['prawns', 'rice', 'green beans', 'garlic', 'lemon', 'olive oil', 'parsley'],
          fuelStory: 'Training-day dinner: protein for overnight repair and carbs to restock glycogen. Prawns are light and high in protein; rice refuels. Garlic, lemon and olive oil keep it Mediterranean.',
          kcal: 540,
          portions: [
            { amount: 140, unit: 'g', name: 'prawns (peeled)' },
            { amount: 180, unit: 'g', name: 'cooked rice' }
          ],
          method: ['Cook rice and green beans. Sauté prawns with garlic and olive oil; finish with lemon and parsley. Serve with rice and beans.']
        }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Toast with smoked salmon, olive oil & lemon',
          ingredients: ['sourdough or rye bread', 'smoked salmon', 'extra virgin olive oil', 'lemon', 'capers or dill'],
          fuelStory: 'On training days you need carbs to fill glycogen and protein to protect muscle. Toast and salmon deliver both. Simple and very Mediterranean.',
          kcal: 480,
          portions: [
            { amount: 2, unit: 'slices', name: 'bread' },
            { amount: 60, unit: 'g', name: 'smoked salmon' }
          ],
          method: ['Toast bread. Drizzle with olive oil; add smoked salmon, a squeeze of lemon and capers or dill.']
        },
        {
          mealType: 'snackPreWod',
          dishName: 'Orange & handful of pretzels',
          ingredients: ['orange', 'pretzels'],
          timingHint: '45–60 min before training',
          fuelStory: 'Pre-WOD you need light, quick carbs and a bit of fluid so you\'re not hungry and not heavy. Pretzels and a drink give exactly that, easy to eat even when you\'re not hungry yet.',
          kcal: 200,
          portions: [
            { amount: 1, unit: '', name: 'orange' },
            { amount: 25, unit: 'g', name: 'pretzels' }
          ]
        },
        {
          mealType: 'lunch',
          dishName: 'Chicken, rice & vegetable salad with olive oil & lemon',
          ingredients: ['chicken breast', 'rice', 'cucumber', 'tomato', 'olive oil', 'lemon', 'herbs'],
          fuelStory: 'After training you need protein to repair and carbs to refill. Chicken and rice give both; cucumber and tomato add freshness. Olive oil and lemon dress it the Mediterranean way.',
          kcal: 540,
          portions: [
            { amount: 150, unit: 'g', name: 'chicken breast' },
            { amount: 180, unit: 'g', name: 'cooked rice' }
          ],
          method: ['Cook chicken and rice. Dice chicken; combine with rice, cucumber and tomato. Dress with olive oil, lemon and herbs.']
        },
        {
          mealType: 'snackPostWod',
          dishName: 'Smoothie: berries, yogurt & oats',
          ingredients: ['mixed berries', 'Greek yogurt', 'oats', 'milk'],
          timingHint: 'Within 30 min after training',
          fuelStory: 'In the recovery window your body takes in protein and carbs best. A shake delivers both without chewing, so you kick off repair and glycogen refill even when you\'re not ready for a full meal.',
          kcal: 340,
          portions: [
            { amount: 0.5, unit: 'cup', name: 'mixed berries' },
            { amount: 30, unit: 'g', name: 'oats' }
          ],
          method: ['Blend berries, yogurt, oats and milk until smooth. Drink within 30 min after training.']
        },
        {
          mealType: 'dinner',
          dishName: 'Lentil & vegetable stew with egg',
          ingredients: ['brown or green lentils', 'carrot', 'onion', 'tomato', 'celery', 'olive oil', 'egg', 'herbs'],
          fuelStory: 'Training-day dinner: protein for overnight repair and carbs to restock glycogen. Lentils bring plant protein and fibre; vegetables add volume. Top with a fried egg for extra protein. Classic Mediterranean comfort.',
          kcal: 560,
          portions: [
            { amount: 120, unit: 'g', name: 'dried lentils (cooked)' },
            { amount: 1, unit: '', name: 'egg' }
          ],
          method: ['Simmer lentils with carrot, onion, tomato and celery in olive oil until tender. Serve in a bowl with a fried egg on top.']
        }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Breakfast Burrito with Eggs & Sweet Potato',
          ingredients: ['eggs', 'sweet potato', 'whole wheat tortilla', 'spinach', 'salsa', 'olive oil'],
          fuelStory: 'On training days you need portable fuel that lasts. Eggs and sweet potato give protein and steady carbs, so you stay fueled through long WODs or a late session without a sugar crash.',
          kcal: 500,
          portions: [
            { amount: 2, unit: '', name: 'eggs' },
            { amount: 80, unit: 'g', name: 'sweet potato' }
          ],
          method: ['Scramble eggs. Cook diced sweet potato; warm tortilla. Layer eggs, potato, spinach and salsa; roll up.']
        },
        {
          mealType: 'snackPreWod',
          dishName: 'Banana & small latte',
          ingredients: ['banana', 'milk', 'espresso'],
          timingHint: '60–90 min before training',
          fuelStory: 'Pre-WOD you sometimes need a quick wake-up and a bit of glucose. Coffee and a small sweet hit give that without a full stomach, so you get on the barbell alert and fueled.',
          kcal: 190,
          portions: [
            { amount: 1, unit: '', name: 'banana' }
          ],
          method: ['Have banana with your coffee 60–90 min before training.']
        },
        {
          mealType: 'lunch',
          dishName: 'Chicken & Quinoa Power Salad',
          ingredients: ['chicken breast', 'quinoa', 'mixed leaves', 'olive oil', 'lemon'],
          fuelStory: 'After training your body needs protein to repair and carbs to refill glycogen. This bowl delivers both with volume and crunch, so you recover without a heavy slump before the next session.',
          kcal: 540,
          portions: [
            { amount: 140, unit: 'g', name: 'chicken breast' },
            { amount: 150, unit: 'g', name: 'cooked quinoa' }
          ],
          method: ['Cook chicken and quinoa. Toss mixed leaves with olive oil and lemon; top with sliced chicken and quinoa.']
        },
        {
          mealType: 'snackPostWod',
          dishName: 'Cottage cheese with pineapple & seeds',
          ingredients: ['cottage cheese', 'pineapple', 'pumpkin seeds'],
          timingHint: '30–60 min after training',
          fuelStory: 'Post-WOD recovery can extend into the evening. Cottage cheese gives slow-digesting protein; fruit adds a bit of sugar. So the repair signal stays on without a heavy meal before bed.',
          kcal: 300,
          portions: [
            { amount: 150, unit: 'g', name: 'cottage cheese' },
            { amount: 0.5, unit: 'cup', name: 'pineapple chunks' }
          ],
          method: ['Scoop cottage cheese into a bowl. Top with pineapple and pumpkin seeds.']
        },
        {
          mealType: 'dinner',
          dishName: 'Pasta with Chicken & Roasted Veg',
          ingredients: ['pasta', 'chicken breast', 'zucchini', 'tomato', 'olive oil', 'parmesan'],
          fuelStory: 'Training-day dinner should restock glycogen and support overnight repair. This plate gives carbs to refill, protein to repair, and vegetables for digestion and nutrients, so you wake recovered and ready for tomorrow.',
          kcal: 650,
          portions: [
            { amount: 75, unit: 'g', name: 'dry pasta' },
            { amount: 130, unit: 'g', name: 'chicken breast' }
          ],
          method: ['Cook pasta. Roast or sauté zucchini and tomato. Pan-fry chicken; slice. Toss pasta with veg, chicken, olive oil and parmesan.']
        }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        { mealType: 'breakfast', dishName: 'Rice with fried egg, tomato & olive oil', ingredients: ['rice', 'egg', 'tomato', 'olive oil', 'garlic', 'salt'], fuelStory: 'On training days breakfast must fuel the session. Rice gives carbs for glycogen; egg and tomato add protein and freshness. A Mediterranean-style start before an early WOD.', kcal: 460, portions: [{ amount: 150, unit: 'g', name: 'cooked rice' }, { amount: 2, unit: '', name: 'eggs' }], method: ['Cook rice. Fry eggs in olive oil. Serve rice with a quick tomato and garlic mix (or fresh tomato) and the eggs on top.'] },
        { mealType: 'snackPreWod', dishName: 'Mashed banana on rice cakes', ingredients: ['banana', 'rice cakes'], timingHint: '45–60 min before', fuelStory: 'Pre-WOD you need quick carbs without bulk. Banana and rice cakes give simple sugars and light volume so your stomach stays light when you train.', kcal: 200, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 2, unit: '', name: 'rice cakes' }], method: ['Mash or slice banana on rice cakes. Eat 45–60 min before training.'] },
        { mealType: 'lunch', dishName: 'Pork Tenderloin with Quinoa & Roasted Veg', ingredients: ['pork tenderloin', 'quinoa', 'bell peppers', 'zucchini', 'olive oil'], fuelStory: 'After training you need protein to repair and carbs to refill. Pork and quinoa deliver both, so you recover without feeling heavy or sluggish.', kcal: 580, portions: [{ amount: 140, unit: 'g', name: 'pork tenderloin' }, { amount: 160, unit: 'g', name: 'cooked quinoa' }], method: ['Roast pork and veg. Cook quinoa. Slice pork; plate with quinoa and roasted peppers and zucchini.'] },
        { mealType: 'snackPostWod', dishName: 'Protein shake & banana', ingredients: ['protein powder', 'banana', 'milk or water'], timingHint: 'Within 30 min', fuelStory: 'In the recovery window protein and carbs together boost repair and glycogen refill. A shake and banana deliver both fast, so recovery starts right after the WOD.', kcal: 280, portions: [{ amount: 1, unit: 'scoop', name: 'protein powder' }, { amount: 1, unit: '', name: 'banana' }], method: ['Blend protein with milk or water; have with banana within 30 min after training.'] },
        { mealType: 'dinner', dishName: 'Turkey Meatballs with Marinara & Spaghetti', ingredients: ['ground turkey', 'pasta', 'tomato sauce', 'garlic', 'basil'], fuelStory: 'Training-day dinner should restock glycogen and support overnight repair. Turkey and pasta give protein and carbs in a format you\'ll actually eat, so you close the day ready for tomorrow.', kcal: 620, portions: [{ amount: 130, unit: 'g', name: 'ground turkey' }, { amount: 70, unit: 'g', name: 'dry spaghetti' }], method: ['Shape turkey into meatballs; brown in a pan. Add tomato sauce, garlic and basil; simmer. Cook pasta; toss with sauce and meatballs.'] }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        { mealType: 'breakfast', dishName: 'Sweet Potato Hash with Eggs & Spinach', ingredients: ['sweet potato', 'eggs', 'spinach', 'onion', 'olive oil'], fuelStory: 'On training days you need carbs and protein from the start. Sweet potato and eggs give both so you have steady energy through the morning and into a midday WOD.', kcal: 490, portions: [{ amount: 150, unit: 'g', name: 'sweet potato' }, { amount: 2, unit: '', name: 'eggs' }], method: ['Dice sweet potato and onion; pan-fry in olive oil until tender. Wilt spinach; push to one side and fry eggs. Serve together.'] },
        { mealType: 'snackPreWod', dishName: 'Oat bar & small apple', ingredients: ['oat bar', 'apple'], timingHint: '60 min before', fuelStory: 'Pre-WOD you need portable fuel that digests in time. Oat bar and apple give carbs and a bit of fiber, easy to eat on the go so you\'re fueled when you hit the box.', kcal: 220, portions: [{ amount: 1, unit: '', name: 'oat bar' }, { amount: 1, unit: '', name: 'apple' }], method: ['Have oat bar and apple 60 min before training.'] },
        { mealType: 'lunch', dishName: 'Tuna Niçoise-Style Bowl with Rice', ingredients: ['tuna', 'rice', 'green beans', 'egg', 'olives', 'olive oil'], fuelStory: 'After training your body needs protein to repair and carbs to refill. Tuna and rice deliver both; greens and olives add nutrients. So you recover without feeling heavy.', kcal: 560, portions: [{ amount: 120, unit: 'g', name: 'tuna' }, { amount: 180, unit: 'g', name: 'cooked rice' }], method: ['Cook rice and green beans; hard-boil egg. Flake tuna over rice; add beans, quartered egg and olives. Drizzle olive oil.'] },
        { mealType: 'snackPostWod', dishName: 'Milk & honey with almonds', ingredients: ['milk', 'honey', 'almonds'], timingHint: 'Within 30 min', fuelStory: 'Right after the WOD your muscles take in protein and carbs best. Milk and honey give both; almonds add a touch of fat. So you kick off recovery without a full meal.', kcal: 300, portions: [{ amount: 250, unit: 'ml', name: 'milk' }, { amount: 15, unit: 'g', name: 'almonds' }], method: ['Stir honey into milk; have with almonds within 30 min after training.'] },
        { mealType: 'dinner', dishName: 'Grilled beef with rosemary, roast potatoes & green salad', ingredients: ['beef steak', 'potato', 'rosemary', 'olive oil', 'mixed greens', 'lemon'], fuelStory: 'Training-day dinner: protein for overnight repair and carbs to restock glycogen. Beef and potatoes deliver both; rosemary and olive oil keep it Mediterranean.', kcal: 620, portions: [{ amount: 150, unit: 'g', name: 'beef steak' }, { amount: 200, unit: 'g', name: 'potato' }], method: ['Roast potato wedges with rosemary and olive oil. Grill or pan-fry steak. Toss greens with olive oil and lemon; serve with steak and potatoes.'] }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        { mealType: 'breakfast', dishName: 'Toast with olive oil, tomato & soft egg', ingredients: ['bread', 'ripe tomato', 'extra virgin olive oil', 'eggs', 'salt'], fuelStory: 'On training days you need carbs to fill glycogen before the WOD. Toast and tomato give quick carbs; egg and olive oil add protein and fat. A Mediterranean start.', kcal: 480, portions: [{ amount: 2, unit: 'slices', name: 'bread' }, { amount: 2, unit: '', name: 'eggs' }], method: ['Toast bread. Grate or mash tomato on top; drizzle olive oil and salt. Fry eggs soft; serve on the side or on the toast.'] },
        { mealType: 'snackPreWod', dishName: 'Dried fruit & nuts (small handful)', ingredients: ['dried apricots', 'almonds'], timingHint: '45–60 min before', fuelStory: 'Pre-WOD you need quick, portable fuel. Dried fruit gives dense carbs; a few nuts add a bit of fat so you don\'t spike and crash. No prep, no mess, just fuel when you need it.', kcal: 180, portions: [{ amount: 30, unit: 'g', name: 'dried fruit' }, { amount: 10, unit: 'g', name: 'almonds' }], method: ['Have a small handful 45–60 min before training.'] },
        { mealType: 'lunch', dishName: 'Chicken, rice & lemon soup', ingredients: ['chicken breast', 'rice', 'carrot', 'celery', 'lemon', 'olive oil', 'herbs'], fuelStory: 'After training you need protein to repair and carbs to refill. Chicken and rice soup is easy to digest and delivers both. Lemon and herbs give it a Mediterranean lift.', kcal: 460, portions: [{ amount: 120, unit: 'g', name: 'chicken breast' }, { amount: 80, unit: 'g', name: 'rice' }], method: ['Simmer chicken in broth with rice, carrot and celery until tender. Shred chicken; return to pot. Finish with lemon, olive oil and herbs.'] },
        { mealType: 'snackPostWod', dishName: 'Cream cheese & jam on crackers', ingredients: ['cream cheese', 'jam', 'crackers'], timingHint: 'Within 30 min', fuelStory: 'In the recovery window you need fast carbs and some protein. Crackers with jam and cream cheese give both, tasty and effective so you kick off repair without a heavy meal.', kcal: 260, portions: [{ amount: 30, unit: 'g', name: 'cream cheese' }, { amount: 4, unit: '', name: 'crackers' }], method: ['Spread cream cheese and jam on crackers. Eat within 30 min after training.'] },
        { mealType: 'dinner', dishName: 'Lamb Chops with Couscous & Roasted Veg', ingredients: ['lamb chops', 'couscous', 'eggplant', 'tomato', 'olive oil'], fuelStory: 'Training-day dinner: protein for overnight repair and carbs to restock glycogen. Lamb and couscous deliver both, so you close a big day recovered and ready for tomorrow\'s session.', kcal: 660, portions: [{ amount: 140, unit: 'g', name: 'lamb chops' }, { amount: 150, unit: 'g', name: 'cooked couscous' }], method: ['Cook couscous. Roast eggplant and tomato. Grill or pan-fry lamb chops. Plate with couscous and veg.'] }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        { mealType: 'breakfast', dishName: 'Muesli with Milk, Banana & Honey', ingredients: ['muesli', 'milk', 'banana', 'honey'], fuelStory: 'On training days breakfast should give steady carbs and some protein. Muesli, banana and milk deliver that so your energy holds through the morning and into the WOD.', kcal: 460, portions: [{ amount: 70, unit: 'g', name: 'muesli' }, { amount: 200, unit: 'ml', name: 'milk' }], method: ['Pour muesli into a bowl; add milk. Slice banana on top and drizzle honey.'] },
        { mealType: 'snackPreWod', dishName: 'Smoothie: banana, oats, milk', ingredients: ['banana', 'oats', 'milk'], timingHint: '60 min before', fuelStory: 'Pre-WOD you need carbs that digest in time. A smoothie gives drinkable carbs and a bit of protein, easy when you don\'t feel like chewing, so you\'re fueled without a full stomach.', kcal: 280, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 30, unit: 'g', name: 'oats' }], method: ['Blend banana, oats and milk until smooth. Drink 60 min before training.'] },
        { mealType: 'lunch', dishName: 'White fish with potatoes, olive oil & lemon', ingredients: ['white fish fillet', 'potato', 'olive oil', 'lemon', 'garlic', 'parsley'], fuelStory: 'After training you need protein to repair and carbs to refill. Fish and potatoes deliver both. Olive oil and lemon keep it simple and Mediterranean.', kcal: 520, portions: [{ amount: 130, unit: 'g', name: 'white fish' }, { amount: 180, unit: 'g', name: 'potato' }], method: ['Boil or roast potatoes. Bake or pan-fry fish with olive oil, garlic and lemon. Serve with parsley.'] },
        { mealType: 'snackPostWod', dishName: 'Yogurt pot with granola & berries', ingredients: ['yogurt', 'granola', 'berries'], timingHint: 'Within 30 min', fuelStory: 'Right after the WOD your body absorbs protein and carbs best. Yogurt and granola give both in one cup, so you hit the recovery window and kick off repair without a full meal.', kcal: 320, portions: [{ amount: 150, unit: 'g', name: 'yogurt' }, { amount: 30, unit: 'g', name: 'granola' }], method: ['Scoop yogurt into a bowl. Top with granola and berries.'] },
        { mealType: 'dinner', dishName: 'Lemon & herb chicken with rice & greens', ingredients: ['chicken thigh', 'rice', 'lemon', 'garlic', 'oregano', 'olive oil', 'spinach or green beans'], fuelStory: 'Training-day dinner should restock glycogen and support overnight repair. Chicken and rice give protein and carbs; lemon and herbs keep it light and Mediterranean.', kcal: 600, portions: [{ amount: 150, unit: 'g', name: 'chicken thigh' }, { amount: 180, unit: 'g', name: 'cooked rice' }], method: ['Cook rice. Bake or pan-fry chicken with lemon, garlic, oregano and olive oil. Serve with rice and wilted greens or green beans.'] }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        { mealType: 'breakfast', dishName: 'Rice bowl with egg, avocado & tomato', ingredients: ['rice', 'egg', 'avocado', 'tomato', 'olive oil', 'lemon', 'salt'], fuelStory: 'On training days breakfast must fuel the session. Rice gives carbs for glycogen; egg and avocado add protein and fat. Tomato and olive oil make it Mediterranean.', kcal: 500, portions: [{ amount: 160, unit: 'g', name: 'cooked rice' }, { amount: 1, unit: '', name: 'egg' }], method: ['Warm rice in a bowl. Fry egg; place on rice. Add sliced avocado and tomato; drizzle olive oil and lemon.'] },
        { mealType: 'snackPreWod', dishName: 'Pear & handful of grapes', ingredients: ['pear', 'grapes'], timingHint: '45–60 min before', fuelStory: 'Pre-WOD you need quick carbs without bulk. Pear and grapes give fruit-based glucose, light and quick so your stomach stays empty when you train.', kcal: 160, portions: [{ amount: 1, unit: '', name: 'pear' }, { amount: 80, unit: 'g', name: 'grapes' }], method: ['Have pear and grapes 45–60 min before training.'] },
        { mealType: 'lunch', dishName: 'Sardines on Toast with Tomato & Greens', ingredients: ['sardines', 'bread', 'tomato', 'arugula', 'lemon'], fuelStory: 'After training you need protein to repair and carbs to refill. Sardines bring omega-3s and protein; toast restocks glycogen. So you recover and calm inflammation in one simple meal.', kcal: 500, portions: [{ amount: 1, unit: 'can', name: 'sardines' }, { amount: 2, unit: 'slices', name: 'bread' }], method: ['Toast bread. Top with sardines, tomato slices and arugula; finish with lemon.'] },
        { mealType: 'snackPostWod', dishName: 'Chia pudding with fruit', ingredients: ['chia seeds', 'milk', 'mango', 'coconut'], timingHint: 'Within 30 min', fuelStory: 'In the recovery window you need protein and carbs. Chia and milk give both; fruit adds quick glucose. So you kick off repair after a hot WOD without a heavy meal.', kcal: 290, portions: [{ amount: 25, unit: 'g', name: 'chia seeds' }, { amount: 150, unit: 'ml', name: 'milk' }], method: ['Mix chia and milk; leave in fridge until set. Top with mango and coconut.'] },
        { mealType: 'dinner', dishName: 'Stuffed Bell Peppers with Beef & Rice', ingredients: ['ground beef', 'rice', 'bell peppers', 'tomato', 'herbs'], fuelStory: 'Training-day dinner should restock glycogen and support overnight repair. Beef and rice give protein and carbs in one dish, so you recover through the night and wake ready to train again.', kcal: 600, portions: [{ amount: 120, unit: 'g', name: 'ground beef' }, { amount: 150, unit: 'g', name: 'cooked rice' }], method: ['Cook rice and beef with tomato and herbs. Halve peppers; stuff with mixture. Bake until peppers are tender.'] }
      ]
    }
  ];

  const MENUS_REST = [
    {
      dayType: 'rest',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Eggs & Avocado on Sourdough',
          ingredients: ['eggs', 'avocado', 'sourdough bread', 'cherry tomatoes', 'salt', 'pepper'],
          fuelStory: 'On rest days you\'re not burning glycogen in a WOD, so you need less carbs and more focus on repair and satiety. Eggs and avocado give protein and healthy fats so you stay full and your body keeps repairing, rest day is part of the work.',
          kcal: 450,
          portions: [
            { amount: 2, unit: '', name: 'eggs' },
            { amount: 0.5, unit: '', name: 'avocado' },
            { amount: 1, unit: 'slice', name: 'sourdough bread' }
          ],
          method: ['Toast bread. Fry or scramble eggs. Mash avocado on toast; top with eggs and halved tomatoes. Season with salt and pepper.']
        },
        {
          mealType: 'lunch',
          dishName: 'Mediterranean Chickpea Bowl',
          ingredients: ['chickpeas', 'cucumber', 'tomato', 'red onion', 'feta', 'olive oil', 'oregano', 'lemon'],
          fuelStory: 'On a rest day you don\'t need a big carb hit. Chickpeas give plant protein and fiber for steady energy; olive oil and feta add fat for satiety. So you stay full and support recovery, for repair, energy and satiety.',
          kcal: 400,
          portions: [
            { amount: 1, unit: 'cup', name: 'cooked chickpeas' },
            { amount: 0.5, unit: 'cup', name: 'chopped cucumber & tomato' }
          ],
          method: ['Combine chickpeas with diced cucumber, tomato and red onion. Add crumbled feta; dress with olive oil, oregano and lemon.']
        },
        {
          mealType: 'dinner',
          dishName: 'Beef with peppers, tomato & olive oil over rice',
          ingredients: ['lean beef', 'bell peppers', 'tomato', 'onion', 'olive oil', 'garlic', 'rice', 'herbs'],
          fuelStory: 'Rest-day dinner: you need protein for repair and veggies for nutrients. Beef brings iron; peppers and tomato add volume and antioxidants. Olive oil and herbs keep it Mediterranean.',
          kcal: 520,
          portions: [
            { amount: 120, unit: 'g', name: 'lean beef' },
            { amount: 150, unit: 'g', name: 'cooked rice' }
          ],
          method: ['Cook rice. Sauté beef with peppers, onion and tomato in olive oil and garlic. Serve over rice with herbs.']
        },
        {
          mealType: 'snack',
          dishName: 'Apple Slices with Almond Butter',
          ingredients: ['apple', 'almond butter', 'cinnamon'],
          fuelStory: 'On rest days snacks should satisfy without spiking blood sugar. Apple and almond butter give fiber and fat for steady energy and hunger control, so you don\'t overeat and you support recovery.',
          kcal: 250,
          portions: [
            { amount: 1, unit: '', name: 'apple' },
            { amount: 1, unit: 'tbsp', name: 'almond butter' }
          ],
          method: ['Slice apple; serve with almond butter. Sprinkle cinnamon if you like.']
        }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Yogurt with walnuts, honey & orange',
          ingredients: ['Greek or natural yogurt', 'walnuts', 'honey', 'orange', 'cinnamon (optional)'],
          fuelStory: 'On rest days breakfast can be lower in carbs and higher in protein and fat. Yogurt and walnuts give satiety and support repair. Honey and orange keep it Mediterranean and fresh.',
          kcal: 400,
          portions: [
            { amount: 170, unit: 'g', name: 'yogurt' },
            { amount: 15, unit: 'g', name: 'walnuts' }
          ],
          method: ['Scoop yogurt into a bowl. Top with walnuts, a drizzle of honey and orange segments. Add cinnamon if you like.']
        },
        {
          mealType: 'lunch',
          dishName: 'Quinoa with roasted vegetables & olive oil',
          ingredients: ['quinoa', 'courgette', 'aubergine', 'bell peppers', 'extra virgin olive oil', 'oregano', 'lemon'],
          fuelStory: 'Rest day lunch: you need nutrients and satisfaction without a big carb load. Quinoa and roasted veg give plant protein and fibre. Olive oil and lemon make it Mediterranean.',
          kcal: 420,
          portions: [
            { amount: 150, unit: 'g', name: 'cooked quinoa' },
            { amount: 1, unit: 'cup', name: 'roasted vegetables' }
          ],
          method: ['Cook quinoa. Roast courgette, aubergine and peppers with olive oil and oregano. Serve with a squeeze of lemon.']
        },
        {
          mealType: 'dinner',
          dishName: 'Herbed Chicken Thighs with Roasted Veg',
          ingredients: ['chicken thighs', 'carrots', 'Brussels sprouts', 'olive oil', 'garlic', 'thyme'],
          fuelStory: 'On a rest day dinner should support repair, energy and satiety. Chicken thighs give protein and a bit of fat; roasted veg add volume and nutrients. So you repair and sleep well without the extra carbs you\'d need on a training day.',
          kcal: 560,
          portions: [
            { amount: 150, unit: 'g', name: 'chicken thighs' },
            { amount: 1, unit: 'cup', name: 'roasted vegetables' }
          ],
          method: ['Rub chicken with garlic and thyme; roast with carrots and Brussels sprouts in olive oil until golden and cooked through.']
        },
        {
          mealType: 'snack',
          dishName: 'Carrot sticks with hummus',
          ingredients: ['carrots', 'hummus', 'paprika'],
          fuelStory: 'Rest-day snacks should curb hunger without spiking insulin. Carrots and hummus give fiber and a bit of protein, so you stay satisfied and support recovery without overeating.',
          kcal: 220,
          portions: [
            { amount: 100, unit: 'g', name: 'carrot sticks' },
            { amount: 40, unit: 'g', name: 'hummus' }
          ],
          method: ['Serve carrot sticks with hummus. Dust with paprika if you like.']
        }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Veggie Omelette with Feta',
          ingredients: ['eggs', 'spinach', 'mushrooms', 'feta', 'olive oil'],
          fuelStory: 'On rest days you don\'t need a carb-heavy start. This omelette gives protein and fat from eggs and feta, plus veg for volume. So you stay full and support repair without fuel you won\'t burn today.',
          kcal: 430,
          portions: [
            { amount: 2, unit: '', name: 'eggs' },
            { amount: 0.5, unit: 'cup', name: 'mixed vegetables' }
          ],
          method: ['Sauté spinach and mushrooms in olive oil. Pour in beaten eggs; add crumbled feta. Fold omelette and serve.']
        },
        {
          mealType: 'lunch',
          dishName: 'Tuna with white beans, olive oil & lemon',
          ingredients: ['canned tuna', 'cannellini beans', 'red onion', 'olive oil', 'lemon', 'parsley'],
          fuelStory: 'On rest days you need protein for repair without a big carb load. Tuna and white beans give protein and fibre. Olive oil and lemon make it a classic Mediterranean combo.',
          kcal: 400,
          portions: [
            { amount: 1, unit: 'can', name: 'tuna' },
            { amount: 0.75, unit: 'cup', name: 'white beans' }
          ],
          method: ['Drain tuna and beans. Combine with sliced red onion; dress with olive oil, lemon and parsley. Serve at room temperature.']
        },
        {
          mealType: 'dinner',
          dishName: 'Lentil Soup with Greens',
          ingredients: ['lentils', 'spinach', 'carrots', 'onion', 'vegetable broth', 'olive oil'],
          fuelStory: 'Rest-day dinner: you need protein and fiber without excess carbs. Lentils give plant protein and slow-release energy; greens add volume. So you repair and stay satisfied without loading up for a session you didn\'t do.',
          kcal: 480,
          portions: [
            { amount: 1, unit: 'cup', name: 'cooked lentils' },
            { amount: 1, unit: 'cup', name: 'broth & vegetables' }
          ],
          method: ['Sauté onion and carrot; add lentils and broth. Simmer until lentils are tender. Stir in spinach; season with olive oil.']
        },
        {
          mealType: 'snack',
          dishName: 'Dark chocolate & almonds',
          ingredients: ['dark chocolate', 'almonds'],
          fuelStory: 'On rest days snacks should satisfy without spiking blood sugar. Dark chocolate and almonds give fat and a touch of sweetness, so you curb cravings and avoid overeating while your body focuses on repair.',
          kcal: 230,
          portions: [
            { amount: 15, unit: 'g', name: 'dark chocolate' },
            { amount: 15, unit: 'g', name: 'almonds' }
          ],
          method: ['Have a few squares of dark chocolate with almonds.']
        }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Chia Pudding with Berries',
          ingredients: ['chia seeds', 'milk or plant milk', 'berries', 'vanilla'],
          fuelStory: 'On rest days breakfast can be lower in carbs and higher in fat and fiber. Chia and milk give both; berries add light sweetness. So you stay full and support recovery without the carb load you\'d need on a training day.',
          kcal: 380,
          portions: [
            { amount: 30, unit: 'g', name: 'chia seeds' },
            { amount: 200, unit: 'ml', name: 'milk' }
          ],
          method: ['Mix chia and milk; leave in fridge overnight or until set. Top with berries and a drop of vanilla.']
        },
        {
          mealType: 'lunch',
          dishName: 'Grain-free Chicken Salad Plate',
          ingredients: ['chicken breast', 'mixed greens', 'avocado', 'olive oil', 'lemon'],
          fuelStory: 'Rest-day lunch: you need protein for repair without a big carb hit. Chicken and avocado give protein and healthy fats; greens add volume. So you stay full and support recovery without the refuel load of a training day.',
          kcal: 420,
          portions: [
            { amount: 130, unit: 'g', name: 'chicken breast' },
            { amount: 1, unit: 'cup', name: 'mixed greens' }
          ],
          method: ['Cook or slice chicken. Toss greens with avocado, olive oil and lemon; top with chicken.']
        },
        {
          mealType: 'dinner',
          dishName: 'Baked Cod with Roasted Vegetables',
          ingredients: ['cod fillet', 'broccoli', 'carrots', 'olive oil', 'lemon'],
          fuelStory: 'Rest-day dinner should support repair without excess carbs. Cod gives lean protein; roasted veg add nutrients and volume. So you close the day recovered and ready for tomorrow without overloading your system.',
          kcal: 440,
          portions: [
            { amount: 150, unit: 'g', name: 'cod fillet' },
            { amount: 1, unit: 'cup', name: 'roasted vegetables' }
          ],
          method: ['Roast broccoli and carrots. Bake cod with lemon and olive oil. Serve cod with roasted veg.']
        },
        {
          mealType: 'snack',
          dishName: 'Yogurt with cinnamon & seeds',
          ingredients: ['plain yogurt', 'mixed seeds', 'cinnamon'],
          fuelStory: 'On rest days snacks should bridge hunger without spiking insulin. Yogurt and seeds give protein and a bit of fat, so you stay satisfied and support repair without the quick carbs you\'d need around a WOD.',
          kcal: 210,
          portions: [
            { amount: 120, unit: 'g', name: 'yogurt' },
            { amount: 10, unit: 'g', name: 'mixed seeds' }
          ],
          method: ['Scoop yogurt into a bowl. Sprinkle cinnamon and seeds.']
        }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Overnight oats with berries & peanut butter',
          ingredients: ['oats', 'milk or plant milk', 'berries', 'peanut butter'],
          fuelStory: 'On rest days you need less carb and more satiety. Overnight oats with peanut butter give a smaller carb portion and more fat, so you stay full and support repair without the fuel load of a training-day breakfast.',
          kcal: 420,
          portions: [
            { amount: 40, unit: 'g', name: 'oats' },
            { amount: 200, unit: 'ml', name: 'milk' }
          ],
          method: ['Mix oats and milk; leave in fridge overnight. In the morning top with berries and peanut butter.']
        },
        {
          mealType: 'lunch',
          dishName: 'Stuffed Sweet Potato with Black Beans & Salsa',
          ingredients: ['sweet potato', 'black beans', 'salsa', 'Greek yogurt'],
          fuelStory: 'Rest-day lunch: you need satisfaction and nutrients without a big refuel. Sweet potato and black beans give fiber, plant protein and slow carbs, so you stay full and support recovery without the glycogen load of a training day.',
          kcal: 460,
          portions: [
            { amount: 1, unit: 'medium', name: 'sweet potato' },
            { amount: 0.75, unit: 'cup', name: 'black beans' }
          ],
          method: ['Bake or microwave sweet potato until tender. Split open; top with black beans, salsa and a dollop of yogurt.']
        },
        {
          mealType: 'dinner',
          dishName: 'Turkey Lettuce Taco Night',
          ingredients: ['ground turkey', 'lettuce', 'tomato', 'cheese', 'salsa'],
          fuelStory: 'Rest-day dinner: protein for repair without a heavy carb load. Turkey in lettuce wraps gives the fun of tacos with fewer carbs, so you repair and enjoy the meal, for repair, energy and satiety.',
          kcal: 520,
          portions: [
            { amount: 140, unit: 'g', name: 'ground turkey (cooked)' },
            { amount: 4, unit: 'leaves', name: 'lettuce' }
          ],
          method: ['Cook turkey with taco-style spices. Serve in lettuce leaves with tomato, cheese and salsa.']
        },
        {
          mealType: 'snack',
          dishName: 'Cottage cheese with cucumber & olive oil',
          ingredients: ['cottage cheese', 'cucumber', 'olive oil', 'pepper'],
          fuelStory: 'On rest days snacks should satisfy without spiking blood sugar. Cottage cheese and cucumber give protein and volume, so you curb hunger and support repair without reaching for quick carbs.',
          kcal: 230,
          portions: [
            { amount: 150, unit: 'g', name: 'cottage cheese' },
            { amount: 0.5, unit: '', name: 'cucumber' }
          ],
          method: ['Scoop cottage cheese into a bowl. Add diced cucumber; drizzle olive oil and pepper.']
        }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        { mealType: 'breakfast', dishName: 'Smoked Salmon & Cream Cheese on Rye', ingredients: ['smoked salmon', 'cream cheese', 'rye bread', 'capers'], fuelStory: 'On rest days breakfast can focus on protein and fat instead of carbs. Smoked salmon and cream cheese give both, so you stay full and support repair without the glycogen load you\'d need on a training day.', kcal: 420, portions: [{ amount: 60, unit: 'g', name: 'smoked salmon' }, { amount: 1, unit: 'slice', name: 'rye bread' }], method: ['Toast rye. Spread cream cheese; add smoked salmon and capers.'] },
        { mealType: 'lunch', dishName: 'White Bean & Tuna Salad with Olive Oil', ingredients: ['cannellini beans', 'tuna', 'red onion', 'olive oil', 'lemon'], fuelStory: 'Rest-day lunch: you need protein and satisfaction without a big carb hit. White beans and tuna give protein and fiber, so you stay full and support recovery with anti-inflammatory, steady energy.', kcal: 450, portions: [{ amount: 1, unit: 'cup', name: 'white beans' }, { amount: 80, unit: 'g', name: 'tuna' }], method: ['Combine beans, flaked tuna and sliced red onion. Dress with olive oil and lemon.'] },
        { mealType: 'dinner', dishName: 'Roast Chicken with Root Vegetables', ingredients: ['chicken leg', 'carrots', 'parsnip', 'onion', 'olive oil'], fuelStory: 'Rest-day dinner should support repair without excess carbs. Chicken and root veg give protein and nutrients, so you close the day recovered and ready for tomorrow without the refuel load of a training day.', kcal: 520, portions: [{ amount: 150, unit: 'g', name: 'chicken leg' }, { amount: 1, unit: 'cup', name: 'root vegetables' }], method: ['Roast chicken leg with carrots, parsnip and onion in olive oil until golden and cooked through.'] },
        { mealType: 'snack', dishName: 'Handful of olives & cherry tomatoes', ingredients: ['olives', 'cherry tomatoes'], fuelStory: 'On rest days snacks should curb hunger without spiking blood sugar. Olives and tomatoes give fat and a bit of volume, so you tide yourself over and support recovery without reaching for quick carbs.', kcal: 120, portions: [{ amount: 30, unit: 'g', name: 'olives' }, { amount: 6, unit: '', name: 'cherry tomatoes' }], method: ['Serve olives with cherry tomatoes.'] }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        { mealType: 'breakfast', dishName: 'Cottage Cheese Bowl with Peach & Mint', ingredients: ['cottage cheese', 'peach', 'mint', 'walnuts'], fuelStory: 'On rest days breakfast can lean on protein and moderate carbs. Cottage cheese and peach give both, so you stay full and support repair without the big carb load of a training-day start.', kcal: 350, portions: [{ amount: 180, unit: 'g', name: 'cottage cheese' }, { amount: 1, unit: '', name: 'peach' }], method: ['Scoop cottage cheese into a bowl. Top with sliced peach, mint and walnuts.'] },
        { mealType: 'lunch', dishName: 'Grilled Halloumi & Watermelon Salad', ingredients: ['halloumi', 'watermelon', 'cucumber', 'mint', 'olive oil'], fuelStory: 'Rest-day lunch: you need protein and satisfaction without a heavy refuel. Halloumi and watermelon give protein, hydration and a lighter carb hit, so you stay full and support recovery, for repair, energy and satiety.', kcal: 440, portions: [{ amount: 100, unit: 'g', name: 'halloumi' }, { amount: 150, unit: 'g', name: 'watermelon' }], method: ['Grill or pan-fry halloumi. Combine with watermelon, cucumber and mint; dress with olive oil.'] },
        { mealType: 'dinner', dishName: 'Mackerel with Roasted Fennel & Lemon', ingredients: ['mackerel', 'fennel', 'lemon', 'olive oil'], fuelStory: 'Rest-day dinner: protein and healthy fats for repair without a big carb load. Mackerel\'s omega-3s support recovery; fennel adds volume and nutrients. So you close the day recovered and ready for tomorrow.', kcal: 480, portions: [{ amount: 150, unit: 'g', name: 'mackerel' }, { amount: 1, unit: 'bulb', name: 'fennel' }], method: ['Roast fennel in olive oil. Bake or pan-fry mackerel with lemon. Serve together.'] },
        { mealType: 'snack', dishName: 'Rice cake with almond butter', ingredients: ['rice cake', 'almond butter'], fuelStory: 'On rest days snacks should satisfy without spiking insulin. Rice cake and almond butter give a bit of carb and fat, so you curb hunger and support recovery without the quick-fuel load you\'d need before a WOD.', kcal: 180, portions: [{ amount: 1, unit: '', name: 'rice cake' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }], method: ['Spread almond butter on rice cake.'] }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        { mealType: 'breakfast', dishName: 'Shakshuka with Feta & Whole Grain Bread', ingredients: ['eggs', 'tomato', 'bell pepper', 'feta', 'bread'], fuelStory: 'Protein and veg in one pan. Rest-day brunch done right.', kcal: 460, portions: [{ amount: 2, unit: '', name: 'eggs' }, { amount: 1, unit: 'slice', name: 'bread' }], method: ['Sauté tomato and pepper; make wells and crack in eggs. Top with feta; serve with toast.'] },
        { mealType: 'lunch', dishName: 'Falafel Plate with Tahini & Salad', ingredients: ['falafel', 'tahini', 'cucumber', 'tomato', 'lettuce'], fuelStory: 'Plant protein and fat. Satisfying without weighing you down.', kcal: 480, portions: [{ amount: 5, unit: '', name: 'falafel' }, { amount: 2, unit: 'tbsp', name: 'tahini' }], method: ['Warm or fry falafel. Serve with tahini and salad of cucumber, tomato and lettuce.'] },
        { mealType: 'dinner', dishName: 'Pork Chop with Apple & Cabbage Slaw', ingredients: ['pork chop', 'apple', 'cabbage', 'apple cider vinegar'], fuelStory: 'Protein and a touch of sweet. Cozy rest-day dinner.', kcal: 510, portions: [{ amount: 140, unit: 'g', name: 'pork chop' }, { amount: 0.5, unit: '', name: 'apple' }], method: ['Pan-fry or grill pork chop. Shred cabbage; toss with grated apple and vinegar for slaw. Serve together.'] },
        { mealType: 'snack', dishName: 'Dates stuffed with almond butter', ingredients: ['dates', 'almond butter'], fuelStory: 'Natural sugar and fat. Small but satisfying.', kcal: 200, portions: [{ amount: 3, unit: '', name: 'dates' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }], method: ['Slit dates and fill with almond butter.'] }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        { mealType: 'breakfast', dishName: 'Smoothie Bowl: Banana, Spinach, Almond Milk & Toppings', ingredients: ['banana', 'spinach', 'almond milk', 'granola', 'coconut'], fuelStory: 'Light start. Fiber and healthy fats without dairy.', kcal: 380, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 1, unit: 'cup', name: 'spinach' }], method: ['Blend banana, spinach and almond milk until thick. Pour into a bowl; top with granola and coconut.'] },
        { mealType: 'lunch', dishName: 'Caprese Salad with Grilled Chicken', ingredients: ['chicken breast', 'mozzarella', 'tomato', 'basil', 'olive oil'], fuelStory: 'Classic combo. Protein and fat, minimal carbs.', kcal: 470, portions: [{ amount: 100, unit: 'g', name: 'chicken breast' }, { amount: 80, unit: 'g', name: 'mozzarella' }], method: ['Grill chicken. Layer tomato, mozzarella and basil; dress with olive oil. Serve with sliced chicken.'] },
        { mealType: 'dinner', dishName: 'Baked Trout with Herbed Potatoes & Greens', ingredients: ['trout', 'potato', 'dill', 'green beans', 'lemon'], fuelStory: 'Lean fish and starch. Simple and satisfying.', kcal: 500, portions: [{ amount: 150, unit: 'g', name: 'trout' }, { amount: 120, unit: 'g', name: 'potato' }], method: ['Roast potatoes with dill. Bake trout with lemon. Steam green beans. Serve together.'] },
        { mealType: 'snack', dishName: 'Pear with a wedge of cheese', ingredients: ['pear', 'hard cheese'], fuelStory: 'Fruit and fat. Rest-day snack that feels like a treat.', kcal: 220, portions: [{ amount: 1, unit: '', name: 'pear' }, { amount: 25, unit: 'g', name: 'cheese' }], method: ['Serve pear with a wedge of cheese.'] }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        { mealType: 'breakfast', dishName: 'Buckwheat Porridge with Berries & Seeds', ingredients: ['buckwheat', 'berries', 'pumpkin seeds', 'almond milk'], fuelStory: 'Gluten-free grains and antioxidants. Steady energy for a slow morning.', kcal: 400, portions: [{ amount: 50, unit: 'g', name: 'buckwheat' }, { amount: 0.5, unit: 'cup', name: 'berries' }], method: ['Cook buckwheat in almond milk until soft. Top with berries and pumpkin seeds.'] },
        { mealType: 'lunch', dishName: 'Asian-Style Chicken Salad with Rice Noodles', ingredients: ['chicken', 'rice noodles', 'cabbage', 'carrot', 'lime', 'fish sauce'], fuelStory: 'Light but filling. Protein and just enough carbs.', kcal: 460, portions: [{ amount: 120, unit: 'g', name: 'chicken' }, { amount: 80, unit: 'g', name: 'rice noodles' }], method: ['Cook noodles and chicken. Toss with shredded cabbage, carrot, lime and fish sauce.'] },
        { mealType: 'dinner', dishName: 'Vegetable & Lentil Shepherd\'s Pie', ingredients: ['lentils', 'potato', 'carrots', 'peas', 'onion'], fuelStory: 'Comfort food with plant protein. Rest-day classic.', kcal: 490, portions: [{ amount: 1, unit: 'cup', name: 'lentils' }, { amount: 150, unit: 'g', name: 'potato mash' }], method: ['Cook lentils with carrot, peas and onion. Top with mashed potato; bake until golden.'] },
        { mealType: 'snack', dishName: 'Roasted chickpeas (small handful)', ingredients: ['chickpeas', 'olive oil', 'spices'], fuelStory: 'Crunchy, savory. Protein and fiber in one bite.', kcal: 150, portions: [{ amount: 40, unit: 'g', name: 'roasted chickpeas' }], method: ['Toss chickpeas in olive oil and spices; roast until crispy.'] }
      ]
    }
  ];

  const MENUS_WOD_VEGAN = [{
    dayType: 'wod',
    meals: [
      {
        mealType: 'breakfast',
        dishName: 'Oat Bowl with Banana, Chia & Almond Butter',
        ingredients: ['rolled oats', 'banana', 'almond butter', 'chia seeds', 'cinnamon'],
        fuelStory: 'Steady glucose and glycogen support without animal products. Chia adds protein and staying power.',
        kcal: 420,
        portions: [
          { amount: 60, unit: 'g', name: 'rolled oats' },
          { amount: 1, unit: '', name: 'banana' },
          { amount: 1, unit: 'tbsp', name: 'almond butter' }
        ],
        method: ['Cook oats with water or plant milk until creamy. Top with banana, chia, almond butter and cinnamon.']
      },
      {
        mealType: 'snackPreWod',
        dishName: 'Banana with dates',
        ingredients: ['banana', 'dates'],
        timingHint: '60–90 min before training',
        fuelStory: 'Fast carbs to top off glycogen. Light on the stomach.',
        kcal: 180,
        portions: [
          { amount: 1, unit: '', name: 'banana' },
          { amount: 4, unit: '', name: 'dates' }
        ],
        method: ['Have banana and dates 60–90 min before training.']
      },
      {
        mealType: 'lunch',
        dishName: 'Chickpea & Sweet Potato Bowl with Greens',
        ingredients: ['chickpeas', 'sweet potato', 'spinach', 'olive oil', 'lemon', 'tahini'],
        fuelStory: 'Plant-based protein and complex carbs. Anti-inflammatory, satisfying.',
        kcal: 480,
        portions: [
          { amount: 1, unit: 'cup', name: 'cooked chickpeas' },
          { amount: 1, unit: 'medium', name: 'sweet potato' },
          { amount: 1, unit: 'cup', name: 'spinach' }
        ],
        method: ['Roast or steam sweet potato. Warm chickpeas; toss spinach with lemon and tahini. Plate chickpeas, potato and greens; dress with olive oil.']
      },
      {
        mealType: 'snackPostWod',
        dishName: 'Smoothie: Banana, Spinach, Pea Protein & Oat Milk',
        ingredients: ['banana', 'spinach', 'pea protein', 'oat milk'],
        timingHint: 'Within 30 min after training',
        fuelStory: 'Fast protein and carbs for the recovery window. No dairy.',
        kcal: 320,
        portions: [
          { amount: 1, unit: '', name: 'banana' },
          { amount: 1, unit: 'cup', name: 'spinach' }
        ],
        method: ['Blend banana, spinach, pea protein and oat milk until smooth. Drink within 30 min after training.']
      },
      {
        mealType: 'dinner',
        dishName: 'Tofu Stir-Fry with Rice & Broccoli',
        ingredients: ['tofu', 'jasmine rice', 'broccoli', 'tamari', 'ginger', 'sesame oil'],
        fuelStory: 'Tofu delivers protein for repair. Rice refills glycogen. Broccoli adds fiber and micronutrients.',
        kcal: 520,
        portions: [
          { amount: 150, unit: 'g', name: 'tofu' },
          { amount: 200, unit: 'g', name: 'cooked jasmine rice' },
          { amount: 1, unit: 'cup', name: 'broccoli florets' }
        ],
        method: ['Cook rice. Pan-fry or bake tofu; stir-fry with broccoli, tamari, ginger and sesame oil. Serve over rice.']
      }
    ]
  },
  {
    dayType: 'wod',
    meals: [
      { mealType: 'breakfast', dishName: 'Chia Pudding with Banana & Almond Butter', ingredients: ['chia seeds', 'oat milk', 'banana', 'almond butter'], fuelStory: 'Plant-based protein and fat. Steady energy without dairy.', kcal: 420, portions: [{ amount: 35, unit: 'g', name: 'chia seeds' }, { amount: 1, unit: '', name: 'banana' }], method: ['Mix chia and oat milk; leave in fridge until set. Top with banana and almond butter.'] },
      { mealType: 'snackPreWod', dishName: 'Dates & banana', ingredients: ['dates', 'banana'], timingHint: '60–90 min before', fuelStory: 'Fast carbs. Light and digestible.', kcal: 200, portions: [{ amount: 4, unit: '', name: 'dates' }, { amount: 1, unit: '', name: 'banana' }], method: ['Have dates and banana 60–90 min before training.'] },
      { mealType: 'lunch', dishName: 'Lentil & Sweet Potato Curry with Rice', ingredients: ['lentils', 'sweet potato', 'coconut milk', 'rice', 'curry spices'], fuelStory: 'Plant protein and complex carbs. Satisfying and anti-inflammatory.', kcal: 540, portions: [{ amount: 1, unit: 'cup', name: 'cooked lentils' }, { amount: 180, unit: 'g', name: 'cooked rice' }], method: ['Cook rice. Simmer lentils with diced sweet potato, coconut milk and curry spices. Serve over rice.'] },
      { mealType: 'snackPostWod', dishName: 'Smoothie: banana, pea protein, oat milk', ingredients: ['banana', 'pea protein', 'oat milk'], timingHint: 'Within 30 min', fuelStory: 'Quick protein and carbs. No dairy.', kcal: 300, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 1, unit: 'scoop', name: 'pea protein' }], method: ['Blend banana, pea protein and oat milk. Drink within 30 min after training.'] },
      { mealType: 'dinner', dishName: 'Tempeh & Veggie Stir-Fry with Rice', ingredients: ['tempeh', 'rice', 'broccoli', 'bell pepper', 'tamari', 'ginger'], fuelStory: 'Fermented soy for protein. Rice for glycogen. Clean and simple.', kcal: 550, portions: [{ amount: 120, unit: 'g', name: 'tempeh' }, { amount: 200, unit: 'g', name: 'cooked rice' }], method: ['Cook rice. Stir-fry tempeh with broccoli and pepper; add tamari and ginger. Serve over rice.'] }
    ]
  },
  {
    dayType: 'wod',
    meals: [
      { mealType: 'breakfast', dishName: 'Overnight Oats with Berries & Tahini', ingredients: ['oats', 'oat milk', 'berries', 'tahini', 'maple syrup'], fuelStory: 'No dairy. Oats and seeds for staying power.', kcal: 450, portions: [{ amount: 60, unit: 'g', name: 'oats' }, { amount: 1, unit: 'tbsp', name: 'tahini' }], method: ['Mix oats and oat milk; leave in fridge overnight. Top with berries, tahini and maple syrup.'] },
      { mealType: 'snackPreWod', dishName: 'Rice cakes with almond butter', ingredients: ['rice cakes', 'almond butter'], timingHint: '45–60 min before', fuelStory: 'Light carbs and fat. Easy on the stomach.', kcal: 220, portions: [{ amount: 2, unit: '', name: 'rice cakes' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }], method: ['Spread almond butter on rice cakes. Eat 45–60 min before training.'] },
      { mealType: 'lunch', dishName: 'Black Bean & Quinoa Bowl with Avocado', ingredients: ['black beans', 'quinoa', 'avocado', 'lime', 'cilantro'], fuelStory: 'Complete plant protein and carbs. Big bowl energy.', kcal: 560, portions: [{ amount: 1, unit: 'cup', name: 'black beans' }, { amount: 150, unit: 'g', name: 'cooked quinoa' }], method: ['Cook quinoa and warm beans. Bowl with avocado, lime and cilantro.'] },
      { mealType: 'snackPostWod', dishName: 'Vegan protein shake & banana', ingredients: ['vegan protein powder', 'banana', 'oat milk'], timingHint: 'Within 30 min', fuelStory: 'Plant protein and fast carbs for recovery.', kcal: 280, portions: [{ amount: 1, unit: 'scoop', name: 'vegan protein' }, { amount: 1, unit: '', name: 'banana' }], method: ['Blend vegan protein with oat milk; have with banana within 30 min after training.'] },
      { mealType: 'dinner', dishName: 'Coconut Chickpea Curry with Jasmine Rice', ingredients: ['chickpeas', 'coconut milk', 'rice', 'spinach', 'curry paste'], fuelStory: 'Creamy and satisfying. Plant-based refuel.', kcal: 580, portions: [{ amount: 1.5, unit: 'cup', name: 'chickpeas' }, { amount: 180, unit: 'g', name: 'cooked rice' }], method: ['Cook rice. Sauté curry paste; add chickpeas, coconut milk and spinach. Simmer; serve over rice.'] }
    ]
  },
  {
    dayType: 'wod',
    meals: [
      { mealType: 'breakfast', dishName: 'Avocado Toast with Tomato & Hemp Seeds', ingredients: ['sourdough', 'avocado', 'tomato', 'hemp seeds'], fuelStory: 'Healthy fats and carbs. No animal products.', kcal: 430, portions: [{ amount: 2, unit: 'slices', name: 'bread' }, { amount: 0.5, unit: '', name: 'avocado' }], method: ['Toast bread. Mash avocado on top; add tomato slices and hemp seeds.'] },
      { mealType: 'snackPreWod', dishName: 'Banana & handful of dried figs', ingredients: ['banana', 'dried figs'], timingHint: '60 min before', fuelStory: 'Natural sugars. Quick energy.', kcal: 210, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 3, unit: '', name: 'figs' }], method: ['Have banana and figs 60 min before training.'] },
      { mealType: 'lunch', dishName: 'Falafel Wrap with Hummus & Salad', ingredients: ['falafel', 'tortilla', 'hummus', 'lettuce', 'tomato'], fuelStory: 'Chickpea power. Portable and filling.', kcal: 520, portions: [{ amount: 4, unit: '', name: 'falafel' }, { amount: 1, unit: '', name: 'tortilla' }], method: ['Warm falafel and tortilla. Spread hummus; add lettuce, tomato and falafel; roll.'] },
      { mealType: 'snackPostWod', dishName: 'Oat milk latte & date bar', ingredients: ['oat milk', 'espresso', 'date bar'], timingHint: 'Within 30 min', fuelStory: 'Carbs and a bit of caffeine. Vegan recovery.', kcal: 260, portions: [{ amount: 1, unit: '', name: 'date bar' }], method: ['Have oat milk latte with a date bar within 30 min after training.'] },
      { mealType: 'dinner', dishName: 'Lentil Bolognese with Pasta', ingredients: ['lentils', 'pasta', 'tomato', 'onion', 'garlic', 'basil'], fuelStory: 'Plant-based bolognese. Carbs and protein in a classic format.', kcal: 590, portions: [{ amount: 1, unit: 'cup', name: 'cooked lentils' }, { amount: 80, unit: 'g', name: 'dry pasta' }], method: ['Cook lentils with tomato, onion, garlic and basil into a sauce. Cook pasta; toss with sauce.'] }
    ]
  },
  {
    dayType: 'wod',
    meals: [
      { mealType: 'breakfast', dishName: 'Smoothie Bowl: Acai, Banana, Granola & Coconut', ingredients: ['acai', 'banana', 'granola', 'coconut', 'plant milk'], fuelStory: 'Antioxidants and carbs. Instagram-worthy fuel.', kcal: 480, portions: [{ amount: 100, unit: 'g', name: 'acai' }, { amount: 1, unit: '', name: 'banana' }], method: ['Blend acai, banana and plant milk until thick. Pour into a bowl; top with granola and coconut.'] },
      { mealType: 'snackPreWod', dishName: 'Apple with almond butter', ingredients: ['apple', 'almond butter'], timingHint: '45–60 min before', fuelStory: 'Fiber and fat. Steady release.', kcal: 250, portions: [{ amount: 1, unit: '', name: 'apple' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }], method: ['Slice apple; serve with almond butter. Eat 45–60 min before training.'] },
      { mealType: 'lunch', dishName: 'Edamame & Brown Rice Bowl with Tahini', ingredients: ['edamame', 'brown rice', 'tahini', 'cucumber', 'lime'], fuelStory: 'Soy protein and whole grains. Clean and filling.', kcal: 530, portions: [{ amount: 1, unit: 'cup', name: 'edamame' }, { amount: 180, unit: 'g', name: 'cooked brown rice' }], method: ['Cook rice. Top with edamame, cucumber, tahini and lime.'] },
      { mealType: 'snackPostWod', dishName: 'Vegan yogurt with berries & granola', ingredients: ['coconut or soy yogurt', 'berries', 'granola'], timingHint: 'Within 30 min', fuelStory: 'Plant-based recovery. No dairy.', kcal: 320, portions: [{ amount: 150, unit: 'g', name: 'vegan yogurt' }, { amount: 30, unit: 'g', name: 'granola' }], method: ['Scoop yogurt into a bowl. Top with berries and granola.'] },
      { mealType: 'dinner', dishName: 'Spiced Cauliflower & Chickpea Bowl with Quinoa', ingredients: ['cauliflower', 'chickpeas', 'quinoa', 'turmeric', 'tahini'], fuelStory: 'Roasted veg and legumes. Anti-inflammatory and satisfying.', kcal: 540, portions: [{ amount: 1, unit: 'cup', name: 'chickpeas' }, { amount: 150, unit: 'g', name: 'cooked quinoa' }], method: ['Roast cauliflower and chickpeas with turmeric. Cook quinoa. Bowl with tahini.'] }
    ]
  }
  ];

  const MENUS_REST_VEGAN = [{
    dayType: 'rest',
    meals: [
      {
        mealType: 'breakfast',
        dishName: 'Avocado Toast with Cherry Tomatoes',
        ingredients: ['sourdough bread', 'avocado', 'cherry tomatoes', 'salt', 'pepper'],
        fuelStory: 'Quality fat and moderate carbs. Satiety and repair without a big carb load.',
        kcal: 380,
        portions: [
          { amount: 1, unit: 'slice', name: 'sourdough bread' },
          { amount: 0.5, unit: '', name: 'avocado' },
          { amount: 4, unit: '', name: 'cherry tomatoes' }
        ],
        method: ['Toast bread. Mash avocado on top; add halved cherry tomatoes. Season with salt and pepper.']
      },
      {
        mealType: 'lunch',
        dishName: 'Mediterranean Chickpea Bowl',
        ingredients: ['chickpeas', 'cucumber', 'tomato', 'red onion', 'olive oil', 'oregano', 'lemon'],
        fuelStory: 'Plant-based, anti-inflammatory, satisfying. Rest-day plate.',
        kcal: 380,
        portions: [
          { amount: 1, unit: 'cup', name: 'cooked chickpeas' },
          { amount: 0.5, unit: 'cup', name: 'cucumber & tomato' }
        ],
        method: ['Combine chickpeas with diced cucumber, tomato and red onion. Dress with olive oil, oregano and lemon.']
      },
      {
        mealType: 'dinner',
        dishName: 'Lentil & Vegetable Curry with Rice',
        ingredients: ['lentils', 'coconut milk', 'bell peppers', 'spinach', 'rice', 'curry spices'],
        fuelStory: 'Lentils bring protein and fiber. Moderate carbs. Supports repair and readiness.',
        kcal: 500,
        portions: [
          { amount: 1, unit: 'cup', name: 'cooked lentils' },
          { amount: 150, unit: 'g', name: 'cooked rice' }
        ],
        method: ['Cook rice. Simmer lentils with coconut milk, bell peppers, spinach and curry spices. Serve over rice.']
      },
      {
        mealType: 'snack',
        dishName: 'Apple Slices with Almond Butter',
        ingredients: ['apple', 'almond butter', 'cinnamon'],
        fuelStory: 'Light snack. Steady blood sugar. Enough for a rest day.',
        kcal: 250,
        portions: [
          { amount: 1, unit: '', name: 'apple' },
          { amount: 1, unit: 'tbsp', name: 'almond butter' }
        ],
        method: ['Slice apple; serve with almond butter. Sprinkle cinnamon if you like.']
      }
    ]
  },
  {
    dayType: 'rest',
    meals: [
      { mealType: 'breakfast', dishName: 'Oatmeal with Walnuts, Cinnamon & Banana', ingredients: ['oats', 'walnuts', 'cinnamon', 'banana', 'plant milk'], fuelStory: 'Warm and simple. No dairy.', kcal: 400, portions: [{ amount: 50, unit: 'g', name: 'oats' }, { amount: 15, unit: 'g', name: 'walnuts' }], method: ['Cook oats in plant milk. Top with banana, walnuts and cinnamon.'] },
      { mealType: 'lunch', dishName: 'Hummus & Roasted Veggie Plate', ingredients: ['hummus', 'zucchini', 'eggplant', 'bell pepper', 'olive oil'], fuelStory: 'Fiber and plant protein. Rest-day comfort.', kcal: 420, portions: [{ amount: 80, unit: 'g', name: 'hummus' }, { amount: 1.5, unit: 'cup', name: 'roasted veg' }], method: ['Roast zucchini, eggplant and pepper in olive oil. Serve with hummus.'] },
      { mealType: 'dinner', dishName: 'Red Lentil Dahl with Rice & Spinach', ingredients: ['red lentils', 'rice', 'spinach', 'coconut milk', 'spices'], fuelStory: 'Warming and nourishing. Plant-based recovery.', kcal: 500, portions: [{ amount: 1, unit: 'cup', name: 'cooked lentils' }, { amount: 150, unit: 'g', name: 'cooked rice' }], method: ['Cook rice. Simmer red lentils with coconut milk and spices; stir in spinach. Serve over rice.'] },
      { mealType: 'snack', dishName: 'Orange & handful of almonds', ingredients: ['orange', 'almonds'], fuelStory: 'Vitamin C and fat. Light rest-day snack.', kcal: 200, portions: [{ amount: 1, unit: '', name: 'orange' }, { amount: 15, unit: 'g', name: 'almonds' }], method: ['Have orange with a handful of almonds.'] }
    ]
  },
  {
    dayType: 'rest',
    meals: [
      { mealType: 'breakfast', dishName: 'Tofu Scramble with Turmeric & Greens', ingredients: ['tofu', 'turmeric', 'spinach', 'olive oil', 'nutritional yeast'], fuelStory: 'Savory vegan breakfast. Protein and greens.', kcal: 380, portions: [{ amount: 150, unit: 'g', name: 'tofu' }, { amount: 1, unit: 'cup', name: 'spinach' }], method: ['Crumble tofu into a pan with olive oil; add turmeric and nutritional yeast. Wilt in spinach.'] },
      { mealType: 'lunch', dishName: 'Quinoa Salad with Roasted Beet & Tahini', ingredients: ['quinoa', 'beet', 'tahini', 'arugula', 'lemon'], fuelStory: 'Color and protein. Satisfying without heaviness.', kcal: 440, portions: [{ amount: 120, unit: 'g', name: 'cooked quinoa' }, { amount: 1, unit: 'medium', name: 'beet' }], method: ['Cook quinoa. Roast beet; dice. Toss quinoa with arugula, beet and tahini; add lemon.'] },
      { mealType: 'dinner', dishName: 'Mushroom & Lentil Stroganoff with Rice', ingredients: ['mushrooms', 'lentils', 'rice', 'coconut cream', 'paprika'], fuelStory: 'Creamy and plant-based. Rest-day comfort food.', kcal: 480, portions: [{ amount: 150, unit: 'g', name: 'mushrooms' }, { amount: 0.75, unit: 'cup', name: 'cooked lentils' }], method: ['Cook rice. Sauté mushrooms; add lentils, coconut cream and paprika. Simmer; serve over rice.'] },
      { mealType: 'snack', dishName: 'Rice cake with peanut butter', ingredients: ['rice cake', 'peanut butter'], fuelStory: 'Simple and satisfying.', kcal: 190, portions: [{ amount: 1, unit: '', name: 'rice cake' }, { amount: 1, unit: 'tbsp', name: 'peanut butter' }], method: ['Spread peanut butter on rice cake.'] }
    ]
  },
  {
    dayType: 'rest',
    meals: [
      { mealType: 'breakfast', dishName: 'Chia Pudding with Mango & Coconut', ingredients: ['chia seeds', 'coconut milk', 'mango', 'coconut flakes'], fuelStory: 'Tropical and light. No dairy.', kcal: 390, portions: [{ amount: 30, unit: 'g', name: 'chia seeds' }, { amount: 150, unit: 'ml', name: 'coconut milk' }], method: ['Mix chia and coconut milk; leave in fridge until set. Top with mango and coconut flakes.'] },
      { mealType: 'lunch', dishName: 'Mediterranean White Bean Salad', ingredients: ['white beans', 'cucumber', 'tomato', 'red onion', 'olive oil', 'oregano'], fuelStory: 'Plant protein and freshness. Rest-day classic.', kcal: 400, portions: [{ amount: 1, unit: 'cup', name: 'white beans' }, { amount: 0.5, unit: 'cup', name: 'chopped veg' }], method: ['Combine white beans with diced cucumber, tomato and red onion. Dress with olive oil and oregano.'] },
      { mealType: 'dinner', dishName: 'Stuffed Peppers with Rice & Black Beans', ingredients: ['bell peppers', 'rice', 'black beans', 'corn', 'salsa'], fuelStory: 'All-in-one plant dinner. Filling and simple.', kcal: 470, portions: [{ amount: 2, unit: '', name: 'bell peppers' }, { amount: 0.5, unit: 'cup', name: 'black beans' }], method: ['Cook rice and black beans; mix with corn and salsa. Halve peppers; stuff and bake until tender.'] },
      { mealType: 'snack', dishName: 'Celery sticks with almond butter', ingredients: ['celery', 'almond butter'], fuelStory: 'Crunch and fat. Light snack.', kcal: 180, portions: [{ amount: 3, unit: 'sticks', name: 'celery' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }], method: ['Serve celery sticks with almond butter.'] }
    ]
  },
  {
    dayType: 'rest',
    meals: [
      { mealType: 'breakfast', dishName: 'Buckwheat Pancakes with Berries & Maple Syrup', ingredients: ['buckwheat flour', 'oat milk', 'berries', 'maple syrup'], fuelStory: 'Gluten-free and vegan. Rest-day treat.', kcal: 420, portions: [{ amount: 60, unit: 'g', name: 'buckwheat flour' }, { amount: 0.5, unit: 'cup', name: 'berries' }], method: ['Mix buckwheat flour with oat milk into a batter. Cook pancakes in a pan; top with berries and maple syrup.'] },
      { mealType: 'lunch', dishName: 'Sushi-Style Bowl: Rice, Avocado, Cucumber & Edamame', ingredients: ['sushi rice', 'avocado', 'cucumber', 'edamame', 'rice vinegar'], fuelStory: 'Fresh and light. Plant-based and satisfying.', kcal: 450, portions: [{ amount: 150, unit: 'g', name: 'cooked rice' }, { amount: 0.5, unit: '', name: 'avocado' }], method: ['Cook rice; season with rice vinegar. Top with avocado, cucumber and edamame.'] },
      { mealType: 'dinner', dishName: 'Vegetable Tagine with Chickpeas & Couscous', ingredients: ['chickpeas', 'couscous', 'apricot', 'carrot', 'spices'], fuelStory: 'Warming and aromatic. Plant protein and carbs.', kcal: 490, portions: [{ amount: 1, unit: 'cup', name: 'chickpeas' }, { amount: 120, unit: 'g', name: 'cooked couscous' }], method: ['Simmer chickpeas with carrot, apricot and spices. Cook couscous; serve tagine over couscous.'] },
      { mealType: 'snack', dishName: 'Dark chocolate & dried cranberries', ingredients: ['dark chocolate', 'dried cranberries'], fuelStory: 'Small treat. Antioxidants and a touch of sweet.', kcal: 210, portions: [{ amount: 20, unit: 'g', name: 'dark chocolate' }, { amount: 20, unit: 'g', name: 'cranberries' }], method: ['Have a few squares of dark chocolate with dried cranberries.'] }
    ]
  }
  ];

  // Gluten-free: no wheat, barley, rye. Use rice, quinoa, oats (certified GF), corn, etc.
  const MENUS_WOD_GLUTEN_FREE = [
    { dayType: 'wod', meals: [
      { mealType: 'breakfast', dishName: 'Rice & Egg Bowl with Avocado & Salsa', ingredients: ['rice', 'eggs', 'avocado', 'salsa'], fuelStory: 'Gluten-free carbs and protein. Simple and effective.', kcal: 480, portions: [{ amount: 160, unit: 'g', name: 'cooked rice' }, { amount: 2, unit: '', name: 'eggs' }] },
      { mealType: 'snackPreWod', dishName: 'Banana & rice cakes', ingredients: ['banana', 'rice cakes'], timingHint: '45–60 min before', fuelStory: 'GF carbs. Light on the stomach.', kcal: 220, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 2, unit: '', name: 'rice cakes' }] },
      { mealType: 'lunch', dishName: 'Chicken & Quinoa Bowl with Roasted Veg', ingredients: ['chicken breast', 'quinoa', 'bell peppers', 'zucchini', 'olive oil'], fuelStory: 'No gluten. Protein and complex carbs.', kcal: 560, portions: [{ amount: 150, unit: 'g', name: 'chicken breast' }, { amount: 160, unit: 'g', name: 'cooked quinoa' }] },
      { mealType: 'snackPostWod', dishName: 'Greek yogurt with honey & banana', ingredients: ['Greek yogurt', 'honey', 'banana'], timingHint: 'Within 30 min', fuelStory: 'Protein and carbs. GF.', kcal: 320, portions: [{ amount: 170, unit: 'g', name: 'Greek yogurt' }, { amount: 1, unit: '', name: 'banana' }] },
      { mealType: 'dinner', dishName: 'Salmon with Rice & Steamed Broccoli', ingredients: ['salmon', 'jasmine rice', 'broccoli', 'tamari', 'ginger'], fuelStory: 'Clean protein and rice. No gluten in sight.', kcal: 600, portions: [{ amount: 150, unit: 'g', name: 'salmon' }, { amount: 200, unit: 'g', name: 'cooked rice' }] }
    ]},
    { dayType: 'wod', meals: [
      { mealType: 'breakfast', dishName: 'Sweet Potato Hash with Eggs', ingredients: ['sweet potato', 'eggs', 'spinach', 'olive oil'], fuelStory: 'GF start. Carbs and protein.', kcal: 500, portions: [{ amount: 180, unit: 'g', name: 'sweet potato' }, { amount: 2, unit: '', name: 'eggs' }] },
      { mealType: 'snackPreWod', dishName: 'Oat bar (GF) & apple', ingredients: ['gluten-free oat bar', 'apple'], timingHint: '60 min before', fuelStory: 'Portable GF carbs.', kcal: 240, portions: [{ amount: 1, unit: '', name: 'GF oat bar' }, { amount: 1, unit: '', name: 'apple' }] },
      { mealType: 'lunch', dishName: 'Turkey & Rice Stuffed Peppers', ingredients: ['ground turkey', 'rice', 'bell peppers', 'tomato', 'herbs'], fuelStory: 'All-in-one GF lunch. Protein and carbs.', kcal: 540, portions: [{ amount: 130, unit: 'g', name: 'ground turkey' }, { amount: 150, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snackPostWod', dishName: 'Milk & banana', ingredients: ['milk', 'banana'], timingHint: 'Within 30 min', fuelStory: 'Simple recovery. GF.', kcal: 280, portions: [{ amount: 250, unit: 'ml', name: 'milk' }, { amount: 1, unit: '', name: 'banana' }] },
      { mealType: 'dinner', dishName: 'Beef Stir-Fry with Rice Noodles', ingredients: ['beef', 'rice noodles', 'broccoli', 'tamari', 'sesame oil'], fuelStory: 'Rice noodles, no wheat. Full flavor.', kcal: 610, portions: [{ amount: 130, unit: 'g', name: 'beef' }, { amount: 100, unit: 'g', name: 'dry rice noodles' }] }
    ]},
    { dayType: 'wod', meals: [
      { mealType: 'breakfast', dishName: 'GF Oat Porridge with Berries & Nuts', ingredients: ['gluten-free oats', 'berries', 'almonds', 'milk'], fuelStory: 'Certified GF oats. Steady energy.', kcal: 450, portions: [{ amount: 60, unit: 'g', name: 'GF oats' }, { amount: 0.5, unit: 'cup', name: 'berries' }] },
      { mealType: 'snackPreWod', dishName: 'Dates & small handful almonds', ingredients: ['dates', 'almonds'], timingHint: '45–60 min before', fuelStory: 'Natural sugars. No gluten.', kcal: 200, portions: [{ amount: 4, unit: '', name: 'dates' }, { amount: 10, unit: 'g', name: 'almonds' }] },
      { mealType: 'lunch', dishName: 'Shrimp & Quinoa Bowl with Lime', ingredients: ['shrimp', 'quinoa', 'avocado', 'lime', 'cilantro'], fuelStory: 'GF bowl. Lean protein and grains.', kcal: 530, portions: [{ amount: 140, unit: 'g', name: 'shrimp' }, { amount: 150, unit: 'g', name: 'cooked quinoa' }] },
      { mealType: 'snackPostWod', dishName: 'Cottage cheese with pineapple', ingredients: ['cottage cheese', 'pineapple'], timingHint: 'Within 30 min', fuelStory: 'Protein and fruit. GF.', kcal: 260, portions: [{ amount: 150, unit: 'g', name: 'cottage cheese' }, { amount: 0.5, unit: 'cup', name: 'pineapple' }] },
      { mealType: 'dinner', dishName: 'Chicken Curry with Basmati Rice', ingredients: ['chicken thigh', 'basmati rice', 'coconut milk', 'curry paste', 'veg'], fuelStory: 'Naturally GF. Warming and filling.', kcal: 620, portions: [{ amount: 150, unit: 'g', name: 'chicken thigh' }, { amount: 180, unit: 'g', name: 'cooked rice' }] }
    ]},
    { dayType: 'wod', meals: [
      { mealType: 'breakfast', dishName: 'Scrambled Eggs with Corn Tortillas & Salsa', ingredients: ['eggs', 'corn tortillas', 'salsa', 'avocado'], fuelStory: 'Corn tortillas = GF. Classic combo.', kcal: 470, portions: [{ amount: 2, unit: '', name: 'eggs' }, { amount: 2, unit: '', name: 'corn tortillas' }] },
      { mealType: 'snackPreWod', dishName: 'Mashed banana on rice cakes', ingredients: ['banana', 'rice cakes'], timingHint: '45–60 min before', fuelStory: 'GF carbs. Quick and easy.', kcal: 210, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 2, unit: '', name: 'rice cakes' }] },
      { mealType: 'lunch', dishName: 'Tuna Poke Bowl with Rice', ingredients: ['tuna', 'sushi rice', 'cucumber', 'avocado', 'tamari'], fuelStory: 'No wheat. Fresh and filling.', kcal: 550, portions: [{ amount: 130, unit: 'g', name: 'tuna' }, { amount: 180, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snackPostWod', dishName: 'Yogurt with GF granola & berries', ingredients: ['yogurt', 'gluten-free granola', 'berries'], timingHint: 'Within 30 min', fuelStory: 'GF recovery snack.', kcal: 310, portions: [{ amount: 170, unit: 'g', name: 'yogurt' }, { amount: 30, unit: 'g', name: 'GF granola' }] },
      { mealType: 'dinner', dishName: 'Pork Tenderloin with Potato & Green Beans', ingredients: ['pork tenderloin', 'potato', 'green beans', 'olive oil'], fuelStory: 'No grains needed. Protein and starch.', kcal: 590, portions: [{ amount: 140, unit: 'g', name: 'pork tenderloin' }, { amount: 180, unit: 'g', name: 'potato' }] }
    ]},
    { dayType: 'wod', meals: [
      { mealType: 'breakfast', dishName: 'Chia Pudding with Banana & Almond Butter', ingredients: ['chia seeds', 'almond milk', 'banana', 'almond butter'], fuelStory: 'Naturally GF. No grains.', kcal: 430, portions: [{ amount: 35, unit: 'g', name: 'chia seeds' }, { amount: 1, unit: '', name: 'banana' }] },
      { mealType: 'snackPreWod', dishName: 'Orange & rice cakes', ingredients: ['orange', 'rice cakes'], timingHint: '45–60 min before', fuelStory: 'GF and light.', kcal: 190, portions: [{ amount: 1, unit: '', name: 'orange' }, { amount: 2, unit: '', name: 'rice cakes' }] },
      { mealType: 'lunch', dishName: 'Lamb & Rice Pilaf with Salad', ingredients: ['lamb', 'basmati rice', 'cucumber', 'yogurt', 'mint'], fuelStory: 'GF pilaf. Protein and carbs.', kcal: 580, portions: [{ amount: 120, unit: 'g', name: 'lamb' }, { amount: 180, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snackPostWod', dishName: 'Smoothie: banana, milk, honey', ingredients: ['banana', 'milk', 'honey'], timingHint: 'Within 30 min', fuelStory: 'GF recovery drink.', kcal: 270, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 200, unit: 'ml', name: 'milk' }] },
      { mealType: 'dinner', dishName: 'Cod with Roasted Potato & Asparagus', ingredients: ['cod', 'potato', 'asparagus', 'lemon', 'olive oil'], fuelStory: 'No gluten. Clean and simple.', kcal: 560, portions: [{ amount: 150, unit: 'g', name: 'cod' }, { amount: 160, unit: 'g', name: 'potato' }] }
    ]}
  ];

  const MENUS_REST_GLUTEN_FREE = [
    { dayType: 'rest', meals: [
      { mealType: 'breakfast', dishName: 'Eggs & Avocado on GF Toast', ingredients: ['eggs', 'avocado', 'gluten-free bread', 'cherry tomatoes'], fuelStory: 'GF toast. Protein and fat.', kcal: 440, portions: [{ amount: 2, unit: '', name: 'eggs' }, { amount: 1, unit: 'slice', name: 'GF bread' }] },
      { mealType: 'lunch', dishName: 'Chicken Salad with Quinoa & Olive Oil', ingredients: ['chicken breast', 'quinoa', 'mixed greens', 'olive oil', 'lemon'], fuelStory: 'No gluten. Protein and fiber.', kcal: 450, portions: [{ amount: 120, unit: 'g', name: 'chicken breast' }, { amount: 100, unit: 'g', name: 'cooked quinoa' }] },
      { mealType: 'dinner', dishName: 'Salmon with Sweet Potato & Greens', ingredients: ['salmon', 'sweet potato', 'spinach', 'olive oil'], fuelStory: 'Naturally GF. Omega-3s and carbs.', kcal: 520, portions: [{ amount: 140, unit: 'g', name: 'salmon' }, { amount: 1, unit: 'medium', name: 'sweet potato' }] },
      { mealType: 'snack', dishName: 'Apple with almond butter', ingredients: ['apple', 'almond butter'], fuelStory: 'GF snack. Simple.', kcal: 250, portions: [{ amount: 1, unit: '', name: 'apple' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }] }
    ]},
    { dayType: 'rest', meals: [
      { mealType: 'breakfast', dishName: 'GF Oatmeal with Nuts & Berries', ingredients: ['gluten-free oats', 'walnuts', 'berries', 'milk'], fuelStory: 'Certified GF oats. Rest-day start.', kcal: 410, portions: [{ amount: 50, unit: 'g', name: 'GF oats' }, { amount: 15, unit: 'g', name: 'walnuts' }] },
      { mealType: 'lunch', dishName: 'Tuna & White Bean Salad', ingredients: ['tuna', 'white beans', 'red onion', 'olive oil', 'lemon'], fuelStory: 'No bread, no gluten. Protein and fiber.', kcal: 420, portions: [{ amount: 100, unit: 'g', name: 'tuna' }, { amount: 0.75, unit: 'cup', name: 'white beans' }] },
      { mealType: 'dinner', dishName: 'Turkey Meatballs with Rice & Tomato Sauce', ingredients: ['ground turkey', 'rice', 'tomato sauce', 'herbs'], fuelStory: 'GF dinner. Comfort without wheat.', kcal: 500, portions: [{ amount: 130, unit: 'g', name: 'ground turkey' }, { amount: 150, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snack', dishName: 'Rice cakes with peanut butter', ingredients: ['rice cakes', 'peanut butter'], fuelStory: 'GF crunch.', kcal: 200, portions: [{ amount: 2, unit: '', name: 'rice cakes' }, { amount: 1, unit: 'tbsp', name: 'peanut butter' }] }
    ]},
    { dayType: 'rest', meals: [
      { mealType: 'breakfast', dishName: 'Sweet Potato & Black Bean Hash with Egg', ingredients: ['sweet potato', 'black beans', 'egg', 'avocado'], fuelStory: 'GF and filling. No grains.', kcal: 430, portions: [{ amount: 120, unit: 'g', name: 'sweet potato' }, { amount: 0.5, unit: 'cup', name: 'black beans' }] },
      { mealType: 'lunch', dishName: 'Grilled Shrimp with Quinoa & Veg', ingredients: ['shrimp', 'quinoa', 'zucchini', 'bell pepper', 'olive oil'], fuelStory: 'GF bowl. Light and satisfying.', kcal: 440, portions: [{ amount: 120, unit: 'g', name: 'shrimp' }, { amount: 120, unit: 'g', name: 'cooked quinoa' }] },
      { mealType: 'dinner', dishName: 'Lentil Soup with Rice', ingredients: ['lentils', 'rice', 'carrots', 'celery', 'broth'], fuelStory: 'Naturally GF. Warm and grounding.', kcal: 460, portions: [{ amount: 1, unit: 'cup', name: 'cooked lentils' }, { amount: 100, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snack', dishName: 'Handful of mixed nuts & dried fruit', ingredients: ['almonds', 'cashews', 'dried apricots'], fuelStory: 'GF snack. No prep.', kcal: 220, portions: [{ amount: 25, unit: 'g', name: 'nuts' }, { amount: 20, unit: 'g', name: 'dried fruit' }] }
    ]},
    { dayType: 'rest', meals: [
      { mealType: 'breakfast', dishName: 'Chia Pudding with Berries', ingredients: ['chia seeds', 'coconut milk', 'berries'], fuelStory: 'No grains. GF and dairy-free option.', kcal: 370, portions: [{ amount: 30, unit: 'g', name: 'chia seeds' }, { amount: 150, unit: 'ml', name: 'coconut milk' }] },
      { mealType: 'lunch', dishName: 'Chickpea & Rice Bowl with Tahini', ingredients: ['chickpeas', 'rice', 'tahini', 'cucumber', 'tomato'], fuelStory: 'GF and plant-forward. Satisfying.', kcal: 460, portions: [{ amount: 1, unit: 'cup', name: 'chickpeas' }, { amount: 120, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'dinner', dishName: 'Baked Chicken with Potato & Roasted Veg', ingredients: ['chicken thigh', 'potato', 'carrots', 'olive oil'], fuelStory: 'One pan. No gluten.', kcal: 530, portions: [{ amount: 150, unit: 'g', name: 'chicken thigh' }, { amount: 150, unit: 'g', name: 'potato' }] },
      { mealType: 'snack', dishName: 'Pear with almond butter', ingredients: ['pear', 'almond butter'], fuelStory: 'Simple GF snack.', kcal: 230, portions: [{ amount: 1, unit: '', name: 'pear' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }] }
    ]},
    { dayType: 'rest', meals: [
      { mealType: 'breakfast', dishName: 'Buckwheat Porridge with Banana', ingredients: ['buckwheat', 'banana', 'almond milk', 'cinnamon'], fuelStory: 'Buckwheat is GF. Cozy rest-day start.', kcal: 400, portions: [{ amount: 50, unit: 'g', name: 'buckwheat' }, { amount: 1, unit: '', name: 'banana' }] },
      { mealType: 'lunch', dishName: 'Beef & Broccoli with Rice', ingredients: ['beef', 'broccoli', 'rice', 'tamari', 'ginger'], fuelStory: 'Classic combo. No wheat.', kcal: 480, portions: [{ amount: 120, unit: 'g', name: 'beef' }, { amount: 150, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'dinner', dishName: 'Cod with Quinoa & Steamed Greens', ingredients: ['cod', 'quinoa', 'kale', 'lemon'], fuelStory: 'GF and light. Rest-day close.', kcal: 450, portions: [{ amount: 150, unit: 'g', name: 'cod' }, { amount: 120, unit: 'g', name: 'cooked quinoa' }] },
      { mealType: 'snack', dishName: 'Rice cake with avocado', ingredients: ['rice cake', 'avocado'], fuelStory: 'GF and satisfying.', kcal: 210, portions: [{ amount: 1, unit: '', name: 'rice cake' }, { amount: 0.25, unit: '', name: 'avocado' }] }
    ]}
  ];

  // Dairy-free: no milk, yogurt, cheese, butter, cream
  const MENUS_WOD_DAIRY_FREE = [
    { dayType: 'wod', meals: [
      { mealType: 'breakfast', dishName: 'Oatmeal with Banana, Almond Butter & Oat Milk', ingredients: ['oats', 'banana', 'almond butter', 'oat milk'], fuelStory: 'Dairy-free oats. Steady energy.', kcal: 460, portions: [{ amount: 60, unit: 'g', name: 'oats' }, { amount: 1, unit: '', name: 'banana' }] },
      { mealType: 'snackPreWod', dishName: 'Banana & dates', ingredients: ['banana', 'dates'], timingHint: '60–90 min before', fuelStory: 'No dairy. Fast carbs.', kcal: 200, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 4, unit: '', name: 'dates' }] },
      { mealType: 'lunch', dishName: 'Chicken & Rice Bowl with Avocado', ingredients: ['chicken breast', 'rice', 'avocado', 'lime', 'cilantro'], fuelStory: 'Dairy-free. Protein and carbs.', kcal: 560, portions: [{ amount: 150, unit: 'g', name: 'chicken breast' }, { amount: 180, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snackPostWod', dishName: 'Smoothie: banana, oat milk, peanut butter', ingredients: ['banana', 'oat milk', 'peanut butter'], timingHint: 'Within 30 min', fuelStory: 'Dairy-free recovery. Carbs and fat.', kcal: 320, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 1, unit: 'tbsp', name: 'peanut butter' }] },
      { mealType: 'dinner', dishName: 'Salmon with Rice & Broccoli', ingredients: ['salmon', 'jasmine rice', 'broccoli', 'tamari', 'sesame oil'], fuelStory: 'No dairy. Omega-3s and carbs.', kcal: 600, portions: [{ amount: 150, unit: 'g', name: 'salmon' }, { amount: 200, unit: 'g', name: 'cooked rice' }] }
    ]},
    { dayType: 'wod', meals: [
      { mealType: 'breakfast', dishName: 'Scrambled Eggs with Rice & Salsa', ingredients: ['eggs', 'rice', 'salsa', 'olive oil'], fuelStory: 'No milk in eggs. DF start.', kcal: 480, portions: [{ amount: 2, unit: '', name: 'eggs' }, { amount: 150, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snackPreWod', dishName: 'Rice cakes with almond butter', ingredients: ['rice cakes', 'almond butter'], timingHint: '45–60 min before', fuelStory: 'DF and light.', kcal: 240, portions: [{ amount: 2, unit: '', name: 'rice cakes' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }] },
      { mealType: 'lunch', dishName: 'Turkey & Quinoa Bowl with Tahini', ingredients: ['ground turkey', 'quinoa', 'tahini', 'cucumber', 'tomato'], fuelStory: 'Tahini instead of yogurt. DF.', kcal: 550, portions: [{ amount: 140, unit: 'g', name: 'ground turkey' }, { amount: 160, unit: 'g', name: 'cooked quinoa' }] },
      { mealType: 'snackPostWod', dishName: 'Vegan protein shake & banana', ingredients: ['vegan protein', 'banana', 'oat milk'], timingHint: 'Within 30 min', fuelStory: 'Dairy-free recovery.', kcal: 290, portions: [{ amount: 1, unit: 'scoop', name: 'vegan protein' }, { amount: 1, unit: '', name: 'banana' }] },
      { mealType: 'dinner', dishName: 'Beef Stir-Fry with Rice', ingredients: ['beef', 'rice', 'bell peppers', 'tamari', 'ginger'], fuelStory: 'No dairy. Classic stir-fry.', kcal: 610, portions: [{ amount: 130, unit: 'g', name: 'beef' }, { amount: 180, unit: 'g', name: 'cooked rice' }] }
    ]},
    { dayType: 'wod', meals: [
      { mealType: 'breakfast', dishName: 'Sweet Potato Hash with Eggs', ingredients: ['sweet potato', 'eggs', 'spinach', 'olive oil'], fuelStory: 'DF. No butter, no cheese.', kcal: 490, portions: [{ amount: 150, unit: 'g', name: 'sweet potato' }, { amount: 2, unit: '', name: 'eggs' }] },
      { mealType: 'snackPreWod', dishName: 'Apple with almond butter', ingredients: ['apple', 'almond butter'], timingHint: '45–60 min before', fuelStory: 'DF snack.', kcal: 250, portions: [{ amount: 1, unit: '', name: 'apple' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }] },
      { mealType: 'lunch', dishName: 'Tuna Poke Bowl with Rice', ingredients: ['tuna', 'sushi rice', 'avocado', 'tamari', 'sesame'], fuelStory: 'No dairy. Fresh and filling.', kcal: 540, portions: [{ amount: 130, unit: 'g', name: 'tuna' }, { amount: 180, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snackPostWod', dishName: 'Chia pudding with oat milk & banana', ingredients: ['chia seeds', 'oat milk', 'banana'], timingHint: 'Within 30 min', fuelStory: 'DF pudding. Carbs and fiber.', kcal: 300, portions: [{ amount: 25, unit: 'g', name: 'chia seeds' }, { amount: 1, unit: '', name: 'banana' }] },
      { mealType: 'dinner', dishName: 'Chicken Curry with Coconut Milk & Rice', ingredients: ['chicken thigh', 'coconut milk', 'rice', 'curry paste', 'veg'], fuelStory: 'Coconut milk, no cream. DF.', kcal: 620, portions: [{ amount: 150, unit: 'g', name: 'chicken thigh' }, { amount: 180, unit: 'g', name: 'cooked rice' }] }
    ]},
    { dayType: 'wod', meals: [
      { mealType: 'breakfast', dishName: 'Avocado Toast with Egg (DF bread)', ingredients: ['bread', 'avocado', 'egg', 'salt', 'pepper'], fuelStory: 'No butter, no cheese. DF toast.', kcal: 420, portions: [{ amount: 2, unit: 'slices', name: 'bread' }, { amount: 0.5, unit: '', name: 'avocado' }] },
      { mealType: 'snackPreWod', dishName: 'Orange & handful of pretzels', ingredients: ['orange', 'pretzels'], timingHint: '45–60 min before', fuelStory: 'DF. Quick carbs.', kcal: 200, portions: [{ amount: 1, unit: '', name: 'orange' }, { amount: 25, unit: 'g', name: 'pretzels' }] },
      { mealType: 'lunch', dishName: 'Pork & Rice Noodles with Veg', ingredients: ['pork', 'rice noodles', 'bok choy', 'tamari', 'lime'], fuelStory: 'No dairy. Asian-style bowl.', kcal: 560, portions: [{ amount: 130, unit: 'g', name: 'pork' }, { amount: 100, unit: 'g', name: 'dry rice noodles' }] },
      { mealType: 'snackPostWod', dishName: 'Dates & almonds', ingredients: ['dates', 'almonds'], timingHint: 'Within 30 min', fuelStory: 'DF. Natural sugars and fat.', kcal: 270, portions: [{ amount: 4, unit: '', name: 'dates' }, { amount: 15, unit: 'g', name: 'almonds' }] },
      { mealType: 'dinner', dishName: 'Shrimp with Rice & Garlic Greens', ingredients: ['shrimp', 'jasmine rice', 'kale', 'garlic', 'olive oil'], fuelStory: 'No butter. Olive oil only. DF.', kcal: 560, portions: [{ amount: 140, unit: 'g', name: 'shrimp' }, { amount: 200, unit: 'g', name: 'cooked rice' }] }
    ]},
    { dayType: 'wod', meals: [
      { mealType: 'breakfast', dishName: 'Chickpea Flour Pancakes with Maple Syrup', ingredients: ['chickpea flour', 'egg', 'oat milk', 'maple syrup'], fuelStory: 'DF pancakes. No milk, no butter.', kcal: 440, portions: [{ amount: 50, unit: 'g', name: 'chickpea flour' }, { amount: 1, unit: '', name: 'egg' }] },
      { mealType: 'snackPreWod', dishName: 'Banana & rice cakes', ingredients: ['banana', 'rice cakes'], timingHint: '45–60 min before', fuelStory: 'DF. Light.', kcal: 220, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 2, unit: '', name: 'rice cakes' }] },
      { mealType: 'lunch', dishName: 'Lamb & Rice with Tzatziki (coconut yogurt)', ingredients: ['lamb', 'rice', 'coconut yogurt', 'cucumber', 'dill'], fuelStory: 'Coconut yogurt = DF. Same vibe.', kcal: 570, portions: [{ amount: 120, unit: 'g', name: 'lamb' }, { amount: 180, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snackPostWod', dishName: 'Smoothie: banana, spinach, oat milk', ingredients: ['banana', 'spinach', 'oat milk'], timingHint: 'Within 30 min', fuelStory: 'DF green smoothie.', kcal: 260, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 1, unit: 'cup', name: 'spinach' }] },
      { mealType: 'dinner', dishName: 'Cod with Potato & Lemon-Olive Oil Drizzle', ingredients: ['cod', 'potato', 'lemon', 'olive oil', 'herbs'], fuelStory: 'No butter. Olive oil. DF.', kcal: 550, portions: [{ amount: 150, unit: 'g', name: 'cod' }, { amount: 180, unit: 'g', name: 'potato' }] }
    ]}
  ];

  const MENUS_REST_DAIRY_FREE = [
    { dayType: 'rest', meals: [
      { mealType: 'breakfast', dishName: 'Eggs & Avocado with GF Toast', ingredients: ['eggs', 'avocado', 'toast', 'cherry tomatoes'], fuelStory: 'No butter. Olive oil if needed. DF.', kcal: 450, portions: [{ amount: 2, unit: '', name: 'eggs' }, { amount: 0.5, unit: '', name: 'avocado' }] },
      { mealType: 'lunch', dishName: 'Chickpea & Roasted Veg Bowl with Tahini', ingredients: ['chickpeas', 'zucchini', 'bell pepper', 'tahini', 'lemon'], fuelStory: 'Tahini instead of yogurt. DF.', kcal: 440, portions: [{ amount: 1, unit: 'cup', name: 'chickpeas' }, { amount: 1, unit: 'cup', name: 'roasted veg' }] },
      { mealType: 'dinner', dishName: 'Lean Beef with Sweet Potato & Greens', ingredients: ['lean beef', 'sweet potato', 'spinach', 'olive oil'], fuelStory: 'No cheese, no cream. DF.', kcal: 520, portions: [{ amount: 120, unit: 'g', name: 'beef' }, { amount: 1, unit: 'medium', name: 'sweet potato' }] },
      { mealType: 'snack', dishName: 'Apple with almond butter', ingredients: ['apple', 'almond butter'], fuelStory: 'DF snack.', kcal: 250, portions: [{ amount: 1, unit: '', name: 'apple' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }] }
    ]},
    { dayType: 'rest', meals: [
      { mealType: 'breakfast', dishName: 'Overnight Oats with Oat Milk & Berries', ingredients: ['oats', 'oat milk', 'berries', 'almond butter'], fuelStory: 'No dairy. Oat milk base.', kcal: 410, portions: [{ amount: 50, unit: 'g', name: 'oats' }, { amount: 200, unit: 'ml', name: 'oat milk' }] },
      { mealType: 'lunch', dishName: 'Tuna Salad with Olive Oil & Lemon (no mayo)', ingredients: ['tuna', 'celery', 'red onion', 'olive oil', 'lemon'], fuelStory: 'No mayo, no yogurt. DF.', kcal: 400, portions: [{ amount: 1, unit: 'can', name: 'tuna' }, { amount: 2, unit: 'tbsp', name: 'olive oil' }] },
      { mealType: 'dinner', dishName: 'Chicken Thighs with Rice & Roasted Veg', ingredients: ['chicken thighs', 'rice', 'carrots', 'olive oil'], fuelStory: 'No cream sauce. DF.', kcal: 530, portions: [{ amount: 150, unit: 'g', name: 'chicken thighs' }, { amount: 150, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snack', dishName: 'Handful of nuts & dried apricots', ingredients: ['almonds', 'dried apricots'], fuelStory: 'DF. No cheese.', kcal: 210, portions: [{ amount: 25, unit: 'g', name: 'almonds' }, { amount: 3, unit: '', name: 'apricots' }] }
    ]},
    { dayType: 'rest', meals: [
      { mealType: 'breakfast', dishName: 'Chia Pudding with Coconut Milk & Mango', ingredients: ['chia seeds', 'coconut milk', 'mango'], fuelStory: 'No dairy. Coconut base.', kcal: 380, portions: [{ amount: 30, unit: 'g', name: 'chia seeds' }, { amount: 150, unit: 'ml', name: 'coconut milk' }] },
      { mealType: 'lunch', dishName: 'Lentil Soup with Olive Oil Drizzle', ingredients: ['lentils', 'carrots', 'celery', 'olive oil', 'broth'], fuelStory: 'No cream. DF soup.', kcal: 420, portions: [{ amount: 1, unit: 'cup', name: 'cooked lentils' }, { amount: 1, unit: 'cup', name: 'veg' }] },
      { mealType: 'dinner', dishName: 'Salmon with Quinoa & Asparagus', ingredients: ['salmon', 'quinoa', 'asparagus', 'lemon', 'olive oil'], fuelStory: 'No butter. DF.', kcal: 510, portions: [{ amount: 140, unit: 'g', name: 'salmon' }, { amount: 120, unit: 'g', name: 'cooked quinoa' }] },
      { mealType: 'snack', dishName: 'Rice cake with peanut butter', ingredients: ['rice cake', 'peanut butter'], fuelStory: 'DF.', kcal: 200, portions: [{ amount: 1, unit: '', name: 'rice cake' }, { amount: 1, unit: 'tbsp', name: 'peanut butter' }] }
    ]},
    { dayType: 'rest', meals: [
      { mealType: 'breakfast', dishName: 'Tofu Scramble with Veg', ingredients: ['tofu', 'bell pepper', 'spinach', 'turmeric', 'olive oil'], fuelStory: 'No eggs or cheese. DF vegan-style.', kcal: 360, portions: [{ amount: 150, unit: 'g', name: 'tofu' }, { amount: 0.5, unit: 'cup', name: 'veg' }] },
      { mealType: 'lunch', dishName: 'Falafel with Tahini & Salad', ingredients: ['falafel', 'tahini', 'lettuce', 'tomato', 'cucumber'], fuelStory: 'No yogurt. Tahini only. DF.', kcal: 470, portions: [{ amount: 5, unit: '', name: 'falafel' }, { amount: 2, unit: 'tbsp', name: 'tahini' }] },
      { mealType: 'dinner', dishName: 'Turkey Meatballs with Tomato Sauce & Rice', ingredients: ['ground turkey', 'tomato sauce', 'rice', 'herbs'], fuelStory: 'No parmesan. DF.', kcal: 500, portions: [{ amount: 130, unit: 'g', name: 'ground turkey' }, { amount: 150, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snack', dishName: 'Pear with almond butter', ingredients: ['pear', 'almond butter'], fuelStory: 'DF.', kcal: 230, portions: [{ amount: 1, unit: '', name: 'pear' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }] }
    ]},
    { dayType: 'rest', meals: [
      { mealType: 'breakfast', dishName: 'Smoothie: Banana, Spinach, Oat Milk & Almond Butter', ingredients: ['banana', 'spinach', 'oat milk', 'almond butter'], fuelStory: 'No yogurt. DF smoothie.', kcal: 390, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 1, unit: 'cup', name: 'spinach' }] },
      { mealType: 'lunch', dishName: 'White Bean & Tuna with Olive Oil', ingredients: ['white beans', 'tuna', 'red onion', 'olive oil', 'lemon'], fuelStory: 'No mayo. DF.', kcal: 430, portions: [{ amount: 1, unit: 'cup', name: 'white beans' }, { amount: 80, unit: 'g', name: 'tuna' }] },
      { mealType: 'dinner', dishName: 'Pork Tenderloin with Potato & Green Beans', ingredients: ['pork tenderloin', 'potato', 'green beans', 'olive oil'], fuelStory: 'No butter. DF.', kcal: 510, portions: [{ amount: 140, unit: 'g', name: 'pork tenderloin' }, { amount: 150, unit: 'g', name: 'potato' }] },
      { mealType: 'snack', dishName: 'Dark chocolate & almonds', ingredients: ['dark chocolate', 'almonds'], fuelStory: 'DF. No milk chocolate.', kcal: 220, portions: [{ amount: 20, unit: 'g', name: 'dark chocolate' }, { amount: 15, unit: 'g', name: 'almonds' }] }
    ]}
  ];

  const screenSelector = document.getElementById('screen-selector');
  const screenMenu = document.getElementById('screen-menu');
  const btnWod = document.getElementById('btn-wod');
  const btnRest = document.getElementById('btn-rest');
  const btnGenerate = document.getElementById('btn-generate');
  const menuCards = document.getElementById('menu-cards');
  const resultDayBadge = document.getElementById('result-day-badge');
  const menuPlanTitle = document.getElementById('menu-plan-title');
  const menuQuote = document.getElementById('menu-quote');
  const macroCarbs = document.getElementById('macro-carbs');
  const macroProtein = document.getElementById('macro-protein');
  const macroFat = document.getElementById('macro-fat');
  const macroLegend = document.getElementById('macro-legend');
  const caloriesInline = document.getElementById('calories-inline');
  const btnToggleCalories = document.getElementById('btn-toggle-calories');
  const caloriesScaleText = document.getElementById('calories-scale-text');
  const inputCalorieTarget = document.getElementById('input-calorie-target');
  const btnApplyTarget = document.getElementById('btn-apply-target');

  let selectedDay = null;
  let lastGeneratedMenu = null;
  let portionScale = 1;

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

  const dayTypeWhy = document.getElementById('day-type-why');
  const btnDayTypeWhy = document.getElementById('btn-day-type-why');
  if (dayTypeWhy && btnDayTypeWhy) {
    btnDayTypeWhy.addEventListener('click', function () {
      const open = dayTypeWhy.classList.toggle('open');
      btnDayTypeWhy.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  menuCards.addEventListener('click', function (e) {
    const btn = e.target.closest('.recipe-trigger');
    if (!btn) return;
    e.preventDefault();
    const reveal = btn.closest('.recipe-reveal');
    if (!reveal) return;
    const open = reveal.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'Hide recipe' : 'View recipe';
  });

  function getMenuForDay(dayType) {
    const pool = dayType === 'wod' ? MENUS_WOD : MENUS_REST;
    const menu = pool[Math.floor(Math.random() * pool.length)];
    return JSON.parse(JSON.stringify(menu));
  }

  function generateMenu() {
    if (!selectedDay || !btnGenerate) return;
    btnGenerate.disabled = true;
    btnGenerate.classList.add('loading');
    const menuData = getMenuForDay(selectedDay);
    lastGeneratedMenu = menuData;
    showMenuScreen(menuData);
    btnGenerate.classList.remove('loading');
    btnGenerate.disabled = false;
  }

  btnGenerate?.addEventListener('click', generateMenu);

  function getMealLabel(mealType) {
    if (mealType === 'snackPreWod') return 'Pre-WOD snack';
    if (mealType === 'snackPostWod') return 'Post-WOD snack';
    return mealType.charAt(0).toUpperCase() + mealType.slice(1);
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function showMenuScreen(menu) {
    if (!screenSelector || !screenMenu) return;
    screenSelector.classList.add('hidden');
    screenMenu.classList.remove('hidden');

    const isWod = menu.dayType === 'wod';
    const dayLabel = isWod ? 'CROSSFIT DAY' : 'REST DAY';
    const planTitle = isWod ? 'YOUR FUEL PLAN' : 'YOUR RECOVERY PLAN';
    const quote = isWod ? 'Today you train. Eat like it.' : 'Rest is part of the work.';

    if (resultDayBadge) {
      resultDayBadge.textContent = dayLabel;
      resultDayBadge.className = 'day-badge day-' + menu.dayType;
    }
    if (menuPlanTitle) menuPlanTitle.textContent = planTitle;
    if (menuQuote) menuQuote.textContent = quote;


    const macro = isWod ? MACRO_WOD : MACRO_REST;
    if (macroCarbs) macroCarbs.style.width = macro.carbs + '%';
    if (macroProtein) macroProtein.style.width = macro.protein + '%';
    if (macroFat) macroFat.style.width = macro.fat + '%';
    if (macroLegend) {
      macroLegend.innerHTML =
        '<span class="macro-legend-item" style="flex: 0 0 ' + macro.carbs + '%;"><span class="dot dot--carbs" aria-hidden="true"></span> Carbs ' + macro.carbs + '%</span>' +
        '<span class="macro-legend-item" style="flex: 0 0 ' + macro.protein + '%;"><span class="dot dot--protein" aria-hidden="true"></span> Protein ' + macro.protein + '%</span>' +
        '<span class="macro-legend-item" style="flex: 0 0 ' + macro.fat + '%;"><span class="dot dot--fat" aria-hidden="true"></span> Fat ' + macro.fat + '%</span>';
    }

    menuCards.innerHTML = '';
    (menu.meals || []).forEach(function (m, idx) {
      const block = document.createElement('article');
      block.className = 'meal-block meal-block--' + menu.dayType;
      const timing = m.timingHint ? m.timingHint : '';
      const ingredients = Array.isArray(m.ingredients) && m.ingredients.length ? m.ingredients : [];
      const methodSteps = Array.isArray(m.method) && m.method.length ? m.method : [];
      const hasRecipe = ingredients.length || methodSteps.length;
      const hasPortions = Array.isArray(m.portions) && m.portions.length > 0;
      const showIngredientsTitle = ingredients.length > 0 || hasPortions;
      const recipeHtml = hasRecipe
        ? '<div class="recipe-reveal">' +
            '<button type="button" class="recipe-trigger" aria-expanded="false" aria-controls="recipe-content-' + idx + '">View recipe</button>' +
            '<div class="recipe-content" id="recipe-content-' + idx + '" role="region" aria-label="Recipe">' +
              (showIngredientsTitle ? '<p class="recipe-content-title">Ingredients</p>' : '') +
              (ingredients.length
                ? '<div class="recipe-ingredients-block"><ul class="recipe-ingredients">' +
                  ingredients.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') + '</ul></div>'
                : '') +
              '<ul class="meal-portions" data-meal-index="' + idx + '"></ul>' +
              (methodSteps.length
                ? '<p class="recipe-content-title">How to make it</p>' +
                  (methodSteps.length === 1
                    ? '<p class="recipe-steps recipe-steps--single">' + escapeHtml(methodSteps[0]) + '</p>'
                    : '<ol class="recipe-steps">' + methodSteps.map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') + '</ol>')
                : '') +
              '</div></div>'
        : '';
      block.innerHTML =
        '<div class="meal-block-header">' +
          '<span class="meal-block-title">' + escapeHtml(getMealLabel(m.mealType)) + '</span>' +
          '<div class="meal-block-meta">' +
            (timing ? '<span class="meal-block-timing">' + escapeHtml(timing) + '</span>' : '') +
            '<span class="meal-block-kcal" data-meal-index="' + idx + '"></span>' +
          '</div>' +
        '</div>' +
        '<div class="meal-block-body">' +
          '<div class="food-item">' +
            '<div class="food-item-name">' + escapeHtml(m.dishName || '') + '</div>' +
            (m.fuelStory ? '<p class="food-item-why">' + escapeHtml(m.fuelStory) + '</p>' : '') +
          '</div>' +
          recipeHtml +
          (hasRecipe ? '' : '<ul class="meal-portions" data-meal-index="' + idx + '"></ul>') +
        '</div>';
      menuCards.appendChild(block);
    });

    portionScale = 1;
    if (inputCalorieTarget) {
      try {
        var savedTarget = (typeof sessionStorage !== 'undefined')
          ? sessionStorage.getItem('crossfitFuelCalorieTarget')
          : null;
        inputCalorieTarget.value = savedTarget ? String(savedTarget) : '';
      } catch (e) {
        inputCalorieTarget.value = '';
      }
    }
    if (caloriesScaleText) { caloriesScaleText.textContent = ''; caloriesScaleText.classList.add('hidden'); }
    if (caloriesInline) caloriesInline.classList.add('hidden');
    if (btnToggleCalories) {
      btnToggleCalories.setAttribute('aria-pressed', 'false');
      btnToggleCalories.textContent = 'Show calorie details';
    }
  }

  function getTotalBaseKcal(menu) {
    if (!menu?.meals) return 0;
    return (menu.meals || []).reduce(function (sum, m) { return sum + (Number(m.kcal) || 0); }, 0);
  }

  function updateMealKcal(menu, scale) {
    const blocks = menuCards.querySelectorAll('.meal-block');
    blocks.forEach(function (block, idx) {
      const meal = (menu.meals || [])[idx];
      const span = block.querySelector('.meal-block-kcal');
      if (!span || !meal) return;
      const base = Number(meal.kcal) || 0;
      if (!base) {
        span.textContent = '';
        return;
      }
      const val = Math.round(base * scale);
      span.textContent = val + ' kcal';
    });
  }

  function formatPortionAmount(amount, unit, scale) {
    const scaled = amount * scale;
    if (unit === 'g' || unit === 'ml') {
      const rounded = Math.max(10, Math.round(scaled / 10) * 10);
      return rounded + ' ' + unit;
    }
    const roundedPieces = Math.max(1, Math.round(scaled));
    return String(roundedPieces);
  }

  function updateMealPortions(menu, scale, show) {
    if (menuCards) {
      menuCards.classList.toggle('menu-cards--calories-on', !!show);
    }
    const blocks = menuCards.querySelectorAll('.meal-block');
    blocks.forEach(function (block, idx) {
      const meal = (menu.meals || [])[idx];
      const list = block.querySelector('.meal-portions');
      if (!list || !meal) return;
      if (!show || !Array.isArray(meal.portions) || meal.portions.length === 0) {
        list.innerHTML = '';
        return;
      }
      const items = meal.portions.map(function (p) {
        const baseAmount = typeof p.amount === 'number' ? p.amount : 0;
        if (!baseAmount) return '';
        const amountText = formatPortionAmount(baseAmount, p.unit || '', scale);
        const unit = p.unit && p.unit !== 'g' && p.unit !== 'ml' ? p.unit + ' ' : '';
        return '<li>' + amountText + ' ' + unit + escapeHtml(p.name || '') + '</li>';
      }).filter(Boolean);
      list.innerHTML = items.join('');
    });
  }

  function renderCaloriesSummary(menu, scale) {
    if (!menu?.meals) return;
    const totalBase = getTotalBaseKcal(menu);
    if (caloriesScaleText) {
      caloriesScaleText.textContent = '';
      caloriesScaleText.classList.add('hidden');
    }
    updateMealKcal(menu, scale);
    updateMealPortions(menu, scale, true);
  }

  btnToggleCalories?.addEventListener('click', function () {
    if (!lastGeneratedMenu || !caloriesInline) return;
    caloriesInline.classList.toggle('hidden');
    const isOpen = !caloriesInline.classList.contains('hidden');
    btnToggleCalories.setAttribute('aria-pressed', isOpen ? 'true' : 'false');
    btnToggleCalories.textContent = isOpen ? 'Hide calorie details' : 'Show calorie details';
    if (isOpen) {
      const totalBase = getTotalBaseKcal(lastGeneratedMenu);
      if (inputCalorieTarget && !inputCalorieTarget.value) {
        inputCalorieTarget.value = String(totalBase);
      }
      portionScale = 1;
      renderCaloriesSummary(lastGeneratedMenu, portionScale);
    } else {
      const spans = menuCards.querySelectorAll('.meal-block-kcal');
      spans.forEach(function (s) { s.textContent = ''; });
      if (caloriesScaleText) { caloriesScaleText.textContent = ''; caloriesScaleText.classList.add('hidden'); }
      updateMealPortions(lastGeneratedMenu, 1, false);
    }
  });

  btnApplyTarget?.addEventListener('click', function () {
    if (!lastGeneratedMenu) return;
    const totalBase = getTotalBaseKcal(lastGeneratedMenu);
    if (totalBase <= 0) return;
    let target = parseInt(inputCalorieTarget?.value, 10);
    if (!target) target = totalBase;
    target = Math.max(1200, Math.min(4000, target));
    portionScale = Math.max(0.5, Math.min(2, target / totalBase));
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('crossfitFuelCalorieTarget', String(target));
      }
    } catch (e) {
      /* ignore storage errors */
    }
    renderCaloriesSummary(lastGeneratedMenu, portionScale);
  });

  function buildShoppingList(meals) {
    const byCategory = { Proteins: [], Vegetables: [], Carbs: [], Pantry: [], Extras: [] };
    const seen = new Set();
    const proteinWords = /chicken|beef|salmon|egg|turkey|tofu|tempeh|tuna|pork|shrimp|yogurt|milk|cheese|feta|greek|pea protein|lentil/i;
    const vegWords = /spinach|broccoli|tomato|pepper|onion|cucumber|avocado|kale|lettuce|carrot|sweet potato|snap pea|berry|berries|banana|apple|lemon|lime|garlic|ginger/i;
    const carbWords = /oat|rice|bread|pasta|potato|quinoa|granola|tortilla|dates/i;
    const pantryWords = /oil|vinegar|soy|tamari|honey|salt|pepper|oregano|cinnamon|chia|almond butter|nut butter|coconut milk|curry/i;

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

})();
