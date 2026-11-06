# agenda-turnos-ci

Proyecto de laboratorio (datos ficticios) para practicar **integración continua** con GitHub Actions.
La aplicación es una agenda de turnos de una lavandería inventada; lo importante aquí no es la agenda,
sino que el pipeline detecte los errores y bloquee la integración.

## Requisitos

- Node.js **22** (la versión está en `.nvmrc`)
- npm (viene con Node.js)
- Git

No hay dependencias externas y no se necesitan secretos ni archivos `.env`.

## Cómo ejecutarlo en limpio

```bash
npm ci          # instala exactamente lo que dice package-lock.json
npm run ci      # lint, sintaxis, pruebas y build, en ese orden
```

También se pueden correr por separado: `npm run lint`, `npm run sintaxis`, `npm test`, `npm run build`.

## Qué revisa cada puerta

| Puerta | Script | Falla cuando |
|--------|--------|--------------|
| Lint | `scripts/lint.mjs` | Aparece `var`, `debugger`, `console.log` en `src/` o un secreto escrito en el código. |
| Sintaxis | `scripts/sintaxis.mjs` | Algún `.js` o `.mjs` tiene un error de sintaxis, o no se revisó ningún archivo. |
| Pruebas | `scripts/pruebas.mjs` | Falla una prueba **o se ejecutan 0 pruebas** (ruta incorrecta). |
| Build | `scripts/build.mjs` | `package.json` no tiene `main` o ese archivo no existe. Genera `dist/` y `build-info.json`. |

## Flujo de CI

El archivo `.github/workflows/ci.yml` corre en cada push a `main` y en cada pull request hacia `main`.
Guarda dos artefactos: `reporte-pruebas-<sha>` (siempre) y `build-<sha>` (solo si todo pasó).

## Provocar fallos controlados

```bash
node scripts/provocar-fallo.mjs lint       # agrega un var
node scripts/provocar-fallo.mjs prueba     # rompe la regla de cruce de turnos
node scripts/provocar-fallo.mjs build      # main apunta a un archivo que no existe
node scripts/provocar-fallo.mjs fantasma   # ruta de pruebas incorrecta (0 pruebas)
npm run ci                                 # debe terminar en rojo
git checkout -- .                          # deshace el fallo
```

## Reglas del proyecto

- No desactive puertas para aprobar (nada de `continue-on-error` ni `|| true`).
- No suba `node_modules/`, `dist/`, `reports/` ni archivos `.env`.
- Todo cambio entra por pull request con el check **Verificar** en verde.
