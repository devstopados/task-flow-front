import type { PaginationParams } from './paginationInterface'
import type { Project } from './projectInterface'

export interface Subproject {
  id: number
  project_id: number
  name: string
  active?: boolean
  created_at?: string
  updated_at?: string
  project?: Project
}

export interface CreateSubprojectPayload {
  project_id: number
  name: string
  active?: boolean
}

export interface UpdateSubprojectPayload {
  project_id?: number
  name?: string
  active?: boolean
}

export interface SubprojectFilterParams extends PaginationParams {
  name?: string
  project_id?: number
  active?: boolean
}

export interface SubprojectActionResponse {
  message?: string
  subproject?: Subproject
  data?: Subproject
}

export interface SubprojectFormData {
  name: string
  project_id?: number
  active?: boolean
}
