import { use } from 'react'
import { LanguageContext } from './languageContext'

export function useLanguage() {
  const ctx = use(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
