import logo from '../assets/logo.png'
import { useAuth } from '../auth/useAuth'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { StatsChart } from '../components/StatsChart'
import { useLanguage } from '../i18n/useLanguage'

export function DashboardPage() {
  const { account, logout } = useAuth()
  const { t } = useLanguage()

  return (
    <div className="min-h-svh bg-stone-50 dark:bg-stone-950">
      {/* The header keeps one physical layout in both languages, so the
          controls don't jump when the language changes: app name on the
          left; name, sign out and language switch on the right. */}
      <header
        dir="ltr"
        className="flex items-center gap-3 bg-brand-header px-4 py-3 text-brand-ink shadow-sm"
      >
        <div className="me-auto flex items-center gap-2.5">
          <img src={logo} alt="" width={32} height={32} className="size-8 rounded-lg" />
          <span dir="auto" className="font-semibold">
            {t('app.name')}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span dir="auto">
            {account?.full_name ?? <bdi dir="ltr">{account?.phone_number}</bdi>}
          </span>
          <button
            dir="auto"
            onClick={() => void logout()}
            className="rounded-lg border border-brand-ink/30 px-3 py-1.5 hover:bg-brand-ink/10"
          >
            {t('auth.signOut')}
          </button>
          <LanguageSwitcher variant="brand" />
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
        <StatsChart metric="scans" />
        <StatsChart metric="users" />
      </main>
    </div>
  )
}
