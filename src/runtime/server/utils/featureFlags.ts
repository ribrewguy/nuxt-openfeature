import { OpenFeature, type EvaluationContext, type JsonValue } from '@openfeature/server-sdk'
import type { H3Event } from 'h3'
import { readOpenFeatureContextHeaders, type OpenFeatureClientContextPayload } from './contextHeaders'

export type FeatureFlagValue = boolean | string | number | JsonValue

type FeatureFlagContextInput = OpenFeatureClientContextPayload

/**
 * Get feature flag context from the X-OF-CTX header (sent by client plugin).
 * Optionally merges with additional server-side context.
 */
export const getFeatureFlagContext = (
  event: H3Event,
  serverContext?: FeatureFlagContextInput
): EvaluationContext | undefined => {
  const clientContext = readOpenFeatureContextHeaders(event)

  // If no client context and no server context, return undefined
  if (!clientContext && !serverContext) {
    return undefined
  }

  // If only one exists, return it
  if (!clientContext && serverContext) {
    return serverContext.targetingKey
      ? { targetingKey: serverContext.targetingKey, ...serverContext.traits }
      : serverContext.traits as EvaluationContext
  }
  if (clientContext && !serverContext) {
    return clientContext.targetingKey
      ? { targetingKey: clientContext.targetingKey, ...clientContext.traits }
      : clientContext.traits as EvaluationContext
  }

  // Merge contexts - server values take precedence for targetingKey
  const targetingKey = serverContext?.targetingKey ?? clientContext?.targetingKey

  // Merge traits
  const mergedTraits = {
    ...(clientContext?.traits ?? {}),
    ...(serverContext?.traits ?? {})
  }

  return targetingKey
    ? { targetingKey, ...mergedTraits }
    : mergedTraits as EvaluationContext
}

type FeatureFlagClient = ReturnType<typeof OpenFeature.getClient>

const withTimeout = <T>(
  evaluation: Promise<T>,
  defaultValue: T,
  timeoutMs?: number
): Promise<T> => {
  if (!timeoutMs || timeoutMs <= 0) {
    return evaluation
  }
  return Promise.race([
    evaluation,
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(defaultValue), timeoutMs)
    })
  ])
}

const evaluateBooleanFlag = (
  client: FeatureFlagClient,
  flagKey: string,
  defaultValue: boolean,
  context?: EvaluationContext,
  timeoutMs?: number
): Promise<boolean> =>
  withTimeout(client.getBooleanValue(flagKey, defaultValue, context), defaultValue, timeoutMs)

const evaluateNumberFlag = (
  client: FeatureFlagClient,
  flagKey: string,
  defaultValue: number,
  context?: EvaluationContext,
  timeoutMs?: number
): Promise<number> =>
  withTimeout(client.getNumberValue(flagKey, defaultValue, context), defaultValue, timeoutMs)

const evaluateStringFlag = (
  client: FeatureFlagClient,
  flagKey: string,
  defaultValue: string,
  context?: EvaluationContext,
  timeoutMs?: number
): Promise<string> =>
  withTimeout(client.getStringValue(flagKey, defaultValue, context), defaultValue, timeoutMs)

const evaluateObjectFlag = (
  client: FeatureFlagClient,
  flagKey: string,
  defaultValue: JsonValue,
  context?: EvaluationContext,
  timeoutMs?: number
): Promise<JsonValue> =>
  withTimeout(client.getObjectValue(flagKey, defaultValue, context), defaultValue, timeoutMs)

export const evaluateFeatureFlag = async (
  flagKey: string,
  defaultValue: FeatureFlagValue,
  context?: EvaluationContext,
  options?: { timeoutMs?: number }
): Promise<FeatureFlagValue> => {
  const client = OpenFeature.getClient()
  const timeoutMs = options?.timeoutMs

  try {
    switch (typeof defaultValue) {
      case 'boolean':
        return await evaluateBooleanFlag(client, flagKey, defaultValue, context, timeoutMs)
      case 'number':
        return await evaluateNumberFlag(client, flagKey, defaultValue, context, timeoutMs)
      case 'string':
        return await evaluateStringFlag(client, flagKey, defaultValue, context, timeoutMs)
      case 'object':
        return await evaluateObjectFlag(client, flagKey, defaultValue, context, timeoutMs)
      default:
        console.warn(`Unsupported feature flag type for key "${flagKey}". Expected boolean, number, string, or object but received ${typeof defaultValue}.`)
        return defaultValue
    }
  } catch (error) {
    console.error('[evaluateFeatureFlag] Feature flag evaluation failed', { flagKey, error })
    return defaultValue
  }
}
