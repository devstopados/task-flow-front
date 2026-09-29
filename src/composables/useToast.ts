import { ref } from 'vue'
import type { Toast, ToastType } from '@/types'

let toastId = 0
const toasts = ref<Toast[]>([])

export function useToast() {
  function addToast(message: string, type: ToastType = 'info', duration = 5000): number {
    const id = ++toastId

    toasts.value.push({ id, message, type, duration })

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id: number): void {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function clearToasts(): void {
    toasts.value = []
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  }
}

export type { Toast, ToastType }
