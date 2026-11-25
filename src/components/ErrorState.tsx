import { useLanguage } from '../i18n/useLanguage'
import { ApiError } from '../lib/api'

type Props = { error: unknown; onRetry: () => void; className?: string }

export function ErrorState({ error, onRetry, className = 'h-80' }: Props) {
  const { t } = useLanguage()
  const key =
    error instanceof ApiError && error.status === 403
      ? 'errors.forbidden'
      : error instanceof ApiError && error.status === 0
        ? 'errors.network'
        : 'errors.loadFailed'
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-sm text-stone-600 dark:text-stone-400 ${className}`}
    >
      <p role="alert">{t(key)}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-stone-300 px-3 py-1.5 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
      >
        {t('common.retry')}
      </button>
    </div>
  )
}
