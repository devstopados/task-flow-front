import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { statusTaskService } from '@/services/statusTaskService'
import type {
  StatusTask,
  CreateStatusTaskPayload,
  UpdateStatusTaskPayload,
  StatusTaskFilterParams,
  PaginationMeta,
  PaginatedResponse,
} from '@/types'

export const useStatusTaskStore = defineStore('statusTask', () => {
  const statusTasks = ref<StatusTask[]>([])
  const currentStatusTask = ref<StatusTask | null>(null)
  const pagination = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: null,
    to: null,
  })
  const loading = ref<boolean>(false)
  const saving = ref<boolean>(false)
  const error = ref<string | null>(null)
  const filters = ref<StatusTaskFilterParams>({})

  const hasStatusTasks = computed(() => statusTasks.value.length > 0)
  const totalStatusTasks = computed(() => pagination.value.total)
  const statusOptions = computed(() =>
    statusTasks.value.map((status) => ({
      label: status.name,
      value: String(status.id),
    })),
  )

  async function fetchStatusTasks(customParams?: StatusTaskFilterParams) {
    loading.value = true
    error.value = null
    try {
      const mergedParams: StatusTaskFilterParams = {
        page: pagination.value.current_page,
        per_page: pagination.value.per_page,
        ...filters.value,
        ...customParams,
      }

      const response = await statusTaskService.getStatusTasks(mergedParams)

      if (Array.isArray(response)) {
        statusTasks.value = response
      } else if (response && 'data' in response && Array.isArray(response.data)) {
        statusTasks.value = response.data
      } else {
        statusTasks.value = []
      }

      if (response && !Array.isArray(response) && 'total' in response) {
        const paginated = response as PaginatedResponse<StatusTask>
        const meta = paginated.meta ?? paginated
        const currentPage = Number(meta.current_page ?? paginated.current_page ?? mergedParams.page ?? 1)
        const perPage = Number(meta.per_page ?? paginated.per_page ?? mergedParams.per_page ?? 10)
        const total = Number(meta.total ?? paginated.total ?? statusTasks.value.length)
        const lastPage = Number(
          meta.last_page ?? paginated.last_page ?? Math.ceil(total / perPage) ?? 1,
        )

        pagination.value = {
          current_page: currentPage,
          last_page: Math.max(1, lastPage),
          per_page: perPage,
          total: total,
          from: meta.from ?? paginated.from ?? (total > 0 ? (currentPage - 1) * perPage + 1 : 0),
          to: meta.to ?? paginated.to ?? (total > 0 ? Math.min(currentPage * perPage, total) : 0),
        }
      } else {
        pagination.value.total = statusTasks.value.length
      }

      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar status das tarefas'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchAllStatusTasks(customParams?: Omit<StatusTaskFilterParams, 'all'>) {
    loading.value = true
    error.value = null
    try {
      const data = await statusTaskService.getAllStatusTasks(customParams)
      statusTasks.value = data
      pagination.value.total = data.length
      return data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar todos os status'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchStatusTaskById(id: number | string) {
    loading.value = true
    error.value = null
    try {
      const statusTask = await statusTaskService.getStatusTaskById(id)
      currentStatusTask.value = statusTask
      return statusTask
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar detalhes do status'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createStatusTask(payload: CreateStatusTaskPayload) {
    saving.value = true
    error.value = null
    try {
      const response = await statusTaskService.createStatusTask(payload)
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar status'
      error.value = message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function updateStatusTask(id: number | string, payload: UpdateStatusTaskPayload) {
    saving.value = true
    error.value = null
    try {
      const response = await statusTaskService.updateStatusTask(id, payload)
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar status'
      error.value = message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function deleteStatusTask(id: number | string) {
    loading.value = true
    error.value = null
    try {
      const response = await statusTaskService.deleteStatusTask(id)
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir status'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    if (page < 1 || (pagination.value.last_page && page > pagination.value.last_page)) return
    pagination.value.current_page = page
    return fetchStatusTasks({ page })
  }

  function setFilters(newFilters: StatusTaskFilterParams) {
    filters.value = { ...newFilters }
    pagination.value.current_page = 1
    return fetchStatusTasks({ ...newFilters, page: 1 })
  }

  function clearFilters() {
    filters.value = {}
    pagination.value.current_page = 1
    return fetchStatusTasks({ page: 1 })
  }

  function resetState() {
    statusTasks.value = []
    currentStatusTask.value = null
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: null,
      to: null,
    }
    error.value = null
    filters.value = {}
  }

  return {
    statusTasks,
    currentStatusTask,
    pagination,
    loading,
    saving,
    error,
    filters,
    hasStatusTasks,
    totalStatusTasks,
    statusOptions,
    fetchStatusTasks,
    fetchAllStatusTasks,
    fetchStatusTaskById,
    createStatusTask,
    updateStatusTask,
    deleteStatusTask,
    setPage,
    setFilters,
    clearFilters,
    resetState,
  }
})
