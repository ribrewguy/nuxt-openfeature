import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/module',
    './src/index',
    './src/types',
    {
      builder: 'mkdist',
      input: './src/runtime',
      outDir: './dist/runtime'
    }
  ],
  clean: true,
  declaration: true,
  externals: [
    '@nuxt/kit',
    '@openfeature/server-sdk',
    '@openfeature/flagsmith-provider',
    'flagsmith-nodejs',
    'nitropack/runtime',
    'h3',
    '#imports',
    'vue',
    '@tanstack/vue-query'
  ]
})
