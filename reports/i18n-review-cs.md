# Czech (cs) translation review - flagged strings

Covers the 2026-08 EU-languages batch.

This report lists strings that, even after a retry with alternate phrasings, still did not fully pass the back-translation fidelity check and require manual review.

## file: common

### `button.dismiss`

- **English original:** Dismiss
- **Chosen translation:** Odebrat
- **Back-translation:** Remove
- **Reason flagged:** English 'Dismiss' (for a button/notification action) means to make something go away / close it without necessarily deleting it. None of the three Czech options is a precise match: 'Zamítnout' means 'reject/decline' (wrong sense entirely, more like rejecting a request), 'Odstranit' means 'delete' (implies permanent removal of data, too strong), and 'Odebrat' means 'remove/take away' which is the closest of the three but still carries a slightly different connotation (removal from a list) rather than 'dismiss' (closing/clearing a notice). Some meaning drift remains.

### `notifications.actions.dismiss`

- **English original:** Dismiss
- **Chosen translation:** Odebrat
- **Back-translation:** Remove
- **Reason flagged:** Same set and same issue as button.dismiss: 'Zamítnout' (reject) is a false-friend mismatch for a notification dismiss action, 'Odstranit' (delete) overstates permanence, and 'Odebrat' (remove) is the closest available option but still leans toward 'removing an item' rather than the lighter 'dismiss/close' sense of the English source, so some nuance drift remains.

## Summary

2 strings flagged across 1 file (`common`), both relating to the same underlying issue: no available Czech candidate cleanly captures the "dismiss/close without deleting" sense of the English source. Recommend manual review with a native Czech speaker to confirm whether 'Odebrat' is acceptable as a pragmatic best-fit, or whether a different term (e.g. 'Skrýt' - hide) better matches the intended UI behavior.
