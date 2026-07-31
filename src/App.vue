<script setup lang="ts">
import { RouterView } from 'vue-router'

import TaskLoading from '@/components/TaskLoading.vue'
import TaskToast from '@/components/TaskToast.vue'
import { useLoadingStore } from '@/stores/loading'

const loadingStore = useLoadingStore()
</script>

<template>
  <RouterView />

  <TaskLoading :visible="loadingStore.isLoading" :message="loadingStore.message" />

  <TaskToast />
</template>
