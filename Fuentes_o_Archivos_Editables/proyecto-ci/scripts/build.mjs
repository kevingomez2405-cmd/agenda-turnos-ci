// Construcción: copia src/ a dist/ y deja un archivo con datos de la versión.
// Antes de terminar comprueba que el archivo "main" de package.json exista.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const paquete = JSON.parse(readFileSync('package.json', 'utf8'));

function fallar(mensaje) {
  console.log(`❌ Build: ${mensaje}`);
  if (process.env.GITHUB_ACTIONS === 'true') {
    console.log(`::error file=package.json,title=build::${mensaje}`);
  }
  process.exit(1);
}

if (!paquete.main) {
  fallar('package.json no define el campo "main"');
}
if (!existsSync(paquete.main)) {
  fallar(`package.json dice que el archivo principal es "${paquete.main}", pero ese archivo no existe`);
}

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('src', join('dist', 'src'), { recursive: true });

const info = {
  nombre: paquete.name,
  version: paquete.version,
  commit: process.env.GITHUB_SHA || 'local',
  node: process.version,
  fecha: new Date().toISOString(),
};
writeFileSync(join('dist', 'build-info.json'), JSON.stringify(info, null, 2) + '\n');

if (!existsSync(join('dist', paquete.main))) {
  fallar('el archivo principal no quedó dentro de dist/');
}

console.log(`✅ Build: dist/ generado (versión ${info.version}, commit ${info.commit.slice(0, 7)})`);
