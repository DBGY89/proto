# AI Proto Lab — Product Design System

Sistema de diseño extraído de **Salad Bar**, **Bubbles**, **Movie Palette** y **CrossFit Fuel**. Sirve para construir nuevos productos con coherencia visual, de UX y de tono sin depender de iteraciones largas de ajustes.

---

## 1. Principios

- **Menos pasos, un flujo claro.** Un input (o muy pocos) → un output. Si puedes quitar un paso, quítalo.
- **Lo importante se ve.** Título y CTA destacan; el resto apoya. Sin ruido decorativo.
- **Reconocimiento, no memoria.** Mostrar opciones y estados; no pedir que el usuario recuerde.
- **Feedback inmediato.** Transiciones cortas (0.2–0.35s), estados hover/active visibles, animaciones que enseñan sin instrucciones.
- **Tono humano.** Directo, cercano, sin corporativo. Educativo sin sermonear; empoderador sin moralina.

---

## 2. Sistema visual

### 2.1 Colores

Paleta compartida en todos los productos. Cada producto puede elegir **un color de acento principal** para títulos y elementos clave; el resto es común.

| Token | Hex | Uso |
|-------|-----|-----|
| `--bg-deep` | `#0a0a1a` | Fondo de página |
| `--bg-card` | `#111128` | Fondos de cards, paneles, dropdowns |
| `--border` | `#1e1e3a` | Bordes, separadores |
| `--text-primary` | `#e8e8f0` | Texto principal |
| `--text-secondary` | `#9090b0` | Texto secundario, hints |
| `--text-muted` | `#555580` / `#606090` | Labels, placeholders muy suaves |
| `--neon-pink` | `#ff2d78` | Acento (Salad Bar, modales, votación) |
| `--neon-cyan` | `#00f0ff` | Acento (Bubbles, links hover, secundario) |
| `--neon-purple` | `#b24dff` | Acento (selección, estados especiales) |
| `--neon-gold` | `#e8c547` / `#ffd700` | Acento (Movie Palette, alternativo) |

**Producto puede definir acentos propios** (ej. CrossFit Fuel: `--accent-wod`, `--accent-rest`, `--accent-cta`) pero el modal “From idea to prototype” y la topbar suelen usar `neon-pink` + `neon-cyan` para mantener identidad de lab.

**Glow / sombras de color:**  
- Títulos: `text-shadow: 0 0 20px rgba(hex, 0.4);`  
- Botones/cards en hover: `box-shadow: 0 0 20px rgba(hex, 0.15);`  
- Sin exagerar: un toque de neón, no pantalla entera brillante.

### 2.2 Tipografía

- **Fuente:** `'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif`
- **Tamaños:**  
  - Hero / título producto: `clamp(1.75rem, 4–5vw, 3rem)`, `font-weight: 700`  
  - Intro: `0.9rem–1rem`, `color: var(--text-secondary)`  
  - Títulos de región: `0.95rem–1rem`, `font-weight: 700`  
  - Body: `0.84rem–0.95rem`  
  - Labels (uppercase): `0.75rem–0.8rem`, `font-weight: 600`, `letter-spacing: 0.05em–0.08em`
- **Títulos de producto:** en mayúsculas (`text-transform: uppercase`), con letter-spacing `-0.02em` a `0.05em` según producto.
- **Line-height:** 1.45–1.6 en párrafos; 1.1 en títulos grandes.

### 2.3 Espaciado y bordes

- **Border radius:** 8px (chips, inputs pequeños), 12px (cards, botones, dropdowns), 16px (modales, paneles grandes). Pills: `999px`.
- **Bordes:** `1px solid var(--border)`. En hover/selected: borde con color de acento + sombra suave.
- **Padding topbar:** `0.6rem–0.75rem 1.25rem–1.5rem`  
- **Padding contenido:** `1rem–1.5rem` lateral; secciones `1.25rem–1.5rem` entre bloques.
- **Gap entre elementos:** 0.5rem (chips, iconos), 1rem–1.5rem (secciones).

### 2.4 Fondos

- **Fondo base:** `var(--bg-deep)`.
- **Patrón opcional:** `bg-pattern` con `radial-gradient` muy suaves (opacidad 0.03–0.06) en esquinas o zonas, a veces punto sutil (1.5px) para textura. No compite con el contenido.
- **Cards/regiones:** `background: rgba(17, 17, 40, 0.5–0.6);` + borde.

### 2.5 Motion

- **Easing:** `cubic-bezier(0.23, 1, 0.32, 1)` (`--ease`).
- **Duración:** 0.2s (hover, color); 0.25–0.35s (modales, aparición).
- **Animaciones de entrada:** `opacity` + `translateY(6px–12px)` o `scale(0.95–0.98)` → estado final.
- **Respetar `prefers-reduced-motion`:** reducir o eliminar animaciones decorativas cuando el usuario lo tiene activado.

---

## 3. Componentes estándar

### 3.1 Topbar

- Fijo o sticky; `background: rgba(10, 10, 26, 0.95)`; `backdrop-filter: blur(10px)`; `border-bottom: 1px solid var(--border)`.
- **Izquierda:** enlace “← AI Proto Lab” (`back-link`): `color: var(--text-secondary)`, hover `color: var(--neon-cyan)`.
- **Derecha:** botón “How this went from idea to prototype →” (desktop) / “The story →” (mobile). Mismo estilo: texto subrayado, secundario, hover cyan. Opcional: score, idioma, etc.
- En mobile: `padding-top` con `env(safe-area-inset-top)` si aplica.

### 3.2 Hero

- Título del producto: acento (neon-pink, neon-cyan, neon-gold o acento del producto) + `text-shadow` suave.
- Una línea de intro: qué hace el producto y qué obtienes. Máx. ~420px de ancho, centrado. Sin instrucciones largas.
- Padding contenido: `1rem–1.25rem` arriba/abajo.

### 3.3 Regiones / paneles

- Contenedor con `border`, `border-radius: 12px`, `padding: 1rem–1.25rem`.
- Título de región: `region-title`; si es la zona “resultado” o destacada, `region-title--accent` con color de acento.
- Hover: borde con tinte de acento y `box-shadow` ligera (ej. `0 0 24px rgba(..., 0.06)`).

### 3.4 Botones

- **CTA principal:** fondo con color de acento (pink, cyan, gold, verde CTA); texto oscuro (`#0a0a1a`); `border-radius: 8px–12px`; `min-height: 48px`; hover: ligera elevación (`translateY(-1px)`) + sombra de color.
- **Secundario / outline:** `background: transparent`; `border: 1px solid var(--border)`; texto secundario; hover: borde y texto en acento (cyan o del producto).
- **Disabled:** `opacity: 0.5`; `cursor: not-allowed`.

### 3.5 Chips / tags

- `padding: 0.45rem 0.85rem`; `border-radius: 999px`; `border: 1px solid var(--border)`; `background: var(--bg-deep)` o `var(--bg-card)`.
- Hover: borde y texto en acento (cyan o purple).
- Selected: borde + color de acento (p. ej. purple) y sombra suave.

### 3.6 Placeholders / empty state

- Misma estructura visual que el contenido que aparecerá (mismo layout, mismo tamaño aproximado).
- Texto breve y amigable: qué hacer para ver el resultado. Sin tono de error.
- Ej.: “Pick something on the left. We'll tell you which dressing fits. No joke.” / “Choose a film” con swatches fantasma.

### 3.7 Modal “From idea to prototype”

- Overlay: `rgba(0,0,0,0.6)`, `backdrop-filter: blur(4px)`.
- Panel: `max-width: 440px`, `border-radius: 16px`, fondo `var(--bg-deep)`, borde `var(--border)`.
- **Barra superior:** `height: 3px`, gradiente `linear-gradient(90deg, neon-pink, neon-cyan)` (o neon-gold en Movie Palette).
- Mobile: bottom sheet (`border-radius: 20px 20px 0 0`), “drag” handle arriba.
- Contenido: título “From idea to prototype”, subtítulo “Built in X evenings.”; secciones con **label** (uppercase, acento cyan/gold) y párrafos.
- Estructura de copy: **What problem & for whom** → **The iteration** → **What AI could and couldn't do** → **Minimum viable effort** → **Get in touch** (Email + LinkedIn).
- Botones: primario (neon-pink), secundario (outline, hover cyan/gold).

### 3.8 Vote widget

- “Rate this prototype” + números 1–5. Seleccionado: color acento (pink); resto en gris. “Thanks ✓” tras votar.
- Colocación: al final del contenido principal, antes del footer; en desktop a la derecha o centrado según layout.
- **Integración:** Incluir `rating-vote.js`, widget con `data-project="id-del-proyecto"` y al votar llamar `saveRating('id-del-proyecto', valor)`. En la landing, la tarjeta del producto debe tener `<span class="card-rating" data-project="id-del-proyecto">` y, si se usa filtro, el id en `PUBLIC_PROJECTS`. Sin esto el voto no se guarda ni se muestra el resumen en la card. Detalle: [ratings-one-vote-per-device.md](ratings-one-vote-per-device.md) (sección "Al añadir un producto nuevo").

### 3.9 Footer

- Una línea: “Part of [AI Proto Lab](/).” + **tagline del producto** (una frase corta, con personalidad).
- Ejemplos: “No boring salads.” / “Pop, pop, hooray.” / “Colors stolen from the best.” / “Feed the Beast.”
- `font-size: 0.8rem`, `color: var(--text-secondary)`. Link hover: acento (pink o cyan).

---

## 4. Tono y voz

### 4.1 Principios

- **Directo:** Frases cortas. Una idea por frase cuando importa el impacto.
- **Humano:** “We” cuando el producto hace algo por el usuario. “You” para hablarle a él.
- **Concreto:** Beneficio claro en la intro. “Pick X, get Y” en vez de descripciones vagas.
- **Sin corporativo:** Nada de “leverage”, “synergy”, “solution”. Nada de disculpas ni rodeos.
- **Empoderador sin sermonear:** Explicar el “por qué” cuando ayuda (ej. día WOD vs rest), sin tono de profesor ni de coach agresivo.

### 4.2 Puntuación

- **Evitar el guion largo (—)** en medio de frases. Suele sonar a “voz de IA”.
  - Usar **punto** cuando la segunda parte es una frase con sentido propio.
  - Usar **coma** cuando es continuación suave (and, plus, because).
  - Usar **dos puntos** cuando se presenta una lista o explicación directa.
- Ejemplos:  
  - “Pick a film. We did the rest.” (no “Pick a film — we did the rest.”)  
  - “...that fits, plus the recipe and one chef's trick.” (no “...that fits — plus...”)

### 4.3 Estructura del copy

- **Hero / intro:** Una o dos frases. Qué haces + qué obtienes. Opcional: un detalle que sorprenda (“plus a kitchen trick you didn't see coming”).
- **Placeholders:** Instrucción mínima + tono amigable. “No joke”, “That's it” cuando encaja.
- **Labels de sección:** Uppercase, letter-spacing. No largos.
- **CTAs:** Verbo claro. “Play”, “Generate my menu”, “Export as PNG”, “Apply”.
- **Footer tagline:** Memorable, con personalidad, una sola frase. Puede ser un juego de palabras o una promesa mínima.

### 4.4 Modal “From idea to prototype”

- **For whom:** A quién va. En una frase.
- **Problem:** Qué les pasa o qué les falta. Concreto.
- **This:** Qué hace este producto en una línea (una pregunta, un botón, un resultado).
- **The iteration:** Qué cambiaste y por qué (layout, pasos, foco). Breve.
- **What AI could and couldn't do:** Honestidad sobre límites. Qué salió bien y qué tuviste que ajustar a mano.
- **Minimum viable effort:** Cuántos pasos tiene el flujo ideal. “One click”, “One question”, etc.
- Tono: mismo que el producto. Cercano, sin relleno.

---

## 5. UX y flujo

### 5.1 Flujo principal

- **Un punto de entrada claro:** una pregunta, un selector, o un solo CTA.
- **Mínimo de pasos:** idealmente 1–2 decisiones antes del resultado. Si hay más, agrupar o ocultar en “opcional”.
- **Progressive disclosure:** detalles (por qué, calorías, receta) en expand/collapse o detrás de “More” en vez de todo visible desde el inicio.

### 5.2 Empty state y resultado

- El empty state debe **parecerse** al resultado (misma estructura, mismo tamaño) para que al rellenar no haya saltos bruscos.
- Mensaje que indique qué hacer, no un error genérico.

### 5.3 Mobile

- Touch targets ≥ 44–48px.
- Modales como bottom sheet con handle; CTA principal siempre accesible.
- Topbar y footer con safe-area si hace falta.
- Evitar scroll horizontal; contenido en columna si en desktop era grid.

### 5.4 Accesibilidad

- Contraste texto/fondo suficiente (text-primary sobre bg-deep cumple).
- `aria-label`, `aria-expanded`, `role` en controles (dropdowns, modales, votación).
- Focus visible en controles (outline con color de acento).
- `prefers-reduced-motion` para animaciones.

---

## 6. Checklist para un nuevo producto

- [ ] Misma topbar (back + “The story” / “How this went from idea to prototype”).
- [ ] Hero con título en acento + una línea de intro (qué haces, qué obtienes).
- [ ] Paleta: `--bg-deep`, `--border`, `--text-primary/secondary`, al menos un neon (o acento propio).
- [ ] Fuente: Space Grotesk.
- [ ] Un flujo claro: pocos pasos, un CTA principal.
- [ ] Empty state que refleje el layout del resultado.
- [ ] Footer: “Part of AI Proto Lab.” + tagline del producto.
- [ ] Modal “From idea to prototype” con la estructura estándar (problem, iteration, AI, MVP, contact).
- [ ] Vote widget antes del footer, conectado: `rating-vote.js`, `data-project`, `saveRating`; en landing, `card-rating` con el mismo id y (si aplica) id en `PUBLIC_PROJECTS`.
- [ ] Copy sin abuso de guiones largos; frases cortas y concretas.
- [ ] Easing `--ease` y transiciones 0.2–0.35s; `prefers-reduced-motion` respetado.

---

## 7. Tokens CSS de referencia

Copia base para un nuevo producto (ajusta acentos según necesidad):

```css
:root {
  --bg-deep: #0a0a1a;
  --bg-card: #111128;
  --border: #1e1e3a;

  --neon-pink: #ff2d78;
  --neon-cyan: #00f0ff;
  --neon-purple: #b24dff;
  --neon-gold: #e8c547;

  --text-primary: #e8e8f0;
  --text-secondary: #9090b0;
  --text-muted: #555580;

  --font: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  --ease: cubic-bezier(0.23, 1, 0.32, 1);
}
```

Con esto puedes alinear cualquier nuevo prototipo al resto del lab en menos iteraciones y mantener un tono y una estética coherentes.
