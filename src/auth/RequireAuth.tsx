import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useLanguage } from '../i18n/useLanguage'
import { useAuth } from './useAuth'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { account, isLoading } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-stone-500">
        {t('common.loading')}
      </div>
    )
  }
  if (!account) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}
