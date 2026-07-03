<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @mousedown.self="handleBackdropClick"
      >
        <div class="absolute inset-0 bg-black/40" />

        <div
          class="relative z-10 flex w-full flex-col rounded-2xl bg-white shadow-2xl"
          :class="sizeClasses[size]"
        >
          <div class="flex items-start justify-between border-b border-neutral px-6 py-5">
            <div>
              <h2 class="text-lg font-semibold text-primary">{{ title }}</h2>
              <p v-if="subtitle" class="mt-0.5 text-sm text-gray">{{ subtitle }}</p>
            </div>

            <button
              type="button"
              class="ml-4 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray transition hover:bg-neutral hover:text-primary"
              @click="close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="h-5 w-5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-5">
            <slot />
          </div>

          <div class="border-t border-neutral px-6 py-4">
            <slot name="footer">
              <div class="flex items-center justify-end gap-3">
                <TaskButton variant="secondary" @click="close">
                  {{ cancelLabel }}
                </TaskButton>
                <TaskButton :loading="loading" :disabled="loading" @click="confirm">
                  {{ confirmLabel }}
                </TaskButton>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import TaskButton from '@/components/TaskButton.vue'

defineOptions({
  name: 'TaskModal',
})

type ModalSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    subtitle?: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
    closeOnBackdrop?: boolean
    size?: ModalSize
  }>(),
  {
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    loading: false,
    closeOnBackdrop: true,
    size: 'md',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'confirm'): void
  (event: 'cancel'): void
}>()

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

function close() {
  emit('update:modelValue', false)
  emit('cancel')
}

function confirm() {
  emit('confirm')
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    close()
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
