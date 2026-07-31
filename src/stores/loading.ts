import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const DEFAULT_MESSAGE = 'Carregando...'

export const useLoadingStore = defineStore('loading', () => {
  const activeRequests = ref(0)
  const message = ref(DEFAULT_MESSAGE)

  const isLoading = computed(() => activeRequests.value > 0)

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
})
