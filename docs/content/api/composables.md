---
title: Composables API
---

# Composables API

The module auto-imports:

- `useFeatureFlags()`
- `useFeatureFlag(flagKey, options)`

## `useFeatureFlag`

```ts
const { enabled, value, pending, error, refresh } = useFeatureFlag('my-feature', {
  defaultValue: false
})
```

- `enabled`: normalized boolean state.
- `value`: raw evaluated flag value.
- `pending`: query state.
- `error`: query error object.
- `refresh`: function to refetch flags.
