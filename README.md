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
pnpm install
pnpm prepare
pnpm dev
pnpm docs:dev
pnpm lint
pnpm docs:lint
pnpm typecheck
pnpm docs:typecheck
pnpm test
pnpm build
pnpm docs:build
pnpm pack
```

## Documentation

- Source: `docs/`
- Local docs dev server: `pnpm docs:dev`
- Production hosting target: Vercel (deployment wiring in follow-up bead)

## Git Hooks (Husky)

- `pre-commit`: runs `pnpm secrets:scan`, `pnpm lint`, and `pnpm typecheck`
- `pre-push`: runs `pnpm secrets:scan:full` and `pnpm test`
