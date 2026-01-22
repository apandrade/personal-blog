/**
 * Utility functions for date formatting and manipulation
 */

export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getMonthName(month: number, locale: string): string {
  const date = new Date(2000, month, 1);
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
}

export function getYearMonth(date: Date): { year: number; month: number } {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}
