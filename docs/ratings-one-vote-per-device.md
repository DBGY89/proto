# Un voto por dispositivo por proyecto

Las votaciones están limitadas a **un voto por dispositivo por proyecto**.

## Cómo funciona

- **Cliente:** Se guarda un `device_id` en `localStorage` (clave `rating_device_id`). Tras votar, se guarda también `rating_{project}` para que la UI muestre "Thanks" y no permita votar de nuevo en ese proyecto.
- **Supabase:** Cada voto envía `project`, `rating` y `device_id`. Si en la tabla existe restricción única `(project, device_id)`, el backend puede hacer **upsert**: mismo dispositivo votando otra vez actualiza su voto en lugar de insertar una fila nueva.

## Cambio en Supabase (opcional pero recomendado)

Para que el backend también restrinja un voto por dispositivo por proyecto y actualice en lugar de duplicar:

1. En el **SQL Editor** de tu proyecto Supabase, ejecuta:

```sql
-- Añadir columna device_id si no existe
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS device_id text;

-- Índice único: un solo voto por (proyecto, dispositivo)
CREATE UNIQUE INDEX IF NOT EXISTS ratings_project_device_id_key
  ON ratings(project, device_id);
```

2. La tabla `ratings` debe tener al menos: `project`, `rating`, `device_id`. Si ya tenías filas sin `device_id`, puedes dejarlas (el índice único solo afecta a filas con `device_id` no nulo) o asignar un valor por defecto.

Con esto, el cliente usa `Prefer: resolution=merge-duplicates` en el POST: si ya existe una fila con ese `(project, device_id)`, Supabase actualiza `rating` en lugar de insertar otra.

## Si al votar sale 400 Bad Request

Suele ser porque la columna `project` tiene un **ENUM** o un **CHECK** que solo permite ciertos valores (p. ej. los tres proyectos originales). Hay que permitir el nuevo id en Supabase:

1. **Dashboard Supabase** → **Table Editor** → tabla `ratings` → pestaña **Definition** (o **SQL Editor**).
2. Si `project` es un **enum**: en **Database** → **Types** → el tipo enum de `project` → añadir el valor (p. ej. `crossfit-fuel`).
3. Si hay un **CHECK** en la tabla que lista proyectos permitidos: editar la constraint para incluir el nuevo id (o eliminarla si quieres aceptar cualquier texto).
4. Si no estás seguro, en **SQL Editor** ejecuta:
   ```sql
   SELECT column_name, data_type, udt_name
   FROM information_schema.columns
   WHERE table_name = 'ratings' AND column_name = 'project';
   ```
   Si `data_type` es `USER-DEFINED` y `udt_name` es un enum, ese tipo hay que actualizarlo con el nuevo valor.

---

## Guía paso a paso (qué hacer en Supabase)

### 1. Entrar en Supabase

- Abre [supabase.com](https://supabase.com) e inicia sesión.
- Abre tu proyecto (el que usa la URL que está en `rating-vote.js`).

### 2. Ver cómo está definida la columna `project`

- En el menú izquierdo: **SQL Editor**.
- Pulsa **New query** y pega esto:

```sql
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'ratings' AND column_name = 'project';
```

- Ejecuta (Run). Anota el resultado:
  - Si sale `data_type = 'USER-DEFINED'` y `udt_name` algo como `project_enum` → la columna es un **ENUM**.
  - Si sale `data_type = 'character varying'` o `'text'` → la columna es **texto**; entonces el 400 puede venir de una **CHECK constraint** en la tabla.

### 3a. Si la columna es ENUM: añadir el valor `crossfit-fuel`

En **SQL Editor**, ejecuta (sustituye `project_enum` por el `udt_name` que te salió antes, si es distinto):

```sql
ALTER TYPE project_enum ADD VALUE IF NOT EXISTS 'crossfit-fuel';
```

Si no existe `IF NOT EXISTS` en tu versión de Postgres:

```sql
ALTER TYPE project_enum ADD VALUE 'crossfit-fuel';
```

(Si da error "already exists", el valor ya está y el problema es otro.)

### 3b. Si la columna es texto: buscar y quitar la CHECK que limita proyectos

- En el menú izquierdo: **Database** → **Tables** → **ratings**.
- Revisa las **Constraints** (o la definición de la tabla) y busca una de tipo **CHECK** que use la columna `project` (por ejemplo que diga `project IN ('bubbles', 'salad-bar', 'movie-palette')`).
- Opción A: editar esa CHECK para incluir `'crossfit-fuel'` en la lista.
- Opción B (más simple para el futuro): borrar esa CHECK para que `project` acepte cualquier texto. En **SQL Editor**:

```sql
-- Listar constraints de la tabla (copia el nombre de la que afecte a project)
SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'public.ratings'::regclass;

-- Quitar la CHECK (sustituye NOMBRE_DE_LA_CHECK por el nombre que salió arriba)
ALTER TABLE public.ratings DROP CONSTRAINT NOMBRE_DE_LA_CHECK;
```

### 4. Probar de nuevo

- En tu app, entra en CrossFit Fuel y vota con la URL que lleve `?rating-debug=1`.
- En la consola del navegador debería aparecer `[rating] OK: vote saved for crossfit-fuel` y ya no 400.

---

## Al añadir un producto nuevo

Si la tabla `ratings` tiene la columna `project` como **text** (sin ENUM ni CHECK que limite valores) y la columna **device_id**, no hace falta tocar Supabase. Solo hay que integrar el rating en el producto y en la landing.

1. **Id del proyecto**  
   Elige un id único en minúsculas y con guiones (ej. `piano-maestro`). Úsalo igual en todos los sitios.

2. **Landing (`index.html` + `landing.js`)**  
   - Añade la tarjeta del producto con `data-project="tu-id"`.  
   - Dentro de la tarjeta, el `<span class="card-rating" data-project="tu-id">` (puede estar vacío).  
   - Si usas `PUBLIC_PROJECTS` en `landing.js`, añade ahí `'tu-id'`.

3. **Página del producto**  
   - Incluye el script: `<script src="/rating-vote.js"></script>`.  
   - Añade el widget de votación (los números 1–5) con `data-project="tu-id"` en el contenedor.  
   - En un `<script>` inline: que al hacer clic en un número llame `saveRating('tu-id', valor)` y actualice la UI (Thanks, estado seleccionado). Puedes copiar la lógica de `projects/crossfit-fuel/index.html`.

Con eso, los votos se guardan en Supabase y el resumen (★ X.X · N ratings) se mostrará en la tarjeta de la landing sin cambios adicionales en backend.
