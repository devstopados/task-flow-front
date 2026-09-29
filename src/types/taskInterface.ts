export interface TaskItem {
  code: string
  startDate: string
  name: string
  project: string
  status: string
}

export interface TaskFormData {
  name: string
  project: string
  startDate: string
  status: string
  description?: string
}

export interface TaskFilterValues {
  code: string
  name: string
  project: string
}
