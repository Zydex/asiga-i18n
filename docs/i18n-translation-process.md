# Translation process

This document describes the repeatable process for adding a new locale (or updating
strings across existing locales) in this repo. It exists so that any future
translation batch — the 12-language EU batch described in the appendix, or any
later one — follows a known procedure instead of being re-derived from scratch.

`locales/en-au/` is the source of truth. Everything else is a translation of it.

## 1. Conventions every locale must follow

These are derived from the existing `locales/en-au/*.json` files and enforced
(where tooling exists) by `format.ts` and `.li18ntrc`.

- **Directory layout**: one directory per locale under `locales/`, containing the
  same 14 namespace files as `en-au`: `apps.json`, `common.json`, `devices.json`,
  `home.json`, `inbox.json`, `jobs.json`, `materials.json`, `onboarding.json`,
  `parts.json`, `rules.json`, `subscription.json`, `templates.json`,
  `timeline.json`, `users.json`.
- **Locale directory naming**: base ISO 639-1 codes for generic languages
  (`de`, `fr`, `it`, ...). Only use a region-tagged code like `en-au` when a
  region-specific variant is genuinely needed, not by default.
- **Only values are translated.** Keys, nesting, and structure must be identical
  to `en-au`. Never translate, rename, add, or remove a key.
- **Preserve verbatim inside values**:
  - `{{placeholder}}` interpolation tokens (e.g. `{{count}}`, `{{fileName}}`).
  - Inline pseudo-HTML tags (e.g. `<a>...</a>`, `<ul><li>...</li></ul>`) — translate
    only the text between tags, never the tags themselves.
  - `\n` newlines — same count, same position.
- **Plural forms are limited to `_zero` / `_one` / `_other`** — exactly the set
  used in `en-au`, nothing more. `format.ts`'s `PLURAL_ORDER` only recognizes
  these three suffixes; do not add additional CLDR plural categories (e.g. Polish
  or Czech grammar would suggest `_few`/`_many`) even where it would be more
  grammatically precise. Pick the most natural translation that fits within
  whichever of the three forms the source key already uses.
- **`_context` suffixes are preserved as-is** (e.g. `_admin`, `_narrow`, or
  numeric contexts like `_0`/`_7`) — same key, translate only the value.

## 2. Translate → back-translate → verify → retry pipeline

Run this per namespace file, per target language:

1. **Translate.** An agent takes the `en-au` source JSON for one namespace and
   produces the target-language JSON, following the conventions in §1.
2. **Back-translate.** A *separate* agent, with no memory of step 1's output,
   translates the produced target-language JSON back into English independently.
3. **Verify.** An agent compares the back-translation against the original
   `en-au` source, per key, and flags any key where meaning, tone, or nuance has
   drifted (structured output: a list of `{key, reason}`).
4. **Retry on failure.** For each flagged key only, generate up to 3 alternate
   phrasings in the target language, back-translate and verify each, and keep
   whichever variant scores best.
5. **Accept with flag.** If no variant fully passes after retries, keep the
   best-scoring variant (the file stays complete and usable) and log an entry to
   the review report (see §4) rather than blocking the run.

Batches spanning many languages × files are naturally suited to the Workflow
tool: pipeline over `(language, file)` jobs so translate/back-translate/verify
for different files overlap instead of running strictly one after another.

## 3. Post-processing checklist (per language)

Run after all 14 files for a language have been produced:

1. `npm run fmt` — canonically deep-sorts the new files the same way
   `en-au`/`pirate` are sorted.
2. `npm run lint` (`li18nt` + `format.ts --dry-run`) — confirms no duplicate or
   conflicting keys and canonical formatting. Fix anything it flags.
3. **Structural parity check**: the new locale's key set must exactly match
   `en-au`'s key set, file by file — no missing or extra keys. This is a plain
   diff, not something to delegate to an agent.

## 4. Review report

Every run produces one consolidated markdown or JSON report listing every
accepted-with-flag translation across all files/languages in that run:
file, key, English source, chosen translation, its back-translation, and the
reason it was flagged. This is what a human reviews — not every string in every
file, just the ones the pipeline itself wasn't fully confident about.

## 5. Phased rollout

Pilot a single language fully through the pipeline first. Manually review a
sample of its output plus its entry in the review report before scaling out to
the remaining languages in the batch. Don't run an entire multi-language batch
unreviewed.

## Appendix: 2026-08 EU batch worklist

Recorded here as an example of the process in use, not as fixed scope of this
document. Locale codes for the 12 largest non-English EU languages, added
2026-08:

| Language | Code |
|---|---|
| German | `de` |
| French | `fr` |
| Italian | `it` |
| Spanish | `es` |
| Polish | `pl` |
| Romanian | `ro` |
| Dutch | `nl` |
| Greek | `el` |
| Portuguese | `pt` |
| Hungarian | `hu` |
| Swedish | `sv` |
| Czech | `cs` |
