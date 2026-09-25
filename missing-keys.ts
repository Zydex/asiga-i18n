import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Parse command line args for --no-hint (used when the output is captured as a Claude prompt)
const args = process.argv.slice(2)
const showHint = !args.includes('--no-hint')

// Output formatting colours, disabled by the NO_COLOR convention (https://no-color.org)
const colour = (code: string) => (process.env.NO_COLOR ? '' : code)
const CONSOLE_RED = colour('\x1b[31m')
const CONSOLE_GREEN = colour('\x1b[32m')
const CONSOLE_YELLOW = colour('\x1b[33m')
const CONSOLE_CYAN = colour('\x1b[36m')
const CONSOLE_BOLD_HIGHLIGHT = colour('\x1b[1;30;43m')
const CONSOLE_RESET = colour('\x1b[0m')

// Target directory containing locale JSON files
const LOCALES_DIR = path.join(__dirname, 'locales')

/** Locale that all other locales are compared against */
const SOURCE_LOCALE = 'en-au'

/** Missing keys for a single namespace file within a locale */
interface MissingNamespace {
  namespace: string
  /** True when the whole namespace file is absent from the locale */
  fileMissing: boolean
  keys: string[]
}

/** Recursively flatten a nested translation object into dot-separated key paths */
function flattenKeys(obj: any, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && value.constructor === Object) {
      return flattenKeys(value, fullKey)
    }
    return [fullKey]
  })
}

/** Get the keys present in `source` that are absent from `target` */
function findMissingKeys(source: any, target: any): string[] {
  const targetKeys = new Set(flattenKeys(target))
  return flattenKeys(source).filter((key) => !targetKeys.has(key))
}

/** Get the namespace names (JSON file names without extension) in a locale directory */
function getNamespaces(localeDir: string): string[] {
  return fs
    .readdirSync(localeDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.basename(file, '.json'))
    .sort()
}

/** Read and parse a namespace JSON file */
function readNamespace(localeDir: string, namespace: string): any {
  return JSON.parse(
    fs.readFileSync(path.join(localeDir, `${namespace}.json`), 'utf8'),
  )
}

/** Compare every namespace of a target locale against the source locale */
function checkLocale(
  sourceDir: string,
  targetDir: string,
): MissingNamespace[] {
  const targetNamespaces = new Set(getNamespaces(targetDir))
  const results: MissingNamespace[] = []

  for (const namespace of getNamespaces(sourceDir)) {
    const source = readNamespace(sourceDir, namespace)
    if (!targetNamespaces.has(namespace)) {
      results.push({ namespace, fileMissing: true, keys: flattenKeys(source) })
      continue
    }
    const keys = findMissingKeys(source, readNamespace(targetDir, namespace))
    if (keys.length > 0) {
      results.push({ namespace, fileMissing: false, keys })
    }
  }

  return results
}

function main(): void {
  const sourceDir = path.join(LOCALES_DIR, SOURCE_LOCALE)
  const locales = fs
    .readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== SOURCE_LOCALE)
    .map((entry) => entry.name)
    .sort()

  let totalMissing = 0
  let failedLocales = 0

  for (const locale of locales) {
    const localeDir = path.join(LOCALES_DIR, locale)
    if (getNamespaces(localeDir).length === 0) {
      console.log(
        `${CONSOLE_YELLOW}Skipped ${locale}: no namespace files${CONSOLE_RESET}`,
      )
      continue
    }

    const results = checkLocale(sourceDir, localeDir)
    if (results.length === 0) {
      console.log(`${CONSOLE_GREEN}✓ ${locale}${CONSOLE_RESET}`)
      continue
    }

    failedLocales++
    const count = results.reduce((sum, r) => sum + r.keys.length, 0)
    totalMissing += count
    console.log(
      `${CONSOLE_RED}✗ ${locale}: ${count} missing key(s)${CONSOLE_RESET}`,
    )
    for (const { namespace, fileMissing, keys } of results) {
      const suffix = fileMissing ? ' (file missing)' : ''
      console.log(`  ${CONSOLE_CYAN}${namespace}.json${CONSOLE_RESET}${suffix}`)
      keys.forEach((key) => console.log(`    - ${key}`))
    }
  }

  // Summary output
  console.log(
    `Checked ${locales.length} locale(s) against ${SOURCE_LOCALE}. ` +
      (totalMissing > 0
        ? `${CONSOLE_RED}${totalMissing} missing key(s) across ${failedLocales} locale(s).${CONSOLE_RESET}`
        : `${CONSOLE_GREEN}No missing keys.${CONSOLE_RESET}`),
  )

  if (totalMissing > 0 && showHint) {
    console.log(
      `\n${CONSOLE_BOLD_HIGHLIGHT} run \`npm run translate-missing-keys\` to auto-generate translation values with Claude. ${CONSOLE_RESET}`,
    )
  }

  // Exit code for CI integration
  process.exit(totalMissing > 0 ? 1 : 0)
}

// Only run when executed directly, so tests can import without side effects
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main()
}

// Export functions for testing
export { checkLocale, findMissingKeys, flattenKeys, MissingNamespace }
