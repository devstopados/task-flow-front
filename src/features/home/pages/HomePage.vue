<template>
  <LayoutInternalPage>
    <div class="pb-4">
      <TaskHeader>Início</TaskHeader>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <ActivityCard label="Atividades Iniciadas" :count="2" variant="info" />
      <ActivityCard label="Atividades Impedidas" :count="2" variant="danger" />
      <ActivityCard label="Atividades Concluídas" :count="2" variant="sucess" />
    </div>
  </LayoutInternalPage>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import LayoutInternalPage from '@/layouts/LayoutInternalPage.vue'
import ActivityCard from '@/features/home/components/ActivityCard.vue'
import TaskHeader from '@/components/TaskHeader.vue'
import { useLoadingStore } from '@/stores/loading'
import { useToastStore } from '@/stores/toast'

defineOptions({
  name: 'HomePage',
})

const loadingStore = useLoadingStore()
const toastStore = useToastStore()

let loadingTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  loadingStore.showLoading()

  loadingTimeout = setTimeout(() => {
    loadingStore.hideLoading()
    toastStore.addToast('Bem-vindo à Home!', 'info', 5000)
  }, 3000)
})

onUnmounted(() => {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout)
  }

  loadingStore.hideLoading()
})
</script>
