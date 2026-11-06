# Resumen de ejecuciones (local)

Ejecutadas con `npm run ci` en Node v22 sobre una copia limpia del proyecto (`npm ci` antes).
Los registros completos están en esta carpeta.

| Archivo | Escenario | Cambio aplicado | Puerta que falla | Código de salida |
|---------|-----------|-----------------|------------------|------------------|
| 01_ejecucion_aprobada.log | Aprobada | Ninguno | — | 0 |
| 02_fallo_lint.log | Fallo controlado 1 | `var duracionVieja = 30;` en `src/turnos.js` | Lint | 1 |
| 03_fallo_prueba.log | Fallo controlado 2 | `<` cambiado por `<=` en `hayCruce` | Pruebas | 1 |
| 04_fallo_build.log | Fallo controlado 3 | `"main": "src/principal.js"` en `package.json` | Build | 1 |
| 05_fallo_pruebas_fantasma.log | Fallo extra | Ruta `test/` en lugar de `tests/` | Pruebas (0 ejecutadas) | 1 |
| 06_recuperacion_tras_corregir.log | Recuperación | Se revirtieron los cambios | — | 0 |
| 07_demostracion_verde_vacio.log | Demostración | `node --test` con ruta incorrecta, sin guarda | — (sale en 0) | 0 |

## Qué faltan por agregar (ejecuciones en GitHub)

Estos registros son **locales**. Para la entrega, suba el proyecto a GitHub y agregue en esta carpeta
las capturas (o los enlaces) de:

- la ejecución aprobada en la pestaña **Actions**,
- los tres pull requests con fallo (lint, prueba, build) mostrando el check rojo y el botón Merge bloqueado.
