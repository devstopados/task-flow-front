export interface ProjectItem {
  code: string
  startDate: string
  name: string
  responsible: string
  status: string
}

export interface ProjectFormData {
  name: string
  responsible: string
  startDate: string
  status: string
  description?: string
}

export interface ProjectFilterValues {
  code: string
  name: string
  responsible: string
}
