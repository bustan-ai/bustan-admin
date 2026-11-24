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

  'common.retry': 'Try again',

  'range.7d': '7 days',
  'range.30d': '30 days',
  'range.90d': '90 days',
  'range.1y': '1 year',
  'range.label': 'Time range',

  'scans.title': 'Plant scans',
  'scans.subtitle': 'New scans per day',
  'scans.total': 'Total scans',
  'scans.newInRange': 'New in this period',
  'scans.new': 'New scans',
  'scans.empty': 'No scans in this period.',

  'users.title': 'Registered users',
  'users.subtitle': 'New sign-ups per day',
  'users.total': 'Total users',
  'users.newInRange': 'New in this period',
  'users.new': 'New users',
  'users.empty': 'No new users in this period.',

  'chart.date': 'Date',
  'chart.cumulative': 'Total',
  'chart.showTable': 'Show as table',
  'chart.hideTable': 'Hide table',

  'errors.loadFailed': 'Could not load the data.',
  'errors.forbidden': 'This account is not allowed to view this data.',

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

  'common.retry': 'إعادة المحاولة',

  'range.7d': '7 أيام',
  'range.30d': '30 يومًا',
  'range.90d': '90 يومًا',
  'range.1y': 'سنة',
  'range.label': 'الفترة الزمنية',

  'scans.title': 'فحوصات النباتات',
  'scans.subtitle': 'الفحوصات الجديدة يوميًا',
  'scans.total': 'إجمالي الفحوصات',
  'scans.newInRange': 'جديدة في هذه الفترة',
  'scans.new': 'فحوصات جديدة',
  'scans.empty': 'لا توجد فحوصات في هذه الفترة.',

  'users.title': 'المستخدمون المسجّلون',
  'users.subtitle': 'التسجيلات الجديدة يوميًا',
  'users.total': 'إجمالي المستخدمين',
  'users.newInRange': 'جدد في هذه الفترة',
  'users.new': 'مستخدمون جدد',
  'users.empty': 'لا يوجد مستخدمون جدد في هذه الفترة.',

  'chart.date': 'التاريخ',
  'chart.cumulative': 'الإجمالي',
  'chart.showTable': 'عرض كجدول',
  'chart.hideTable': 'إخفاء الجدول',

  'errors.loadFailed': 'تعذّر تحميل البيانات.',
  'errors.forbidden': 'هذا الحساب غير مخوّل بعرض هذه البيانات.',

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
