/**
 * CrossFit Fuel — Curated menu bank, no AI. Dietary filters. Tags, macro bar, meal blocks.
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
          dishName: 'Power Oat Bowl with Banana & Almond Butter',
          ingredients: ['rolled oats', 'banana', 'almond butter', 'honey', 'chia seeds', 'cinnamon'],
          fuelStory: 'Oats deliver steady glucose so your energy doesn\'t spike and crash before the WOD. The banana tops off muscle glycogen. Almond butter and chia add staying power.',
          kcal: 450,
          portions: [
            { amount: 60, unit: 'g', name: 'rolled oats' },
            { amount: 1, unit: '', name: 'banana' },
            { amount: 1, unit: 'tbsp', name: 'almond butter' }
          ]
        },
        {
          mealType: 'snackPreWod',
          dishName: 'Banana with a handful of dates',
          ingredients: ['banana', 'dates'],
          timingHint: '60–90 min before training',
          fuelStory: 'Fast, digestible carbs to top off glycogen without sitting heavy in your stomach. Quick energy when you need it.',
          kcal: 180,
          portions: [
            { amount: 1, unit: '', name: 'banana' },
            { amount: 4, unit: '', name: 'dates' }
          ]
        },
        {
          mealType: 'lunch',
          dishName: 'Grilled Chicken & Sweet Potato with Greens',
          ingredients: ['chicken breast', 'sweet potato', 'spinach', 'olive oil', 'lemon', 'garlic'],
          fuelStory: 'Chicken restocks the amino pool your muscles used. Sweet potato restores glycogen. The greens bring anti-inflammatory compounds. Your body is repairing right now.',
          kcal: 550,
          portions: [
            { amount: 150, unit: 'g', name: 'chicken breast' },
            { amount: 1, unit: 'medium', name: 'sweet potato' },
            { amount: 1, unit: 'cup', name: 'spinach' }
          ]
        },
        {
          mealType: 'snackPostWod',
          dishName: 'Greek Yogurt with Berries & Granola',
          ingredients: ['Greek yogurt', 'mixed berries', 'granola', 'drizzle of honey'],
          timingHint: 'Within 30 min after training',
          fuelStory: 'Fast protein and carbs in one hit. Yogurt\'s casein supports muscle protein synthesis; berries add antioxidants. Perfect for the recovery window.',
          kcal: 350,
          portions: [
            { amount: 170, unit: 'g', name: 'Greek yogurt' },
            { amount: 0.5, unit: 'cup', name: 'mixed berries' },
            { amount: 0.25, unit: 'cup', name: 'granola' }
          ]
        },
        {
          mealType: 'dinner',
          dishName: 'Salmon, Rice & Broccoli',
          ingredients: ['salmon fillet', 'jasmine rice', 'broccoli', 'tamari', 'ginger', 'sesame oil'],
          fuelStory: 'Salmon\'s omega-3s support recovery and keep inflammation in check. Rice refills glycogen. Broccoli adds fiber and micronutrients.',
          kcal: 600,
          portions: [
            { amount: 150, unit: 'g', name: 'salmon fillet' },
            { amount: 200, unit: 'g', name: 'cooked jasmine rice' },
            { amount: 1, unit: 'cup', name: 'broccoli florets' }
          ]
        }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Protein Pancakes with Berries & Yogurt',
          ingredients: ['oat flour', 'egg whites', 'Greek yogurt', 'mixed berries', 'maple syrup'],
          fuelStory: 'Feels like brunch, performs like fuel. High protein, plenty of carbs, minimal junk so you hit the WOD feeling light.',
          kcal: 480,
          portions: [
            { amount: 60, unit: 'g', name: 'oat flour' },
            { amount: 3, unit: '', name: 'egg whites' },
            { amount: 0.5, unit: 'cup', name: 'Greek yogurt' }
          ]
        },
        {
          mealType: 'snackPreWod',
          dishName: 'Rice cakes with peanut butter & banana',
          ingredients: ['rice cakes', 'peanut butter', 'banana'],
          timingHint: '45–60 min before training',
          fuelStory: 'Easy-on-the-stomach carbs plus a little fat. You get quick fuel without feeling heavy on the rower.',
          kcal: 220,
          portions: [
            { amount: 2, unit: '', name: 'rice cakes' },
            { amount: 1, unit: 'tbsp', name: 'peanut butter' }
          ]
        },
        {
          mealType: 'lunch',
          dishName: 'Turkey Rice Bowl with Greens & Pickled Onion',
          ingredients: ['ground turkey', 'brown rice', 'mixed greens', 'pickled red onion', 'olive oil', 'lime'],
          fuelStory: 'Lean turkey for repair, rice for refuel, greens for volume and micronutrients. Big bowl energy without the bloat.',
          kcal: 560,
          portions: [
            { amount: 140, unit: 'g', name: 'ground turkey (cooked)' },
            { amount: 180, unit: 'g', name: 'cooked brown rice' }
          ]
        },
        {
          mealType: 'snackPostWod',
          dishName: 'Chocolate milk-style shake',
          ingredients: ['cow milk or soy milk', 'cocoa powder', 'banana'],
          timingHint: 'Within 30 min after training',
          fuelStory: 'Classic carb-plus-protein combo in a glass. Replaces what you burned without needing cutlery.',
          kcal: 320,
          portions: [
            { amount: 250, unit: 'ml', name: 'milk' },
            { amount: 1, unit: '', name: 'banana' }
          ]
        },
        {
          mealType: 'dinner',
          dishName: 'Chicken Fajita Plate with Peppers & Rice',
          ingredients: ['chicken breast', 'bell peppers', 'onion', 'rice', 'spices', 'lime'],
          fuelStory: 'Big flavors, simple macros. Real-food dinner that still keeps tomorrow\'s training in mind.',
          kcal: 620,
          portions: [
            { amount: 160, unit: 'g', name: 'chicken breast' },
            { amount: 180, unit: 'g', name: 'cooked rice' }
          ]
        }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Egg & Potato Skillet with Spinach',
          ingredients: ['eggs', 'potato', 'spinach', 'olive oil'],
          fuelStory: 'Eggs for protein, potatoes for go-power, greens so your body doesn\'t revolt later. Feels like a diner plate, acts like training fuel.',
          kcal: 500,
          portions: [
            { amount: 2, unit: '', name: 'eggs' },
            { amount: 150, unit: 'g', name: 'potato' }
          ]
        },
        {
          mealType: 'snackPreWod',
          dishName: 'Toast with jam',
          ingredients: ['white or sourdough bread', 'jam'],
          timingHint: '30–45 min before training',
          fuelStory: 'Simple, fast carbs when you just need sugar in the tank. No fiber bomb, no stomach games.',
          kcal: 180,
          portions: [
            { amount: 2, unit: 'slices', name: 'bread' }
          ]
        },
        {
          mealType: 'lunch',
          dishName: 'Baked Salmon Grain Bowl',
          ingredients: ['salmon', 'farro', 'arugula', 'cherry tomatoes', 'olive oil', 'lemon'],
          fuelStory: 'A bowl that does double duty: refuel and reduce inflammation from heavy lifts.',
          kcal: 580,
          portions: [
            { amount: 140, unit: 'g', name: 'salmon' },
            { amount: 160, unit: 'g', name: 'cooked farro' }
          ]
        },
        {
          mealType: 'snackPostWod',
          dishName: 'Greek yogurt with honey & walnuts',
          ingredients: ['Greek yogurt', 'honey', 'walnuts'],
          timingHint: '30–60 min after training',
          fuelStory: 'Protein and carbs plus a bit of crunch. Dessert energy with performance macros.',
          kcal: 320,
          portions: [
            { amount: 170, unit: 'g', name: 'Greek yogurt' },
            { amount: 15, unit: 'g', name: 'walnuts' }
          ]
        },
        {
          mealType: 'dinner',
          dishName: 'Shrimp Stir-Fry with Jasmine Rice',
          ingredients: ['shrimp', 'jasmine rice', 'snap peas', 'carrots', 'soy sauce', 'sesame oil'],
          fuelStory: 'Quick-cooking shrimp for a light but serious protein hit. Rice tops up glycogen without sending you into a food coma.',
          kcal: 580,
          portions: [
            { amount: 140, unit: 'g', name: 'shrimp (peeled)' },
            { amount: 200, unit: 'g', name: 'cooked jasmine rice' }
          ]
        }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Bagel with Smoked Salmon & Cream Cheese',
          ingredients: ['bagel', 'smoked salmon', 'cream cheese', 'capers'],
          fuelStory: 'High-carb, high-protein breakfast that feels like a treat and trains like a pro. Great for long sessions or double days.',
          kcal: 520,
          portions: [
            { amount: 1, unit: '', name: 'bagel' },
            { amount: 60, unit: 'g', name: 'smoked salmon' }
          ]
        },
        {
          mealType: 'snackPreWod',
          dishName: 'Orange & handful of pretzels',
          ingredients: ['orange', 'pretzels'],
          timingHint: '45–60 min before training',
          fuelStory: 'Salt, carbs, and a bit of fluid. Easy to eat even when you\'re not hungry yet.',
          kcal: 200,
          portions: [
            { amount: 1, unit: '', name: 'orange' },
            { amount: 25, unit: 'g', name: 'pretzels' }
          ]
        },
        {
          mealType: 'lunch',
          dishName: 'Chicken Poke-Style Rice Bowl',
          ingredients: ['chicken breast', 'rice', 'edamame', 'cucumber', 'soy sauce', 'sesame oil'],
          fuelStory: 'Bright, fresh bowl that covers carbs, protein, and crunch without feeling heavy.',
          kcal: 560,
          portions: [
            { amount: 150, unit: 'g', name: 'chicken breast' },
            { amount: 200, unit: 'g', name: 'cooked rice' }
          ]
        },
        {
          mealType: 'snackPostWod',
          dishName: 'Smoothie: berries, yogurt & oats',
          ingredients: ['mixed berries', 'Greek yogurt', 'oats', 'milk'],
          timingHint: 'Within 30 min after training',
          fuelStory: 'Drinkable carbs and protein when chewing sounds like too much work.',
          kcal: 340,
          portions: [
            { amount: 0.5, unit: 'cup', name: 'mixed berries' },
            { amount: 30, unit: 'g', name: 'oats' }
          ]
        },
        {
          mealType: 'dinner',
          dishName: 'Beef & Sweet Potato Hash',
          ingredients: ['lean beef', 'sweet potato', 'onion', 'spinach', 'olive oil'],
          fuelStory: 'Beef brings iron and creatine, sweet potato keeps glycogen stocked, and the pan does all the work.',
          kcal: 620,
          portions: [
            { amount: 130, unit: 'g', name: 'lean beef' },
            { amount: 180, unit: 'g', name: 'sweet potato' }
          ]
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
          fuelStory: 'Handheld carb and protein bomb that travels well. Eggs and sweet potato keep you fueled through long WODs without a sugar spike.',
          kcal: 500,
          portions: [
            { amount: 2, unit: '', name: 'eggs' },
            { amount: 80, unit: 'g', name: 'sweet potato' }
          ]
        },
        {
          mealType: 'snackPreWod',
          dishName: 'Banana & small latte',
          ingredients: ['banana', 'milk', 'espresso'],
          timingHint: '60–90 min before training',
          fuelStory: 'Bit of caffeine, bit of sugar, not a lot of anything else. Enough to wake you up and get you on the barbell.',
          kcal: 190,
          portions: [
            { amount: 1, unit: '', name: 'banana' }
          ]
        },
        {
          mealType: 'lunch',
          dishName: 'Chicken & Quinoa Power Salad',
          ingredients: ['chicken breast', 'quinoa', 'mixed leaves', 'olive oil', 'lemon'],
          fuelStory: 'Protein plus complex carbs and crunch. You get a huge bowl without a huge slump.',
          kcal: 540,
          portions: [
            { amount: 140, unit: 'g', name: 'chicken breast' },
            { amount: 150, unit: 'g', name: 'cooked quinoa' }
          ]
        },
        {
          mealType: 'snackPostWod',
          dishName: 'Cottage cheese with pineapple & seeds',
          ingredients: ['cottage cheese', 'pineapple', 'pumpkin seeds'],
          timingHint: '30–60 min after training',
          fuelStory: 'Slow-digesting protein with a bit of fruit sugar. Keeps the recovery signal going into the evening.',
          kcal: 300,
          portions: [
            { amount: 150, unit: 'g', name: 'cottage cheese' },
            { amount: 0.5, unit: 'cup', name: 'pineapple chunks' }
          ]
        },
        {
          mealType: 'dinner',
          dishName: 'Pasta with Chicken & Roasted Veg',
          ingredients: ['pasta', 'chicken breast', 'zucchini', 'tomato', 'olive oil', 'parmesan'],
          fuelStory: 'Comfort food that still respects your macros. Carbs to refill, protein to repair, vegetables so tomorrow\'s digestion isn\'t mad.',
          kcal: 650,
          portions: [
            { amount: 75, unit: 'g', name: 'dry pasta' },
            { amount: 130, unit: 'g', name: 'chicken breast' }
          ]
        }
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
          fuelStory: 'On rest days you don\'t need the same carb load. Eggs and avocado give you quality fat and protein for satiety and repair. Rest day is part of the work.',
          kcal: 450,
          portions: [
            { amount: 2, unit: '', name: 'eggs' },
            { amount: 0.5, unit: '', name: 'avocado' },
            { amount: 1, unit: 'slice', name: 'sourdough bread' }
          ]
        },
        {
          mealType: 'lunch',
          dishName: 'Mediterranean Chickpea Bowl',
          ingredients: ['chickpeas', 'cucumber', 'tomato', 'red onion', 'feta', 'olive oil', 'oregano', 'lemon'],
          fuelStory: 'Plant-based protein and fat, moderate carbs. Chickpeas provide fiber and steady energy. Satisfying, anti-inflammatory.',
          kcal: 400,
          portions: [
            { amount: 1, unit: 'cup', name: 'cooked chickpeas' },
            { amount: 0.5, unit: 'cup', name: 'chopped cucumber & tomato' }
          ]
        },
        {
          mealType: 'dinner',
          dishName: 'Lean Beef Stir-Fry with Vegetables',
          ingredients: ['lean beef', 'bell peppers', 'broccoli', 'snap peas', 'soy sauce', 'rice', 'garlic'],
          fuelStory: 'Beef brings creatine and iron; the veggies add volume and micronutrients. Supports repair and keeps you ready for tomorrow.',
          kcal: 550,
          portions: [
            { amount: 120, unit: 'g', name: 'lean beef strips' },
            { amount: 1, unit: 'cup', name: 'mixed stir-fry vegetables' },
            { amount: 150, unit: 'g', name: 'cooked rice' }
          ]
        },
        {
          mealType: 'snack',
          dishName: 'Apple Slices with Almond Butter',
          ingredients: ['apple', 'almond butter', 'cinnamon'],
          fuelStory: 'Light, real-food snack. Enough to keep hunger at bay. Fiber and fat for steady blood sugar.',
          kcal: 250,
          portions: [
            { amount: 1, unit: '', name: 'apple' },
            { amount: 1, unit: 'tbsp', name: 'almond butter' }
          ]
        }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        {
          mealType: 'breakfast',
          dishName: 'Greek Yogurt Parfait with Nuts & Seeds',
          ingredients: ['Greek yogurt', 'walnuts', 'pumpkin seeds', 'berries', 'honey'],
          fuelStory: 'High protein, moderate carbs, and healthy fats for a slow, steady morning. Keeps you full without a crash.',
          kcal: 420,
          portions: [
            { amount: 170, unit: 'g', name: 'Greek yogurt' },
            { amount: 15, unit: 'g', name: 'walnuts & seeds' }
          ]
        },
        {
          mealType: 'lunch',
          dishName: 'Quinoa & Roasted Veggie Plate',
          ingredients: ['quinoa', 'zucchini', 'eggplant', 'bell peppers', 'olive oil', 'herbs'],
          fuelStory: 'Color on a plate plus plant protein. Fiber and volume without a blood sugar rollercoaster.',
          kcal: 430,
          portions: [
            { amount: 150, unit: 'g', name: 'cooked quinoa' },
            { amount: 1, unit: 'cup', name: 'roasted vegetables' }
          ]
        },
        {
          mealType: 'dinner',
          dishName: 'Herbed Chicken Thighs with Roasted Veg',
          ingredients: ['chicken thighs', 'carrots', 'Brussels sprouts', 'olive oil', 'garlic', 'thyme'],
          fuelStory: 'A cozy, higher-fat meal for a lower-output day. Plenty of protein for repair without excessive carbs.',
          kcal: 560,
          portions: [
            { amount: 150, unit: 'g', name: 'chicken thighs' },
            { amount: 1, unit: 'cup', name: 'roasted vegetables' }
          ]
        },
        {
          mealType: 'snack',
          dishName: 'Carrot sticks with hummus',
          ingredients: ['carrots', 'hummus', 'paprika'],
          fuelStory: 'Crisp, crunchy, and light. Enough to kill cravings without turning into a second lunch.',
          kcal: 220,
          portions: [
            { amount: 100, unit: 'g', name: 'carrot sticks' },
            { amount: 40, unit: 'g', name: 'hummus' }
          ]
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
          fuelStory: 'Low-carb, high-satiety breakfast that leans into protein and fat on your easier day.',
          kcal: 430,
          portions: [
            { amount: 2, unit: '', name: 'eggs' },
            { amount: 0.5, unit: 'cup', name: 'mixed vegetables' }
          ]
        },
        {
          mealType: 'lunch',
          dishName: 'Tuna Salad Lettuce Wraps',
          ingredients: ['canned tuna', 'Greek yogurt', 'celery', 'lettuce', 'lemon', 'mustard'],
          fuelStory: 'High protein without the bread. Crunchy, salty, and light enough for a walk after.',
          kcal: 380,
          portions: [
            { amount: 1, unit: 'can', name: 'tuna' },
            { amount: 3, unit: 'leaves', name: 'lettuce' }
          ]
        },
        {
          mealType: 'dinner',
          dishName: 'Lentil Soup with Greens',
          ingredients: ['lentils', 'spinach', 'carrots', 'onion', 'vegetable broth', 'olive oil'],
          fuelStory: 'Warm, slow, and grounding. Lentils bring plant protein and fiber that fit perfectly into a recovery day.',
          kcal: 480,
          portions: [
            { amount: 1, unit: 'cup', name: 'cooked lentils' },
            { amount: 1, unit: 'cup', name: 'broth & vegetables' }
          ]
        },
        {
          mealType: 'snack',
          dishName: 'Dark chocolate & almonds',
          ingredients: ['dark chocolate', 'almonds'],
          fuelStory: 'A small, deliberate treat instead of accidental snacking. Fat and a touch of sweetness take the edge off cravings.',
          kcal: 230,
          portions: [
            { amount: 15, unit: 'g', name: 'dark chocolate' },
            { amount: 15, unit: 'g', name: 'almonds' }
          ]
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
          fuelStory: 'Fiber and fat up front so you\'re not thinking about food every hour. Light sweetness, heavy satiety.',
          kcal: 380,
          portions: [
            { amount: 30, unit: 'g', name: 'chia seeds' },
            { amount: 200, unit: 'ml', name: 'milk' }
          ]
        },
        {
          mealType: 'lunch',
          dishName: 'Grain-free Chicken Salad Plate',
          ingredients: ['chicken breast', 'mixed greens', 'avocado', 'olive oil', 'lemon'],
          fuelStory: 'Protein plus fats, almost no grains. Great if your body wants a lighter carb day.',
          kcal: 420,
          portions: [
            { amount: 130, unit: 'g', name: 'chicken breast' },
            { amount: 1, unit: 'cup', name: 'mixed greens' }
          ]
        },
        {
          mealType: 'dinner',
          dishName: 'Baked Cod with Roasted Vegetables',
          ingredients: ['cod fillet', 'broccoli', 'carrots', 'olive oil', 'lemon'],
          fuelStory: 'Lean protein and vegetables to close the day without overloading your system.',
          kcal: 440,
          portions: [
            { amount: 150, unit: 'g', name: 'cod fillet' },
            { amount: 1, unit: 'cup', name: 'roasted vegetables' }
          ]
        },
        {
          mealType: 'snack',
          dishName: 'Yogurt with cinnamon & seeds',
          ingredients: ['plain yogurt', 'mixed seeds', 'cinnamon'],
          fuelStory: 'Simple protein snack to bridge the gap between meals on lower-output days.',
          kcal: 210,
          portions: [
            { amount: 120, unit: 'g', name: 'yogurt' },
            { amount: 10, unit: 'g', name: 'mixed seeds' }
          ]
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
          fuelStory: 'Rest-day oats: smaller portion, more fats. Your muscles still get carbs, your appetite gets something cozy.',
          kcal: 420,
          portions: [
            { amount: 40, unit: 'g', name: 'oats' },
            { amount: 200, unit: 'ml', name: 'milk' }
          ]
        },
        {
          mealType: 'lunch',
          dishName: 'Stuffed Sweet Potato with Black Beans & Salsa',
          ingredients: ['sweet potato', 'black beans', 'salsa', 'Greek yogurt'],
          fuelStory: 'Fiber-heavy comfort food that still respects your macros. Plant protein and slow carbs keep you full all afternoon.',
          kcal: 460,
          portions: [
            { amount: 1, unit: 'medium', name: 'sweet potato' },
            { amount: 0.75, unit: 'cup', name: 'black beans' }
          ]
        },
        {
          mealType: 'dinner',
          dishName: 'Turkey Lettuce Taco Night',
          ingredients: ['ground turkey', 'lettuce', 'tomato', 'cheese', 'salsa'],
          fuelStory: 'All the fun of taco night with a gentler carb hit. Great on a day when you moved less but still want something fun.',
          kcal: 520,
          portions: [
            { amount: 140, unit: 'g', name: 'ground turkey (cooked)' },
            { amount: 4, unit: 'leaves', name: 'lettuce' }
          ]
        },
        {
          mealType: 'snack',
          dishName: 'Cottage cheese with cucumber & olive oil',
          ingredients: ['cottage cheese', 'cucumber', 'olive oil', 'pepper'],
          fuelStory: 'Savory protein snack when you\'re not in the mood for sweet. Keeps you from diving into the pantry.',
          kcal: 230,
          portions: [
            { amount: 150, unit: 'g', name: 'cottage cheese' },
            { amount: 0.5, unit: '', name: 'cucumber' }
          ]
        }
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  }];

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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  }];

  const screenSelector = document.getElementById('screen-selector');
  const screenMenu = document.getElementById('screen-menu');
  const btnWod = document.getElementById('btn-wod');
  const btnRest = document.getElementById('btn-rest');
  const btnGenerate = document.getElementById('btn-generate');
  const filters = document.getElementById('filters');
  const menuCards = document.getElementById('menu-cards');
  const resultDayBadge = document.getElementById('result-day-badge');
  const menuPlanTitle = document.getElementById('menu-plan-title');
  const menuQuote = document.getElementById('menu-quote');
  const tagsRow = document.getElementById('tags-row');
  const macroCarbs = document.getElementById('macro-carbs');
  const macroProtein = document.getElementById('macro-protein');
  const macroFat = document.getElementById('macro-fat');
  const macroLegend = document.getElementById('macro-legend');
  const btnShoppingList = document.getElementById('btn-shopping-list');
  const btnDownloadMenu = document.getElementById('btn-download-menu');
  const btnShareToggle = document.getElementById('btn-share-toggle');
  const shareDropdown = document.getElementById('share-dropdown');
  const shareEmail = document.getElementById('share-email');
  const shareWhatsapp = document.getElementById('share-whatsapp');
  const shareInstagram = document.getElementById('share-instagram');
  const btnNewMenu = document.getElementById('btn-new-menu');
  const shoppingOverlay = document.getElementById('shopping-overlay');
  const shoppingOverlayContent = document.getElementById('shopping-overlay-content');
  const shoppingListEl = document.getElementById('shopping-list');
  const shoppingClose = document.getElementById('shopping-close');
  const btnDownloadWhatINeed = document.getElementById('btn-download-what-i-need');
  const btnDownloadFullList = document.getElementById('btn-download-full-list');
  const shareCardWrap = document.getElementById('share-card-wrap');
  const shareCard = document.getElementById('share-card');
  const shareCardDay = document.getElementById('share-card-day');
  const shareCardMeals = document.getElementById('share-card-meals');
  const shareCardPhrase = document.getElementById('share-card-phrase');

  const caloriesInline = document.getElementById('calories-inline');
  const btnToggleCalories = document.getElementById('btn-toggle-calories');
  const caloriesScaleText = document.getElementById('calories-scale-text');
  const inputCalorieTarget = document.getElementById('input-calorie-target');
  const btnApplyTarget = document.getElementById('btn-apply-target');

  let selectedDay = null;
  let activeFilters = { vegan: false, glutenFree: false, dairyFree: false };
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

  filters?.addEventListener('click', function (e) {
    const chip = e.target.closest('.filter-chip[data-filter]');
    if (!chip) return;
    const key = chip.getAttribute('data-filter');
    activeFilters[key] = !activeFilters[key];
    chip.setAttribute('aria-pressed', activeFilters[key] ? 'true' : 'false');
    chip.classList.toggle('active', activeFilters[key]);
  });

  function getMenuForDay(dayType) {
    const isVegan = activeFilters.vegan;
    const pool = dayType === 'wod'
      ? (isVegan ? MENUS_WOD_VEGAN : MENUS_WOD)
      : (isVegan ? MENUS_REST_VEGAN : MENUS_REST);
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

    if (tagsRow) {
      const tags = isWod ? TAGS_WOD : TAGS_REST;
      tagsRow.innerHTML = tags.map(function (t) { return '<span class="tag-pill">' + escapeHtml(t) + '</span>'; }).join('');
    }

    const macro = isWod ? MACRO_WOD : MACRO_REST;
    if (macroCarbs) macroCarbs.style.width = macro.carbs + '%';
    if (macroProtein) macroProtein.style.width = macro.protein + '%';
    if (macroFat) macroFat.style.width = macro.fat + '%';
    if (macroLegend) {
      macroLegend.innerHTML =
        '<span><span class="dot dot--carbs" aria-hidden="true"></span> Carbs ' + macro.carbs + '%</span>' +
        '<span><span class="dot dot--protein" aria-hidden="true"></span> Protein ' + macro.protein + '%</span>' +
        '<span><span class="dot dot--fat" aria-hidden="true"></span> Fat ' + macro.fat + '%</span>';
    }

    menuCards.innerHTML = '';
    (menu.meals || []).forEach(function (m, idx) {
      const block = document.createElement('article');
      block.className = 'meal-block meal-block--' + menu.dayType;
      const timing = m.timingHint ? m.timingHint : '';
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
          '<ul class="meal-portions" data-meal-index="' + idx + '"></ul>' +
        '</div>';
      menuCards.appendChild(block);
    });

    portionScale = 1;
    if (inputCalorieTarget) inputCalorieTarget.value = '';
    if (caloriesScaleText) { caloriesScaleText.textContent = ''; caloriesScaleText.classList.add('hidden'); }
    if (caloriesInline) caloriesInline.classList.add('hidden');
    if (btnToggleCalories) {
      btnToggleCalories.setAttribute('aria-pressed', 'false');
      btnToggleCalories.textContent = 'Calorie details';
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
    btnToggleCalories.textContent = isOpen ? 'Hide calorie details' : 'Calorie details';
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
        row.setAttribute('data-category', g.category);
        row.innerHTML = '<input type="checkbox"> <span>' + escapeHtml(item) + '</span>';
        section.appendChild(row);
      });
      shoppingListEl.appendChild(section);
    });
    shoppingOverlay?.classList.remove('hidden');
  }

  btnShoppingList?.addEventListener('click', function (e) {
    e.preventDefault();
    openShoppingList();
  });
  shoppingClose?.addEventListener('click', function () { shoppingOverlay?.classList.add('hidden'); });
  shoppingOverlay?.addEventListener('click', function (e) {
    if (e.target === shoppingOverlay) shoppingOverlay.classList.add('hidden');
  });
  shoppingOverlayContent?.addEventListener('click', function (e) { e.stopPropagation(); });

  function downloadShoppingListAsTxt(onlyUnchecked) {
    const items = shoppingListEl?.querySelectorAll('.shopping-item');
    if (!items || items.length === 0) return;
    const byCategory = {};
    items.forEach(function (row) {
      const input = row.querySelector('input[type="checkbox"]');
      const span = row.querySelector('span');
      if (!span) return;
      if (onlyUnchecked && input && input.checked) return;
      const cat = row.getAttribute('data-category') || 'Other';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(span.textContent.trim());
    });
    const lines = [];
    const order = ['Proteins', 'Vegetables', 'Carbs', 'Pantry', 'Extras'];
    order.forEach(function (cat) {
      if (!byCategory[cat] || byCategory[cat].length === 0) return;
      lines.push(cat.toUpperCase());
      byCategory[cat].forEach(function (item) { lines.push('  • ' + item); });
      lines.push('');
    });
    Object.keys(byCategory).forEach(function (cat) {
      if (order.indexOf(cat) !== -1) return;
      lines.push(cat.toUpperCase());
      byCategory[cat].forEach(function (item) { lines.push('  • ' + item); });
      lines.push('');
    });
    const title = lastGeneratedMenu?.dayType === 'wod' ? 'CrossFit Day' : 'Rest Day';
    const header = 'CrossFit Fuel — Shopping list (' + title + ')\n' + (onlyUnchecked ? 'What I need to buy\n\n' : '\n');
    const blob = new Blob([header + lines.join('\n').trim() + '\n\n— aiprotolab.es/crossfit-fuel'], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'crossfit-fuel-shopping-' + (onlyUnchecked ? 'to-buy' : 'full') + '.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  btnDownloadWhatINeed?.addEventListener('click', function () { downloadShoppingListAsTxt(true); });
  btnDownloadFullList?.addEventListener('click', function () { downloadShoppingListAsTxt(false); });

  function getShareText() {
    if (!lastGeneratedMenu) return '';
    const lines = (lastGeneratedMenu.meals || []).map(function (m) {
      const label = m.mealType === 'snackPreWod' ? 'Pre-WOD snack' : m.mealType === 'snackPostWod' ? 'Post-WOD snack' : getMealLabel(m.mealType);
      return label + ': ' + (m.dishName || '');
    });
    const dayLabel = lastGeneratedMenu.dayType === 'wod' ? 'CrossFit Day' : 'Rest Day';
    return 'My CrossFit Fuel plan (' + dayLabel + ')\n\n' + lines.join('\n') + '\n\n— aiprotolab.es/crossfit-fuel';
  }

  function getShareUrl() {
    return 'https://aiprotolab.es/crossfit-fuel';
  }

  btnDownloadMenu?.addEventListener('click', function () {
    if (!lastGeneratedMenu) return;
    if (shareCardDay) shareCardDay.textContent = lastGeneratedMenu.dayType === 'wod' ? 'CrossFit Day' : 'Rest Day';
    if (shareCardPhrase) shareCardPhrase.textContent = lastGeneratedMenu.dayType === 'wod' ? 'Today you train. Eat like it.' : 'Rest is part of the work.';
    if (shareCardMeals) {
      const lines = (lastGeneratedMenu.meals || []).map(function (m) {
        const label = m.mealType === 'snackPreWod' ? 'Pre-WOD snack' : m.mealType === 'snackPostWod' ? 'Post-WOD snack' : getMealLabel(m.mealType);
        return label + ': ' + (m.dishName || '');
      });
      shareCardMeals.innerHTML = lines.map(function (line) { return '<p>' + escapeHtml(line) + '</p>'; }).join('');
    }
    shareCardWrap.classList.remove('hidden');
    shareCardWrap.style.position = 'fixed';
    shareCardWrap.style.left = '0';
    shareCardWrap.style.top = '0';
    shareCardWrap.style.width = '360px';
    shareCardWrap.style.height = '640px';
    shareCardWrap.style.zIndex = '9999';
    function resetShareWrap() {
      shareCardWrap.classList.add('hidden');
      shareCardWrap.style.position = '';
      shareCardWrap.style.left = '';
      shareCardWrap.style.top = '';
      shareCardWrap.style.width = '';
      shareCardWrap.style.height = '';
      shareCardWrap.style.zIndex = '';
    }
    if (typeof html2canvas !== 'function') { resetShareWrap(); return; }
    html2canvas(shareCard, { scale: 2, useCORS: true, logging: false, width: 360, height: 640 }).then(function (canvas) {
      const link = document.createElement('a');
      link.download = 'crossfit-fuel-menu.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      resetShareWrap();
    });
  });

  btnShareToggle?.addEventListener('click', function (e) {
    e.stopPropagation();
    const open = shareDropdown?.classList.toggle('hidden');
    btnShareToggle?.setAttribute('aria-expanded', !open);
  });
  document.addEventListener('click', function () {
    shareDropdown?.classList.add('hidden');
    btnShareToggle?.setAttribute('aria-expanded', 'false');
  });
  shareDropdown?.addEventListener('click', function (e) { e.stopPropagation(); });

  shareEmail?.addEventListener('click', function (e) {
    e.preventDefault();
    const subject = encodeURIComponent('My CrossFit Fuel plan');
    const body = encodeURIComponent(getShareText());
    window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
    shareDropdown?.classList.add('hidden');
  });
  shareWhatsapp?.addEventListener('click', function (e) {
    e.preventDefault();
    const text = encodeURIComponent(getShareText());
    window.open('https://wa.me/?text=' + text, '_blank', 'noopener');
    shareDropdown?.classList.add('hidden');
  });
  shareInstagram?.addEventListener('click', function (e) {
    e.preventDefault();
    if (!lastGeneratedMenu) return;
    if (shareCardDay) shareCardDay.textContent = lastGeneratedMenu.dayType === 'wod' ? 'CrossFit Day' : 'Rest Day';
    if (shareCardPhrase) shareCardPhrase.textContent = lastGeneratedMenu.dayType === 'wod' ? 'Today you train. Eat like it.' : 'Rest is part of the work.';
    if (shareCardMeals) {
      const lines = (lastGeneratedMenu.meals || []).map(function (m) {
        const label = m.mealType === 'snackPreWod' ? 'Pre-WOD snack' : m.mealType === 'snackPostWod' ? 'Post-WOD snack' : getMealLabel(m.mealType);
        return label + ': ' + (m.dishName || '');
      });
      shareCardMeals.innerHTML = lines.map(function (line) { return '<p>' + escapeHtml(line) + '</p>'; }).join('');
    }
    shareCardWrap.classList.remove('hidden');
    shareCardWrap.style.position = 'fixed';
    shareCardWrap.style.left = '0';
    shareCardWrap.style.top = '0';
    shareCardWrap.style.width = '360px';
    shareCardWrap.style.height = '640px';
    shareCardWrap.style.zIndex = '9999';
    function resetShareWrap() {
      shareCardWrap.classList.add('hidden');
      shareCardWrap.style.position = '';
      shareCardWrap.style.left = '';
      shareCardWrap.style.top = '';
      shareCardWrap.style.width = '';
      shareCardWrap.style.height = '';
      shareCardWrap.style.zIndex = '';
    }
    if (typeof html2canvas !== 'function') { resetShareWrap(); return; }
    html2canvas(shareCard, { scale: 2, useCORS: true, logging: false, width: 360, height: 640 }).then(function (canvas) {
      const link = document.createElement('a');
      link.download = 'crossfit-fuel-instagram.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      resetShareWrap();
    });
    shareDropdown?.classList.add('hidden');
  });

  btnNewMenu?.addEventListener('click', function () {
    if (screenMenu) screenMenu.classList.add('hidden');
    if (screenSelector) screenSelector.classList.remove('hidden');
  });
})();
