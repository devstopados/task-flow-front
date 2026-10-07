import type { PaginationParams } from './paginationInterface'
import type { Subproject } from './subprojectInterface'
import type { StatusTask } from './statusTaskInterface'

export interface Task {
  id: number
  code?: string | null
  name: string
  start_date?: string | null
  end_date?: string | null
  hours?: number | null
  branch?: string | null
  link?: string | null
  status_id: number
  status?: StatusTask | null
  subproject_id?: number | null
  subproject?: Subproject | null
  created_at?: string
  updated_at?: string
}

export interface CreateTaskPayload {
  code?: string
  name: string
  start_date?: string
  end_date?: string
  hours?: number | null
  branch?: string
  link?: string
  status_id: number
  subproject_id?: number | null
}

export interface UpdateTaskPayload {
  code?: string
  name?: string
  start_date?: string
  end_date?: string
  hours?: number | null
  branch?: string
  link?: string
  status_id?: number
  subproject_id?: number | null
}

export interface TaskFilterParams extends PaginationParams {
  search?: string
  code?: string
  name?: string
  subproject_id?: number | string
  status_id?: number | string
}

export interface TaskFilterValues {
  search?: string
  subproject_id?: number | string
  status_id?: number | string
}

export interface TaskItem {
  id: number
  code: string
  name: string
  startDate: string
  endDate?: string
  hours?: string | number
  branch?: string
  link?: string
  subproject?: string
  subproject_id?: number | null
  status_id: number
  statusLabel: string
  rawTask: Task
}

export interface TaskFormData {
  code?: string
  name: string
  start_date?: string
  end_date?: string
  hours?: number | string | null
  branch?: string
  link?: string
  status_id: number
  subproject_id?: number | string | null
}

export interface TaskActionResponse {
  message?: string
  data?: Task
  task?: Task
}

export const TASK_STATUS_OPTIONS = [
  { value: 1, label: 'Não Iniciada' },
  { value: 2, label: 'Em andamento' },
  { value: 3, label: 'Pausada' },
  { value: 4, label: 'Concluída' },
] as const

export const TASK_STATUS_MAP: Record<number, { label: string; badgeClass: string }> = {
  1: { label: 'Não Iniciada', badgeClass: 'bg-slate-100 text-slate-600' },
  2: { label: 'Em andamento', badgeClass: 'bg-sky-50 text-sky-700' },
  3: { label: 'Pausada', badgeClass: 'bg-amber-50 text-amber-700' },
  4: { label: 'Concluída', badgeClass: 'bg-emerald-50 text-emerald-700' },
}
