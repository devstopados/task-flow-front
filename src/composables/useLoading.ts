import { ref, computed } from 'vue'

const DEFAULT_MESSAGE = 'Carregando...'

const activeRequests = ref(0)
const message = ref(DEFAULT_MESSAGE)
const isLoading = computed(() => activeRequests.value > 0)

export function useLoading() {
  function showLoading(newMessage: string = DEFAULT_MESSAGE): void {
    message.value = newMessage
    activeRequests.value++
  }

  function hideLoading(): void {
    if (activeRequests.value > 0) {
      activeRequests.value--
    }

    if (activeRequests.value === 0) {
      message.value = DEFAULT_MESSAGE
    }
  }

  function resetLoading(): void {
    activeRequests.value = 0
    message.value = DEFAULT_MESSAGE
  }

  return {
    activeRequests,
    message,
    isLoading,
    showLoading,
    hideLoading,
    resetLoading,
  }
}
