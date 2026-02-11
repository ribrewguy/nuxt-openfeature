import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

import { buildEnvFlags, type FlagDefinition } from '../../utils/envFlags'
import { fetchFlagsmithEnvironmentFlags } from '../../plugins/flagsmith'

type DiagnosticFlagDefinition = FlagDefinition & { disabled?: boolean }

type ProviderConfig = {
  type: 'in-memory' | 'env' | 'flagsmith'
  envPrefix?: string
  flags?: Record<string, DiagnosticFlagDefinition>
  options?: Record<string, unknown>
  providerOptions?: Record<string, unknown>
}

const getFlagValue = (definition: DiagnosticFlagDefinition) => {
  if (!definition) {
    return null
  }

  return definition.variants?.[definition.defaultVariant] ?? null
}

const buildInMemoryFlags = (flags?: Record<string, DiagnosticFlagDefinition>) =>
  Object.entries(flags ?? {}).map(([key, definition]) => ({
    key,
    enabled: definition.disabled ? false : true,
    value: getFlagValue(definition)
  }))

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()
  const rawProviders = (runtimeConfig.openFeature as { providers?: unknown } | undefined)?.providers
  const providers = Array.isArray(rawProviders) ? (rawProviders as ProviderConfig[]) : []
  const flagsByProvider = await Promise.all(
    providers.map(async (provider) => {
      if (provider.type === 'env') {
        const envPrefix = provider.envPrefix ?? 'OPENFEATURE_FLAG_'
        const envFlags = buildEnvFlags(envPrefix)
        return {
          type: provider.type,
          flags: buildInMemoryFlags(envFlags)
        }
      }

      if (provider.type === 'flagsmith') {
        const flags = await fetchFlagsmithEnvironmentFlags({
          flagsmith: provider.options
        })

        return {
          type: provider.type,
          flags
        }
      }

      return {
        type: provider.type,
        flags: buildInMemoryFlags(provider.flags)
      }
    })
  )

  return {
    config: {
      flagRouteBase: runtimeConfig.public?.openFeature?.flagRouteBase ?? '/api/feature-flags',
      providers
    },
    flagsByProvider
  }
})
