import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Translation process document used as the basis of the prompt
const PROCESS_DOC = path.join(__dirname, 'docs', 'i18n-translation-process.md')

/** Build the initial Claude prompt from the translation process and the missing keys report */
function buildPrompt(processDoc: string, report: string): string {
  return [
    'Translate the missing i18n keys listed in the report below, following the translation process document.',
    '',
    '- `locales/en-au/` is the source; add each missing key to the listed locale and namespace file using the `en-au` value as the source text.',
    '- Only add the missing keys. Do not change existing translations.',
    '- Run the translate → back-translate → verify → retry pipeline per key rather than per whole file.',
    // `npm run lint` is omitted as its li18nt path (/app/locales) only resolves inside Docker
    '- When done, run `npm run fmt` then `npm run check-missing-keys` and fix anything it flags.',
    '',
    '<translation-process>',
    processDoc.trim(),
    '</translation-process>',
    '',
    '<missing-keys-report>',
    report.trim(),
    '</missing-keys-report>',
  ].join('\n')
}

function main(): void {
  // Run the check without colours so the report is clean prompt text
  const check = spawnSync(
    'npm',
    ['run', '--silent', 'check-missing-keys', '--', '--no-hint'],
    {
      cwd: __dirname,
      encoding: 'utf8',
      env: { ...process.env, NO_COLOR: '1' },
      shell: process.platform === 'win32',
    },
  )

  if (check.status === 0) {
    console.log('No missing keys, nothing to translate.')
    process.exit(0)
  }

  // A non-zero exit with stderr output means the check itself failed (e.g. invalid JSON)
  if (check.error || check.stderr.trim()) {
    console.error('check-missing-keys failed to run:')
    console.error(check.error ?? check.stderr)
    process.exit(check.status ?? 1)
  }

  const prompt = buildPrompt(fs.readFileSync(PROCESS_DOC, 'utf8'), check.stdout)

  // Pass the prompt as an argument (not stdin) so Claude opens an interactive session
  const claude = spawnSync('claude', [prompt], {
    cwd: __dirname,
    stdio: 'inherit',
  })

  if (claude.error) {
    console.error(
      'Failed to launch Claude Code. Is `claude` installed and on your PATH?',
    )
    console.error(claude.error)
    process.exit(1)
  }

  process.exit(claude.status ?? 0)
}

// Only run when executed directly, so tests can import without side effects
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main()
}

// Export functions for testing
export { buildPrompt }
