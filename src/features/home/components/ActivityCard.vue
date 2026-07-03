<template>
  <div
    :class="[
      'flex min-h-[96px] items-center justify-between rounded-xl px-5 text-white',
      variantClass,
    ]"
  >
    <span class="text-[20px] font-medium leading-tight">{{ label }}</span>
    <span class="text-[48px] font-bold">{{ String(count).padStart(2, '0') }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'ActivityCard',
})

type ActivityVariant = 'info' | 'danger' | 'sucess'

const props = withDefaults(
  defineProps<{
    label: string
    count: number
    variant?: ActivityVariant
  }>(),
  {
    variant: 'info',
  },
)

const variantClasses: Record<ActivityVariant, string> = {
  info: 'bg-info',
  danger: 'bg-danger',
  sucess: 'bg-sucess',
}

const variantClass = computed(() => variantClasses[props.variant])
</script>
