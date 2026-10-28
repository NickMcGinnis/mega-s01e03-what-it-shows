# S01E03 · what it shows

The supplied KB export merges two distinct causes into #4471. The review splits the
412 distinct report IDs into 379 parser reports and 33 booking-v3 hint reports, with
each report assigned exactly once. The source export has 427 rows because paginated
exports overlap. Intake tags would give 371 parser and 41 hint, which are incorrect
cause counts.

- [Parser issue text](tickets/parser.md)
- [Booking-v3 hint issue text](tickets/hint.md)
- [Published parser issue](https://github.com/NickMcGinnis/mega-s01e03-what-it-shows/issues/1)
- [Published hint issue](https://github.com/NickMcGinnis/mega-s01e03-what-it-shows/issues/2)
- [Signed KB page source](src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx)
- [Rendered KB page](rendered/kb/decisions/0002-dedupe-by-cause/index.html)
- [Signed outcome page source](src/routes/kb/incidents/4471-outcome/+page.svx)
- [Rendered outcome page](rendered/kb/incidents/4471-outcome/index.html)
- [All KB pages, rendered](rendered/kb/index.html)
- [Derived evidence and every assigned report ID](evidence/analysis.json)
- [Rendered review as text](evidence/rendered-review.txt)

The original review's signature is `NickMcGinnis / Codex / S01E03 / 2026-10-28`.
Its supplied RenderStamp component computes desk ref `DR-54A4-PER7`. The outcome page
carries the exact signature issued by the course's start-challenge tool, and its
RenderStamp derives that page's desk reference from the issued signature.

## Reproduce

Use Node 24 and run:

```sh
npm ci
npm run render
```

The renderer compiles the actual .svx pages and supplied Svelte components with
mdsvex and Vite, then uses Svelte server rendering. It writes self-contained HTML
with the compiled styles into `rendered/kb/`. It does not launch a server.
These files capture the rendered page; interactive controls are static in this
snapshot. They retain the component's initial values, verdict and case table.
Review ages are computed at render time and reflect 28 October 2026 in this submission.

All 30 original export files are preserved byte for byte. The old accepted decision
remains intact; decision 0002 replaces its subject-only policy and explains why.
The original incident table, timeline and triage components are rendered alongside
the review so their output can be compared with their prose.

## Verification

- All 412 distinct IDs appear in exactly one cause group.
- The 15 overlapping export rows are counted once by ID.
- Tenant lookup and the supplied `Intl.DateTimeFormat` cause logic yield 379 parser
  and 33 hint reports; 38 intake tags disagree with the assigned causes.
- The signed .svx compiles and renders with `DR-54A4-PER7`, with no missing signature.
- The rendered review was visually checked with no browser console errors.
- Five unusual time-related descriptions remain explicitly flagged for investigation;
  their classifier assignment does not establish their underlying root cause.
- The source data ends on 4 October. No claim is made about live reports after that cutoff.

The public GitHub repository and two issues were authorized by the student. The course
accepted the final submission on 28 October 2026. The
[debrief](https://hq.mega.dev/challenges/what-it-shows#debrief) is saved on the course page.

After accepting the tickets, the course exposed a new engineering update on its page:
#4471 closed on 5 October; parser fixed, hint won't fix because booking-v3 was retired.
The outcome page records that evidence. The matching GitHub closure reasons are
`completed` for the parser and `not_planned` for the hint. The accepted decision
record is preserved unchanged.
