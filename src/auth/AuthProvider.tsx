import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ApiError, authApi, getToken, setToken } from '../lib/api'
import { isAdmin, NotAdminError } from './admin'
import { AuthContext, type AuthState } from './authContext'

// End a session we won't use (e.g. a non-admin account). Best effort.
function revoke(token: string) {
  authApi.logout(token).catch(() => {})
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setTokenState] = useState<string | null>(() => getToken())

  const forget = useCallback(() => {
    setToken(null)
    setTokenState(null)
  }, [])

  const meQuery = useQuery({
    queryKey: ['auth', 'me', token],
    queryFn: async () => {
      let account
      try {
        account = await authApi.me()
      } catch (err) {
        // Saved token expired or revoked: forget it and show the login page.
        if (err instanceof ApiError && err.status === 401) forget()
        throw err
      }
      // Saved session belongs to an account that is no longer an admin.
      if (!isAdmin(account)) {
        if (token) revoke(token)
        forget()
        throw new NotAdminError()
      }
      return account
    },
    enabled: token !== null,
    retry: false,
    staleTime: Infinity,
  })

  const login = useCallback(
    async (phoneNumber: string, password: string) => {
      const res = await authApi.login(phoneNumber, password)
      if (!isAdmin(res.account)) {
        revoke(res.access_token)
        throw new NotAdminError()
      }
      setToken(res.access_token)
      queryClient.setQueryData(['auth', 'me', res.access_token], res.account)
      setTokenState(res.access_token)
    },
    [queryClient],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Sign out locally even if the server call fails.
    }
    forget()
    queryClient.clear()
  }, [forget, queryClient])

  const value = useMemo<AuthState>(
    () => ({
      account: token ? (meQuery.data ?? null) : null,
      isLoading: token !== null && meQuery.isPending,
      login,
      logout,
    }),
    [token, meQuery.data, meQuery.isPending, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
