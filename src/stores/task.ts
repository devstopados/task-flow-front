import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { taskService } from '@/services/taskService'
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilterParams,
  PaginationMeta,
} from '@/types'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
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
  const filters = ref<TaskFilterParams>({})

  const hasTasks = computed(() => tasks.value.length > 0)
  const totalTasks = computed(() => pagination.value.total)

  async function fetchTasks(customParams?: TaskFilterParams) {
    loading.value = true
    error.value = null
    try {
      const mergedParams: TaskFilterParams = {
        page: pagination.value.current_page,
        per_page: pagination.value.per_page,
        ...filters.value,
        ...customParams,
      }

      const response = await taskService.getTasks(mergedParams)

      tasks.value = Array.isArray(response.data) ? response.data : []

      const meta = response.meta ?? response
      const currentPage = Number(meta.current_page ?? response.current_page ?? mergedParams.page ?? 1)
      const perPage = Number(meta.per_page ?? response.per_page ?? mergedParams.per_page ?? 10)
      const total = Number(meta.total ?? response.total ?? tasks.value.length)
      const lastPage = Number(
        meta.last_page ?? response.last_page ?? Math.ceil(total / perPage) ?? 1,
      )

      pagination.value = {
        current_page: currentPage,
        last_page: Math.max(1, lastPage),
        per_page: perPage,
        total: total,
        from: meta.from ?? response.from ?? (total > 0 ? (currentPage - 1) * perPage + 1 : 0),
        to: meta.to ?? response.to ?? (total > 0 ? Math.min(currentPage * perPage, total) : 0),
      }

      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar tarefas'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTaskById(id: number | string) {
    loading.value = true
    error.value = null
    try {
      const task = await taskService.getTaskById(id)
      currentTask.value = task
      return task
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar tarefa'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createTask(payload: CreateTaskPayload) {
    saving.value = true
    error.value = null
    try {
      const response = await taskService.createTask(payload)
      await fetchTasks()
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar tarefa'
      error.value = message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function updateTask(id: number | string, payload: UpdateTaskPayload) {
    saving.value = true
    error.value = null
    try {
      const response = await taskService.updateTask(id, payload)
      await fetchTasks()
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar tarefa'
      error.value = message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function deleteTask(id: number | string) {
    loading.value = true
    error.value = null
    try {
      const response = await taskService.deleteTask(id)
      await fetchTasks()
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir tarefa'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    if (page < 1 || (pagination.value.last_page && page > pagination.value.last_page)) return
    pagination.value.current_page = page
    return fetchTasks({ page })
  }

  function setFilters(newFilters: TaskFilterParams) {
    filters.value = { ...newFilters }
    pagination.value.current_page = 1
    return fetchTasks({ ...newFilters, page: 1 })
  }

  function clearFilters() {
    filters.value = {}
    pagination.value.current_page = 1
    return fetchTasks({ page: 1 })
  }

  function resetState() {
    tasks.value = []
    currentTask.value = null
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
    tasks,
    currentTask,
    pagination,
    loading,
    saving,
    error,
    filters,
    hasTasks,
    totalTasks,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    setPage,
    setFilters,
    clearFilters,
    resetState,
  }
})
