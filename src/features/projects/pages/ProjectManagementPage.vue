<template>
  <LayoutInternalPage>
    <div class="pb-4">
      <TaskHeader> Gestão de Projetos </TaskHeader>
    </div>

    <TaskCard>
      <div class="mb-5 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-secondary">Lista de projetos</h2>

        <div class="flex items-center gap-3">
          <TaskButton @click="handleNewProject"> Novo Projeto </TaskButton>

          <TaskButton variant="secondary" @click="handleFilters"> Filtros </TaskButton>
        </div>
      </div>
      <div class="py-4">
        <hr class="border-primary" />
      </div>

      <TaskTable :columns="columns" :rows="projects" empty-message="Nenhum projeto encontrado.">
        <template #cell-status="{ value }">
          <span :class="statusClass(value as string)">
            {{ value }}
          </span>
        </template>
      </TaskTable>
    </TaskCard>

    <ProjectFormModal v-model="showFormModal" @saved="handleSaved" />
    <ProjectFilterModal v-model="showFilterModal" @search="handleSearch" @clear="handleClear" />
  </LayoutInternalPage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LayoutInternalPage from '@/layouts/LayoutInternalPage.vue'
import TaskHeader from '@/components/TaskHeader.vue'
import TaskButton from '@/components/TaskButton.vue'
import TaskTable from '@/components/TaskTable.vue'
import TaskCard from '@/components/TaskCard.vue'
import type { TableColumn } from '@/components/TaskTable.vue'
import ProjectFormModal from '@/features/projects/components/ProjectFormModal.vue'
import ProjectFilterModal from '@/features/projects/components/ProjectFilterModal.vue'

defineOptions({
  name: 'ProjectManagementPage',
})

const showFormModal = ref(false)
const showFilterModal = ref(false)

const columns: TableColumn[] = [
  { key: 'code', label: 'Codigo' },
  { key: 'startDate', label: 'Data de início' },
  { key: 'name', label: 'Nome' },
  { key: 'responsible', label: 'Responsável' },
  { key: 'status', label: 'Status' },
]

const projects = [
  {
    code: '---------',
    startDate: '19/03/2026',
    name: 'Nome do projeto',
    responsible: 'Nome do responsável',
    status: 'Não Iniciado',
  },
  {
    code: '---------',
    startDate: '19/03/2026',
    name: 'Nome do projeto',
    responsible: 'Nome do responsável',
    status: 'Em andamento',
  },
  {
    code: '---------',
    startDate: '14/03/2026',
    name: 'Nome do projeto',
    responsible: 'Nome do responsável',
    status: 'Pausado',
  },
  {
    code: '---------',
    startDate: '12/03/2026',
    name: 'Nome do projeto',
    responsible: 'Nome do responsável',
    status: 'Concluído',
  },
]

const statusClasses: Record<string, string> = {
  'Não Iniciado': 'text-slate-500',
  'Em andamento': 'text-info font-medium',
  Pausado: 'text-danger font-medium',
  Concluído: 'text-sucess font-medium',
}

function statusClass(status: string): string {
  return statusClasses[status] ?? 'text-slate-500'
}

function handleNewProject() {
  showFormModal.value = true
}

function handleFilters() {
  showFilterModal.value = true
}

function handleSaved() {}

function handleSearch() {}

function handleClear() {}
</script>
