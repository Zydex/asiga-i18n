import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { checkLocale, findMissingKeys, flattenKeys } from './missing-keys'

describe('flattenKeys', () => {
  it('flattens nested objects into dot-separated paths', () => {
    const input = {
      a: 'A',
      outer: {
        b_one: 'one',
        b_other: 'other',
        inner: { c: 'C' },
      },
    }
    expect(flattenKeys(input)).toEqual([
      'a',
      'outer.b_one',
      'outer.b_other',
      'outer.inner.c',
    ])
  })
})

describe('findMissingKeys', () => {
  it('returns keys in the source that are absent from the target', () => {
    const source = { a: 'A', b: 'B', nested: { c: 'C', d_one: 'D' } }
    const target = { a: 'A', nested: { c: 'C' } }
    expect(findMissingKeys(source, target)).toEqual(['b', 'nested.d_one'])
  })

  it('ignores keys that only exist in the target', () => {
    expect(findMissingKeys({ a: 'A' }, { a: 'A', extra: 'X' })).toEqual([])
  })

  it('reports leaf keys when the target has a string in place of an object', () => {
    const source = { group: { a: 'A' } }
    const target = { group: 'not an object' }
    expect(findMissingKeys(source, target)).toEqual(['group.a'])
  })
})

describe('checkLocale', () => {
  let root: string
  let sourceDir: string
  let targetDir: string

  const write = (dir: string, namespace: string, json: object) =>
    fs.writeFileSync(path.join(dir, `${namespace}.json`), JSON.stringify(json))

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'missing-keys-'))
    sourceDir = path.join(root, 'source')
    targetDir = path.join(root, 'target')
    fs.mkdirSync(sourceDir)
    fs.mkdirSync(targetDir)
  })

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true })
  })

  it('returns nothing when the target matches the source', () => {
    write(sourceDir, 'common', { a: 'A' })
    write(targetDir, 'common', { a: 'Ä' })
    expect(checkLocale(sourceDir, targetDir)).toEqual([])
  })

  it('reports missing keys per namespace', () => {
    write(sourceDir, 'common', { a: 'A', b: 'B' })
    write(sourceDir, 'jobs', { c: 'C' })
    write(targetDir, 'common', { a: 'Ä' })
    write(targetDir, 'jobs', { c: 'Ç' })
    expect(checkLocale(sourceDir, targetDir)).toEqual([
      { namespace: 'common', fileMissing: false, keys: ['b'] },
    ])
  })

  it('reports every key of a missing namespace file', () => {
    write(sourceDir, 'common', { a: 'A', nested: { b: 'B' } })
    expect(checkLocale(sourceDir, targetDir)).toEqual([
      { namespace: 'common', fileMissing: true, keys: ['a', 'nested.b'] },
    ])
  })
})
