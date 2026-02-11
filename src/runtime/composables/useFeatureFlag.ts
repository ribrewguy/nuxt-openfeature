import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useState, useRuntimeConfig } from '#imports'

export type UseFeatureFlagOptions = {
  defaultValue?: FeatureFlagValue
}

type JsonPrimitive = string | number | boolean | null
type JsonObject = { [key: string]: JsonValue }
type JsonArray = JsonValue[]
type JsonValue = JsonPrimitive | JsonObject | JsonArray

export type FeatureFlagValue = boolean | string | number | JsonValue

type FeatureFlagsResponse = {
  flags: Record<string, FeatureFlagValue>
}

export const useFeatureFlags = (_options: UseFeatureFlagOptions = {}) => {
  const runtimeConfig = useRuntimeConfig()
  const flagRouteBase = runtimeConfig.public?.openFeature?.flagRouteBase ?? '/api/feature-flags'

  // Get user ID for query key (so flags refetch when user changes)
  const user = useState('auth-user', () => null) as { value: { id: string } | null }

  // Query key includes user ID so flags refetch on login/logout
  const queryKey = computed(() => ['feature-flags', user.value?.id ?? 'anonymous'])

  return useQuery({
    queryKey: queryKey as unknown as readonly unknown[],
    queryFn: async () => {
      // Context is automatically added via X-OF-CTX header by the plugin
      const response = await $fetch<FeatureFlagsResponse>(flagRouteBase.replace(/\/$/, ''), {
        credentials: 'include'
      })
      return response.flags ?? {}
    },
    enabled: import.meta.client
  })
}

export const useFeatureFlag = (flagKey: string, options: UseFeatureFlagOptions = {}) => {
  const defaultValue = options.defaultValue ?? false
  const query = useFeatureFlags(options) as ReturnType<typeof useFeatureFlags>
  const value = computed<FeatureFlagValue | undefined>(() => {
    const flags = query.data.value ?? {}
    return flagKey in flags ? flags[flagKey] : undefined
  })
  const enabled = computed(() => {
    const v = value.value
    // If flag exists and is boolean, use it
    if (typeof v === 'boolean') {
      return v
    }
    // If flag exists but is non-boolean, evaluate truthiness
    if (v !== undefined) {
      return Boolean(v)
    }
    // Flag doesn't exist - use default
    if (typeof defaultValue === 'boolean') {
      return defaultValue
    }
    return Boolean(defaultValue)
  })

  return {
    value,
    enabled,
    pending: query.isPending,
    error: query.error,
    refresh: query.refetch
  }
}
