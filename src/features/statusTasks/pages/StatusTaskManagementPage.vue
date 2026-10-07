<template>
  <LayoutInternalPage>
    <div class="flex flex-col gap-6">
      <TaskHeader>
        Status de Atividades
        <template #description>
          Gerencie os status disponíveis para as tarefas e atividades do sistema.
        </template>
      </TaskHeader>

      <TaskCard title="Lista de status de atividades">
        <template #actions>
          <TaskButton @click="handleNewStatus"> Novo Status </TaskButton>
        </template>

        <div v-if="statusTaskStore.loading" class="flex items-center justify-center py-12">
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
            <span class="text-sm font-medium">Carregando status...</span>
          </div>
        </div>

        <template v-else>
          <TaskTable
            :columns="columns"
            :rows="tableRows"
            empty-message="Nenhum status de atividade cadastrado."
          >
            <!-- Célula: Código -->
            <template #cell-id="{ row }">
              <span class="font-medium text-slate-700">#{{ (row as StatusTaskItem).id }}</span>
            </template>

            <!-- Célula: Nome -->
            <template #cell-name="{ row }">
              <span class="font-semibold text-primary">{{ (row as StatusTaskItem).name }}</span>
            </template>

            <!-- Célula: Slug -->
            <template #cell-slug="{ row }">
              <span class="text-xs text-slate-500 font-mono">
                {{ (row as StatusTaskItem).slug || '—' }}
              </span>
            </template>

            <!-- Célula: Situação (Ativo / Inativo) -->
            <template #cell-active="{ row }">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                :class="
                  (row as StatusTaskItem).active !== false
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                "
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="
                    (row as StatusTaskItem).active !== false
                      ? 'bg-emerald-500'
                      : 'bg-slate-400'
                  "
                />
                {{ (row as StatusTaskItem).active !== false ? 'Ativo' : 'Inativo' }}
              </span>
            </template>

            <!-- Célula: Ações -->
            <template #cell-actions="{ row }">
              <div class="flex items-center gap-2">
                <!-- Editar -->
                <button
                  type="button"
                  class="rounded p-1 text-slate-400 transition hover:text-primary cursor-pointer"
                  title="Editar status"
                  @click="handleEdit(row as StatusTaskItem)"
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

                <!-- Alternar Ativo/Inativo -->
                <button
                  type="button"
                  class="rounded p-1 transition cursor-pointer"
                  :class="
                    (row as StatusTaskItem).active !== false
                      ? 'text-slate-400 hover:text-amber-600'
                      : 'text-slate-400 hover:text-emerald-600'
                  "
                  :title="
                    (row as StatusTaskItem).active !== false
                      ? 'Desativar status'
                      : 'Ativar status'
                  "
                  @click="handleToggleActive(row as StatusTaskItem)"
                >
                  <svg
                    v-if="(row as StatusTaskItem).active !== false"
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

                <!-- Excluir -->
                <button
                  type="button"
                  class="rounded p-1 text-slate-400 transition hover:text-danger cursor-pointer"
                  title="Excluir status"
                  @click="handleDelete(row as StatusTaskItem)"
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
            v-if="statusTaskStore.pagination.total > 0"
            :current-page="statusTaskStore.pagination.current_page"
            :last-page="statusTaskStore.pagination.last_page"
            :per-page="statusTaskStore.pagination.per_page"
            :total="statusTaskStore.pagination.total"
            :disabled="statusTaskStore.loading"
            @change="handlePageChange"
          />
        </template>
      </TaskCard>
    </div>

    <!-- Modal de Criação / Edição de Status -->
    <StatusTaskFormModal
      v-model="showFormModal"
      :status-task="selectedStatusTask"
      @saved="handleStatusSaved"
    />

    <!-- Modal de Confirmação de Exclusão -->
    <TaskConfirmModal
      v-model="showDeleteModal"
      title="Excluir Status"
      subtitle="Confirmação de exclusão"
      confirm-label="Excluir"
      loading-text="Excluindo..."
      variant="danger"
      description="Esta ação removerá o status de atividades do sistema."
      :loading="statusTaskStore.loading"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    >
      <p class="text-sm text-slate-600">
        Deseja realmente excluir o status
        <strong class="font-semibold text-slate-800">"{{ statusToDelete?.name }}"</strong>?
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
import StatusTaskFormModal from '@/features/statusTasks/components/StatusTaskFormModal.vue'
import type { TableColumn, StatusTask, StatusTaskItem } from '@/types'
import { useStatusTaskStore } from '@/stores/statusTask'
import { useToast } from '@/composables/useToast'

defineOptions({
  name: 'StatusTaskManagementPage',
})

const statusTaskStore = useStatusTaskStore()
const { addToast } = useToast()

const showFormModal = ref(false)
const selectedStatusTask = ref<StatusTask | null>(null)

const showDeleteModal = ref(false)
const statusToDelete = ref<StatusTask | null>(null)

const columns: TableColumn[] = [
  { key: 'id', label: 'Código' },
  { key: 'name', label: 'Nome' },
  { key: 'slug', label: 'Slug' },
  { key: 'active', label: 'Situação' },
  { key: 'actions', label: 'Ações' },
]

const tableRows = computed<StatusTaskItem[]>(() => {
  return statusTaskStore.statusTasks.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    active: item.active,
    rawStatusTask: item,
  }))
})

onMounted(async () => {
  try {
    await statusTaskStore.fetchStatusTasks()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao carregar status de atividades'
    addToast(message, 'error')
  }
})

function handleNewStatus() {
  selectedStatusTask.value = null
  showFormModal.value = true
}

function handleEdit(item: StatusTaskItem) {
  selectedStatusTask.value = item.rawStatusTask
  showFormModal.value = true
}

async function handleToggleActive(item: StatusTaskItem) {
  const newStatus = !(item.active !== false)
  try {
    await statusTaskStore.updateStatusTask(item.id, {
      name: item.name,
      slug: item.slug,
      active: newStatus,
    })
    addToast(`Status ${newStatus ? 'ativado' : 'desativado'} com sucesso!`, 'success')
    await statusTaskStore.fetchStatusTasks()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao alterar situação do status'
    addToast(message, 'error')
  }
}

function handleDelete(item: StatusTaskItem) {
  statusToDelete.value = item.rawStatusTask
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!statusToDelete.value?.id) return
  try {
    await statusTaskStore.deleteStatusTask(statusToDelete.value.id)
    addToast('Status excluído com sucesso!', 'success')
    showDeleteModal.value = false
    statusToDelete.value = null
    await statusTaskStore.fetchStatusTasks()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao excluir status'
    addToast(message, 'error')
  }
}

async function handleStatusSaved() {
  await statusTaskStore.fetchStatusTasks()
}

function handlePageChange(newPage: number) {
  statusTaskStore.setPage(newPage)
}
</script>
