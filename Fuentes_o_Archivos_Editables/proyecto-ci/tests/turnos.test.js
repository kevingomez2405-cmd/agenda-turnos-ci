import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validarTurno, hayCruce, agendarTurno } from '../src/index.js';

const turnoBase = { cliente: 'Cliente de prueba', inicio: 540, fin: 570 };

test('un turno correcto no tiene errores', () => {
  assert.deepEqual(validarTurno(turnoBase), []);
});

test('rechaza un turno sin cliente', () => {
  const errores = validarTurno({ ...turnoBase, cliente: '  ' });
  assert.equal(errores.length, 1);
  assert.match(errores[0], /cliente/i);
});

test('rechaza un turno más corto que la duración mínima', () => {
  const errores = validarTurno({ ...turnoBase, fin: 545 });
  assert.match(errores[0], /al menos 15 minutos/);
});

test('detecta cruce entre dos turnos', () => {
  const otro = { cliente: 'Otro', inicio: 560, fin: 600 };
  assert.equal(hayCruce(turnoBase, otro), true);
});

test('turnos que se tocan en el borde no se cruzan', () => {
  const siguiente = { cliente: 'Siguiente', inicio: 570, fin: 600 };
  assert.equal(hayCruce(turnoBase, siguiente), false);
});

test('agendarTurno agrega el turno a la agenda', () => {
  const agenda = agendarTurno([], turnoBase);
  assert.equal(agenda.length, 1);
});

test('agendarTurno rechaza un turno que se cruza', () => {
  const agenda = [turnoBase];
  const otro = { cliente: 'Otro', inicio: 550, fin: 600 };
  assert.throws(() => agendarTurno(agenda, otro), /se cruza/);
});
