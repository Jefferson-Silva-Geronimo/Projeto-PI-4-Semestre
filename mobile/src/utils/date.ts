const UTC_OFFSET_HOURS = -3;
const HOUR = 60 * 60 * 1000;

function shifted(instant: Date): Date {
  return new Date(
    instant.getTime() + UTC_OFFSET_HOURS * HOUR,
  );
}

export function toDateKey(instant: Date): string {
  return shifted(instant).toISOString().slice(0, 10);
}

export function nextDays(count: number): string[] {
  const now = Date.now();

  return Array.from({ length: count }, (_, index) =>
    toDateKey(new Date(now + index * 24 * HOUR)),
  );
}

export function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-');

  const weekday = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  ).getUTCDay();

  const names = [
    'Dom',
    'Seg',
    'Ter',
    'Qua',
    'Qui',
    'Sex',
    'Sáb',
  ];

  return `${names[weekday]} ${day}/${month}`;
}

export function formatDateKeyLong(dateKey: string): string {
  const [year, month, day] = dateKey.split('-');

  const weekday = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  ).getUTCDay();

  const names = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  return `${names[weekday]}, ${day}/${month}`;
}

export function formatTime(iso: string): string {
  return shifted(new Date(iso))
    .toISOString()
    .slice(11, 16);
}

export function formatDateTime(iso: string): string {
  const [year, month, day] = toDateKey(
    new Date(iso),
  ).split('-');

  return `${day}/${month}/${year} às ${formatTime(iso)}`;
}
