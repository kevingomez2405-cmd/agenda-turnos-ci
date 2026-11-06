# Criterios de integración

Reglas que debe cumplir un cambio antes de entrar a la rama `main`.
Cada regla se comprueba con el resultado real del flujo CI (`.github/workflows/ci.yml`).

| N.º | Regla | Cómo se comprueba | Si no se cumple |
|-----|-------|-------------------|-----------------|
| 1 | El cambio llega por pull request, nunca por push directo a `main`. | Protección de rama (ver `proteccion-de-rama.md`). | GitHub no deja fusionar. |
| 2 | El flujo se ejecuta en ambiente limpio: máquina nueva de GitHub y `npm ci` con `package-lock.json`. | Paso "Instalar dependencias con el lockfile". | El flujo falla y no sigue. |
| 3 | **Lint** sin problemas. | `npm run lint` (código de salida 0). | El pull request queda en rojo. |
| 4 | **Sintaxis** válida en todos los archivos JavaScript. | `npm run sintaxis`. | Rojo. |
| 5 | **Pruebas** aprobadas y **al menos una ejecutada**. | `npm test` (la guarda falla con 0 pruebas). | Rojo. |
| 6 | **Build** exitoso: se genera `dist/` y el archivo `main` existe. | `npm run build`. | Rojo. |
| 7 | Ninguna puerta se desactiva para "hacer pasar" el flujo. | Revisión del pull request: sin `continue-on-error`, sin `|| true`. | El revisor rechaza el cambio. |
| 8 | No hay secretos en el código ni en los registros. | Regla `no-secretos` del lint, `.gitignore` y permisos mínimos (`contents: read`). | Rojo, y se cambia el secreto si llegó a subirse. |
| 9 | El reporte de pruebas y el build quedan guardados con el commit. | Artefactos `reporte-pruebas-<sha>` y `build-<sha>`. | Sin reporte no hay forma de diagnosticar. |

## Orden de las puertas

`lint → sintaxis → pruebas → build`

Se ordenan de la más barata a la más cara. Si una falla, las siguientes no se ejecutan,
y el mensaje de error dice qué archivo y qué regla causó el problema.

## Decisión y alternativa descartada

- **Decisión:** scripts propios sin paquetes externos. El flujo es fácil de leer y se reconstruye en cualquier equipo con Node.js 22.
- **Alternativa descartada:** ESLint y TypeScript. Son más completos, pero obligan a instalar dependencias y a mantener un lockfile con muchos paquetes; para un laboratorio de CI pequeño añadían complejidad sin cambiar lo que se quiere demostrar.
