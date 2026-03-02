/**
 * REGLAS DEL GENERADOR — Etsy Listing Generator
 * Fuente única de verdad para la lógica de generación.
 * Usar para construir prompts de IA y/o validar salida.
 */

const GENERATOR_RULES = {
  title: {
    maxChars: 140,
    rules: [
      'La keyword principal va siempre en los primeros 40 caracteres',
      'Estructura: [Keyword principal], [variación 1], [caso de uso], [formato], [estancia o contexto]',
      'Separar bloques con comas, no con guiones ni pipes',
      'Cada fragmento debe ser algo que alguien podría buscar literalmente',
      'No usar adjetivos vacíos: "beautiful", "amazing", "stunning", "lovely"',
      'Incluir siempre la palabra "Printable" o "Digital Download" en el título porque son búsquedas activas en Etsy',
      'Usar casi los 140 caracteres disponibles',
      'No repetir la misma palabra más de dos veces en todo el título',
    ],
    keywordFirstChars: 40,
    requiredTerms: ['Printable', 'Digital Download'], // al menos uno
    forbiddenAdjectives: ['beautiful', 'amazing', 'stunning', 'lovely'],
    separator: ',',
    forbiddenSeparators: ['-', '|', '—'],
  },

  tags: {
    count: 13,
    maxCharsPerTag: 20,
    rules: [
      'Frases de 2-3 palabras, nunca palabras sueltas',
      'Máximo 20 caracteres por tag',
      'Ningún tag debe repetir exactamente una frase ya presente en el título (son complementarios, no redundantes)',
      'Incluir variaciones de orden: si el título tiene "wall art printable" un tag puede ser "printable wall art"',
      'No usar tags en mayúsculas',
      'No usar caracteres especiales',
    ],
    dimensions: [
      { name: 'keyword principal y variaciones directas', count: '2-3 tags' },
      { name: 'estilo visual (ej: minimalist poster, retro art print)', count: '2-3 tags' },
      { name: 'caso de uso o estancia (ej: kids room decor, classroom poster)', count: '2-3 tags' },
      { name: 'formato (ej: digital download, instant download)', count: '2 tags' },
      { name: 'ocasión o regalo (ej: teacher gift, nursery gift)', count: '1-2 tags' },
    ],
  },

  description: {
    minWords: 250,
    maxWords: 400,
    inputUsage: [
      'El campo "Descripción breve del producto" es solo contexto: sirve para entender de qué va el producto (tema, uso, público).',
      'A partir de esa información se genera una descripción nueva, con sentido al leerla, que cumple todas las reglas de esta sección.',
      'No se copia ni se pega literalmente el texto del input en la descripción generada.',
    ],
    rules: [
      'Párrafos cortos, máximo 3-4 líneas cada uno',
      'Se pueden usar emojis con moderación para separar secciones (✔️, 📐, 🖨️) pero sin abusar',
      'No usar markdown (Etsy no lo renderiza)',
      'Repetir la keyword principal al menos 2 veces de forma natural a lo largo del texto',
      'No poner links externos',
    ],
    blocks: [
      {
        name: 'Bloque 1 — Gancho SEO (primeras 160 caracteres, crítico para Google)',
        points: [
          'Incluir la keyword principal de forma natural en la primera frase',
          'Describir el producto claramente: qué es, para quién es, para qué sirve',
        ],
      },
      {
        name: 'Bloque 2 — Propuesta de valor',
        points: [
          'Para printables decorativos: enfatizar estética, ambiente, estilo, en qué estancias queda bien',
          'Para printables educativos: enfatizar utilidad, aprendizaje, contextos de uso (aula, habitación infantil, cocina, etc.)',
          'Para printables juegos: enfatizar entretenimiento, edad recomendada, si es para jugar solo o en grupo',
        ],
      },
      {
        name: 'Bloque 3 — Información técnica (siempre presente)',
        points: [
          'Formatos incluidos (PDF, JPG, PNG)',
          'Tamaños disponibles (ej: 4x6, 5x7, 8x10, A4, A3)',
          'Resolución (300 DPI, listo para imprimir)',
          'Instrucciones de descarga en 1-2 frases: "After purchase you\'ll receive an instant download link"',
        ],
      },
      {
        name: 'Bloque 4 — Cierre y política de uso',
        points: [
          'Aclarar que es uso personal únicamente, no comercial',
          'Frase que invite a ver más productos de la tienda',
          'No poner links externos',
        ],
      },
    ],
    seoHookMaxChars: 160,
  },

  coherence: [
    'La keyword principal debe aparecer en el título, en al menos 1 tag, y en la descripción',
    'El estilo visual mencionado en el título debe reflejarse en la descripción',
    'Los casos de uso del título deben tener al menos 1 tag correspondiente',
  ],

  categorySpecific: {
    decorativos: {
      title: 'Printables Decorativos',
      rules: [
        'Mencionar estancias concretas: living room, bedroom, hallway, bathroom, gallery wall',
        'Incluir el estilo en el título: retro, minimalist, boho, vintage, modern',
        'Tags deben incluir "wall art", "art print", "home decor"',
        'La descripción debe evocar ambiente y estética antes que funcionalidad',
      ],
    },
    educativos: {
      title: 'Printables Educativos',
      rules: [
        'Mencionar contextos: classroom, kids room, homeschool, nursery, playroom',
        'El valor funcional va antes que el estético en título y descripción',
        'Tags deben incluir referencias al contenido (ej: first aid poster, kids hygiene chart)',
        'Mencionar rango de edad si aplica',
        'Incluir que es útil tanto para padres como para profesores',
      ],
    },
    juegos: {
      title: 'Printables Juegos',
      rules: [
        'Mencionar si es para imprimir y jugar directamente',
        'Incluir número de jugadores o edad recomendada en la descripción',
        'Tags orientados a ocasión: party game, family game night, road trip activity',
        'Destacar que no necesita nada más que imprimir y cortar si es el caso',
      ],
    },
  },
};

/**
 * Devuelve las reglas en formato texto para usar en prompts de IA.
 * @param {string} [category] - 'decorativos' | 'educativos' | 'juegos' para incluir reglas de categoría
 * @param {string} [language] - 'es' | 'en'
 */
function getRulesAsPromptText(category, language = 'es') {
  const r = GENERATOR_RULES;
  const lines = [];

  lines.push('=== TÍTULO (máx. ' + r.title.maxChars + ' caracteres) ===');
  r.title.rules.forEach((rule) => lines.push('- ' + rule));

  lines.push('\n=== TAGS (exactamente ' + r.tags.count + ') ===');
  r.tags.rules.forEach((rule) => lines.push('- ' + rule));
  lines.push('Dimensiones a cubrir:');
  r.tags.dimensions.forEach((d) => lines.push('- ' + d.count + ': ' + d.name));

  lines.push('\n=== DESCRIPCIÓN (' + r.description.minWords + '-' + r.description.maxWords + ' palabras) ===');
  if (r.description.inputUsage && r.description.inputUsage.length) {
    lines.push('Uso del campo "Descripción breve del producto":');
    r.description.inputUsage.forEach((point) => lines.push('- ' + point));
  }
  r.description.blocks.forEach((block) => {
    lines.push(block.name);
    block.points.forEach((p) => lines.push('- ' + p));
  });
  r.description.rules.forEach((rule) => lines.push('- ' + rule));

  lines.push('\n=== COHERENCIA ===');
  r.coherence.forEach((c) => lines.push('- ' + c));

  if (category && r.categorySpecific[category]) {
    const cat = r.categorySpecific[category];
    lines.push('\n=== REGLAS ESPECÍFICAS: ' + cat.title + ' ===');
    cat.rules.forEach((rule) => lines.push('- ' + rule));
  }

  return lines.join('\n');
}

// Export for use in app (global in non-module context)
if (typeof window !== 'undefined') {
  window.GENERATOR_RULES = GENERATOR_RULES;
  window.getRulesAsPromptText = getRulesAsPromptText;
}
