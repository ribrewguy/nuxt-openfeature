import { defineNuxtPlugin, useState } from '#imports'
import {
  OPENFEATURE_HEADER_LIMITS,
  buildOpenFeatureContextHeaders
} from '../utils/contextHeaders'

type FeatureFlagContext = {
  targetingKey?: string
  traits: Record<string, unknown>
}

export default defineNuxtPlugin(() => {
  const user = useState('auth-user', () => null) as {
    value: {
      id: string
      email: string
      emailVerifiedAt: Date | null
      createdAt: Date
    } | null
  }

  const buildContext = (): FeatureFlagContext => {
    const traits: Record<string, unknown> = {
      locale: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      platform: navigator.platform,
      userAgent: navigator.userAgent
    }

    if (user.value) {
      traits.userId = user.value.id
      traits.email = user.value.email
      traits.emailVerified = user.value.emailVerifiedAt !== null
      traits.userCreatedAt = user.value.createdAt instanceof Date
        ? user.value.createdAt.toISOString()
        : user.value.createdAt
    }

    return {
      targetingKey: user.value?.id,
      traits
    }
  }

  const originalFetch = globalThis.$fetch

  globalThis.$fetch = Object.assign(
    async (request: Parameters<typeof originalFetch>[0], options?: Parameters<typeof originalFetch>[1]) => {
      const context = buildContext()
      const headers = new Headers(options?.headers as HeadersInit | undefined)

      try {
        const encoded = await buildOpenFeatureContextHeaders(context)
        const { MAX_CHUNKS } = OPENFEATURE_HEADER_LIMITS

        // Skip sending headers if context is too large to fit in safe chunks.
        if (encoded.chunkCount && encoded.chunkCount > MAX_CHUNKS) {
          console.warn('[openfeature] Feature flag context too large for headers')
        } else {
          encoded.headers.forEach(([name, value]) => {
            headers.set(name, value)
          })
        }
      } catch (error) {
        console.warn('[openfeature] Failed to encode feature flag context', error)
      }

      return originalFetch(request, {
        ...options,
        headers
      })
    },
    originalFetch
  ) as typeof originalFetch

  return {
    provide: {
      featureFlagContext: buildContext
    }
  }
})
