import { useAuth } from '../auth/useAuth'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { useLanguage } from '../i18n/useLanguage'

// Placeholder until the stats dashboards are built.
export function DashboardPage() {
  const { account, logout } = useAuth()
  const { t } = useLanguage()

  return (
    <div className="min-h-svh bg-stone-50 dark:bg-stone-950">
      {/* The language switcher stays at the physical right edge in both
          directions: last item in LTR, first item (= rightmost) in RTL. */}
      <header className="flex items-center gap-3 border-b border-stone-200 bg-white px-4 py-3 dark:border-stone-800 dark:bg-stone-900">
        <span className="me-auto font-semibold text-stone-900 dark:text-stone-50">{t('app.name')}</span>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-stone-600 dark:text-stone-400">
            {account?.full_name ?? <bdi dir="ltr">{account?.phone_number}</bdi>}
          </span>
          <button
            onClick={() => void logout()}
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            {t('auth.signOut')}
          </button>
        </div>
        <LanguageSwitcher className="rtl:order-first" />
      </header>
      <main className="p-4 text-stone-700 dark:text-stone-300">
        <p>{t('dashboard.placeholder')}</p>
      </main>
    </div>
  )
}
