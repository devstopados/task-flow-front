import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { projectService } from '@/services/projectService'
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectFilterParams,
  PaginationMeta,
} from '@/types'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
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
  const filters = ref<ProjectFilterParams>({})

  const hasProjects = computed(() => projects.value.length > 0)
  const totalProjects = computed(() => pagination.value.total)

  async function fetchProjects(customParams?: ProjectFilterParams) {
    loading.value = true
    error.value = null
    try {
      const mergedParams: ProjectFilterParams = {
        page: pagination.value.current_page,
        per_page: pagination.value.per_page,
        ...filters.value,
        ...customParams,
      }

      const response = await projectService.getProjects(mergedParams)

      projects.value = Array.isArray(response.data) ? response.data : []

      const meta = response.meta ?? response
      const currentPage = Number(meta.current_page ?? response.current_page ?? mergedParams.page ?? 1)
      const perPage = Number(meta.per_page ?? response.per_page ?? mergedParams.per_page ?? 10)
      const total = Number(meta.total ?? response.total ?? projects.value.length)
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
      const message = err instanceof Error ? err.message : 'Erro ao buscar projetos'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchProjectById(id: number | string) {
    loading.value = true
    error.value = null
    try {
      const project = await projectService.getProjectById(id)
      currentProject.value = project
      return project
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar detalhes do projeto'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createProject(payload: CreateProjectPayload) {
    saving.value = true
    error.value = null
    try {
      const response = await projectService.createProject(payload)
      await fetchProjects()
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar projeto'
      error.value = message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function updateProject(id: number | string, payload: UpdateProjectPayload) {
    saving.value = true
    error.value = null
    try {
      const response = await projectService.updateProject(id, payload)
      await fetchProjects()
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar projeto'
      error.value = message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function deleteProject(id: number | string) {
    loading.value = true
    error.value = null
    try {
      const response = await projectService.deleteProject(id)
      await fetchProjects()
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir projeto'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    if (page < 1 || (pagination.value.last_page && page > pagination.value.last_page)) return
    pagination.value.current_page = page
    return fetchProjects({ page })
  }

  function setFilters(newFilters: ProjectFilterParams) {
    filters.value = { ...newFilters }
    pagination.value.current_page = 1
    return fetchProjects({ ...newFilters, page: 1 })
  }

  function clearFilters() {
    filters.value = {}
    pagination.value.current_page = 1
    return fetchProjects({ page: 1 })
  }

  function resetState() {
    projects.value = []
    currentProject.value = null
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
    projects,
    currentProject,
    pagination,
    loading,
    saving,
    error,
    filters,
    hasProjects,
    totalProjects,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    setPage,
    setFilters,
    clearFilters,
    resetState,
  }
})
