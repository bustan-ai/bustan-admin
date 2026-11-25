import type { Language } from './translations'

// Western digits in both languages, so numbers on charts and tables read the same.
const LOCALES: Record<Language, string> = { en: 'en', ar: 'ar-u-nu-latn' }

export function locale(language: Language): string {
  return LOCALES[language]
}

/** Parses an API date (YYYY-MM-DD) as a local calendar day, with no timezone shift. */
export function parseDay(value: string): Date {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatNumber(language: Language, value: number): string {
  return new Intl.NumberFormat(locale(language)).format(value)
}

export function formatShortDate(language: Language, value: string): string {
  return new Intl.DateTimeFormat(locale(language), { day: 'numeric', month: 'short' }).format(parseDay(value))
}

// Same time zone as the API's days (its stats_timezone), so times match the day they are listed under.
const API_TIME_ZONE = 'Asia/Damascus'

/** Time of day of an API timestamp. */
export function formatTime(language: Language, value: string): string {
  return new Intl.DateTimeFormat(locale(language), {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: API_TIME_ZONE,
  }).format(new Date(value))
}

export function formatLongDate(language: Language, value: string): string {
  return new Intl.DateTimeFormat(locale(language), {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parseDay(value))
}
