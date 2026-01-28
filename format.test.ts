import { describe, expect, it } from 'vitest'
import { deepSortObject, i18nKeySort, parseKey, PluralForm } from './format'

describe('i18nKeySort', () => {
  it('sorts by base key alphabetically', () => {
    const a = {
      base: 'apple',
      context: null,
      plural: null,
      original: 'apple',
      value: 'A',
    }
    const b = {
      base: 'banana',
      context: null,
      plural: null,
      original: 'banana',
      value: 'B',
    }
    expect(i18nKeySort(a, b)).toBeLessThan(0)
    expect(i18nKeySort(b, a)).toBeGreaterThan(0)
  })

  it('sorts by context (null before non-null, then alphabetically)', () => {
    const a = {
      base: 'fruit',
      context: null,
      plural: null,
      original: 'fruit',
      value: 'A',
    }
    const b = {
      base: 'fruit',
      context: 'red',
      plural: null,
      original: 'fruit_red',
      value: 'B',
    }
    expect(i18nKeySort(a, b)).toBeLessThan(0)
    expect(i18nKeySort(b, a)).toBeGreaterThan(0)

    const c = {
      base: 'fruit',
      context: 'yellow',
      plural: null,
      original: 'fruit_yellow',
      value: 'C',
    }
    expect(i18nKeySort(b, c)).toBeLessThan(0)
  })

  it('sorts by plural order: null < zero < one < other', () => {
    const base = 'item'
    const make = (plural: PluralForm | null) => ({
      base,
      context: null,
      plural,
      original: plural ? `${base}_${plural}` : base,
      value: plural,
    })
    expect(i18nKeySort(make(null), make('zero'))).toBeLessThan(0)
    expect(i18nKeySort(make('zero'), make('one'))).toBeLessThan(0)
    expect(i18nKeySort(make('one'), make('other'))).toBeLessThan(0)
    expect(i18nKeySort(make('other'), make(null))).toBeGreaterThan(0)
    expect(
      i18nKeySort(make('zero'), parseKey(`${base}_context`, '')),
    ).toBeLessThan(0)
  })
})

describe('deepSortObject', () => {
  it('sorts a flat object by i18nKeySort', () => {
    const input = {
      fruit_one: 'one',
      fruit: 'base',
      fruit_other: 'other',
      fruit_zero: 'zero',
      fruit_red: 'red',
    }
    const sorted = deepSortObject(input)
    expect(Object.keys(sorted)).toEqual([
      'fruit',
      'fruit_zero',
      'fruit_one',
      'fruit_other',
      'fruit_red',
    ])
  })

  it('sorts nested objects recursively', () => {
    const input = {
      outer: {
        b_one: 1,
        a: 0,
        b_other: 2,
      },
      z: 9,
      a: 1,
    }
    const sorted = deepSortObject(input)
    expect(Object.keys(sorted)).toEqual(['a', 'outer', 'z'])
    expect(Object.keys(sorted.outer)).toEqual(['a', 'b_one', 'b_other'])
  })
})
