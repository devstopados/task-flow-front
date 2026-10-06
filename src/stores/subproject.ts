import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { subprojectService } from '@/services/subprojectService'
import type {
  Subproject,
  CreateSubprojectPayload,
  UpdateSubprojectPayload,
  SubprojectFilterParams,
  PaginationMeta,
} from '@/types'

export const useSubprojectStore = defineStore('subproject', () => {
  const subprojects = ref<Subproject[]>([])
  const currentSubproject = ref<Subproject | null>(null)
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
  const filters = ref<SubprojectFilterParams>({})

  const hasSubprojects = computed(() => subprojects.value.length > 0)
  const totalSubprojects = computed(() => pagination.value.total)

  async function fetchSubprojects(customParams?: SubprojectFilterParams) {
    loading.value = true
    error.value = null
    try {
      const mergedParams: SubprojectFilterParams = {
        page: pagination.value.current_page,
        per_page: pagination.value.per_page,
        ...filters.value,
        ...customParams,
      }

      const response = await subprojectService.getSubprojects(mergedParams)

      subprojects.value = Array.isArray(response.data) ? response.data : []

      const meta = response.meta ?? response
      const currentPage = Number(meta.current_page ?? response.current_page ?? mergedParams.page ?? 1)
      const perPage = Number(meta.per_page ?? response.per_page ?? mergedParams.per_page ?? 10)
      const total = Number(meta.total ?? response.total ?? subprojects.value.length)
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
      const message = err instanceof Error ? err.message : 'Erro ao buscar subprojetos'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSubprojectById(id: number | string) {
    loading.value = true
    error.value = null
    try {
      const subproject = await subprojectService.getSubprojectById(id)
      currentSubproject.value = subproject
      return subproject
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar detalhes do subprojeto'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createSubproject(payload: CreateSubprojectPayload) {
    saving.value = true
    error.value = null
    try {
      const response = await subprojectService.createSubproject(payload)
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar subprojeto'
      error.value = message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function updateSubproject(id: number | string, payload: UpdateSubprojectPayload) {
    saving.value = true
    error.value = null
    try {
      const response = await subprojectService.updateSubproject(id, payload)
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar subprojeto'
      error.value = message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function deleteSubproject(id: number | string) {
    loading.value = true
    error.value = null
    try {
      const response = await subprojectService.deleteSubproject(id)
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir subprojeto'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    if (page < 1 || (pagination.value.last_page && page > pagination.value.last_page)) return
    pagination.value.current_page = page
    return fetchSubprojects({ page })
  }

  function setFilters(newFilters: SubprojectFilterParams) {
    filters.value = { ...newFilters }
    pagination.value.current_page = 1
    return fetchSubprojects({ ...newFilters, page: 1 })
  }

  function clearFilters() {
    filters.value = {}
    pagination.value.current_page = 1
    return fetchSubprojects({ page: 1 })
  }

  function resetState() {
    subprojects.value = []
    currentSubproject.value = null
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
    subprojects,
    currentSubproject,
    pagination,
    loading,
    saving,
    error,
    filters,
    hasSubprojects,
    totalSubprojects,
    fetchSubprojects,
    fetchSubprojectById,
    createSubproject,
    updateSubproject,
    deleteSubproject,
    setPage,
    setFilters,
    clearFilters,
    resetState,
  }
})
