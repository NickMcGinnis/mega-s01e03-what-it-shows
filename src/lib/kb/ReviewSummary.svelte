<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const rows = reports as Report[];
  const merged = uniqueById(rows).filter(r => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const mismatch = groups.reduce((n, g) => n + g.reports.filter(r => r.meta.intakeTag !== g.cause).length, 0);
  const bulk = merged.filter(r => r.mergedAt?.slice(0, 10) === '2026-07-02').length;
  const later = merged.filter(r => r.receivedAt.slice(0, 10) > '2026-07-02').length;
  const observed = merged.filter(r => notes.oneDayMove.includes(r.id));
</script>

<p>
  The export has {rows.length} rows, {merged.length} distinct report IDs and
  {rows.length - merged.length} overlapping rows. It contains {groups.length} causes.
  Intake labels disagree with the tenant-based cause for {mismatch} reports.
</p>
<p>
  {bulk} reports were merged on 2 July. Another {later} reports arrived after that day.
  The received and merged bars below measure different events: a merge spike is not an arrival spike.
</p>
<p>
  {observed.length} reports have unusual one-day or time-related descriptions. The supplied
  classifier places them under parser; that assignment does not prove their root cause.
  Keep these IDs visible and investigate the original booking, invite, date and timezone data
  before asserting a third defect or closing them with the parser fix.
</p>
<ul>
  {#each observed as r (r.id)}
    <li><code>{r.id}</code> · {r.tenant} · {r.channel}: {r.body}</li>
  {/each}
</ul>
