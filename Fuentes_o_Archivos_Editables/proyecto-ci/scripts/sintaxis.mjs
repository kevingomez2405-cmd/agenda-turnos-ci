// Revisa que todos los archivos JavaScript tengan sintaxis válida (node --check).
// Es la comprobación de "tipos" de este proyecto: no usa TypeScript para no depender de paquetes.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const CARPETAS = ['src', 'tests', 'scripts'];

function listarArchivos(carpeta) {
  const archivos = [];
  for (const nombre of readdirSync(carpeta)) {
    const ruta = join(carpeta, nombre);
    if (statSync(ruta).isDirectory()) {
      archivos.push(...listarArchivos(ruta));
    } else if (ruta.endsWith('.js') || ruta.endsWith('.mjs')) {
      archivos.push(ruta);
    }
  }
  return archivos;
}

let fallos = 0;
let revisados = 0;

for (const carpeta of CARPETAS) {
  for (const archivo of listarArchivos(carpeta)) {
    revisados++;
    const resultado = spawnSync(process.execPath, ['--check', archivo], { encoding: 'utf8' });
    if (resultado.status !== 0) {
      fallos++;
      console.log(`❌ Error de sintaxis en ${archivo}`);
      console.log(resultado.stderr);
    }
  }
}

if (revisados === 0) {
  console.log('❌ Sintaxis: no se revisó ningún archivo (¿rutas incorrectas?)');
  process.exit(1);
}

if (fallos > 0) {
  console.log(`❌ Sintaxis: ${fallos} archivo(s) con errores de ${revisados}`);
  process.exit(1);
}

console.log(`✅ Sintaxis: ${revisados} archivos revisados sin errores`);
