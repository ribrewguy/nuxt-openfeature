export default defineNuxtConfig({
  modules: ['../src/module'],
  openFeature: {
    providers: [
      {
        type: 'in-memory',
        flags: {
          'beneficiaries-enabled': {
            variants: { on: true, off: false },
            defaultVariant: 'on'
          }
        }
      }
    ],
    publicFlags: {
      'beneficiaries-enabled': true
    }
  }
})
