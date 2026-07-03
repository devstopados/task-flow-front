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
import LayoutInternalPage from '@/layouts/LayoutInternalPage.vue'
import ActivityCard from '@/features/home/components/ActivityCard.vue'
import TaskHeader from '@/components/TaskHeader.vue'

defineOptions({
  name: 'HomePage',
})
</script>
