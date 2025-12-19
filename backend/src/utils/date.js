export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day; // start week on Sunday
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

export function isSameDay(a, b) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
}
