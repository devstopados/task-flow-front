<script setup lang="ts">
import { RouterView } from 'vue-router'

import TaskLoading from '@/components/TaskLoading.vue'
import TaskToast from '@/components/TaskToast.vue'
import { useLoading } from '@/composables/useLoading'

const { isLoading, message } = useLoading()
</script>

<template>
  <RouterView />

  <TaskLoading :visible="isLoading" :message="message" />

  <TaskToast />
</template>
