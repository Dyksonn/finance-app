export const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getNextMonth(): { month: number; year: number; label: string } {
  const now = new Date();
  let month = now.getMonth() + 1; // advance by 1 (0-indexed)
  let year = now.getFullYear();
  if (month > 11) {
    month = 0;
    year += 1;
  }
  return { month, year, label: `${MONTH_NAMES[month]} ${year}` };
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Masks raw keyboard input as Brazilian currency (e.g. "123" → "1,23") */
export function maskCurrency(text: string): string {
  const digits = text.replace(/\D/g, "");
  if (!digits) return "";
  const number = parseInt(digits, 10) / 100;
  const data = number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  console.log("data", data);
  return data;
}

/** Parses a masked Brazilian currency string back to a number (e.g. "1.234,56" → 1234.56) */
export function parseMaskedCurrency(masked: string): number {
  if (!masked) return 0;
  return parseFloat(masked.replace(/\./g, "").replace(",", ".")) || 0;
}

/** Converts a number to masked display format for editing (e.g. 1234.56 → "1.234,56") */
export function numberToMasked(value: number): string {
  if (!value) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
