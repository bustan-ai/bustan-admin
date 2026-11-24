import { useLanguage } from '../i18n/useLanguage'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage()
  const next = language === 'ar' ? 'en' : 'ar'

  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      aria-label={t('language.label')}
      lang={next}
      className={`rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 ${className}`}
    >
      {t('language.switchTo')}
    </button>
  )
}
