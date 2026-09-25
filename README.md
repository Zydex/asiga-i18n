# asiga-i18n

Asiga i18n Internationalisation.

## Formatting

`npm run fmt`: Will sort keys in expected order by the front-end [18next-cli](https://github.com/i18next/i18next-cli) key extractor.

## Missing keys

`npm run check-missing-keys`: Lists every key in `locales/en-au` (the source locale) that is missing from each other locale, and exits non-zero if any are missing. Runs in CI alongside linting.

## Adding translations

See [docs/i18n-translation-process.md](docs/i18n-translation-process.md) for the process used to add or update a locale.
