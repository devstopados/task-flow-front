<template>
  <LayoutInternalPage>
    <div class="pb-4">
      <TaskHeader> Gestão de Tarefas </TaskHeader>
    </div>

    <TaskCard>
      <div class="mb-5 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-secondary">Lista de tarefas</h2>

        <div class="flex items-center gap-3">
          <TaskButton @click="handleNewTask"> Nova Tarefa </TaskButton>

          <TaskButton variant="secondary" @click="handleFilters"> Filtros </TaskButton>
        </div>
      </div>
      <div class="py-4">
        <hr class="border-primary" />
      </div>

      <TaskTable :columns="columns" :rows="tasks" empty-message="Nenhuma tarefa encontrada.">
        <template #cell-status="{ value }">
          <span :class="statusClass(value as string)">
            {{ value }}
          </span>
        </template>
      </TaskTable>
    </TaskCard>

    <TaskFormModal v-model="showNewTaskModal" @saved="handleTaskSaved" />
    <TaskFilterModal v-model="showFilterModal" @search="handleSearch" @clear="handleClearFilters" />
  </LayoutInternalPage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LayoutInternalPage from '@/layouts/LayoutInternalPage.vue'
import TaskHeader from '@/components/TaskHeader.vue'
import TaskButton from '@/components/TaskButton.vue'
import TaskTable from '@/components/TaskTable.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskFormModal from '@/features/tasks/components/TaskFormModal.vue'
import TaskFilterModal from '@/features/tasks/components/TaskFilterModal.vue'
import type { TableColumn } from '@/components/TaskTable.vue'

defineOptions({
  name: 'TaskManagementPage',
})

const columns: TableColumn[] = [
  { key: 'code', label: 'Codigo' },
  { key: 'startDate', label: 'Data da início' },
  { key: 'name', label: 'Nome' },
  { key: 'project', label: 'Projeto' },
  { key: 'status', label: 'Status' },
]

const tasks = [
  {
    code: '---------',
    startDate: '19/03/2026',
    name: 'Nome da task',
    project: 'Nome do projeto',
    status: 'Não Iniciada',
  },
  {
    code: '---------',
    startDate: '19/03/2026',
    name: 'Nome da task',
    project: 'Nome do projeto',
    status: 'Em andamento',
  },
  {
    code: '---------',
    startDate: '14/03/2026',
    name: 'Nome da task',
    project: 'Nome do projeto',
    status: 'Pausada',
  },
  {
    code: '---------',
    startDate: '12/03/2026',
    name: 'Nome da task',
    project: 'Nome do projeto',
    status: 'Concluída',
  },
]

const statusClasses: Record<string, string> = {
  'Não Iniciada': 'text-slate-500',
  'Em andamento': 'text-info font-medium',
  Pausada: 'text-danger font-medium',
  Concluída: 'text-sucess font-medium',
}

function statusClass(status: string): string {
  return statusClasses[status] ?? 'text-slate-500'
}

const showNewTaskModal = ref(false)

function handleNewTask() {
  showNewTaskModal.value = true
}

function handleTaskSaved(payload: Record<string, unknown>) {
  console.log('Tarefa salva:', payload)
}

const showFilterModal = ref(false)

function handleFilters() {
  showFilterModal.value = true
}

function handleSearch(filters: Record<string, string>) {
  console.log('Filtros aplicados:', filters)
}

function handleClearFilters() {
  console.log('Filtros limpos')
}
</script>
