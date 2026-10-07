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

        <template v-if="taskStore.loading && !taskStore.hasTasks">
          <div class="flex items-center justify-center py-12 text-slate-500">
            <div class="flex items-center gap-2">
              <svg
                class="h-5 w-5 animate-spin text-primary"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  opacity="0.2"
                />
                <path
                  d="M22 12a10 10 0 0 0-10-10"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-linecap="round"
                />
              </svg>
              <span class="text-sm font-medium">Carregando tarefas...</span>
            </div>
          </div>
        </template>

        <template v-else>
          <TaskTable
            :columns="columns"
            :rows="tableRows"
            empty-message="Nenhuma tarefa encontrada."
          >
            <!-- Badge de Status -->
            <template #cell-status="{ row }">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                :class="getStatusBadgeClass((row as TaskItem).status_id)"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="getStatusDotClass((row as TaskItem).status_id)"
                />
                {{ (row as TaskItem).statusLabel }}
              </span>
            </template>

            <!-- Ações -->
            <template #cell-actions="{ row }">
              <div class="flex items-center gap-2">
                <!-- Ver Detalhes -->
                <button
                  type="button"
                  class="rounded p-1 text-slate-400 transition hover:text-primary cursor-pointer"
                  title="Ver detalhes"
                  @click="handleViewDetails((row as TaskItem).rawTask)"
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

                <!-- Editar -->
                <button
                  type="button"
                  class="rounded p-1 text-slate-400 transition hover:text-primary cursor-pointer"
                  title="Editar tarefa"
                  @click="handleEdit((row as TaskItem).rawTask)"
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

                <!-- Excluir -->
                <button
                  type="button"
                  class="rounded p-1 text-slate-400 transition hover:text-danger cursor-pointer"
                  title="Excluir tarefa"
                  @click="handleDelete((row as TaskItem).rawTask)"
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

          <!-- Paginação -->
          <TaskPagination
            :current-page="taskStore.pagination.current_page"
            :last-page="taskStore.pagination.last_page"
            :per-page="taskStore.pagination.per_page"
            :total="taskStore.pagination.total"
            :disabled="taskStore.loading"
            @change="handlePageChange"
          />
        </template>
      </TaskCard>
    </div>

    <!-- Modal de Criação / Edição de Tarefa -->
    <TaskFormModal v-model="showFormModal" :task="selectedTask" @saved="handleTaskSaved" />

    <!-- Modal de Detalhes da Tarefa -->
    <TaskDetailsModal v-model="showDetailsModal" :task="selectedTaskForDetails" />

    <!-- Modal de Confirmação de Exclusão -->
    <TaskConfirmModal
      v-model="showDeleteModal"
      title="Excluir Tarefa"
      subtitle="Confirmação de exclusão"
      confirm-label="Excluir"
      loading-text="Excluindo..."
      variant="danger"
      description="Esta ação é irreversível e excluirá a tarefa permanentemente."
      :loading="taskStore.loading"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    >
      <p class="text-sm text-slate-600">
        Deseja realmente excluir a tarefa
        <strong class="font-semibold text-slate-800">"{{ taskToDelete?.name }}"</strong>?
      </p>
    </TaskConfirmModal>
  </LayoutInternalPage>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import LayoutInternalPage from '@/layouts/LayoutInternalPage.vue'
import TaskHeader from '@/components/TaskHeader.vue'
import TaskButton from '@/components/TaskButton.vue'
import TaskTable from '@/components/TaskTable.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskPagination from '@/components/TaskPagination.vue'
import TaskConfirmModal from '@/components/TaskConfirmModal.vue'
import TaskFormModal from '@/features/tasks/components/TaskFormModal.vue'
import TaskDetailsModal from '@/features/tasks/components/TaskDetailsModal.vue'
import TasksFilter from '@/features/tasks/components/TasksFilter.vue'
import type { TableColumn, Task, TaskItem, TaskFilterValues } from '@/types'
import { TASK_STATUS_MAP } from '@/types'
import { useTaskStore } from '@/stores/task'
import { useStatusTaskStore } from '@/stores/statusTask'
import { useToast } from '@/composables/useToast'

defineOptions({
  name: 'TaskManagementPage',
})

const taskStore = useTaskStore()
const statusTaskStore = useStatusTaskStore()
const { addToast } = useToast()

const showFormModal = ref(false)
const selectedTask = ref<Task | null>(null)

const showDetailsModal = ref(false)
const selectedTaskForDetails = ref<Task | null>(null)

const showDeleteModal = ref(false)
const taskToDelete = ref<Task | null>(null)

const columns: TableColumn[] = [
  { key: 'code', label: 'Código' },
  { key: 'name', label: 'Nome' },
  { key: 'subproject', label: 'Subprojeto' },
  { key: 'startDate', label: 'Data de início' },
  { key: 'hours', label: 'Horas' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Ações' },
]

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('pt-BR')
  } catch {
    return dateStr
  }
}

function getStatusBadgeClass(statusId: number): string {
  return TASK_STATUS_MAP[statusId]?.badgeClass ?? 'bg-slate-100 text-slate-600'
}

function getStatusDotClass(statusId: number): string {
  switch (statusId) {
    case 2:
      return 'bg-sky-500'
    case 3:
      return 'bg-amber-500'
    case 4:
      return 'bg-emerald-500'
    case 1:
    default:
      return 'bg-slate-400'
  }
}

const tableRows = computed<TaskItem[]>(() => {
  return taskStore.tasks.map((task) => {
    const statusMeta = TASK_STATUS_MAP[task.status_id] ?? {
      label: 'Desconhecido',
      badgeClass: 'bg-slate-100 text-slate-600',
    }
    const statusFromStore = statusTaskStore.statusTasks.find((s) => s.id === task.status_id)
    const statusLabel = task.status?.name || statusFromStore?.name || statusMeta.label

    return {
      id: task.id,
      code: task.code || `#${task.id}`,
      name: task.name,
      startDate: formatDate(task.start_date),
      endDate: formatDate(task.end_date),
      hours: task.hours !== null && task.hours !== undefined ? `${task.hours}h` : '—',
      branch: task.branch || '',
      link: task.link || '',
      subproject:
        task.subproject?.name || (task.subproject_id ? `Sub #${task.subproject_id}` : '—'),
      subproject_id: task.subproject_id,
      status_id: task.status_id,
      statusLabel,
      rawTask: task,
    }
  })
})

onMounted(async () => {
  try {
    await Promise.all([taskStore.fetchTasks(), statusTaskStore.fetchAllStatusTasks()])
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao carregar dados'
    addToast(message, 'error')
  }
})

function handleNewTask() {
  selectedTask.value = null
  showFormModal.value = true
}

function handleViewDetails(task: Task) {
  selectedTaskForDetails.value = task
  showDetailsModal.value = true
}

function handleEdit(task: Task) {
  selectedTask.value = task
  showFormModal.value = true
}

function handleTaskSaved() {
  // Lista recarregada pela store
}

function handleDelete(task: Task) {
  taskToDelete.value = task
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!taskToDelete.value?.id) return

  try {
    await taskStore.deleteTask(taskToDelete.value.id)
    addToast('Tarefa excluída com sucesso!', 'success')
    showDeleteModal.value = false
    taskToDelete.value = null
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao excluir tarefa'
    addToast(message, 'error')
  }
}

function handleSearch(filters: TaskFilterValues) {
  taskStore.setFilters({
    search: filters.search || undefined,
    subproject_id:
      filters.subproject_id !== '' && filters.subproject_id !== undefined
        ? filters.subproject_id
        : undefined,
    status_id:
      filters.status_id !== '' && filters.status_id !== undefined ? filters.status_id : undefined,
  })
}

function handleClearFilters() {
  taskStore.clearFilters()
}

function handlePageChange(page: number) {
  taskStore.setPage(page)
}
</script>
