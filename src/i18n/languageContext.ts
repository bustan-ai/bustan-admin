import { createContext } from 'react'
import type { Language, TranslationKey } from './translations'

export type LanguageState = {
  language: Language
  dir: 'ltr' | 'rtl'
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}

export const LanguageContext = createContext<LanguageState | null>(null)
