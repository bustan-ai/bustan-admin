// All UI strings. English is the source: add a key here first, then the
// TypeScript type forces the same key in every other language.

const en = {
  'app.name': 'Bustan Admin',
  'common.loading': 'Loading…',

  'language.switchTo': 'العربية',
  'language.label': 'Change language',

  'login.subtitle': 'Sign in to continue',
  'login.phone': 'Phone number',
  'login.password': 'Password',
  'login.submit': 'Sign in',
  'login.submitting': 'Signing in…',

  'auth.signOut': 'Sign out',

  'dashboard.placeholder': 'Signed in. Dashboards coming next.',

  'errors.invalidCredentials': 'Wrong phone number or password.',
  'errors.notAdmin': 'This account is not an admin account.',
  'errors.network': 'Could not reach the server. Check your connection.',
  'errors.generic': 'Something went wrong. Please try again.',
} as const

export type TranslationKey = keyof typeof en

const ar: Record<TranslationKey, string> = {
  'app.name': 'إدارة بستان',
  'common.loading': 'جارٍ التحميل…',

  'language.switchTo': 'English',
  'language.label': 'تغيير اللغة',

  'login.subtitle': 'سجّل الدخول للمتابعة',
  'login.phone': 'رقم الهاتف',
  'login.password': 'كلمة المرور',
  'login.submit': 'تسجيل الدخول',
  'login.submitting': 'جارٍ تسجيل الدخول…',

  'auth.signOut': 'تسجيل الخروج',

  'dashboard.placeholder': 'تم تسجيل الدخول. لوحات المعلومات قادمة قريبًا.',

  'errors.invalidCredentials': 'رقم الهاتف أو كلمة المرور غير صحيحة.',
  'errors.notAdmin': 'هذا الحساب ليس حساب مسؤول.',
  'errors.network': 'تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت.',
  'errors.generic': 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
}

export const translations = { en, ar } as const

export type Language = keyof typeof translations

export const LANGUAGES: Record<Language, { dir: 'ltr' | 'rtl' }> = {
  en: { dir: 'ltr' },
  ar: { dir: 'rtl' },
}
