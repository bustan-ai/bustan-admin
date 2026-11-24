import { createContext } from 'react'
import type { Account } from '../lib/api'

export type AuthState = {
  account: Account | null
  /** True while a saved token is being checked against /auth/me. */
  isLoading: boolean
  login: (phoneNumber: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)
