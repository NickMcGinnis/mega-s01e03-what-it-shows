import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { uniqueById, groupByCause, dayFirst } from '../src/lib/kb/causes.ts';

const read = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const rows = await read('../src/lib/data/reports-4471.json');
const tenants = new Map();
for (const file of await readdir(new URL('../src/lib/data/tenants/', import.meta.url))) {
  const t = await read(`../src/lib/data/tenants/${file}`);
  tenants.set(t.handle, t);
}
const reports = uniqueById(rows).filter(r => r.mergedInto === 4471);
const notes = await read('../src/lib/data/desk-notes.json');
const groups = groupByCause(reports, r => tenants.get(r.tenant));
const day = (value) => value.slice(0, 10);
const monthCounts = (rs, field) => rs.reduce((out, r) => {
  const month = r[field].slice(0, 7);
  out[month] = (out[month] ?? 0) + 1;
  return out;
}, {});
const analysis = {
  sourceRows: rows.length,
  uniqueReports: reports.length,
  overlapRows: rows.length - reports.length,
  tenants: [...tenants.values()].map(t => ({ ...t, dayFirst: dayFirst(t.locale) })),
  receivedByMonth: monthCounts(reports, 'receivedAt'),
  mergedByMonth: monthCounts(reports, 'mergedAt'),
  july2Bulk: reports.filter(r => day(r.mergedAt) === '2026-07-02').length,
  receivedAfterJuly2: reports.filter(r => day(r.receivedAt) > '2026-07-02').length,
  groups: groups.map(g => ({
    cause: g.cause, count: g.reports.length, taggedAs: g.taggedAs, tenants: g.tenants,
    firstSeen: g.firstSeen, lastSeen: g.lastSeen,
    reportIds: g.reports.map(r => r.id),
    receivedByMonth: monthCounts(g.reports, 'receivedAt'),
    noteReports: g.reports.filter(r => notes.oneDayMove.includes(r.id)),
    examples: g.reports.filter(r => g.cause === 'hint' || r.meta.intakeTag !== g.cause).slice(0, 4)
  }))
};
if (groups.some(g => g.cause === 'unplaced')) throw new Error('Unplaced reports need investigation');
await mkdir(new URL('../evidence/', import.meta.url), { recursive: true });
await writeFile(new URL('../evidence/analysis.json', import.meta.url), JSON.stringify(analysis, null, 2) + '\n');
console.log(JSON.stringify({ ...analysis, tenants: undefined, groups: analysis.groups.map(({reportIds, noteReports, ...g}) => g) }, null, 2));
