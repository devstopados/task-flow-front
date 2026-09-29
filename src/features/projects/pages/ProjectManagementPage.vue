<template>
  <LayoutInternalPage>
    <div class="flex flex-col gap-6">
      <TaskHeader> Gestão de Projetos </TaskHeader>

      <TaskCard title="Filtros" collapsible default-collapsed>
        <ProjectsFilter @search="handleSearch" @clear="handleClear" />
      </TaskCard>

      <TaskCard title="Lista de projetos">
        <template #actions>
          <TaskButton @click="handleNewProject"> Novo Projeto </TaskButton>
        </template>

        <TaskTable :columns="columns" :rows="projects" empty-message="Nenhum projeto encontrado.">
          <template #cell-status="{ value }">
            <span :class="statusClass(value as string)">
              {{ value }}
            </span>
          </template>
        </TaskTable>
      </TaskCard>
    </div>

    <ProjectFormModal v-model="showFormModal" @saved="handleSaved" />
  </LayoutInternalPage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LayoutInternalPage from '@/layouts/LayoutInternalPage.vue'
import TaskHeader from '@/components/TaskHeader.vue'
import TaskButton from '@/components/TaskButton.vue'
import TaskTable from '@/components/TaskTable.vue'
import TaskCard from '@/components/TaskCard.vue'
import type { TableColumn, ProjectFormData, ProjectFilterValues, ProjectItem } from '@/types'
import ProjectFormModal from '@/features/projects/components/ProjectFormModal.vue'
import ProjectsFilter from '@/features/projects/components/ProjectsFilter.vue'

defineOptions({
  name: 'ProjectManagementPage',
})

const showFormModal = ref(false)

const columns: TableColumn[] = [
  { key: 'code', label: 'Codigo' },
  { key: 'startDate', label: 'Data de início' },
  { key: 'name', label: 'Nome' },
  { key: 'responsible', label: 'Responsável' },
  { key: 'status', label: 'Status' },
]

const projects: ProjectItem[] = [
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

function handleSaved(payload: ProjectFormData) {
  console.log('Projeto salvo:', payload)
}

function handleSearch(filters: ProjectFilterValues) {
  console.log('Filtros de projeto aplicados:', filters)
}

function handleClear() {
  console.log('Filtros de projeto limpos')
}
</script>
