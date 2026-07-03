<template>
  <div :class="wrapperClasses">
    <label v-if="label" :id="labelId" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="ml-0.5 text-rose-500">*</span>
    </label>

    <div ref="wrapperRef" class="relative">
      <div
        v-if="$slots.prepend"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
      >
        <slot name="prepend" />
      </div>

      <button
        :id="selectId"
        ref="triggerRef"
        type="button"
        role="combobox"
        :name="name"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-activedescendant="activeOptionId"
        :aria-invalid="Boolean(error)"
        :aria-describedby="descriptionId"
        :disabled="disabled"
        :class="triggerClasses"
        @click="toggleOpen"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
      >
        <span :class="selectedLabel ? 'text-slate-900' : 'text-slate-400'">
          {{ selectedLabel || placeholder }}
        </span>
      </button>

      <button
        v-if="showClearButton"
        type="button"
        class="absolute right-8 top-1/2 flex h-8 -translate-y-1/2 items-center rounded-lg px-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
        @click="clearValue"
      >
        Limpar
      </button>

      <div
        v-if="$slots.append"
        class="pointer-events-none absolute inset-y-0 right-8 flex items-center pr-3 text-slate-400"
      >
        <slot name="append" />
      </div>

      <svg
        :class="[
          'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition',
          isOpen && 'rotate-180',
        ]"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6 8L10 12L14 8"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <Teleport to="body">
        <div
          v-if="isOpen"
          :id="listboxId"
          ref="dropdownRef"
          role="listbox"
          :aria-labelledby="labelId"
          :style="dropdownStyles"
          :class="[
            'overflow-hidden rounded-xl border border-sky-500 bg-white py-1 shadow-lg transition-opacity duration-150',
            isPositioned ? 'opacity-100' : 'opacity-0',
          ]"
        >
          <div
            v-for="(option, index) in normalizedOptions"
            :id="`${selectId}-option-${index}`"
            :key="String(option.value)"
            role="option"
            :aria-selected="isSelected(option.value)"
            :class="optionClasses(index, option.value)"
            @click="selectOption(option.value)"
            @mouseenter="activeIndex = index"
          >
            {{ option.label }}
          </div>
        </div>
      </Teleport>
    </div>

    <p
      v-if="error || hint"
      :id="descriptionId"
      :class="['text-xs', error ? 'text-rose-600' : 'text-slate-500']"
    >
      {{ error || hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

defineOptions({
  name: 'TaskSelect',
  inheritAttrs: false,
})

type SelectSize = 'sm' | 'md' | 'lg'
type SelectPrimitive = string | number
type SelectOptionObject = {
  label: string
  value: SelectPrimitive
  disabled?: boolean
}

type SelectOption = SelectPrimitive | SelectOptionObject

const props = withDefaults(
  defineProps<{
    modelValue?: SelectPrimitive | null
    options?: SelectOption[]
    id?: string
    name?: string
    label?: string
    hint?: string
    error?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    size?: SelectSize
    clearable?: boolean
    fullWidth?: boolean
  }>(),
  {
    modelValue: '',
    options: () => [],
    placeholder: 'Selecione uma opcao',
    size: 'md',
    clearable: false,
    fullWidth: true,
    disabled: false,
    required: false,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string, nativeEvent: Event): void
  (event: 'focus', nativeEvent: FocusEvent): void
  (event: 'blur', nativeEvent: FocusEvent): void
  (event: 'keydown', nativeEvent: KeyboardEvent): void
  (event: 'keyup', nativeEvent: KeyboardEvent): void
  (event: 'enter', value: string, nativeEvent: KeyboardEvent): void
  (event: 'clear'): void
}>()

const wrapperRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const generatedId = `task-select-${Math.random().toString(36).slice(2, 10)}`

const selectId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${selectId.value}-label`)
const listboxId = computed(() => `${selectId.value}-listbox`)
const descriptionId = computed(() => `${selectId.value}-description`)
const activeOptionId = computed(() =>
  isOpen.value ? `${selectId.value}-option-${activeIndex.value}` : '',
)
const normalizedValue = computed(() => String(props.modelValue ?? ''))
const isOpen = ref(false)
const activeIndex = ref(-1)
const isPositioned = ref(false)
const dropdownStyles = ref<Record<string, string>>({})

function updateDropdownPosition() {
  if (!triggerRef.value || !isOpen.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  dropdownStyles.value = {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    'z-index': '9999',
  }
}

watch(isOpen, async (open) => {
  if (open) {
    isPositioned.value = false
    await nextTick()
    requestAnimationFrame(() => {
      updateDropdownPosition()
      setTimeout(() => {
        updateDropdownPosition()
        isPositioned.value = true
      }, 50)
    })
  } else {
    isPositioned.value = false
  }
})

const normalizedOptions = computed<SelectOptionObject[]>(() =>
  props.options.map((option) => {
    if (typeof option === 'string' || typeof option === 'number') {
      return {
        label: String(option),
        value: option,
        disabled: false,
      }
    }

    return {
      label: option.label,
      value: option.value,
      disabled: Boolean(option.disabled),
    }
  }),
)

const wrapperClasses = computed(() => ['flex flex-col gap-2', props.fullWidth && 'w-full'])

const sizeClasses: Record<SelectSize, string> = {
  sm: 'h-9 rounded-lg px-3 text-sm',
  md: 'h-11 rounded-xl px-4 text-sm',
  lg: 'h-12 rounded-xl px-4 text-base',
}

const triggerClasses = computed(() => [
  'w-full text-left border bg-white outline-none transition',
  'focus:ring-4',
  sizeClasses[props.size],
  'pr-10',
  props.error
    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
    : 'border-slate-300 focus:border-sky-500 focus:ring-sky-100',
  props.disabled && 'cursor-not-allowed bg-slate-100 text-slate-500',
])

const showClearButton = computed(
  () => props.clearable && !props.disabled && normalizedValue.value.length > 0,
)

const selectedLabel = computed(() => {
  const selected = normalizedOptions.value.find(
    (option) => String(option.value) === normalizedValue.value,
  )
  return selected?.label ?? ''
})

function isSelected(value: SelectPrimitive): boolean {
  return String(value) === normalizedValue.value
}

function optionClasses(index: number, value: SelectPrimitive): string[] {
  const selected = isSelected(value)
  const active = index === activeIndex.value
  const disabled = Boolean(normalizedOptions.value[index]?.disabled)

  return [
    'cursor-pointer px-4 py-2 text-sm transition',
    selected ? 'bg-sky-100 text-sky-700 font-medium' : 'text-slate-700',
    active && !selected ? 'bg-sky-50' : '',
    disabled ? 'cursor-not-allowed opacity-50' : '',
  ]
}

function toggleOpen() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    activeIndex.value = Math.max(
      normalizedOptions.value.findIndex((option) => String(option.value) === normalizedValue.value),
      0,
    )
  }
}

function close() {
  isOpen.value = false
  activeIndex.value = -1
}

function selectOption(value: SelectPrimitive) {
  const option = normalizedOptions.value.find((option) => String(option.value) === String(value))
  if (option?.disabled) return

  const stringValue = String(value)
  emit('update:modelValue', stringValue)
  emit('change', stringValue, new Event('change'))
  close()
  triggerRef.value?.focus()
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event)

  if (event.key === 'Enter') {
    if (isOpen.value && activeIndex.value >= 0) {
      const activeOption = normalizedOptions.value[activeIndex.value]
      if (activeOption) {
        selectOption(activeOption.value)
      }
    } else {
      emit('enter', normalizedValue.value, event)
    }
    return
  }

  if (event.key === 'Escape') {
    close()
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!isOpen.value) {
      toggleOpen()
    }
    const direction = event.key === 'ArrowDown' ? 1 : -1
    const nextIndex = activeIndex.value + direction
    activeIndex.value = Math.max(0, Math.min(normalizedOptions.value.length - 1, nextIndex))
  }
}

function handleKeyup(event: KeyboardEvent) {
  emit('keyup', event)
}

function clearValue() {
  emit('update:modelValue', '')
  emit('clear')
  triggerRef.value?.focus()
}

function handleClickOutside(event: MouseEvent) {
  if (isOpen.value && wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', updateDropdownPosition)
  window.addEventListener('scroll', updateDropdownPosition, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updateDropdownPosition)
  window.removeEventListener('scroll', updateDropdownPosition, true)
})
</script>
