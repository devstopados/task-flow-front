import { api } from '@/api'
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectFilterParams,
  ProjectActionResponse,
  PaginatedResponse,
} from '@/types'

const url = '/projects'

export const projectService = {
  async getProjects(params?: ProjectFilterParams): Promise<PaginatedResponse<Project>> {
    const cleanParams: Record<string, unknown> = {}
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = val
        }
      })
      if (params.name && !cleanParams.search) {
        cleanParams.search = params.name
      }
    }

    const { data } = await api.get<PaginatedResponse<Project> | { data: PaginatedResponse<Project> }>(url, {
      params: cleanParams,
    })

    if (data && 'data' in data && data.data && !Array.isArray(data.data) && 'data' in data.data) {
      return (data as { data: PaginatedResponse<Project> }).data
    }

    return data as PaginatedResponse<Project>
  },

  async getProjectById(id: number | string): Promise<Project> {
    const { data } = await api.get<Project | { data: Project } | { project: Project }>(`${url}/${id}`)
    if (data && typeof data === 'object') {
      if ('data' in data && data.data) {
        return data.data
      }
      if ('project' in data && data.project) {
        return data.project
      }
    }
    return data as Project
  },

  async createProject(payload: CreateProjectPayload): Promise<ProjectActionResponse> {
    const { data } = await api.post<ProjectActionResponse>(url, payload)
    return data
  },

  async updateProject(
    id: number | string,
    payload: UpdateProjectPayload,
  ): Promise<ProjectActionResponse> {
    const { data } = await api.put<ProjectActionResponse>(`${url}/${id}`, payload)
    return data
  },

  async deleteProject(id: number | string): Promise<{ message?: string }> {
    const { data } = await api.delete<{ message?: string }>(`${url}/${id}`)
    return data
  },
}

export type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectFilterParams,
  ProjectActionResponse,
}
