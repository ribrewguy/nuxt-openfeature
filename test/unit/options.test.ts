import { describe, expect, it } from 'vitest'
import { normalizeFlagRouteBase, normalizeOpenFeatureOptions } from '../../src/utils/options'

describe('normalizeFlagRouteBase', () => {
  it('uses default route when empty', () => {
    expect(normalizeFlagRouteBase()).toBe('/api/feature-flags')
    expect(normalizeFlagRouteBase('')).toBe('/api/feature-flags')
  })

  it('normalizes missing leading slash and trailing slash', () => {
    expect(normalizeFlagRouteBase('api/feature-flags/')).toBe('/api/feature-flags')
  })
})

describe('normalizeOpenFeatureOptions', () => {
  it('merges existing and incoming providers', () => {
    const normalized = normalizeOpenFeatureOptions(
      {
        providers: [{ type: 'env' }],
        publicFlags: { b: false }
      },
      {
        providers: [{ type: 'in-memory' }],
        publicFlags: { a: true }
      },
      {
        flagRouteBase: '/api/custom/'
      }
    )

    expect(normalized.runtime.providers).toEqual([{ type: 'in-memory' }, { type: 'env' }])
    expect(normalized.runtime.publicFlags).toEqual({ b: false })
    expect(normalized.public.flagRouteBase).toBe('/api/custom')
  })
})
