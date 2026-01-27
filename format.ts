#!/usr/bin/env node
/// <reference types="node" />
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type PluralForm = 'zero' | 'one' | 'other'

interface ParsedKey {
  original: string
  base: string
  context: string | null
  plural: PluralForm | null
  value: string
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

function parseKey(key: string, value: string): ParsedKey {
  const parts = key.split('_')
  const last = parts[parts.length - 1]

  const isPlural = last in PLURAL_ORDER

  return {
    original: key,
    base: isPlural ? parts.slice(0, -1).join('_') : parts[0],
    context: !isPlural && parts.length > 1 ? parts.slice(1).join('_') : null,
    plural: isPlural ? (last as PluralForm) : null,
    value,
  }
}

const files = getAllJsonFiles(LOCALES_DIR)
files.forEach((file: string) => {
  const raw = fs.readFileSync(file, 'utf8')
  let json: Record<string, string>
  try {
    json = JSON.parse(raw)
  } catch (e) {
    console.error(`Failed to parse JSON in ${file}:`, e)
    return
  }

  const sorted = Object.entries(json)
    .map(([key, value]) => parseKey(key, value))
    .sort((a, b) => {
      // 1. Base key A–Z
      if (a.base !== b.base) {
        return a.base.localeCompare(b.base)
      }

      // 2. Non-context before context
      if (a.context && !b.context) return 1
      if (!a.context && b.context) return -1

      // 3. Context A–Z
      if (a.context && b.context && a.context !== b.context) {
        return a.context.localeCompare(b.context)
      }

      // 4. Plural order
      if (a.plural && b.plural) {
        return PLURAL_ORDER[a.plural] - PLURAL_ORDER[b.plural]
      }

      // 5. Base before plural
      if (a.plural && !b.plural) return 1
      if (!a.plural && b.plural) return -1

      return 0
    })

  const output: Record<string, string> = {}
  for (const item of sorted) {
    output[item.original] = item.value
  }

  fs.writeFileSync(file, JSON.stringify(output, null, 2) + '\n')
  console.log(`Sorted: ${file}`)
})
