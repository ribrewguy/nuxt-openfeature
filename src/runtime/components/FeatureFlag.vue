<script setup lang="ts">
import { useFeatureFlag } from '#imports'
import type { FeatureFlagValue } from '../composables/useFeatureFlag'

type FeatureFlagProps = {
  name: string
  default?: FeatureFlagValue
}

const props = defineProps<FeatureFlagProps>()

const { enabled, pending } = useFeatureFlag(props.name, {
  defaultValue: props.default
})
</script>

<template>
  <slot v-if="!pending && enabled" />
  <slot
    v-else-if="!pending"
    name="fallback"
  />
</template>
