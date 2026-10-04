export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');

  return digits.length === 10 || digits.length === 11;
}

export function parseBirthDate(
  value: string,
): string | null | undefined {
  const text = value.trim();

  if (!text) {
    return null;
  }

  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);

  if (!match) {
    return undefined;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  const valid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getTime() <= Date.now();

  return valid ? date.toISOString() : undefined;
}

export function formatBirthDate(
  iso: string | null,
): string {
  if (!iso) {
    return '';
  }

  const date = new Date(iso);

  return [
    String(date.getUTCDate()).padStart(2, '0'),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCFullYear()),
  ].join('/');
}

export function parseWeight(
  value: string,
): number | null | undefined {
  const text = value.trim().replace(',', '.');

  if (!text) {
    return null;
  }

  const weight = Number(text);

  if (!Number.isFinite(weight) || weight <= 0 || weight > 200) {
    return undefined;
  }

  return weight;
}
