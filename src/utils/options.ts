import type { OpenFeatureModuleOptions, OpenFeatureProviderConfig } from '../types'

const DEFAULT_FLAG_ROUTE_BASE = '/api/feature-flags'

const trimSlash = (value: string): string => value.replace(/\/$/, '')

export const normalizeFlagRouteBase = (value?: string): string => {
  if (!value || !value.trim()) {
    return DEFAULT_FLAG_ROUTE_BASE
  }

  const trimmed = trimSlash(value.trim())
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

export type NormalizedOpenFeatureOptions = {
  runtime: Required<Pick<OpenFeatureModuleOptions, 'providers' | 'publicFlags'>> & {
    flagRouteBase: string
  }
  public: {
    flagRouteBase: string
  }
}

export const normalizeOpenFeatureOptions = (
  moduleOptions: OpenFeatureModuleOptions,
  existingRuntimeOptions?: OpenFeatureModuleOptions,
  existingPublicOptions?: { flagRouteBase?: string }
): NormalizedOpenFeatureOptions => {
  const flagRouteBase = normalizeFlagRouteBase(moduleOptions.flagRouteBase || existingPublicOptions?.flagRouteBase)
  const existingProviders = existingRuntimeOptions?.providers ?? []
  const incomingProviders = moduleOptions.providers ?? []
  const providers: OpenFeatureProviderConfig[] = [...existingProviders, ...incomingProviders]

  return {
    runtime: {
      providers,
      publicFlags: moduleOptions.publicFlags ?? existingRuntimeOptions?.publicFlags ?? {},
      flagRouteBase
    },
    public: {
      flagRouteBase
    }
  }
}

export { DEFAULT_FLAG_ROUTE_BASE }
