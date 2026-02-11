import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildEnvFlags } from '../../src/runtime/server/utils/envFlags'

describe('buildEnvFlags', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('maps prefixed env vars to flags', () => {
    vi.stubEnv('OPENFEATURE_FLAG_BENEFICIARIES_ENABLED', 'true')
    vi.stubEnv('OPENFEATURE_FLAG_EXPERIMENT_NAME', 'rollover-v2')

    const flags = buildEnvFlags('OPENFEATURE_FLAG_')

    expect(flags['beneficiaries-enabled']).toBeDefined()
    expect(flags['beneficiaries-enabled']?.defaultVariant).toBe('on')
    expect(flags['experiment-name']?.variants.value).toBe('rollover-v2')
  })
})
