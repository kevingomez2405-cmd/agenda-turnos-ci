// Lint sencillo hecho a mano: revisa reglas básicas línea por línea.
// Si encuentra problemas, muestra archivo y línea y termina con código 1.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CARPETAS = ['src', 'tests', 'scripts'];
const enGitHub = process.env.GITHUB_ACTIONS === 'true';

const REGLAS = [
  { nombre: 'no-var', patron: /\bvar\s+\w+/, mensaje: 'Use const o let en lugar de var' },
  { nombre: 'no-debugger', patron: /^\s*debugger\s*;?\s*$/, mensaje: 'Quite la instrucción debugger' },
  {
    nombre: 'no-console',
    patron: /console\.log\(/,
    mensaje: 'No deje console.log en el código de la aplicación',
    soloEn: 'src',
  },
  {
    nombre: 'no-secretos',
    patron: /(password|passwd|secret|token|api[_-]?key)\s*[:=]\s*['"][^'"]+['"]/i,
    mensaje: 'Parece un secreto escrito en el código; use variables de entorno',
  },
];

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

const problemas = [];

for (const carpeta of CARPETAS) {
  for (const archivo of listarArchivos(carpeta)) {
    // El propio lint contiene los patrones, así que no se revisa a sí mismo.
    if (archivo.endsWith('lint.mjs')) continue;

    const lineas = readFileSync(archivo, 'utf8').split('\n');
    lineas.forEach((linea, i) => {
      if (linea.trim().startsWith('//')) return; // se ignoran los comentarios
      for (const regla of REGLAS) {
        if (regla.soloEn && regla.soloEn !== carpeta) continue;
        if (regla.patron.test(linea)) {
          problemas.push({ archivo: archivo.replaceAll('\\', '/'), linea: i + 1, regla, });
        }
      }
    });
  }
}

if (problemas.length === 0) {
  console.log('✅ Lint: sin problemas');
  process.exit(0);
}

for (const p of problemas) {
  console.log(`${p.archivo}:${p.linea}  [${p.regla.nombre}]  ${p.regla.mensaje}`);
  // Esta línea especial hace que GitHub marque el error sobre el archivo en el pull request.
  if (enGitHub) {
    console.log(`::error file=${p.archivo},line=${p.linea},title=${p.regla.nombre}::${p.regla.mensaje}`);
  }
}
console.log(`\n❌ Lint: ${problemas.length} problema(s) encontrado(s)`);
process.exit(1);
