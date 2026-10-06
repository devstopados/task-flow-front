import type { PaginationParams } from './paginationInterface'

export interface Project {
  id: number
  name: string
  active?: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateProjectPayload {
  name: string
  active?: boolean
}

export interface UpdateProjectPayload {
  name?: string
  active?: boolean
}

export interface ProjectFilterParams extends PaginationParams {
  name?: string
  search?: string
  active?: boolean | string
}

export interface ProjectActionResponse {
  message?: string
  project?: Project
  data?: Project
}

export interface ProjectItem {
  id?: number
  code: string
  name: string
  active?: boolean
}

export interface ProjectFormData {
  name: string
  active?: boolean
}

export interface ProjectFilterValues {
  name?: string
  status?: string
}
