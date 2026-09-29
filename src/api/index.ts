import axios, { type AxiosInstance, type InternalAxiosRequestConfig, AxiosError } from 'axios'

export class ApiError extends Error {
  public status: number
  public data: unknown
  public errors?: Record<string, string[]>

  constructor(message: string, status: number, data?: unknown, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
    this.errors = errors
  }
}

const DEFAULT_BASE_URL = 'http://localhost:8000/api'

export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined
  if (!envUrl) return DEFAULT_BASE_URL
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl
}

export const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('taskflow_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    if (error.response) {
      const data = error.response.data
      const status = error.response.status

      if (status === 401) {
        localStorage.removeItem('taskflow_token')
        localStorage.removeItem('taskflow_user')
        if (window.location.hash && window.location.hash !== '#/') {
          window.location.hash = '#/'
        }
      }

      const message =
        (data && typeof data === 'object' && data.message) ||
        error.message ||
        `Erro na requisição (${status})`
      const errors = data && typeof data === 'object' ? data.errors : undefined

      return Promise.reject(new ApiError(message, status, data, errors))
    }

    return Promise.reject(new ApiError(error.message || 'Erro de conexão com o servidor', 0, null))
  },
)

export default api
