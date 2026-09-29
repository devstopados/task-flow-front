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

  async getUser(): Promise<User> {
    const { data } = await api.get<User>(`${url}/user`)
    return data
  },
}

export type { User, LoginPayload, LoginResponse }
