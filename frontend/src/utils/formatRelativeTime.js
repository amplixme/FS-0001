/**
 * Returns a date in a user-friendly relative format.
 * @param {string|Date|number} date - Date to format
 * @returns {string} Relative text or full date
 */

export function formatRelativeTime(date) {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const diffMs = Date.now() - dateObj.getTime();
  const isFuture = diffMs < 0;
  const diff = Math.abs(diffMs);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  const rel = (n, singular, plural) =>
    isFuture
      ? `en ${n} ${n === 1 ? singular : plural}`
      : `hace ${n} ${n === 1 ? singular : plural}`;

  if (seconds < 60) {
    return isFuture ? 'en un momento' : 'hace un momento';
  }

  if (minutes < 60) {
    return isFuture ? `en ${minutes} min` : `hace ${minutes} min`;
  }

  if (hours < 24) {
    return rel(hours, 'hora', 'horas');
  }

  if (days < 7) {
    return rel(days, 'día', 'días');
  }

  if (days < 28) {
    return rel(weeks, 'semana', 'semanas');
  }

  if (days < 365) {
    return rel(months, 'mes', 'meses');
  }

  return dateObj.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
