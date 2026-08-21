# Hungarian (hu) translation review - flagged strings

This report covers the 2026-08 EU-languages batch. It lists strings that, even after a retry with alternate phrasings, still did not fully pass the back-translation fidelity check and require manual review.

---

## File: `jobs`

### `message.noJobsToReview`

- **English (original):** Provisional jobs that have been promoted will appear here. Upload parts in the inbox to get started.
- **Hungarian (chosen translation):** Az előléptetett ideiglenes munkák itt fognak megjelenni. A kezdéshez töltsön fel alkatrészeket a bejövő mappába.
- **Back-translation:** The promoted provisional jobs will appear here. To get started, upload parts to the incoming folder.
- **Reason flagged:** Variant [2] is the only one using future tense (fognak megjelenni = "will appear"), matching the source's future tense, whereas [0] and [1] both shift to present tense ("appear"). However, [2] renders "inbox" as "bejövő mappa" (incoming folder), a generic/literal translation rather than the more idiomatic "Beérkező" used in [1] (closer to a proper Inbox label), so a minor nuance drift remains — hence not a full pass.

---

## Summary

- **Total flagged strings:** 1
- **Files affected:** jobs
