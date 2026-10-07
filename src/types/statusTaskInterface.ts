export interface StatusTask {
  id: number
  name: string
  slug?: string
  active?: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateStatusTaskPayload {
  name: string
  slug?: string
  active?: boolean
}

export interface UpdateStatusTaskPayload {
  name?: string
  slug?: string
  active?: boolean
}

export interface StatusTaskFilterParams {
  search?: string
  active?: boolean | number | string
  all?: boolean | number
  page?: number
  per_page?: number
}

export interface StatusTaskActionResponse {
  message?: string
  data?: StatusTask
}
