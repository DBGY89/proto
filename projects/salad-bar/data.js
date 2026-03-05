/**
 * Salad Bar — ingredients and dressings with recipes
 * Dressings have goesWith: tags that match ingredient tags for suggestion logic
 */
window.SALAD_BAR_DATA = {
  ingredients: [
    { id: 'lettuce', name: 'Lettuce', category: 'base', tags: ['green', 'fresh'], shape: 'leaf', color: '#5a8c4a', color2: '#3d6b36' },
    { id: 'spinach', name: 'Spinach', category: 'base', tags: ['green', 'leafy'], shape: 'leaf', color: '#3d6b36', color2: '#2d5a27' },
    { id: 'arugula', name: 'Arugula', category: 'base', tags: ['peppery', 'mediterranean'], shape: 'leaf', color: '#4a7c42', color2: '#3d6b36' },
    { id: 'kale', name: 'Kale', category: 'base', tags: ['green', 'hearty'], shape: 'leaf', color: '#2d5a27', color2: '#1e4a1a' },
    { id: 'tomato', name: 'Tomato', category: 'veggie', tags: ['mediterranean', 'juicy'], shape: 'circle', color: '#c23a2b', color2: '#a02a1a' },
    { id: 'cucumber', name: 'Cucumber', category: 'veggie', tags: ['fresh', 'cool', 'mediterranean'], shape: 'oval', color: '#6b8e23', color2: '#5a7c1a' },
    { id: 'pepper', name: 'Bell pepper', category: 'veggie', tags: ['sweet', 'crunchy'], shape: 'chunk', color: '#c23a2b', color2: '#8b2a1a' },
    { id: 'carrot', name: 'Carrot', category: 'veggie', tags: ['sweet', 'crunchy'], shape: 'stick', color: '#e67e22', color2: '#d46a12' },
    { id: 'onion', name: 'Red onion', category: 'veggie', tags: ['sharp', 'mediterranean'], shape: 'circle', color: '#6b2d5a', color2: '#4a1e3d' },
    { id: 'corn', name: 'Corn', category: 'veggie', tags: ['sweet', 'summer'], shape: 'kernel', color: '#e6b422', color2: '#c49a18' },
    { id: 'olives', name: 'Olives', category: 'extra', tags: ['mediterranean', 'salty'], shape: 'oval', color: '#2c2416', color2: '#1a1510' },
    { id: 'cheese', name: 'Cheese', category: 'extra', tags: ['mediterranean', 'creamy'], shape: 'chunk', color: '#f0e6c8', color2: '#d4c4a0' },
    { id: 'avocado', name: 'Avocado', category: 'extra', tags: ['creamy', 'fresh'], shape: 'oval', color: '#6b8e23', color2: '#5a7c1a' },
    { id: 'nuts', name: 'Nuts', category: 'extra', tags: ['crunchy', 'hearty'], shape: 'oval', color: '#a08050', color2: '#8a6a3a' },
    { id: 'chicken', name: 'Chicken', category: 'protein', tags: ['light', 'classic'], shape: 'chunk', color: '#e8dcc8', color2: '#c4b898' },
    { id: 'egg', name: 'Egg', category: 'protein', tags: ['creamy', 'classic'], shape: 'oval', color: '#f5ecd0', color2: '#e8dcc8' },
    { id: 'chickpeas', name: 'Chickpeas', category: 'protein', tags: ['mediterranean', 'hearty'], shape: 'circle', color: '#c4a858', color2: '#a88a40' },
  ],

  dressings: [
    {
      id: 'vinaigrette',
      name: 'Classic vinaigrette',
      goesWith: ['green', 'fresh', 'leafy', 'classic', 'light'],
      recipe: {
        ingredients: ['3 tbsp olive oil', '1 tbsp vinegar (red wine or apple cider)', '1 tsp Dijon mustard', 'Salt and pepper'],
        steps: ['In a small bowl or jar, combine oil, vinegar, and mustard.', 'Whisk or shake until emulsified.', 'Season with salt and pepper. Taste and adjust.'],
      },
    },
    {
      id: 'lemon-tahini',
      name: 'Lemon tahini',
      goesWith: ['chickpeas', 'cucumber', 'mediterranean', 'hearty', 'leafy'],
      recipe: {
        ingredients: ['2 tbsp tahini', '2 tbsp lemon juice', '1–2 tbsp water', '1 small garlic clove, minced', 'Salt and pepper'],
        steps: ['Mix tahini and lemon juice in a bowl (it will thicken at first).', 'Add water little by little until you get a drizzling consistency.', 'Stir in garlic, salt, and pepper.'],
      },
    },
    {
      id: 'honey-mustard',
      name: 'Honey mustard',
      goesWith: ['chicken', 'carrot', 'sweet', 'crunchy', 'classic'],
      recipe: {
        ingredients: ['2 tbsp olive oil', '1 tbsp Dijon mustard', '1 tbsp honey', '1 tbsp lemon juice', 'Salt and pepper'],
        steps: ['Whisk together oil, mustard, honey, and lemon juice.', 'Season with salt and pepper. Add a splash of water if you want it lighter.'],
      },
    },
    {
      id: 'balsamic',
      name: 'Balsamic glaze',
      goesWith: ['tomato', 'arugula', 'cheese', 'mediterranean', 'peppery'],
      recipe: {
        ingredients: ['2 tbsp balsamic vinegar', '2 tbsp olive oil', '1 tsp honey or maple syrup', 'Salt and pepper'],
        steps: ['Whisk vinegar, oil, and honey in a small bowl.', 'Season with salt and pepper. Drizzle over the salad just before serving.'],
      },
    },
    {
      id: 'creamy-avocado',
      name: 'Creamy avocado lime',
      goesWith: ['avocado', 'corn', 'sweet', 'summer', 'creamy'],
      recipe: {
        ingredients: ['½ ripe avocado', '2 tbsp lime juice', '2 tbsp olive oil', '1 tbsp water', 'Salt and pepper', 'Optional: cilantro, pinch of cumin'],
        steps: ['Mash the avocado in a bowl with a fork.', 'Add lime juice, oil, and water; mix until smooth.', 'Season with salt, pepper, and optional cilantro or cumin.'],
      },
    },
    {
      id: 'greek',
      name: 'Greek-style',
      goesWith: ['olives', 'tomato', 'cucumber', 'cheese', 'mediterranean', 'onion'],
      recipe: {
        ingredients: ['3 tbsp olive oil', '1 tbsp red wine vinegar', '1 small garlic clove, minced', '½ tsp dried oregano', 'Salt and pepper'],
        steps: ['Combine oil, vinegar, garlic, and oregano in a small bowl.', 'Whisk and season with salt and pepper. Let sit 5 minutes for flavours to blend.'],
      },
    },
    {
      id: 'asian-sesame',
      name: 'Asian sesame',
      goesWith: ['carrot', 'crunchy', 'hearty', 'nuts', 'sweet'],
      recipe: {
        ingredients: ['2 tbsp sesame oil', '1 tbsp rice vinegar', '1 tbsp soy sauce', '1 tsp honey', '1 tsp sesame seeds', 'Optional: ginger, lime'],
        steps: ['Whisk sesame oil, vinegar, soy sauce, and honey.', 'Add sesame seeds. Add a little grated ginger or lime juice if you like.'],
      },
    },
  ],
};
