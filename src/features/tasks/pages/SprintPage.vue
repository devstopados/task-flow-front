<template>
  <LayoutInternalPage>
    <div class="flex flex-col gap-6">
      <TaskHeader>
        Sprint
        <template #description>
          Planejamento e acompanhamento das sprints de desenvolvimento.
        </template>
      </TaskHeader>

      <TaskCard>
        <div class="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
          <div
            class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-8 w-8 text-primary/70"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
              />
            </svg>
          </div>
          <h2 class="text-lg font-semibold text-slate-800">Nenhuma Sprint em andamento</h2>
          <p class="mt-1.5 max-w-md text-sm text-slate-500">
            Esta tela está reservada para a gestão de sprints. Em breve você poderá criar sprints, atribuir tarefas do backlog e acompanhar o progresso por aqui.
          </p>
        </div>
      </TaskCard>
    </div>
  </LayoutInternalPage>
</template>

<script setup lang="ts">
import LayoutInternalPage from '@/layouts/LayoutInternalPage.vue'
import TaskHeader from '@/components/TaskHeader.vue'
import TaskCard from '@/components/TaskCard.vue'

defineOptions({
  name: 'SprintPage',
})
</script>
