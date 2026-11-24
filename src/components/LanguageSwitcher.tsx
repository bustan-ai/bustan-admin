import { useLanguage } from '../i18n/useLanguage'

const VARIANTS = {
  // On the page background (login screen).
  default:
    'border-stone-300 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800',
  // On the leaf-green header.
  brand: 'border-brand-ink/30 text-brand-ink hover:bg-brand-ink/10',
} as const

type Props = { className?: string; variant?: keyof typeof VARIANTS }

export function LanguageSwitcher({ className = '', variant = 'default' }: Props) {
  const { language, setLanguage, t } = useLanguage()
  const next = language === 'ar' ? 'en' : 'ar'

  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      aria-label={t('language.label')}
      lang={next}
      className={`rounded-lg border px-3 py-1.5 text-sm ${VARIANTS[variant]} ${className}`}
    >
      {t('language.switchTo')}
    </button>
  )
}
