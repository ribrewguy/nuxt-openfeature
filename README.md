# @nls/nuxt-openfeature

Nuxt 4 OpenFeature module extracted from the application repo.

## Install

```bash
pnpm add @nls/nuxt-openfeature
```

`.npmrc` (consumer):

```ini
@nls:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
always-auth=true
```

## Usage

```ts
export default defineNuxtConfig({
  modules: ['@nls/nuxt-openfeature'],
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
- Configure repo secret `GITHUB_PACKAGES_TOKEN` (PAT with `write:packages`, and `repo` if org policy requires it)

## Commands

```bash
pnpm install --ignore-workspace
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm pack
```
