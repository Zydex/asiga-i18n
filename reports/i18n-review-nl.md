# Dutch (nl) translation review - flagged strings

_Covers the 2026-08 EU-languages batch._

The following strings still did not fully pass the back-translation fidelity check after a retry with alternate phrasings, and are flagged here for manual review.

## File: `jobs`

### `status.awaitingApproval.tooltip`

- **English original:** The finalised Job is ready to review.
- **Chosen Dutch translation:** De taak is afgerond voorbereid en klaar om te worden beoordeeld.
- **Back-translation:** The job has been fully prepared and is ready to be reviewed.
- **Reason flagged:** Source: 'The finalised Job is ready to review.' All three candidates replace the simple, already-established pattern 'afgeronde taak' (finalised job — confirmed by the existing nl/jobs.json translation of this exact string, 'De afgeronde taak is klaar om te worden beoordeeld.') with a different concept. Variant [0] ('De taak is klaar voor beoordeling nu de indeling is afgerond.' -> 'The job is ready for review now that the layout has been finalized.') shifts what is finalised from the Job itself to its 'indeling' (layout/nesting arrangement) — a term this same file uses for the distinct 'preparing' status, so it wrongly conflates two different job states and drifts furthest from the source. Variant [1] ('De voorbereiding van de taak is afgerond en de taak is klaar om te worden beoordeeld.' -> 'The preparation of the job has been completed and the job is ready to be reviewed.') is faithful in gist but adds an unstated 'preparation' clause, repeats 'taak' redundantly, and turns the original's tight single-clause tooltip into a wordier two-clause sentence, losing tone/concision. Variant [2] keeps the concise single-subject, two-predicate structure closest to the source's compactness and avoids the 'indeling'/layout confusion of [0], making it the best of the three. However it still swaps 'finalised' for 'voorbereid' (prepared), a term already used elsewhere in the file for the earlier, distinct 'preparing' status — so it introduces a nuance/terminology drift (prepared vs. finalised) and could blur two states that are meant to read as different in the UI. Because of that residual drift, it does not fully pass.
