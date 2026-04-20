/** YYYY-MM-DD in local timezone (for date inputs). */
export function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Pretty label for a `YYYY-MM-DD` string in local calendar (no UTC shift). */
export function formatSessionDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const dt = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(dt);
}

/** Whole days since `startDate` (YYYY-MM-DD), in local time. */
export function daysSince(startDate: string, now = new Date()): number {
  const [y, m, d] = startDate.split('-').map(Number);
  if (!y || !m || !d) return 0;
  const start = new Date(y, m - 1, d);
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.max(0, Math.floor((nowMidnight - startMidnight) / 86_400_000));
}
