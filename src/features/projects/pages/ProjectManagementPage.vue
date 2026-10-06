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

        <div v-if="projectStore.loading" class="flex items-center justify-center py-12">
          <div class="flex items-center gap-3 text-slate-500">
            <svg
              class="h-5 w-5 animate-spin text-primary"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.2" />
              <path
                d="M22 12a10 10 0 0 0-10-10"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
            <span class="text-sm font-medium">Carregando projetos...</span>
          </div>
        </div>

        <template v-else>
          <TaskTable
            :columns="columns"
            :rows="tableRows"
            empty-message="Nenhum projeto encontrado."
          >
            <template #cell-active="{ row }">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                :class="
                  (row as ProjectItem).active !== false
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                "
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="
                    (row as ProjectItem).active !== false
                      ? 'bg-emerald-500'
                      : 'bg-slate-400'
                  "
                />
                {{ (row as ProjectItem).active !== false ? 'Ativo' : 'Inativo' }}
              </span>
            </template>

            <template #cell-actions="{ row }">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded p-1 text-slate-400 transition hover:text-primary cursor-pointer"
                  title="Ver detalhes"
                  @click="handleViewDetails(row as ProjectItem)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="rounded p-1 text-slate-400 transition hover:text-primary cursor-pointer"
                  title="Editar projeto"
                  @click="handleEdit(row as ProjectItem)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="rounded p-1 text-slate-400 transition hover:text-secondary cursor-pointer"
                  title="Adicionar subprojeto"
                  @click="handleAddSubproject(row as ProjectItem)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="rounded p-1 transition cursor-pointer"
                  :class="
                    (row as ProjectItem).active !== false
                      ? 'text-slate-400 hover:text-danger'
                      : 'text-slate-400 hover:text-emerald-600'
                  "
                  :title="
                    (row as ProjectItem).active !== false
                      ? 'Desativar projeto'
                      : 'Ativar projeto'
                  "
                  @click="handleToggleActive(row as ProjectItem)"
                >
                  <svg
                    v-if="(row as ProjectItem).active !== false"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="rounded p-1 text-slate-400 transition hover:text-danger cursor-pointer"
                  title="Excluir projeto"
                  @click="handleDelete(row as ProjectItem)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </template>
          </TaskTable>

          <TaskPagination
            :current-page="projectStore.pagination.current_page"
            :last-page="projectStore.pagination.last_page"
            :per-page="projectStore.pagination.per_page"
            :total="projectStore.pagination.total"
            :disabled="projectStore.loading"
            @change="handlePageChange"
          />
        </template>
      </TaskCard>
    </div>

    <ProjectFormModal v-model="showFormModal" :project="selectedProject" @saved="handleSaved" />

    <SubprojectFormModal v-model="showSubprojectModal" :project="selectedProjectForSubproject" />

    <ProjectDetailsModal v-model="showDetailsModal" :project="selectedProjectForDetails" />

    <!-- Modal de Confirmação de Exclusão -->
    <TaskConfirmModal
      v-model="showDeleteModal"
      title="Excluir Projeto"
      confirm-label="Excluir"
      loading-text="Excluindo..."
      variant="danger"
      description="Esta ação é irreversível e excluirá o projeto permanentemente."
      :loading="projectStore.loading"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    >
      <p class="text-sm text-slate-600">
        Deseja realmente excluir o projeto
        <strong class="font-semibold text-slate-800">"{{ projectToDelete?.name }}"</strong>?
      </p>
    </TaskConfirmModal>

    <!-- Modal de Confirmação de Ativação/Desativação de Projeto -->
    <TaskConfirmModal
      v-model="showToggleModal"
      :title="projectToToggle?.active !== false ? 'Desativar Projeto' : 'Ativar Projeto'"
      subtitle="Confirmação de alteração de status"
      :confirm-label="projectToToggle?.active !== false ? 'Desativar' : 'Ativar'"
      :variant="projectToToggle?.active !== false ? 'danger' : 'primary'"
      :loading="savingToggle"
      :description="
        projectToToggle?.active !== false
          ? 'O projeto ficará inativo no sistema até ser reativado.'
          : 'O projeto voltará a ficar ativo no sistema.'
      "
      @confirm="confirmToggleActive"
      @cancel="showToggleModal = false"
    >
      <p v-if="projectToToggle" class="text-sm text-slate-600">
        Deseja realmente {{ projectToToggle.active !== false ? 'desativar' : 'ativar' }} o projeto
        <strong class="font-semibold text-slate-800">"{{ projectToToggle.name }}"</strong>?
      </p>
    </TaskConfirmModal>
  </LayoutInternalPage>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import LayoutInternalPage from '@/layouts/LayoutInternalPage.vue'
import TaskHeader from '@/components/TaskHeader.vue'
import TaskButton from '@/components/TaskButton.vue'
import TaskConfirmModal from '@/components/TaskConfirmModal.vue'
import TaskTable from '@/components/TaskTable.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskPagination from '@/components/TaskPagination.vue'
import type { TableColumn, ProjectFilterValues, ProjectItem } from '@/types'
import ProjectFormModal from '@/features/projects/components/ProjectFormModal.vue'
import SubprojectFormModal from '@/features/projects/components/SubprojectFormModal.vue'
import ProjectDetailsModal from '@/features/projects/components/ProjectDetailsModal.vue'
import ProjectsFilter from '@/features/projects/components/ProjectsFilter.vue'
import { useProjectStore } from '@/stores/project'
import { useToast } from '@/composables/useToast'

defineOptions({
  name: 'ProjectManagementPage',
})

const projectStore = useProjectStore()
const { addToast } = useToast()

const showFormModal = ref(false)
const selectedProject = ref<ProjectItem | null>(null)

const showSubprojectModal = ref(false)
const selectedProjectForSubproject = ref<ProjectItem | null>(null)

const showDetailsModal = ref(false)
const selectedProjectForDetails = ref<ProjectItem | null>(null)

const showDeleteModal = ref(false)
const projectToDelete = ref<ProjectItem | null>(null)

const showToggleModal = ref(false)
const projectToToggle = ref<ProjectItem | null>(null)
const savingToggle = ref(false)

const columns: TableColumn[] = [
  { key: 'code', label: 'Código' },
  { key: 'name', label: 'Nome' },
  { key: 'active', label: 'Status' },
  { key: 'actions', label: 'Ações' },
]

const tableRows = computed<ProjectItem[]>(() => {
  return projectStore.projects.map((proj) => ({
    id: proj.id,
    code: `#${proj.id}`,
    name: proj.name,
    active: proj.active !== false,
  }))
})

onMounted(async () => {
  try {
    await projectStore.fetchProjects()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao buscar projetos'
    addToast(message, 'error')
  }
})

function handleViewDetails(project: ProjectItem) {
  selectedProjectForDetails.value = project
  showDetailsModal.value = true
}

function handleNewProject() {
  selectedProject.value = null
  showFormModal.value = true
}

function handleEdit(project: ProjectItem) {
  selectedProject.value = project
  showFormModal.value = true
}

function handleAddSubproject(project: ProjectItem) {
  selectedProjectForSubproject.value = project
  showSubprojectModal.value = true
}

function handleSaved() {
  // Formulário salva e atualiza a lista pela store
}

function handleSearch(filters: ProjectFilterValues) {
  projectStore.setFilters({
    name: filters.name || undefined,
    active: filters.status !== undefined && filters.status !== '' ? filters.status : undefined,
  })
}

function handleClear() {
  projectStore.clearFilters()
}

function handlePageChange(page: number) {
  projectStore.setPage(page)
}

function handleDelete(project: ProjectItem) {
  projectToDelete.value = project
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!projectToDelete.value?.id) return

  try {
    await projectStore.deleteProject(projectToDelete.value.id)
    addToast('Projeto excluído com sucesso!', 'success')
    showDeleteModal.value = false
    projectToDelete.value = null
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao excluir projeto'
    addToast(message, 'error')
  }
}

function handleToggleActive(project: ProjectItem) {
  projectToToggle.value = project
  showToggleModal.value = true
}

async function confirmToggleActive() {
  if (!projectToToggle.value || projectToToggle.value.id === undefined) return

  const target = projectToToggle.value
  const projectId = projectToToggle.value.id
  const newActive = target.active === false
  const actionText = newActive ? 'ativado' : 'desativado'

  savingToggle.value = true
  try {
    await projectStore.updateProject(projectId, { active: newActive })
    target.active = newActive
    addToast(`Projeto ${actionText} com sucesso!`, 'success')
    showToggleModal.value = false
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao alterar status do projeto'
    addToast(message, 'error')
  } finally {
    savingToggle.value = false
  }
}
</script>
