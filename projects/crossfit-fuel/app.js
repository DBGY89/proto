/**
 * CrossFit Fuel — Curated menu bank, no AI. Dietary filters. Tags, macro bar, meal blocks.
 *
 * Recetas por combinación (day type + filter):
 * ┌─────────────────────┬──────────────┬──────────────┐
 * │ Combinación         │ Día entreno  │ Día descanso │
 * ├─────────────────────┼──────────────┼──────────────┤
 * │ Sin filtro          │ 10           │ 10           │
 * │ Vegano              │ 5            │ 5            │
 * │ Gluten-free         │ 5            │ 5            │
 * │ Dairy-free          │ 5            │ 5            │
 * └─────────────────────┴──────────────┴──────────────┘
 * Si hay varios filtros activos: prioridad Vegan > Gluten-free > Dairy-free.
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
    },
    {
      dayType: 'wod',
      meals: [
        { mealType: 'breakfast', dishName: 'Scrambled Eggs with Rice & Salsa', ingredients: ['eggs', 'white rice', 'salsa', 'olive oil'], fuelStory: 'Carbs and protein in one pan. Quick to make, easy to eat before an early session.', kcal: 480, portions: [{ amount: 2, unit: '', name: 'eggs' }, { amount: 150, unit: 'g', name: 'cooked rice' }] },
        { mealType: 'snackPreWod', dishName: 'Mashed banana on rice cakes', ingredients: ['banana', 'rice cakes'], timingHint: '45–60 min before', fuelStory: 'Simple sugars and light volume. No heavy stomach.', kcal: 200, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 2, unit: '', name: 'rice cakes' }] },
        { mealType: 'lunch', dishName: 'Pork Tenderloin with Quinoa & Roasted Veg', ingredients: ['pork tenderloin', 'quinoa', 'bell peppers', 'zucchini', 'olive oil'], fuelStory: 'Lean protein and complex carbs. Fills you up without slowing you down.', kcal: 580, portions: [{ amount: 140, unit: 'g', name: 'pork tenderloin' }, { amount: 160, unit: 'g', name: 'cooked quinoa' }] },
        { mealType: 'snackPostWod', dishName: 'Protein shake & banana', ingredients: ['protein powder', 'banana', 'milk or water'], timingHint: 'Within 30 min', fuelStory: 'Fast protein and carbs to kick off recovery.', kcal: 280, portions: [{ amount: 1, unit: 'scoop', name: 'protein powder' }, { amount: 1, unit: '', name: 'banana' }] },
        { mealType: 'dinner', dishName: 'Turkey Meatballs with Marinara & Spaghetti', ingredients: ['ground turkey', 'pasta', 'tomato sauce', 'garlic', 'basil'], fuelStory: 'Classic post-training plate. Carbs and protein in a format you actually want to eat.', kcal: 620, portions: [{ amount: 130, unit: 'g', name: 'ground turkey' }, { amount: 70, unit: 'g', name: 'dry spaghetti' }] }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        { mealType: 'breakfast', dishName: 'Sweet Potato Hash with Eggs & Spinach', ingredients: ['sweet potato', 'eggs', 'spinach', 'onion', 'olive oil'], fuelStory: 'Hearty breakfast that fuels a long morning and a midday WOD.', kcal: 490, portions: [{ amount: 150, unit: 'g', name: 'sweet potato' }, { amount: 2, unit: '', name: 'eggs' }] },
        { mealType: 'snackPreWod', dishName: 'Oat bar & small apple', ingredients: ['oat bar', 'apple'], timingHint: '60 min before', fuelStory: 'Portable carbs and a bit of fiber. Easy to eat on the go.', kcal: 220, portions: [{ amount: 1, unit: '', name: 'oat bar' }, { amount: 1, unit: '', name: 'apple' }] },
        { mealType: 'lunch', dishName: 'Tuna Niçoise-Style Bowl with Rice', ingredients: ['tuna', 'rice', 'green beans', 'egg', 'olives', 'olive oil'], fuelStory: 'Protein and carbs with Mediterranean flair. Light but substantial.', kcal: 560, portions: [{ amount: 120, unit: 'g', name: 'tuna' }, { amount: 180, unit: 'g', name: 'cooked rice' }] },
        { mealType: 'snackPostWod', dishName: 'Milk & honey with almonds', ingredients: ['milk', 'honey', 'almonds'], timingHint: 'Within 30 min', fuelStory: 'Simple recovery combo. Carbs, protein, and a touch of fat.', kcal: 300, portions: [{ amount: 250, unit: 'ml', name: 'milk' }, { amount: 15, unit: 'g', name: 'almonds' }] },
        { mealType: 'dinner', dishName: 'Grilled Steak with Potato Wedges & Salad', ingredients: ['beef steak', 'potato', 'mixed greens', 'olive oil', 'lemon'], fuelStory: 'High protein and starchy carbs. Recovery and refuel in one plate.', kcal: 640, portions: [{ amount: 150, unit: 'g', name: 'beef steak' }, { amount: 200, unit: 'g', name: 'potato' }] }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        { mealType: 'breakfast', dishName: 'French Toast with Berries & Maple Syrup', ingredients: ['bread', 'eggs', 'berries', 'maple syrup', 'cinnamon'], fuelStory: 'High-carb breakfast that feels like a treat. Perfect before a tough session.', kcal: 520, portions: [{ amount: 2, unit: 'slices', name: 'bread' }, { amount: 2, unit: '', name: 'eggs' }] },
        { mealType: 'snackPreWod', dishName: 'Dried fruit & nuts (small handful)', ingredients: ['dried apricots', 'almonds'], timingHint: '45–60 min before', fuelStory: 'Dense carbs and a bit of fat. No prep, no mess.', kcal: 180, portions: [{ amount: 30, unit: 'g', name: 'dried fruit' }, { amount: 10, unit: 'g', name: 'almonds' }] },
        { mealType: 'lunch', dishName: 'Chicken & Rice Soup with Veg', ingredients: ['chicken breast', 'rice', 'carrots', 'celery', 'broth'], fuelStory: 'Warm, easy to digest, and full of what you need after a hard effort.', kcal: 480, portions: [{ amount: 120, unit: 'g', name: 'chicken breast' }, { amount: 80, unit: 'g', name: 'rice' }] },
        { mealType: 'snackPostWod', dishName: 'Cream cheese & jam on crackers', ingredients: ['cream cheese', 'jam', 'crackers'], timingHint: 'Within 30 min', fuelStory: 'Quick carbs and a bit of protein. Tasty and effective.', kcal: 260, portions: [{ amount: 30, unit: 'g', name: 'cream cheese' }, { amount: 4, unit: '', name: 'crackers' }] },
        { mealType: 'dinner', dishName: 'Lamb Chops with Couscous & Roasted Veg', ingredients: ['lamb chops', 'couscous', 'eggplant', 'tomato', 'olive oil'], fuelStory: 'Rich protein and carbs. A solid dinner to close a big day.', kcal: 660, portions: [{ amount: 140, unit: 'g', name: 'lamb chops' }, { amount: 150, unit: 'g', name: 'cooked couscous' }] }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        { mealType: 'breakfast', dishName: 'Muesli with Milk, Banana & Honey', ingredients: ['muesli', 'milk', 'banana', 'honey'], fuelStory: 'Oats, fruit, and dairy. Steady energy for the first part of the day.', kcal: 460, portions: [{ amount: 70, unit: 'g', name: 'muesli' }, { amount: 200, unit: 'ml', name: 'milk' }] },
        { mealType: 'snackPreWod', dishName: 'Smoothie: banana, oats, milk', ingredients: ['banana', 'oats', 'milk'], timingHint: '60 min before', fuelStory: 'Drinkable carbs. Easy when you don\'t feel like chewing.', kcal: 280, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 30, unit: 'g', name: 'oats' }] },
        { mealType: 'lunch', dishName: 'Fish Tacos with Cabbage Slaw & Lime', ingredients: ['white fish', 'corn tortillas', 'cabbage', 'lime', 'avocado'], fuelStory: 'Lean protein and carbs. Fresh and light for a post-WOD lunch.', kcal: 540, portions: [{ amount: 130, unit: 'g', name: 'white fish' }, { amount: 3, unit: '', name: 'tortillas' }] },
        { mealType: 'snackPostWod', dishName: 'Yogurt pot with granola & berries', ingredients: ['yogurt', 'granola', 'berries'], timingHint: 'Within 30 min', fuelStory: 'Classic recovery snack. Protein and carbs in one cup.', kcal: 320, portions: [{ amount: 150, unit: 'g', name: 'yogurt' }, { amount: 30, unit: 'g', name: 'granola' }] },
        { mealType: 'dinner', dishName: 'Chicken Curry with Basmati Rice', ingredients: ['chicken thigh', 'basmati rice', 'coconut milk', 'curry paste', 'vegetables'], fuelStory: 'Warming and satisfying. Carbs and protein in a format that goes down easy.', kcal: 630, portions: [{ amount: 150, unit: 'g', name: 'chicken thigh' }, { amount: 180, unit: 'g', name: 'cooked rice' }] }
      ]
    },
    {
      dayType: 'wod',
      meals: [
        { mealType: 'breakfast', dishName: 'Breakfast Bowl: Rice, Egg, Avocado & Kimchi', ingredients: ['rice', 'egg', 'avocado', 'kimchi', 'sesame oil'], fuelStory: 'Savory start. Carbs, fat, and protein with a kick.', kcal: 530, portions: [{ amount: 160, unit: 'g', name: 'cooked rice' }, { amount: 1, unit: '', name: 'egg' }] },
        { mealType: 'snackPreWod', dishName: 'Pear & handful of grapes', ingredients: ['pear', 'grapes'], timingHint: '45–60 min before', fuelStory: 'Fruit-based carbs. Light and quick.', kcal: 160, portions: [{ amount: 1, unit: '', name: 'pear' }, { amount: 80, unit: 'g', name: 'grapes' }] },
        { mealType: 'lunch', dishName: 'Sardines on Toast with Tomato & Greens', ingredients: ['sardines', 'bread', 'tomato', 'arugula', 'lemon'], fuelStory: 'Omega-3s and carbs. Simple and powerful.', kcal: 500, portions: [{ amount: 1, unit: 'can', name: 'sardines' }, { amount: 2, unit: 'slices', name: 'bread' }] },
        { mealType: 'snackPostWod', dishName: 'Chia pudding with fruit', ingredients: ['chia seeds', 'milk', 'mango', 'coconut'], timingHint: 'Within 30 min', fuelStory: 'Carbs and a bit of protein. Refreshing after a hot WOD.', kcal: 290, portions: [{ amount: 25, unit: 'g', name: 'chia seeds' }, { amount: 150, unit: 'ml', name: 'milk' }] },
        { mealType: 'dinner', dishName: 'Stuffed Bell Peppers with Beef & Rice', ingredients: ['ground beef', 'rice', 'bell peppers', 'tomato', 'herbs'], fuelStory: 'All-in-one dinner. Protein and carbs in a single dish.', kcal: 600, portions: [{ amount: 120, unit: 'g', name: 'ground beef' }, { amount: 150, unit: 'g', name: 'cooked rice' }] }
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
    },
    {
      dayType: 'rest',
      meals: [
        { mealType: 'breakfast', dishName: 'Smoked Salmon & Cream Cheese on Rye', ingredients: ['smoked salmon', 'cream cheese', 'rye bread', 'capers'], fuelStory: 'Quality fat and protein. Rest-day luxury without a carb overload.', kcal: 420, portions: [{ amount: 60, unit: 'g', name: 'smoked salmon' }, { amount: 1, unit: 'slice', name: 'rye bread' }] },
        { mealType: 'lunch', dishName: 'White Bean & Tuna Salad with Olive Oil', ingredients: ['cannellini beans', 'tuna', 'red onion', 'olive oil', 'lemon'], fuelStory: 'Protein and fiber. Filling and anti-inflammatory.', kcal: 450, portions: [{ amount: 1, unit: 'cup', name: 'white beans' }, { amount: 80, unit: 'g', name: 'tuna' }] },
        { mealType: 'dinner', dishName: 'Roast Chicken with Root Vegetables', ingredients: ['chicken leg', 'carrots', 'parsnip', 'onion', 'olive oil'], fuelStory: 'Comforting and simple. Protein and veg without heavy carbs.', kcal: 520, portions: [{ amount: 150, unit: 'g', name: 'chicken leg' }, { amount: 1, unit: 'cup', name: 'root vegetables' }] },
        { mealType: 'snack', dishName: 'Handful of olives & cherry tomatoes', ingredients: ['olives', 'cherry tomatoes'], fuelStory: 'Savory, light. Enough to tide you over.', kcal: 120, portions: [{ amount: 30, unit: 'g', name: 'olives' }, { amount: 6, unit: '', name: 'cherry tomatoes' }] }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        { mealType: 'breakfast', dishName: 'Cottage Cheese Bowl with Peach & Mint', ingredients: ['cottage cheese', 'peach', 'mint', 'walnuts'], fuelStory: 'High protein, moderate carbs. Refreshing and satisfying.', kcal: 350, portions: [{ amount: 180, unit: 'g', name: 'cottage cheese' }, { amount: 1, unit: '', name: 'peach' }] },
        { mealType: 'lunch', dishName: 'Grilled Halloumi & Watermelon Salad', ingredients: ['halloumi', 'watermelon', 'cucumber', 'mint', 'olive oil'], fuelStory: 'Salty and sweet. Protein and hydration in one plate.', kcal: 440, portions: [{ amount: 100, unit: 'g', name: 'halloumi' }, { amount: 150, unit: 'g', name: 'watermelon' }] },
        { mealType: 'dinner', dishName: 'Mackerel with Roasted Fennel & Lemon', ingredients: ['mackerel', 'fennel', 'lemon', 'olive oil'], fuelStory: 'Omega-3s and veg. Light but nutrient-dense.', kcal: 480, portions: [{ amount: 150, unit: 'g', name: 'mackerel' }, { amount: 1, unit: 'bulb', name: 'fennel' }] },
        { mealType: 'snack', dishName: 'Rice cake with almond butter', ingredients: ['rice cake', 'almond butter'], fuelStory: 'Light crunch. Just enough to curb hunger.', kcal: 180, portions: [{ amount: 1, unit: '', name: 'rice cake' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }] }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        { mealType: 'breakfast', dishName: 'Shakshuka with Feta & Whole Grain Bread', ingredients: ['eggs', 'tomato', 'bell pepper', 'feta', 'bread'], fuelStory: 'Protein and veg in one pan. Rest-day brunch done right.', kcal: 460, portions: [{ amount: 2, unit: '', name: 'eggs' }, { amount: 1, unit: 'slice', name: 'bread' }] },
        { mealType: 'lunch', dishName: 'Falafel Plate with Tahini & Salad', ingredients: ['falafel', 'tahini', 'cucumber', 'tomato', 'lettuce'], fuelStory: 'Plant protein and fat. Satisfying without weighing you down.', kcal: 480, portions: [{ amount: 5, unit: '', name: 'falafel' }, { amount: 2, unit: 'tbsp', name: 'tahini' }] },
        { mealType: 'dinner', dishName: 'Pork Chop with Apple & Cabbage Slaw', ingredients: ['pork chop', 'apple', 'cabbage', 'apple cider vinegar'], fuelStory: 'Protein and a touch of sweet. Cozy rest-day dinner.', kcal: 510, portions: [{ amount: 140, unit: 'g', name: 'pork chop' }, { amount: 0.5, unit: '', name: 'apple' }] },
        { mealType: 'snack', dishName: 'Dates stuffed with almond butter', ingredients: ['dates', 'almond butter'], fuelStory: 'Natural sugar and fat. Small but satisfying.', kcal: 200, portions: [{ amount: 3, unit: '', name: 'dates' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }] }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        { mealType: 'breakfast', dishName: 'Smoothie Bowl: Banana, Spinach, Almond Milk & Toppings', ingredients: ['banana', 'spinach', 'almond milk', 'granola', 'coconut'], fuelStory: 'Light start. Fiber and healthy fats without dairy.', kcal: 380, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 1, unit: 'cup', name: 'spinach' }] },
        { mealType: 'lunch', dishName: 'Caprese Salad with Grilled Chicken', ingredients: ['chicken breast', 'mozzarella', 'tomato', 'basil', 'olive oil'], fuelStory: 'Classic combo. Protein and fat, minimal carbs.', kcal: 470, portions: [{ amount: 100, unit: 'g', name: 'chicken breast' }, { amount: 80, unit: 'g', name: 'mozzarella' }] },
        { mealType: 'dinner', dishName: 'Baked Trout with Herbed Potatoes & Greens', ingredients: ['trout', 'potato', 'dill', 'green beans', 'lemon'], fuelStory: 'Lean fish and starch. Simple and satisfying.', kcal: 500, portions: [{ amount: 150, unit: 'g', name: 'trout' }, { amount: 120, unit: 'g', name: 'potato' }] },
        { mealType: 'snack', dishName: 'Pear with a wedge of cheese', ingredients: ['pear', 'hard cheese'], fuelStory: 'Fruit and fat. Rest-day snack that feels like a treat.', kcal: 220, portions: [{ amount: 1, unit: '', name: 'pear' }, { amount: 25, unit: 'g', name: 'cheese' }] }
      ]
    },
    {
      dayType: 'rest',
      meals: [
        { mealType: 'breakfast', dishName: 'Buckwheat Porridge with Berries & Seeds', ingredients: ['buckwheat', 'berries', 'pumpkin seeds', 'almond milk'], fuelStory: 'Gluten-free grains and antioxidants. Steady energy for a slow morning.', kcal: 400, portions: [{ amount: 50, unit: 'g', name: 'buckwheat' }, { amount: 0.5, unit: 'cup', name: 'berries' }] },
        { mealType: 'lunch', dishName: 'Asian-Style Chicken Salad with Rice Noodles', ingredients: ['chicken', 'rice noodles', 'cabbage', 'carrot', 'lime', 'fish sauce'], fuelStory: 'Light but filling. Protein and just enough carbs.', kcal: 460, portions: [{ amount: 120, unit: 'g', name: 'chicken' }, { amount: 80, unit: 'g', name: 'rice noodles' }] },
        { mealType: 'dinner', dishName: 'Vegetable & Lentil Shepherd\'s Pie', ingredients: ['lentils', 'potato', 'carrots', 'peas', 'onion'], fuelStory: 'Comfort food with plant protein. Rest-day classic.', kcal: 490, portions: [{ amount: 1, unit: 'cup', name: 'lentils' }, { amount: 150, unit: 'g', name: 'potato mash' }] },
        { mealType: 'snack', dishName: 'Roasted chickpeas (small handful)', ingredients: ['chickpeas', 'olive oil', 'spices'], fuelStory: 'Crunchy, savory. Protein and fiber in one bite.', kcal: 150, portions: [{ amount: 40, unit: 'g', name: 'roasted chickpeas' }] }
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
  },
  {
    dayType: 'wod',
    meals: [
      { mealType: 'breakfast', dishName: 'Chia Pudding with Banana & Almond Butter', ingredients: ['chia seeds', 'oat milk', 'banana', 'almond butter'], fuelStory: 'Plant-based protein and fat. Steady energy without dairy.', kcal: 420, portions: [{ amount: 35, unit: 'g', name: 'chia seeds' }, { amount: 1, unit: '', name: 'banana' }] },
      { mealType: 'snackPreWod', dishName: 'Dates & banana', ingredients: ['dates', 'banana'], timingHint: '60–90 min before', fuelStory: 'Fast carbs. Light and digestible.', kcal: 200, portions: [{ amount: 4, unit: '', name: 'dates' }, { amount: 1, unit: '', name: 'banana' }] },
      { mealType: 'lunch', dishName: 'Lentil & Sweet Potato Curry with Rice', ingredients: ['lentils', 'sweet potato', 'coconut milk', 'rice', 'curry spices'], fuelStory: 'Plant protein and complex carbs. Satisfying and anti-inflammatory.', kcal: 540, portions: [{ amount: 1, unit: 'cup', name: 'cooked lentils' }, { amount: 180, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snackPostWod', dishName: 'Smoothie: banana, pea protein, oat milk', ingredients: ['banana', 'pea protein', 'oat milk'], timingHint: 'Within 30 min', fuelStory: 'Quick protein and carbs. No dairy.', kcal: 300, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 1, unit: 'scoop', name: 'pea protein' }] },
      { mealType: 'dinner', dishName: 'Tempeh & Veggie Stir-Fry with Rice', ingredients: ['tempeh', 'rice', 'broccoli', 'bell pepper', 'tamari', 'ginger'], fuelStory: 'Fermented soy for protein. Rice for glycogen. Clean and simple.', kcal: 550, portions: [{ amount: 120, unit: 'g', name: 'tempeh' }, { amount: 200, unit: 'g', name: 'cooked rice' }] }
    ]
  },
  {
    dayType: 'wod',
    meals: [
      { mealType: 'breakfast', dishName: 'Overnight Oats with Berries & Tahini', ingredients: ['oats', 'oat milk', 'berries', 'tahini', 'maple syrup'], fuelStory: 'No dairy. Oats and seeds for staying power.', kcal: 450, portions: [{ amount: 60, unit: 'g', name: 'oats' }, { amount: 1, unit: 'tbsp', name: 'tahini' }] },
      { mealType: 'snackPreWod', dishName: 'Rice cakes with almond butter', ingredients: ['rice cakes', 'almond butter'], timingHint: '45–60 min before', fuelStory: 'Light carbs and fat. Easy on the stomach.', kcal: 220, portions: [{ amount: 2, unit: '', name: 'rice cakes' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }] },
      { mealType: 'lunch', dishName: 'Black Bean & Quinoa Bowl with Avocado', ingredients: ['black beans', 'quinoa', 'avocado', 'lime', 'cilantro'], fuelStory: 'Complete plant protein and carbs. Big bowl energy.', kcal: 560, portions: [{ amount: 1, unit: 'cup', name: 'black beans' }, { amount: 150, unit: 'g', name: 'cooked quinoa' }] },
      { mealType: 'snackPostWod', dishName: 'Vegan protein shake & banana', ingredients: ['vegan protein powder', 'banana', 'oat milk'], timingHint: 'Within 30 min', fuelStory: 'Plant protein and fast carbs for recovery.', kcal: 280, portions: [{ amount: 1, unit: 'scoop', name: 'vegan protein' }, { amount: 1, unit: '', name: 'banana' }] },
      { mealType: 'dinner', dishName: 'Coconut Chickpea Curry with Jasmine Rice', ingredients: ['chickpeas', 'coconut milk', 'rice', 'spinach', 'curry paste'], fuelStory: 'Creamy and satisfying. Plant-based refuel.', kcal: 580, portions: [{ amount: 1.5, unit: 'cup', name: 'chickpeas' }, { amount: 180, unit: 'g', name: 'cooked rice' }] }
    ]
  },
  {
    dayType: 'wod',
    meals: [
      { mealType: 'breakfast', dishName: 'Avocado Toast with Tomato & Hemp Seeds', ingredients: ['sourdough', 'avocado', 'tomato', 'hemp seeds'], fuelStory: 'Healthy fats and carbs. No animal products.', kcal: 430, portions: [{ amount: 2, unit: 'slices', name: 'bread' }, { amount: 0.5, unit: '', name: 'avocado' }] },
      { mealType: 'snackPreWod', dishName: 'Banana & handful of dried figs', ingredients: ['banana', 'dried figs'], timingHint: '60 min before', fuelStory: 'Natural sugars. Quick energy.', kcal: 210, portions: [{ amount: 1, unit: '', name: 'banana' }, { amount: 3, unit: '', name: 'figs' }] },
      { mealType: 'lunch', dishName: 'Falafel Wrap with Hummus & Salad', ingredients: ['falafel', 'tortilla', 'hummus', 'lettuce', 'tomato'], fuelStory: 'Chickpea power. Portable and filling.', kcal: 520, portions: [{ amount: 4, unit: '', name: 'falafel' }, { amount: 1, unit: '', name: 'tortilla' }] },
      { mealType: 'snackPostWod', dishName: 'Oat milk latte & date bar', ingredients: ['oat milk', 'espresso', 'date bar'], timingHint: 'Within 30 min', fuelStory: 'Carbs and a bit of caffeine. Vegan recovery.', kcal: 260, portions: [{ amount: 1, unit: '', name: 'date bar' }] },
      { mealType: 'dinner', dishName: 'Lentil Bolognese with Pasta', ingredients: ['lentils', 'pasta', 'tomato', 'onion', 'garlic', 'basil'], fuelStory: 'Plant-based bolognese. Carbs and protein in a classic format.', kcal: 590, portions: [{ amount: 1, unit: 'cup', name: 'cooked lentils' }, { amount: 80, unit: 'g', name: 'dry pasta' }] }
    ]
  },
  {
    dayType: 'wod',
    meals: [
      { mealType: 'breakfast', dishName: 'Smoothie Bowl: Acai, Banana, Granola & Coconut', ingredients: ['acai', 'banana', 'granola', 'coconut', 'plant milk'], fuelStory: 'Antioxidants and carbs. Instagram-worthy fuel.', kcal: 480, portions: [{ amount: 100, unit: 'g', name: 'acai' }, { amount: 1, unit: '', name: 'banana' }] },
      { mealType: 'snackPreWod', dishName: 'Apple with almond butter', ingredients: ['apple', 'almond butter'], timingHint: '45–60 min before', fuelStory: 'Fiber and fat. Steady release.', kcal: 250, portions: [{ amount: 1, unit: '', name: 'apple' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }] },
      { mealType: 'lunch', dishName: 'Edamame & Brown Rice Bowl with Tahini', ingredients: ['edamame', 'brown rice', 'tahini', 'cucumber', 'lime'], fuelStory: 'Soy protein and whole grains. Clean and filling.', kcal: 530, portions: [{ amount: 1, unit: 'cup', name: 'edamame' }, { amount: 180, unit: 'g', name: 'cooked brown rice' }] },
      { mealType: 'snackPostWod', dishName: 'Vegan yogurt with berries & granola', ingredients: ['coconut or soy yogurt', 'berries', 'granola'], timingHint: 'Within 30 min', fuelStory: 'Plant-based recovery. No dairy.', kcal: 320, portions: [{ amount: 150, unit: 'g', name: 'vegan yogurt' }, { amount: 30, unit: 'g', name: 'granola' }] },
      { mealType: 'dinner', dishName: 'Spiced Cauliflower & Chickpea Bowl with Quinoa', ingredients: ['cauliflower', 'chickpeas', 'quinoa', 'turmeric', 'tahini'], fuelStory: 'Roasted veg and legumes. Anti-inflammatory and satisfying.', kcal: 540, portions: [{ amount: 1, unit: 'cup', name: 'chickpeas' }, { amount: 150, unit: 'g', name: 'cooked quinoa' }] }
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
  },
  {
    dayType: 'rest',
    meals: [
      { mealType: 'breakfast', dishName: 'Oatmeal with Walnuts, Cinnamon & Banana', ingredients: ['oats', 'walnuts', 'cinnamon', 'banana', 'plant milk'], fuelStory: 'Warm and simple. No dairy.', kcal: 400, portions: [{ amount: 50, unit: 'g', name: 'oats' }, { amount: 15, unit: 'g', name: 'walnuts' }] },
      { mealType: 'lunch', dishName: 'Hummus & Roasted Veggie Plate', ingredients: ['hummus', 'zucchini', 'eggplant', 'bell pepper', 'olive oil'], fuelStory: 'Fiber and plant protein. Rest-day comfort.', kcal: 420, portions: [{ amount: 80, unit: 'g', name: 'hummus' }, { amount: 1.5, unit: 'cup', name: 'roasted veg' }] },
      { mealType: 'dinner', dishName: 'Red Lentil Dahl with Rice & Spinach', ingredients: ['red lentils', 'rice', 'spinach', 'coconut milk', 'spices'], fuelStory: 'Warming and nourishing. Plant-based recovery.', kcal: 500, portions: [{ amount: 1, unit: 'cup', name: 'cooked lentils' }, { amount: 150, unit: 'g', name: 'cooked rice' }] },
      { mealType: 'snack', dishName: 'Orange & handful of almonds', ingredients: ['orange', 'almonds'], fuelStory: 'Vitamin C and fat. Light rest-day snack.', kcal: 200, portions: [{ amount: 1, unit: '', name: 'orange' }, { amount: 15, unit: 'g', name: 'almonds' }] }
    ]
  },
  {
    dayType: 'rest',
    meals: [
      { mealType: 'breakfast', dishName: 'Tofu Scramble with Turmeric & Greens', ingredients: ['tofu', 'turmeric', 'spinach', 'olive oil', 'nutritional yeast'], fuelStory: 'Savory vegan breakfast. Protein and greens.', kcal: 380, portions: [{ amount: 150, unit: 'g', name: 'tofu' }, { amount: 1, unit: 'cup', name: 'spinach' }] },
      { mealType: 'lunch', dishName: 'Quinoa Salad with Roasted Beet & Tahini', ingredients: ['quinoa', 'beet', 'tahini', 'arugula', 'lemon'], fuelStory: 'Color and protein. Satisfying without heaviness.', kcal: 440, portions: [{ amount: 120, unit: 'g', name: 'cooked quinoa' }, { amount: 1, unit: 'medium', name: 'beet' }] },
      { mealType: 'dinner', dishName: 'Mushroom & Lentil Stroganoff with Rice', ingredients: ['mushrooms', 'lentils', 'rice', 'coconut cream', 'paprika'], fuelStory: 'Creamy and plant-based. Rest-day comfort food.', kcal: 480, portions: [{ amount: 150, unit: 'g', name: 'mushrooms' }, { amount: 0.75, unit: 'cup', name: 'cooked lentils' }] },
      { mealType: 'snack', dishName: 'Rice cake with peanut butter', ingredients: ['rice cake', 'peanut butter'], fuelStory: 'Simple and satisfying.', kcal: 190, portions: [{ amount: 1, unit: '', name: 'rice cake' }, { amount: 1, unit: 'tbsp', name: 'peanut butter' }] }
    ]
  },
  {
    dayType: 'rest',
    meals: [
      { mealType: 'breakfast', dishName: 'Chia Pudding with Mango & Coconut', ingredients: ['chia seeds', 'coconut milk', 'mango', 'coconut flakes'], fuelStory: 'Tropical and light. No dairy.', kcal: 390, portions: [{ amount: 30, unit: 'g', name: 'chia seeds' }, { amount: 150, unit: 'ml', name: 'coconut milk' }] },
      { mealType: 'lunch', dishName: 'Mediterranean White Bean Salad', ingredients: ['white beans', 'cucumber', 'tomato', 'red onion', 'olive oil', 'oregano'], fuelStory: 'Plant protein and freshness. Rest-day classic.', kcal: 400, portions: [{ amount: 1, unit: 'cup', name: 'white beans' }, { amount: 0.5, unit: 'cup', name: 'chopped veg' }] },
      { mealType: 'dinner', dishName: 'Stuffed Peppers with Rice & Black Beans', ingredients: ['bell peppers', 'rice', 'black beans', 'corn', 'salsa'], fuelStory: 'All-in-one plant dinner. Filling and simple.', kcal: 470, portions: [{ amount: 2, unit: '', name: 'bell peppers' }, { amount: 0.5, unit: 'cup', name: 'black beans' }] },
      { mealType: 'snack', dishName: 'Celery sticks with almond butter', ingredients: ['celery', 'almond butter'], fuelStory: 'Crunch and fat. Light snack.', kcal: 180, portions: [{ amount: 3, unit: 'sticks', name: 'celery' }, { amount: 1, unit: 'tbsp', name: 'almond butter' }] }
    ]
  },
  {
    dayType: 'rest',
    meals: [
      { mealType: 'breakfast', dishName: 'Buckwheat Pancakes with Berries & Maple Syrup', ingredients: ['buckwheat flour', 'oat milk', 'berries', 'maple syrup'], fuelStory: 'Gluten-free and vegan. Rest-day treat.', kcal: 420, portions: [{ amount: 60, unit: 'g', name: 'buckwheat flour' }, { amount: 0.5, unit: 'cup', name: 'berries' }] },
      { mealType: 'lunch', dishName: 'Sushi-Style Bowl: Rice, Avocado, Cucumber & Edamame', ingredients: ['sushi rice', 'avocado', 'cucumber', 'edamame', 'rice vinegar'], fuelStory: 'Fresh and light. Plant-based and satisfying.', kcal: 450, portions: [{ amount: 150, unit: 'g', name: 'cooked rice' }, { amount: 0.5, unit: '', name: 'avocado' }] },
      { mealType: 'dinner', dishName: 'Vegetable Tagine with Chickpeas & Couscous', ingredients: ['chickpeas', 'couscous', 'apricot', 'carrot', 'spices'], fuelStory: 'Warming and aromatic. Plant protein and carbs.', kcal: 490, portions: [{ amount: 1, unit: 'cup', name: 'chickpeas' }, { amount: 120, unit: 'g', name: 'cooked couscous' }] },
      { mealType: 'snack', dishName: 'Dark chocolate & dried cranberries', ingredients: ['dark chocolate', 'dried cranberries'], fuelStory: 'Small treat. Antioxidants and a touch of sweet.', kcal: 210, portions: [{ amount: 20, unit: 'g', name: 'dark chocolate' }, { amount: 20, unit: 'g', name: 'cranberries' }] }
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
    const isGlutenFree = activeFilters.glutenFree;
    const isDairyFree = activeFilters.dairyFree;
    let pool;
    if (isVegan) {
      pool = dayType === 'wod' ? MENUS_WOD_VEGAN : MENUS_REST_VEGAN;
    } else if (isGlutenFree) {
      pool = dayType === 'wod' ? MENUS_WOD_GLUTEN_FREE : MENUS_REST_GLUTEN_FREE;
    } else if (isDairyFree) {
      pool = dayType === 'wod' ? MENUS_WOD_DAIRY_FREE : MENUS_REST_DAIRY_FREE;
    } else {
      pool = dayType === 'wod' ? MENUS_WOD : MENUS_REST;
    }
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
