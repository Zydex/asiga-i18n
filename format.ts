import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Parse command line args for --dry-run
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Output formatting colours
const CONSOLE_GREEN = '\x1b[42m'
const CONSOLE_CYAN = '\x1b[36m'
const CONSOLE_RESET = '\x1b[0m'

type PluralForm = 'zero' | 'one' | 'other'

interface ParsedKey {
  original: string
  base: string
  context: string | null
  plural: PluralForm | null
  value: any
}

const PLURAL_ORDER: Record<PluralForm, number> = {
  zero: 0,
  one: 1,
  other: 2,
}
const LOCALES_DIR = path.join(__dirname, 'locales')

function getAllJsonFiles(dir: string): string[] {
  let results: string[] = []
  const list = fs.readdirSync(dir)
  list.forEach((file: string) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(filePath))
    } else if (file.endsWith('.json')) {
      results.push(filePath)
    }
  })
  return results
}

function parseKey(key: string, value: any): ParsedKey {
  const parts = key.split('_')
  const last = parts[parts.length - 1]

  const isPlural = last in PLURAL_ORDER && parts.length > 1

  return {
    original: key,
    base: isPlural ? parts.slice(0, -1).join('_') : parts[0],
    context: !isPlural && parts.length > 1 ? parts.slice(1).join('_') : null,
    plural: isPlural ? (last as PluralForm) : null,
    value,
  }
}



// Recursively sort all object keys (deep sort), using i18n key sort for flat string objects
function deepSortObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(deepSortObject)
    } else if (obj && typeof obj === 'object' && obj.constructor === Object) {
      const sorted = Object.entries(obj)
        .map(([key, value]) => parseKey(key, value))
        .sort(i18nKeySort)
      const result: any = {}
      for (const item of sorted) {
        // If the value is an object (not a string), deepSort it
        if (item.value && typeof item.value === 'object' && typeof item.value !== 'string' && item.value.constructor === Object) {
          result[item.original] = deepSortObject(item.value)
        } else {
          result[item.original] = item.value
        }
      }
      return result
    }
    return obj
}

// Custom i18n key sort: group base/context, then all plural forms in PLURAL_ORDER, then next base/context, etc.
function i18nKeySort(a: ParsedKey, b: ParsedKey): number {
  // 1. Base key A–Z
  if (a.base !== b.base) {
    return a.base.localeCompare(b.base)
  }

  // 2. Context A–Z (null before non-null)
  if (a.context !== b.context) {
    if (a.context === null) return -1
    if (b.context === null) return 1
    return a.context.localeCompare(b.context)
  }

  // 3. Plural order: base/context first, then zero, one, other
  if (a.plural === b.plural) return 0
  if (a.plural === null) return -1
  if (b.plural === null) return 1
  return PLURAL_ORDER[a.plural] - PLURAL_ORDER[b.plural]
}

const files = getAllJsonFiles(LOCALES_DIR)
let needsFormatting = false
let unchangedFiles = 0
files.forEach((file: string) => {
  const raw = fs.readFileSync(file, 'utf8')
  let json: any
  try {
    json = JSON.parse(raw)
  } catch (e) {
    console.error(`Failed to parse JSON in ${file}:`, e)
    return
  }


  // Always use deepSortObject, which now handles both flat and nested cases
  const output = deepSortObject(json)
  const formatted = JSON.stringify(output, null, 2) + '\n'
  if (raw !== formatted) {
    needsFormatting = true
    if (!dryRun) {
      fs.writeFileSync(file, formatted)
      console.log(`Sorted: ${file}`)
    } else {
      console.log(`Would sort: ${file}`)
    }
  } else {
    if (!dryRun) {
      unchangedFiles ++
    }
  }
})

console.log(`Checked ${CONSOLE_GREEN}${files.length}${CONSOLE_RESET} files. ${CONSOLE_GREEN}${unchangedFiles}${CONSOLE_RESET} already formatted. ${CONSOLE_CYAN}${files.length - unchangedFiles}${CONSOLE_RESET} needed formatting.`)

if (dryRun) {
  if (needsFormatting) {
    process.exit(1)
  } else {
    process.exit(0)
  }
}

