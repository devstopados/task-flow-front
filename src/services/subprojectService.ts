import { api } from '@/api'
import type {
  Subproject,
  CreateSubprojectPayload,
  UpdateSubprojectPayload,
  SubprojectFilterParams,
  SubprojectActionResponse,
  PaginatedResponse,
} from '@/types'

const url = '/subprojects'

export const subprojectService = {
  async getSubprojects(params?: SubprojectFilterParams): Promise<PaginatedResponse<Subproject>> {
    const cleanParams: Record<string, unknown> = {}
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = val
        }
      })
    }

    const { data } = await api.get<PaginatedResponse<Subproject> | { data: PaginatedResponse<Subproject> }>(url, {
      params: cleanParams,
    })

    if (data && 'data' in data && data.data && !Array.isArray(data.data) && 'data' in data.data) {
      return (data as { data: PaginatedResponse<Subproject> }).data
    }

    return data as PaginatedResponse<Subproject>
  },

  async getSubprojectById(id: number | string): Promise<Subproject> {
    const { data } = await api.get<Subproject | { data: Subproject } | { subproject: Subproject }>(`${url}/${id}`)
    if (data && typeof data === 'object') {
      if ('data' in data && data.data) {
        return data.data
      }
      if ('subproject' in data && data.subproject) {
        return data.subproject
      }
    }
    return data as Subproject
  },

  async createSubproject(payload: CreateSubprojectPayload): Promise<SubprojectActionResponse> {
    const finalPayload = {
      active: true,
      ...payload,
    }
    const { data } = await api.post<SubprojectActionResponse>(url, finalPayload)
    return data
  },

  async updateSubproject(
    id: number | string,
    payload: UpdateSubprojectPayload,
  ): Promise<SubprojectActionResponse> {
    const { data } = await api.put<SubprojectActionResponse>(`${url}/${id}`, payload)
    return data
  },

  async deleteSubproject(id: number | string): Promise<{ message?: string }> {
    const { data } = await api.delete<{ message?: string }>(`${url}/${id}`)
    return data
  },
}

export type {
  Subproject,
  CreateSubprojectPayload,
  UpdateSubprojectPayload,
  SubprojectFilterParams,
  SubprojectActionResponse,
}
