import { describe, expect, it } from 'vitest'
import { buildNuxt, loadNuxt } from '@nuxt/kit'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

const currentDir = dirname(fileURLToPath(import.meta.url))
const fixtureDir = resolve(currentDir, '../fixtures/basic')

describe('nuxt-openfeature module integration', () => {
  it('registers runtime config and runtime assets', async () => {
    const nuxt = await loadNuxt({
      cwd: fixtureDir,
      dev: false,
      ready: true
    })

    try {
      await buildNuxt(nuxt)

      const openFeatureRuntime = nuxt.options.runtimeConfig.openFeature as {
        providers?: unknown[]
        publicFlags?: Record<string, unknown>
      }
      const publicRuntime = nuxt.options.runtimeConfig.public?.openFeature as {
        flagRouteBase?: string
      }

      expect(openFeatureRuntime.providers?.length).toBeGreaterThan(0)
      expect(openFeatureRuntime.publicFlags?.['beneficiaries-enabled']).toBe(true)
      expect(publicRuntime.flagRouteBase).toBe('/api/feature-flags')

      const pluginPaths = nuxt.options.plugins.map((plugin) => {
        if (typeof plugin === 'string') {
          return plugin
        }
        return plugin.src
      })
      expect(pluginPaths.some(path => path.includes('openfeature-context.client'))).toBe(true)

      const importsTypeFile = resolve(fixtureDir, '.nuxt/imports.d.ts')
      const importsTypeContent = await readFile(importsTypeFile, 'utf8')
      expect(importsTypeContent.includes('useFeatureFlag')).toBe(true)
    } finally {
      await nuxt.close()
    }
  }, 120000)
})
