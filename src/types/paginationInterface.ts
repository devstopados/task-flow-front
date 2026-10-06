export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from?: number | null
  to?: number | null
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
  from?: number | null
  to?: number | null
  meta?: PaginationMeta
  links?: Record<string, unknown>
}

export interface PaginationParams {
  page?: number
  per_page?: number
}
