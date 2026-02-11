import { defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { EvaluationContext } from '@openfeature/server-sdk'

import { evaluateFeatureFlag } from '../../utils/featureFlags'

const normalizeBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()

    if (normalized === 'true' || normalized === '1') {
      return true
    }

    if (normalized === 'false' || normalized === '0') {
      return false
    }
  }

  if (typeof value === 'boolean') {
    return value
  }

  return undefined
}

const parseContext = (rawContext: unknown): EvaluationContext | undefined => {
  if (!rawContext || typeof rawContext !== 'string') {
    return undefined
  }

  try {
    const parsed = JSON.parse(rawContext)
    if (parsed && typeof parsed === 'object') {
      return parsed as EvaluationContext
    }
  } catch (error) {
    console.warn('Failed to parse feature flag context', { error })
  }

  return undefined
}

export default defineEventHandler(async (event) => {
  const flagKey = getRouterParam(event, 'key')

  if (!flagKey) {
    return {
      enabled: false
    }
  }

  const query = getQuery(event)
  const defaultValue = normalizeBoolean(query.default) ?? false

  const context = parseContext(query.context)
  const enabled = await evaluateFeatureFlag(flagKey, defaultValue, context)

  return {
    enabled
  }
})
