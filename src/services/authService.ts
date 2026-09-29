import { api } from '@/api'
import type { User, LoginPayload, LoginResponse } from '@/types'

const url = '/auth'

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(`${url}/login`, payload)
    return data
  },

  async logout(): Promise<{ message?: string }> {
    const { data } = await api.post<{ message?: string }>(`${url}/logout`)
    return data
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User | { user: User } | { data: User }>(`${url}/me`)
    if (data && typeof data === 'object') {
      if ('user' in data && data.user) {
        return data.user
      }
      if ('data' in data && data.data && typeof data.data === 'object' && 'id' in data.data) {
        return data.data as User
      }
    }
    return data as User
  },

  async getUser(): Promise<User> {
    return this.getMe()
  },
}

export type { User, LoginPayload, LoginResponse }
