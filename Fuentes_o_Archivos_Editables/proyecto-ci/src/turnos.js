// Agenda de turnos de una lavandería ficticia.
// Los turnos se miden en minutos desde las 00:00 (por ejemplo 540 = 9:00 a. m.).

export const DURACION_MINIMA = 15; // minutos

// Devuelve una lista de errores. Si la lista está vacía, el turno es válido.
export function validarTurno(turno) {
  const errores = [];

  if (!turno.cliente || turno.cliente.trim() === '') {
    errores.push('El cliente es obligatorio');
  }

  if (!Number.isInteger(turno.inicio) || !Number.isInteger(turno.fin)) {
    errores.push('Inicio y fin deben ser minutos enteros');
  } else if (turno.fin - turno.inicio < DURACION_MINIMA) {
    errores.push(`El turno debe durar al menos ${DURACION_MINIMA} minutos`);
  }

  return errores;
}

// Dos turnos se cruzan si cada uno empieza antes de que el otro termine.
// Si uno termina justo cuando empieza el otro, NO hay cruce.
export function hayCruce(a, b) {
  return a.inicio < b.fin && b.inicio < a.fin;
}

// Agrega un turno a la agenda. Lanza un error si es inválido o se cruza.
export function agendarTurno(agenda, turno) {
  const errores = validarTurno(turno);
  if (errores.length > 0) {
    throw new Error(errores.join('. '));
  }

  for (const existente of agenda) {
    if (hayCruce(existente, turno)) {
      throw new Error(`El turno se cruza con el de ${existente.cliente}`);
    }
  }

  return [...agenda, turno];
}
