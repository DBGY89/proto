# Salad Bar

Generador de ensaladas: eliges ingredientes, ves cómo se vería tu ensalada en un plato y recibes un **ingrediente secreto** — un aderezo que encaja con tu mezcla, con la receta para hacerlo.

## Cómo funciona

1. **Elige ingredientes** — Base (lechuga, espinaca, rúcula, kale), verduras, extras (aceitunas, queso, aguacate, frutos secos), proteína (pollo, huevo, garbanzos).
2. **Visual en el plato** — Aparece un plato con una representación de tu ensalada según lo que seleccionaste.
3. **Tu ingrediente secreto** — Se sugiere un aderezo que combina con tus ingredientes (por etiquetas: mediterráneo, dulce, cremoso, etc.) y se muestra la receta para prepararlo.

## Stack

HTML, CSS, JS. Datos en `data.js` (ingredientes y aderezos con recetas). Sin backend.

## Estructura

- `index.html` — Picker, plato, bloque de aderezo y receta.
- `style.css` — Estilos del generador.
- `data.js` — Lista de ingredientes (con categoría y tags) y aderezos (goesWith + receta).
- `app.js` — Estado de selección, dibujo del plato, elección de aderezo por coincidencia de tags, render de la receta.
# saladbar
