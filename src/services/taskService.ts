import { api } from '@/api'
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilterParams,
  TaskActionResponse,
  PaginatedResponse,
} from '@/types'

const url = '/tasks'

export const taskService = {
  async getTasks(params?: TaskFilterParams): Promise<PaginatedResponse<Task>> {
    const cleanParams: Record<string, unknown> = {}
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = val
        }
      })
      if (!cleanParams.search && (params.search || params.name || params.code)) {
        cleanParams.search = params.search || params.name || params.code
      }
    }

    const { data } = await api.get<PaginatedResponse<Task> | { data: PaginatedResponse<Task> }>(url, {
      params: cleanParams,
    })

    if (data && 'data' in data && data.data && !Array.isArray(data.data) && 'data' in data.data) {
      return (data as { data: PaginatedResponse<Task> }).data
    }

    return data as PaginatedResponse<Task>
  },

  async getTaskById(id: number | string): Promise<Task> {
    const { data } = await api.get<Task | { data: Task } | { task: Task }>(`${url}/${id}`)
    if (data && typeof data === 'object') {
      if ('data' in data && data.data) {
        return data.data
      }
      if ('task' in data && data.task) {
        return data.task
      }
    }
    return data as Task
  },

  async createTask(payload: CreateTaskPayload): Promise<TaskActionResponse> {
    const { data } = await api.post<TaskActionResponse>(url, payload)
    return data
  },

  async updateTask(
    id: number | string,
    payload: UpdateTaskPayload,
  ): Promise<TaskActionResponse> {
    const { data } = await api.put<TaskActionResponse>(`${url}/${id}`, payload)
    return data
  },

  async deleteTask(id: number | string): Promise<{ message?: string }> {
    const { data } = await api.delete<{ message?: string }>(`${url}/${id}`)
    return data
  },
}

export type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilterParams,
  TaskActionResponse,
}
