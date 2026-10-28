<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import update from '#lib/data/desk-update-2026-10-05.json';
  import { uniqueById, groupByCause, type Report, type Cause } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const merged = uniqueById(reports as Report[]).filter(r => r.mergedInto === update.ticket);
  const groups = groupByCause(merged, tenantOf);
  const outcomeFor = (cause: string) => update.causes[cause as Cause];
</script>

<p>{merged.length} distinct reports, {groups.length} separate causes. Desk ticket #{update.ticket} closed {update.closed}.</p>
<table>
  <thead><tr><th>cause</th><th>reports</th><th>desk outcome</th><th>reason</th><th>GitHub closure</th></tr></thead>
  <tbody>
    {#each groups as g (g.cause)}
      {@const outcome = outcomeFor(g.cause)}
      <tr>
        <td><a href={outcome.issue}>{g.cause}</a></td>
        <td>{g.reports.length}</td>
        <td>{outcome.status}</td>
        <td>{outcome.message}</td>
        <td><code>{outcome.githubReason}</code></td>
      </tr>
    {/each}
  </tbody>
</table>
