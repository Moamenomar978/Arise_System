const pad = (n: number) => String(n).padStart(2, '0');

/** Local-date key such as "2026-10-09". Used for streaks and daily periods. */
export function dayKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}
