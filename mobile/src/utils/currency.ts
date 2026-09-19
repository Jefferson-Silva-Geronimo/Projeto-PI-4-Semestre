export function formatCurrency(
  valueInCents: number,
): string {
  const normalizedValue =
    Number.isFinite(valueInCents)
      ? valueInCents
      : 0;

  return (
    normalizedValue / 100
  ).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function parseCurrencyInputToCents(
  value: string,
): number | null {
  const normalizedValue = value
    .trim()
    .replace(/\s/g, '')
    .replace(/^R\$/i, '')
    .replace(/\./g, '')
    .replace(',', '.');

  if (!normalizedValue) {
    return null;
  }

  const numericValue = Number(
    normalizedValue,
  );

  if (
    !Number.isFinite(numericValue) ||
    numericValue <= 0
  ) {
    return null;
  }

  return Math.round(
    numericValue * 100,
  );
}

export function formatCentsForInput(
  valueInCents: number,
): string {
  if (
    !Number.isFinite(valueInCents) ||
    valueInCents < 0
  ) {
    return '';
  }

  return (
    valueInCents / 100
  ).toFixed(2)
    .replace('.', ',');
}