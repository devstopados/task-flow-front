<template>
  <LayoutInternalPage>
    <div class="flex flex-col gap-6">
      <TaskHeader> Gestão de Tarefas </TaskHeader>

      <TaskCard title="Filtros" collapsible default-collapsed>
        <TasksFilter @search="handleSearch" @clear="handleClearFilters" />
      </TaskCard>

      <TaskCard title="Lista de tarefas">
        <template #actions>
          <TaskButton @click="handleNewTask"> Nova Tarefa </TaskButton>
        </template>

        <TaskTable :columns="columns" :rows="tasks" empty-message="Nenhuma tarefa encontrada.">
          <template #cell-status="{ value }">
            <span :class="statusClass(value as string)">
              {{ value }}
            </span>
          </template>
        </TaskTable>
      </TaskCard>
    </div>

    <TaskFormModal v-model="showNewTaskModal" @saved="handleTaskSaved" />
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
import TasksFilter from '@/features/tasks/components/TasksFilter.vue'
import type { TableColumn, TaskFormData, TaskFilterValues, TaskItem } from '@/types'

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

const tasks: TaskItem[] = [
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

function handleTaskSaved(payload: TaskFormData) {
  console.log('Tarefa salva:', payload)
}

function handleSearch(filters: TaskFilterValues) {
  console.log('Filtros aplicados:', filters)
}

function handleClearFilters() {
  console.log('Filtros limpos')
}
</script>
