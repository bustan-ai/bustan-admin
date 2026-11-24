import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LanguageContext, type LanguageState } from './languageContext'
import { LANGUAGES, translations, type Language, type TranslationKey } from './translations'

const STORAGE_KEY = 'bustan-admin.language'

function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && value in translations
}

// Saved choice first, then the browser's language, then English.
function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLanguage(saved)) return saved
  } catch {
    // Storage unavailable: fall through.
  }
  return navigator.language.toLowerCase().startsWith('ar') ? 'ar' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const { dir } = LANGUAGES[language]

  // Keep <html lang dir> in sync so the browser and Tailwind lay out RTL correctly.
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = dir
  }, [language, dir])

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable: the choice just won't persist.
    }
  }, [])

  const t = useCallback((key: TranslationKey) => translations[language][key], [language])

  const value = useMemo<LanguageState>(
    () => ({ language, dir, setLanguage, t }),
    [language, dir, setLanguage, t],
  )

  return <LanguageContext value={value}>{children}</LanguageContext>
}
