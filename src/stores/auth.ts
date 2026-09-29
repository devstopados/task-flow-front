import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '@/services/authService'
import type { User, LoginPayload, LoginResponse } from '@/types'

const TOKEN_KEY = 'taskflow_token'
const USER_KEY = 'taskflow_user'

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function getStoredUser(): User | null {
  const stored = localStorage.getItem(USER_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as User
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getStoredToken())
  const user = ref<User | null>(getStoredUser())

  const isAuthenticated = computed(() => Boolean(token.value))

  function setSession(newToken: string, newUser: User): void {
    token.value = newToken
    user.value = newUser
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  }

  function clearSession(): void {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  async function login(credentials: LoginPayload): Promise<LoginResponse> {
    const response = await authService.login(credentials)
    setSession(response.token, response.user)
    return response
  }

  async function logout(): Promise<void> {
    try {
      if (token.value) {
        await authService.logout()
      }
    } catch {
      // Ignora erro de requisição no logout para garantir limpeza de sessão local
    } finally {
      clearSession()
    }
  }

  async function fetchUser(): Promise<User | null> {
    if (!token.value) return null
    try {
      const userData = await authService.getUser()
      user.value = userData
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
      return userData
    } catch {
      clearSession()
      return null
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    fetchUser,
    setSession,
    clearSession,
  }
})
