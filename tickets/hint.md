Booking-v3 prints `MM/DD/YYYY` for day-first tenants, but the form reads the entry in the tenant's day-first order. People following the hint enter a different date from the one the form interprets.

**Reports covered: 33 distinct report IDs**, received 2026-04-17 through 2026-09-22, across three tenants: alder.physio (`de-DE`), copper.studio (`es-ES`) and pale.harbour (`pt-PT`). These reports were incorrectly merged into support ticket #4471, whose majority cause is the shared parser.

Evidence:

- `R-41230`, copper.studio, form: 6 January became 1 June. Intake tagged this `parser`, but the tenant's day-first locale and booking-v3 form classify it as `hint`.
- `R-41241`, alder.physio, form: 6 August became 8 June.
- `R-41251`, pale.harbour, form: 7 January became 1 July, also tagged `parser` by intake.

Classification follows `DATE_HINT` and `causeOf` in `src/lib/kb/causes.ts`, joined to the tenant directory. Count distinct IDs once. Intake tagged 18 of these as hint and 15 as parser; those guesses are not reliable issue counts. App and email reports from these same tenants belong to the separate parser issue.

Expected behavior and fix scope:

- Make the displayed hint, input validation and form reader agree with the tenant's date order.
- In each of the three affected booking-v3 tenants, verify a 6 January booking from hint through saved booking and generated invite. Check ambiguous input and a day above twelve.
- Include booking-v2 and month-first tenant controls. Do not change the shared parser and assume that fixes this independent form contract.
- Recheck subsequent form reports before marking this issue resolved. The export ending on 4 October does not establish today's desk status.

Every assigned ID is recorded in `evidence/analysis.json` under `groups[cause=hint].reportIds`. Rebuild with `npm ci` and `npm run render`. The signed review source is `src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx`; its rendered counterpart is `rendered/kb/decisions/0002-dedupe-by-cause/index.html`.
