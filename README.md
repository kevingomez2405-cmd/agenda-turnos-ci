# Evidencia 5 — Flujo de integración continua y criterios de integración

Guía de aprendizaje Trimestre 5 · ADSO · GA5-220501096-AA1-EV05

## Contenido

```
Evidencia_05_Integracion_Continua/
├── Documento/
│   ├── criterios-de-integracion.md     Reglas para integrar un cambio
│   └── proteccion-de-rama.md           Cómo proteger main en GitHub
├── Fuentes_o_Archivos_Editables/
│   └── proyecto-ci/                    Repositorio completo del laboratorio
│       ├── .github/workflows/ci.yml    Flujo de integración continua
│       ├── scripts/                    lint, sintaxis, pruebas, build y provocar-fallo
│       ├── src/ y tests/               Código y pruebas (agenda de turnos ficticia)
│       └── README.md                   Cómo ejecutarlo
├── Pruebas_y_Resultados/               Registros de la ejecución aprobada y de los fallos
└── README.md
```

El **reporte PDF** se entrega por separado (no va dentro de este ZIP).

## Cómo reconstruirlo

1. Instale Node.js 22.
2. Entre a `Fuentes_o_Archivos_Editables/proyecto-ci/`.
3. Ejecute `npm ci` y luego `npm run ci`. Debe terminar con código 0.

## Cómo usarlo en GitHub

1. Cree un repositorio vacío y suba **el contenido de `proyecto-ci/`** como raíz del repositorio
   (la carpeta `.github/` debe quedar en la raíz).
2. Revise la pestaña **Actions**: debe aparecer la ejecución "CI" en verde.
3. Proteja `main` siguiendo `Documento/proteccion-de-rama.md`.
4. Cree tres ramas con fallos (`node scripts/provocar-fallo.mjs lint | prueba | build`), abra un pull request por cada una y tome captura del check en rojo.

## Relación con los criterios de verificación de la guía

| Criterio | Dónde se cumple |
|----------|-----------------|
| El flujo se ejecuta en ambiente limpio | `ci.yml`: `ubuntu-latest` + `npm ci` |
| Las verificaciones corresponden al proyecto | Lint, sintaxis, pruebas y build del propio proyecto |
| Los fallos bloquean e informan la causa | `Pruebas_y_Resultados/02` a `05` |
| No se exponen secretos | Regla `no-secretos`, `.gitignore`, permisos mínimos |
| Los criterios de integración usan el resultado real | `Documento/criterios-de-integracion.md` |
