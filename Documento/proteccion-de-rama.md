# Protección de la rama `main` (paso a paso)

Se hace una sola vez en GitHub, **después** de que el workflow haya corrido al menos una vez
(así el nombre de la verificación aparece en la lista).

1. Entre al repositorio → **Settings** → **Branches**.
2. Pulse **Add branch ruleset** (o **Add classic branch protection rule**) y escriba el nombre `main`.
3. Active **Require a pull request before merging**.
4. Active **Require status checks to pass before merging** y agregue la verificación **Verificar** (es el nombre del job en `ci.yml`).
5. Active **Require branches to be up to date before merging**.
6. Active **Do not allow bypassing the above settings** (o desactive las excepciones para administradores).
7. Guarde con **Create** / **Save changes**.

## Cómo demostrar que funciona

1. Cree una rama con un fallo (por ejemplo, `node scripts/provocar-fallo.mjs lint`).
2. Haga commit, suba la rama y abra un pull request hacia `main`.
3. Verifique que el check **Verificar** aparece en rojo y que el botón **Merge** está bloqueado.
4. Tome una captura de esa pantalla: es evidencia de que "no se integra si incumple".

> Nota: en repositorios **privados** con cuenta gratuita, GitHub puede no ofrecer la protección de ramas. Si le pasa eso, use un repositorio público para el laboratorio y anótelo en el reporte.
