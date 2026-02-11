import OpenFeatureModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [OpenFeatureModule],
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
    flagRouteBase: '/api/feature-flags',
    publicFlags: {
      'beneficiaries-enabled': true
    }
  }
})
