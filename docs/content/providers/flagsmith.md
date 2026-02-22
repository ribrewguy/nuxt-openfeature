---
title: Flagsmith Provider
---

# Flagsmith Provider

The module supports Flagsmith using `@openfeature/flagsmith-provider`.

```ts
openFeature: {
  providers: [
    {
      type: 'flagsmith',
      options: {
        apiUrl: process.env.FLAGSMITH_URL,
        environmentKey: process.env.FLAGSMITH_ENVIRONMENT_KEY
      },
      providerOptions: {
        useFlagsmithDefaults: false
      }
    }
  ]
}
```

## Safety Behavior

- Provider initialization errors do not crash request handling.
- Flag evaluation failures return configured defaults.
