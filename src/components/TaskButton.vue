<template>
  <button
    v-bind="attrs"
    :type="buttonType"
    :disabled="isDisabled"
    :aria-busy="loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
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

    <span :class="loading && 'opacity-80'">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({
  name: 'TaskButton',
  inheritAttrs: false,
})

type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonType = 'button' | 'submit' | 'reset'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    buttonType?: ButtonType
    loading?: boolean
    disabled?: boolean
    fullWidth?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    buttonType: 'button',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
)

const emit = defineEmits<{
  (event: 'click', nativeEvent: MouseEvent): void
}>()

const attrs = useAttrs()

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-secondary focus:ring-neutral',
  secondary:
    'border border-primary bg-white text-primary hover:bg-neutral hover:bg-opacity-5 focus:ring-slate-200',
  tertiary: 'bg-transparent text-sky-700 hover:bg-sky-50 focus:ring-sky-200',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-lg px-3 text-sm',
  md: 'h-11 rounded-xl px-4 text-sm',
  lg: 'h-12 rounded-2xl px-5 text-base',
}

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center gap-2 font-semibold outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer',
  sizeClasses[props.size],
  variantClasses[props.variant],
  props.fullWidth && 'w-full',
])

const isDisabled = computed(() => props.disabled || props.loading)

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>
