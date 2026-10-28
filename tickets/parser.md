## Closure update

The course's engineering update reports #4471 closed on 5 October: **parser FIXED**, `fix(dates): parse dd/mm for eu locales`. Closing as **completed** based on that desk update, not on a locally implemented production fix. See https://hq.mega.dev/challenges/what-it-shows and the signed outcome page at `src/routes/kb/incidents/4471-outcome/+page.svx`. The five unusual descriptions below remain limitations of the available evidence.

## Original review

The shared date parser reads month first for tenants whose date order is day first. This flips the intended day and month in bookings, invites and reminders.

**Reports covered: 379 distinct report IDs**, received 2026-04-01 through 2026-10-04, across 11 tenants. These reports were merged into support ticket #4471. Count each ID once; the export contains overlapping pages.

Evidence:

- `R-41203`, lantern.row, app: 2 December became 12 February.
- `R-41205`, morrow.tax, app: 3 October became 10 March. Intake tagged it `hint`, but the tenant's `fr-FR` locale and app channel classify it as `parser`.
- `R-41292`, harbour.dental, booking-v2 form: Tuesday 10 November showed as Sunday 11 October. A form channel alone does not imply the booking-v3 hint defect.

Classification follows `causeOf` in `src/lib/kb/causes.ts`, using the tenant locale and booking-form version from `src/lib/data/tenants/`. It does not follow `meta.browserLocale` or `meta.intakeTag`. Of these reports, intake tagged 356 as parser and 23 as hint. All app/email reports from the day-first tenants belong here; form reports do too unless the tenant uses booking-v3.

Five assigned reports need separate investigation before their root cause is treated as established: `R-41202`, `R-41209`, `R-41236`, `R-41344`, `R-41620`. They describe one-day shifts, an invite before booking, or different days across cities. The supplied code places them here; those descriptions alone do not establish a timezone defect. They are included in the 379, not added on top.

Expected behavior and fix scope:

- Read input according to an explicit tenant date contract, preserving the intended calendar date through booking, invite and reminder generation.
- Reproduce a day-first tenant entering `02/12/2026`: retain 2 December rather than treating it as 12 February. Check a day value above twelve and a month-first tenant as controls.
- Check app, email and booking-v2 form paths. Investigate the original booking and timezone data for the five unusual descriptions before closing their reports.
- Track the booking-v3 hint defect separately. Fixing this parser does not fix a hint that contradicts its form reader.

The KB's “known / one fix queued” status is not evidence of resolution. Reports continued arriving through the export cutoff. Keep this issue open until the relevant flows and subsequent reports verify the fix.

Every assigned ID is recorded in `evidence/analysis.json` under `groups[cause=parser].reportIds`. Rebuild with `npm ci` and `npm run render`. The signed review source is `src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx`; its rendered counterpart is `rendered/kb/decisions/0002-dedupe-by-cause/index.html`.
