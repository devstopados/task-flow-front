<script setup lang="ts">
import TaskNotification from '@/components/TaskNotification.vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
</script>

<template>
  <TransitionGroup
    tag="div"
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
    class="fixed right-4 top-4 z-9998 flex flex-col gap-3"
  >
    <TaskNotification
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :type="toast.type"
      :title="toast.message"
      @close="toastStore.removeToast(toast.id)"
    />
  </TransitionGroup>
</template>
