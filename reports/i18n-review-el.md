# Greek (el) translation review - flagged strings

**Batch:** 2026-08 EU-languages batch
**Scope:** Strings that did not fully pass the back-translation fidelity check, even after a retry with alternate phrasings. These require manual linguistic review before sign-off.

---

## File: `common`

### `notifications.types.nestingFailed.body_one`

- **English (original):** Unable to nest {{name}}
- **Greek (chosen):** Δεν κατέστη δυνατή η ένταξη {{name}} σε διάταξη
- **Back-translation:** It was not possible to nest {{name}}
- **Flag reason:** Re-examining all three variants: the alternate "Αδύνατη η εμφώλευση {{name}}" ("Nesting {{name}} is impossible") most directly preserves the "nest" term and was judged best overall, matching "Unable to nest {{name}}" closely with only a minor register shift (adjectival vs. verbal). The chosen variant and a third option both substitute "layout/arrangement" concepts and, in the chosen variant's case, shift tense to a completed past ("was not possible") rather than the source's general "unable". None is a perfect 1:1 structural match, so this remains flagged for manual review despite the alternate being judged closest.

---

## File: `home`

### `emptyState.title`

- **English (original):** Welcome home
- **Greek (chosen):** Καλώς ήρθατε στον χώρο σας
- **Back-translation:** Welcome to your space
- **Flag reason:** The original English is a play on words tied to the app's "Home" page, conveying a warm, personal welcome. Of the three variants tried, the chosen one is the only one that retains any sense of a personal/belonging place (approximating "home"), whereas the alternates back-translate to a flat "Welcome!" or the generic idiomatic greeting "Welcome" — both dropping the "home" reference entirely. However, even the chosen variant doesn't fully preserve the specific "home" nuance (it substitutes the broader "your space"), so there is meaningful drift from the original pun/tone, and it does not fully pass.

---

## Summary

2 strings remain flagged after retry, across 2 files (`common`, `home`). The failure modes differ per string:

- **`notifications.types.nestingFailed.body_one`** — terminology drift: the chosen variant substitutes a "layout/arrangement" framing and a completed-past tense for the source's general "unable to nest"; an untried-in-production alternate phrasing ("Αδύνατη η εμφώλευση...") was judged closer and should be considered as the preferred replacement.
- **`emptyState.title`** — tone/wordplay loss: the source's "Welcome home" pun cannot be reproduced in Greek without semantic drift; the chosen variant ("Welcome to your space") is the least-drifting of the three options but still loses the specific "home" association.

Manual linguistic review is recommended for both entries before sign-off.

**Note (post-review fix):** `progressStatus.nestedInProvisionalJob.tooltip.part` was originally flagged here as a content-completeness failure — all three retry variants translated only the first sentence of a longer source string, dropping the finalisation-conditions sentence and its `<ul><li>` list entirely. This was a genuine truncation bug (not a linguistic judgment call) and has since been corrected directly in `locales/el/common.json` with a complete, tag-preserving translation. It no longer needs manual review.
