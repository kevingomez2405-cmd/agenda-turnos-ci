// Ejecuta las pruebas y NO acepta un "verde vacío":
// si el comando termina bien pero no corrió ninguna prueba, también falla.
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';

const patron = process.argv[2];
if (!patron) {
  console.log('❌ Falta el patrón de pruebas. Ejemplo: node scripts/pruebas.mjs "tests/**/*.test.js"');
  process.exit(1);
}

mkdirSync('reports', { recursive: true });

const resultado = spawnSync(
  process.execPath,
  [
    '--test',
    '--test-reporter=spec',
    '--test-reporter-destination=stdout',
    '--test-reporter=junit',
    '--test-reporter-destination=reports/junit.xml',
    patron,
  ],
  { stdio: 'inherit' },
);

// Cuenta cuántas pruebas quedaron registradas en el reporte.
let cantidad = 0;
try {
  const xml = readFileSync('reports/junit.xml', 'utf8');
  cantidad = (xml.match(/<testcase /g) || []).length;
} catch {
  cantidad = 0;
}

if (resultado.status !== 0) {
  console.log('\n❌ Pruebas: hay pruebas que fallaron (revise el detalle de arriba)');
  process.exit(1);
}

if (cantidad === 0) {
  console.log(`\n❌ Pruebas: se ejecutaron 0 pruebas con el patrón "${patron}".`);
  console.log('   Revise que la carpeta y el nombre de los archivos sean correctos.');
  process.exit(1);
}

console.log(`\n✅ Pruebas: ${cantidad} pruebas ejecutadas y aprobadas`);
