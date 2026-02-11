type RuntimeConfigShape = {
  openFeature?: Record<string, unknown>
  public?: {
    openFeature?: {
      flagRouteBase?: string
    }
    [key: string]: unknown
  }
  [key: string]: unknown
}

declare module '#imports' {
  export const defineNuxtPlugin: (plugin: () => unknown) => unknown
  export const useRuntimeConfig: () => RuntimeConfigShape
  export const useState: <T>(key: string, init?: () => T) => { value: T }
  export const useFeatureFlag: (flagKey: string, options?: unknown) => {
    enabled: { value: boolean }
    pending: { value: boolean }
  }
}

declare module 'nitropack/runtime' {
  export const defineNitroPlugin: (plugin: () => unknown) => unknown
  export const useRuntimeConfig: () => RuntimeConfigShape
}

declare function defineNuxtConfig(config: Record<string, unknown>): Record<string, unknown>
