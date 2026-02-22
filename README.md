# @ribrewguy/nuxt-openfeature

Nuxt 4 OpenFeature module extracted from the application repo.

## Install

```bash
pnpm add @ribrewguy/nuxt-openfeature
```

## Usage

```ts
export default defineNuxtConfig({
  modules: ['@ribrewguy/nuxt-openfeature'],
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
    ],
    publicFlags: {
      'beneficiaries-enabled': true
    }
  }
})
```

## Release

- Version with semver in `package.json`
- Create tag `vX.Y.Z`
- Push tag to trigger publish workflow
- Publish workflow expects `NPM_TOKEN` in GitHub Actions secrets

## Commands

```bash
pnpm install --ignore-workspace
pnpm prepare
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm pack
```

## Git Hooks (Husky)

- `pre-commit`: runs `pnpm secrets:scan`, `pnpm lint`, and `pnpm typecheck`
- `pre-push`: runs `pnpm secrets:scan:full` and `pnpm test`
