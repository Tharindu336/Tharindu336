const DAY = 86400000;
const dateKey = date => new Date(date).toISOString().slice(0, 10);
function calendarFromHTML(html, today = dateKey(Date.now())) {
  const tips = new Map();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = match[1].match(/\bfor="([^"]+)"/)?.[1];
    if (id) tips.set(id, match[2].replace(/<[^>]+>/g, '').trim());
  }
  const days = [];
  for (const match of html.matchAll(/<td\b[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g)) {
    const date = match[1]; if (date > today) continue;
    const id = match[0].match(/\bid="([^"]+)"/)?.[1], tip = tips.get(id);
    if (!tip) throw new Error(`GitHub calendar tooltip missing for ${date}`);
    const count = /^No contributions/i.test(tip) ? 0 : Number(tip.match(/([\d,]+) contributions?/i)?.[1].replaceAll(',', ''));
    if (!Number.isSafeInteger(count) || count < 0) throw new Error(`Unrecognized GitHub calendar count: ${tip}`);
    days.push({ date, count });
  }
  if (days.length < 300) throw new Error('GitHub contribution calendar is incomplete; the existing snapshot was preserved.');
  return days.sort((a, b) => a.date.localeCompare(b.date)).slice(-365);
}
function summarizeCalendar(days, today = dateKey(Date.now())) {
  const ordered = [...days].sort((a, b) => a.date.localeCompare(b.date));
  let longestStreak = 0, run = 0, activeDays = 0, total = 0, bestDay = { date: null, count: 0 };
  for (const day of ordered) {
    total += day.count; if (day.count > 0) { activeDays++; run++; longestStreak = Math.max(longestStreak, run); } else run = 0;
    if (day.count > bestDay.count) bestDay = day;
  }
  const lookup = new Map(ordered.map(d => [d.date, d.count]));
  let cursor = Date.parse(today + 'T00:00:00Z'), currentStreak = 0;
  // A streak is still active if yesterday has activity and today is not over.
  if (!lookup.get(today)) cursor -= DAY;
  while ((lookup.get(dateKey(cursor)) || 0) > 0) { currentStreak++; cursor -= DAY; }
  const months = [];
  for (const day of ordered) { const key = day.date.slice(0, 7); if (months.at(-1)?.date !== key) months.push({ date: key, count: 0 }); months.at(-1).count += day.count; }
  return { total, activeDays, currentStreak, longestStreak, bestDay, months, last30: ordered.slice(-30).reduce((n, d) => n + d.count, 0), activeRate: ordered.length ? activeDays / ordered.length : 0 };
}
function languageSummary(maps) {
  const bytes = {};
  for (const languages of maps) for (const [name, count] of Object.entries(languages)) if (name !== 'Jupyter Notebook') bytes[name] = (bytes[name] || 0) + count;
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  return Object.entries(bytes).sort((a, b) => b[1] - a[1]).map(([name, bytes]) => ({ name, bytes, percent: total ? bytes / total * 100 : 0 }));
}
module.exports = { calendarFromHTML, summarizeCalendar, languageSummary, dateKey };
