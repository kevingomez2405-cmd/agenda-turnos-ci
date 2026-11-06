// Ayuda para la práctica: provoca un fallo controlado en el proyecto.
// Uso:  node scripts/provocar-fallo.mjs <lint | prueba | build | fantasma>
// Para deshacerlo:  git checkout -- .
import { readFileSync, writeFileSync } from 'node:fs';

const tipo = process.argv[2];

function reemplazar(archivo, antes, despues) {
  const texto = readFileSync(archivo, 'utf8');
  if (!texto.includes(antes)) {
    console.log(`No se encontró "${antes}" en ${archivo}. ¿Ya provocó este fallo?`);
    process.exit(1);
  }
  writeFileSync(archivo, texto.replace(antes, despues));
}

if (tipo === 'lint') {
  // Agrega una variable con var: rompe la regla no-var.
  const texto = readFileSync('src/turnos.js', 'utf8');
  writeFileSync('src/turnos.js', texto + '\nvar duracionVieja = 30;\n');
} else if (tipo === 'prueba') {
  // Cambia < por <= : ahora dos turnos que se tocan en el borde cuentan como cruce.
  reemplazar('src/turnos.js', 'a.inicio < b.fin && b.inicio < a.fin', 'a.inicio <= b.fin && b.inicio <= a.fin');
} else if (tipo === 'build') {
  // package.json apunta a un archivo principal que no existe.
  reemplazar('package.json', '"main": "src/index.js"', '"main": "src/principal.js"');
} else if (tipo === 'fantasma') {
  // Ruta incorrecta: "test/" en lugar de "tests/". Sin la guarda, el pipeline saldría en verde.
  reemplazar('package.json', 'node scripts/pruebas.mjs \\"tests/', 'node scripts/pruebas.mjs \\"test/');
} else {
  console.log('Uso: node scripts/provocar-fallo.mjs <lint | prueba | build | fantasma>');
  process.exit(1);
}

console.log(`Fallo "${tipo}" provocado. Ejecute: npm run ci`);
console.log('Para deshacerlo: git checkout -- .');
