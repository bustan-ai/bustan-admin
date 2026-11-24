import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import logo from '../assets/logo.png'
import { NotAdminError } from '../auth/admin'
import { useAuth } from '../auth/useAuth'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { useLanguage } from '../i18n/useLanguage'
import type { TranslationKey } from '../i18n/translations'
import { ApiError } from '../lib/api'

function loginErrorKey(err: unknown): TranslationKey {
  if (err instanceof NotAdminError) return 'errors.notAdmin'
  if (err instanceof ApiError) {
    if (err.status === 401 || err.status === 400) return 'errors.invalidCredentials'
    if (err.status === 0) return 'errors.network'
  }
  return 'errors.generic'
}

export function LoginPage() {
  const { account, isLoading, login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<TranslationKey | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!isLoading && account) return <Navigate to={from} replace />

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(phoneNumber.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(loginErrorKey(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center bg-stone-50 px-4 dark:bg-stone-950">
      <LanguageSwitcher className="absolute right-4 top-4" />

      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img
            src={logo}
            alt=""
            width={80}
            height={80}
            className="mx-auto mb-4 size-20 rounded-2xl shadow-sm"
          />
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">{t('app.name')}</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{t('login.subtitle')}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900"
        >
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              {t('login.phone')}
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="username"
              dir="ltr"
              required
              placeholder="0933123456"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none rtl:text-right dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
              {t('login.password')}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
              {t(error)}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? t('login.submitting') : t('login.submit')}
          </button>
        </form>
      </div>
    </main>
  )
}
