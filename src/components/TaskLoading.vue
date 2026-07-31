<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'TaskLoading',
})

withDefaults(
  defineProps<{
    visible: boolean
    message?: string
    overlay?: boolean
  }>(),
  {
    message: 'Carregando...',
    overlay: true,
  },
)

const prefersReducedMotion = computed(
  () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
)
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      :aria-busy="visible"
      :class="[
        'fixed inset-0 z-9999 flex items-center justify-center bg-dark/60 backdrop-blur-xs',
        overlay ? 'fixed inset-0' : 'absolute inset-0',
      ]"
    >
      <svg
        class="h-12 w-12 text-white"
        :class="{ 'animate-spin': !prefersReducedMotion }"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.2" />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
        />
      </svg>

      <span class="sr-only">{{ message }}</span>
    </div>
  </Transition>
</template>
