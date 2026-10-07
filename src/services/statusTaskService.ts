import { api } from '@/api'
import type {
  StatusTask,
  CreateStatusTaskPayload,
  UpdateStatusTaskPayload,
  StatusTaskFilterParams,
  StatusTaskActionResponse,
  PaginatedResponse,
} from '@/types'

const url = '/status-tasks'

export const statusTaskService = {
  async getStatusTasks(
    params?: StatusTaskFilterParams,
  ): Promise<PaginatedResponse<StatusTask> | { data: StatusTask[] }> {
    const cleanParams: Record<string, unknown> = {}
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = val
        }
      })
    }

    const { data } = await api.get<
      | PaginatedResponse<StatusTask>
      | { data: PaginatedResponse<StatusTask> }
      | { data: StatusTask[] }
      | StatusTask[]
    >(url, {
      params: cleanParams,
    })

    if (data && 'data' in data && data.data && !Array.isArray(data.data) && 'data' in data.data) {
      return (data as { data: PaginatedResponse<StatusTask> }).data
    }

    return data as PaginatedResponse<StatusTask> | { data: StatusTask[] }
  },

  async getAllStatusTasks(params?: Omit<StatusTaskFilterParams, 'all'>): Promise<StatusTask[]> {
    const cleanParams: Record<string, unknown> = { all: true }
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = val
        }
      })
    }

    const { data } = await api.get<{ data: StatusTask[] } | StatusTask[]>(url, {
      params: cleanParams,
    })

    if (data && 'data' in data && Array.isArray(data.data)) {
      return data.data
    }
    if (Array.isArray(data)) {
      return data
    }
    return []
  },

  async getStatusTaskById(id: number | string): Promise<StatusTask> {
    const { data } = await api.get<StatusTask | { data: StatusTask }>(`${url}/${id}`)
    if (data && typeof data === 'object' && 'data' in data && data.data) {
      return data.data
    }
    return data as StatusTask
  },

  async createStatusTask(payload: CreateStatusTaskPayload): Promise<StatusTaskActionResponse> {
    const finalPayload = {
      active: true,
      ...payload,
    }
    const { data } = await api.post<StatusTaskActionResponse>(url, finalPayload)
    return data
  },

  async updateStatusTask(
    id: number | string,
    payload: UpdateStatusTaskPayload,
  ): Promise<StatusTaskActionResponse> {
    const { data } = await api.put<StatusTaskActionResponse>(`${url}/${id}`, payload)
    return data
  },

  async deleteStatusTask(id: number | string): Promise<{ message?: string }> {
    const { data } = await api.delete<{ message?: string }>(`${url}/${id}`)
    return data
  },
}

export type {
  StatusTask,
  CreateStatusTaskPayload,
  UpdateStatusTaskPayload,
  StatusTaskFilterParams,
  StatusTaskActionResponse,
}
