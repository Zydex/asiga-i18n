# French (fr) translation review - flagged strings

**Batch:** 2026-08 EU-languages batch
**Scope:** Strings that did not fully pass the back-translation fidelity check, even after a retry with alternate phrasings. These require manual linguistic review before sign-off.

---

## File: `apps`

### `message.unlink`

- **English (original):** Your organisation will no longer receive parts from the app.
- **French (chosen):** Votre organisation ne recevra plus de pièces produites par l'application.
- **Back-translation:** Your organisation will no longer receive parts produced by the app.
- **Flag reason:** Source is 'receive parts from the app' with no qualifier on how parts are made. All three variants insert an unwarranted descriptor (imprimées/produites/fabriquées). 'produites par' (produced by) is the most generic/neutral addition of the three and also keeps closest to describing the app as origin of the parts, whereas 'imprimées' (printed) wrongly narrows this to 3D-printing specifically and 'fabriquées' (manufactured) implies heavier industrial production. Still, since none reproduces the unqualified 'from the app' of the source, there is meaningful drift and it does not fully pass.

### `message.unlink_one`

- **English (original):** Your organisation will no longer receive parts from the app.
- **French (chosen):** Votre organisation ne recevra plus de pièces produites par l'application.
- **Back-translation:** Your organisation will no longer receive parts produced by the app.
- **Flag reason:** Identical source and variant set to message.unlink. 'produites par' is the least-specific/least-drifting of the three added descriptors, but it still adds a production-agency claim ('produced by') absent from the plain 'from the app' of the source, so it does not fully pass.

### `message.unlink_other`

- **English (original):** Your organisation will no longer receive parts from the apps.
- **French (chosen):** Votre organisation ne recevra plus de pièces produites par les applications.
- **Back-translation:** Your organisation will no longer receive parts produced by the apps.
- **Flag reason:** Same reasoning as message.unlink applied to the plural 'apps' form: 'produites par' is the least intrusive addition among 'imprimées'/'produites'/'fabriquées', but still adds specificity not present in the neutral source 'from the apps', so meaningful drift remains.

### `message.unlink_name_one`

- **English (original):** Your organisation will no longer receive parts from the {{name}}.
- **French (chosen):** Votre organisation ne recevra plus de pièces produites par {{name}}.
- **Back-translation:** Your organisation will no longer receive parts produced by {{name}}.
- **Flag reason:** Source 'from the {{name}}' carries no manufacturing-method qualifier. 'produites par' best approximates a neutral origin relationship compared to the narrower 'imprimées' (printed) or heavier 'fabriquées' (manufactured), but it still attributes production agency to {{name}} that the English does not explicitly state, so it's the best but not a perfect match.

### `message.unlink_nameOrg_one`

- **English (original):** {{org}} will no longer receive parts from the {{name}}.
- **French (chosen):** {{org}} ne recevra plus de pièces produites par {{name}}.
- **Back-translation:** {{org}} will no longer receive parts produced by {{name}}.
- **Flag reason:** Same pattern as message.unlink_name_one: source only says 'from {{name}}'. 'produites par' is the mildest addition of the three options, but still introduces a production/agency nuance beyond the plain source preposition, so some drift remains.

### `message.unlink_org_other`

- **English (original):** {{org}} will no longer receive parts from the apps.
- **French (chosen):** {{org}} ne recevra plus de pièces produites par les applications.
- **Back-translation:** {{org}} will no longer receive parts produced by the apps.
- **Flag reason:** Source 'from the apps' has no manufacturing qualifier; 'produites par' is the least specific/least drifting of the three variants offered, but still adds a 'produced by' relationship not present in the source, so it is best-of-set but not a full pass.

### `tooltips.apps`

- **English (original):** Lists all the apps that the Funnel supports. Use these to automatically receive parts from third party services.
- **French (chosen):** Répertorie toutes les applications prises en charge par Funnel. Utilisez-les pour recevoir automatiquement des pièces produites par des services tiers.
- **Back-translation:** Lists all the apps that Funnel supports. Use these to automatically receive parts produced by third-party services.
- **Flag reason:** Source only says 'receive parts from third party services', without specifying how the parts are made. Of the three options, 'produites par' (produced by) is the most neutral/generic addition, less presumptive than 'imprimées' (printed, wrongly implies 3D printing specifically) or 'fabriquées' (manufactured, implies heavier industrial process). Still adds a causation nuance ('produced by') absent from the source's plain 'from', so it is best-in-set but not a full match.

### `tooltips.connectedApps`

- **English (original):** Lists all the apps that have permission to send parts to the Funnel.
- **French (chosen):** Répertorie toutes les applications autorisées à envoyer des pièces produites vers Funnel.
- **Back-translation:** Lists all the apps that have permission to send produced parts to Funnel.
- **Flag reason:** Source says only 'send parts to the Funnel' with no qualifier. 'produites' is the least specific/least drifting insertion compared to 'imprimées' (printed) or 'fabriquées' (manufactured), but it still adds an unstated production descriptor to 'parts', so it does not fully preserve the original's neutral phrasing.

---

## Summary

All 8 flagged strings share a common pattern: the English source uses a neutral preposition ("from"/"to") describing the relationship between parts and an app/service, with no indication of how those parts are produced. The chosen French translations consistently insert "produit(e)(s) par" ("produced by"), which was judged the least-drifting option among the alternates tried (versus "imprimées" — wrongly implies 3D printing — and "fabriquées" — implies heavier industrial manufacturing), but it still adds an agency/production nuance not present in the source. Manual review should decide whether to accept "produit(e)(s) par" as good enough, or find a phrasing (e.g. "en provenance de" / "de la part de") that preserves the source's neutrality without any production qualifier.
