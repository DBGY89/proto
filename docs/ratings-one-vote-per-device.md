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
