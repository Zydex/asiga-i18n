# German (de) translation review - flagged strings

_Covers the 2026-08 pilot run._

The following strings still did not fully pass the back-translation fidelity check after a retry with alternate phrasings, and are flagged here for manual review.

## File: `users`

### `alt.addUsers`

- **English original:** Add Users
- **Chosen German translation:** Mehrere Benutzer hinzufügen
- **Back-translation:** Add multiple users
- **Reason flagged:** Source is the plain "Add Users" with no qualifier. None of the three variants reproduce that exactly. Of the three, "mehrere" (multiple) merely makes explicit the plurality already implied by "Users", so it drifts least. "Neue Benutzer" (new users) introduces an unrelated notion of novelty/status not present in the source, and "Benutzer gemeinsam hinzufügen" (add users jointly/together) is an awkward near-mistranslation implying a collective action. Because "multiple" is still an added qualifier absent from the English, this does not fully pass.

### `button.remove_other`

- **English original:** Remove Users
- **Chosen German translation:** Mehrere Benutzer entfernen
- **Back-translation:** Remove multiple users
- **Reason flagged:** Source "Remove Users" is a bare plural with no qualifier, and this is the ICU `_other` (count>1) form. "Mehrere" (multiple) directly encodes the plural/count-based distinction the key represents without introducing a new concept, whereas "Ausgewählte" (selected) adds a UI-selection-state idea not in the source, and "Diese" (these) adds an unwarranted demonstrative reference. Still, since "multiple" is not literally in the two-word source, it counts as drift and does not fully pass.

### `title.invite`

- **English original:** Invite users
- **Chosen German translation:** Mehrere Benutzer einladen
- **Back-translation:** Invite multiple users
- **Reason flagged:** Source "Invite users" is unqualified plural. As with `alt.addUsers`, "mehrere" only reinforces existing plurality (least drift), while "neue" (new) adds an unrelated identity/novelty claim and "gemeinsam" (together/jointly) is an odd, non-idiomatic rendering. The added "multiple" still isn't in the two-word original, so it doesn't fully pass.
