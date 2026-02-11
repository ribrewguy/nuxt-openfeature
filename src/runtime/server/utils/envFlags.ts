type FlagValue = boolean | string | number

type FlagDefinition = {
  variants: Record<string, FlagValue>
  defaultVariant: string
  disabled: boolean
}

const normalizeEnvFlagValue = (rawValue: string): FlagValue => {
  const normalized = rawValue.trim().toLowerCase()

  if (normalized === 'true' || normalized === '1') {
    return true
  }

  if (normalized === 'false' || normalized === '0') {
    return false
  }

  return rawValue
}

const normalizeEnvFlagKey = (rawKey: string): string =>
  rawKey
    .trim()
    .toLowerCase()
    // TODO: revisit normalization rules once flag naming conventions are finalized.
    .replace(/__/g, '-')
    .replace(/_/g, '-')

const toFlagDefinition = (value: FlagValue): FlagDefinition => {
  if (typeof value === 'boolean') {
    return {
      variants: {
        on: true,
        off: false
      },
      defaultVariant: value ? 'on' : 'off',
      disabled: false
    }
  }

  return {
    variants: {
      value
    },
    defaultVariant: 'value',
    disabled: false
  }
}

export const buildEnvFlags = (envPrefix: string): Record<string, FlagDefinition> => {
  const flags: Record<string, FlagDefinition> = {}

  for (const [key, rawValue] of Object.entries(process.env)) {
    if (!key.startsWith(envPrefix) || rawValue === undefined) {
      continue
    }

    const flagKey = normalizeEnvFlagKey(key.slice(envPrefix.length))
    flags[flagKey] = toFlagDefinition(normalizeEnvFlagValue(rawValue))
  }

  return flags
}

export type { FlagDefinition, FlagValue }
