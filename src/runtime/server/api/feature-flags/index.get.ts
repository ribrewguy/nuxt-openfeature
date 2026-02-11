import { defineEventHandler } from 'h3'
import { evaluateFeatureFlag, getFeatureFlagContext, type FeatureFlagValue } from '../../utils/featureFlags'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const context = getFeatureFlagContext(event)
  const publicFlags = (runtimeConfig.openFeature as { publicFlags?: Record<string, FeatureFlagValue> } | undefined)
    ?.publicFlags ?? {}

  const entries = await Promise.all(
    Object.entries(publicFlags).map(async ([flagKey, defaultValue]) => {
      const value = await evaluateFeatureFlag(flagKey, defaultValue, context, { timeoutMs: 750 })
      return [flagKey, value] as const
    })
  )

  return {
    flags: Object.fromEntries(entries)
  }
})
