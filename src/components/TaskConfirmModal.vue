<template>
  <TaskModal
    :model-value="modelValue"
    :title="title"
    :subtitle="subtitle"
    :size="size"
    :close-on-backdrop="closeOnBackdrop && !loading"
    @update:model-value="handleUpdateModelValue"
    @cancel="handleCancel"
  >
    <div class="flex items-start gap-3.5 py-1">
      <div
        v-if="showIcon"
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition"
        :class="variantConfig.iconBadge"
      >
        <slot name="icon">
          <!-- Danger: Lixeira / Alerta -->
          <svg
            v-if="variant === 'danger'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>

          <!-- Warning: Triângulo de aviso -->
          <svg
            v-else-if="variant === 'warning'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>

          <!-- Success: Check -->
          <svg
            v-else-if="variant === 'success'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          <!-- Primary / Default: Informação / Check -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        </slot>
      </div>

      <div class="flex flex-1 flex-col gap-1.5">
        <slot>
          <p v-if="message" class="text-sm text-slate-600">
            {{ message }}
          </p>
        </slot>

        <slot name="description">
          <p v-if="description" class="text-xs" :class="variantConfig.description">
            {{ description }}
          </p>
        </slot>
      </div>
    </div>

    <template #footer>
      <slot name="footer">
        <div class="flex items-center justify-end gap-3">
          <TaskButton variant="secondary" :disabled="loading" @click="handleCancel">
            {{ cancelLabel }}
          </TaskButton>

          <button
            type="button"
            class="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            :class="variantConfig.confirmButton"
            :disabled="loading"
            @click="handleConfirm"
          >
            <svg
              v-if="loading"
              class="mr-2 h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.2" />
              <path
                d="M22 12a10 10 0 0 0-10-10"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
            {{ loading ? loadingText || 'Processando...' : confirmLabel }}
          </button>
        </div>
      </slot>
    </template>
  </TaskModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TaskModal from '@/components/TaskModal.vue'
import TaskButton from '@/components/TaskButton.vue'

defineOptions({
  name: 'TaskConfirmModal',
})

export type ConfirmVariant = 'danger' | 'warning' | 'primary' | 'success'

interface Props {
  modelValue: boolean
  title?: string
  subtitle?: string
  message?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  loadingText?: string
  variant?: ConfirmVariant
  size?: 'sm' | 'md' | 'lg'
  closeOnBackdrop?: boolean
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmação',
  subtitle: '',
  message: '',
  description: '',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  loading: false,
  loadingText: 'Processando...',
  variant: 'danger',
  size: 'sm',
  closeOnBackdrop: true,
  showIcon: true,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'confirm'): void
  (event: 'cancel'): void
}>()

const variantConfig = computed(() => {
  switch (props.variant) {
    case 'primary':
      return {
        iconBadge: 'bg-primary/10 text-primary',
        confirmButton: 'bg-primary',
        description: 'text-slate-500',
      }
    case 'success':
      return {
        iconBadge: 'bg-emerald-50 text-emerald-600',
        confirmButton: 'bg-emerald-600 hover:bg-emerald-700',
        description: 'text-slate-500',
      }
    case 'warning':
      return {
        iconBadge: 'bg-amber-50 text-amber-600',
        confirmButton: 'bg-amber-600 hover:bg-amber-700',
        description: 'text-amber-600',
      }
    case 'danger':
    default:
      return {
        iconBadge: 'bg-danger/10 text-danger',
        confirmButton: 'bg-danger',
        description: 'text-danger',
      }
  }
})

function handleUpdateModelValue(value: boolean) {
  emit('update:modelValue', value)
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>
