// Thin client for the Bustan API. Requests go to /api/... on our own origin and
// are forwarded to the Bustan API (Vite proxy in dev, vercel.json rewrite in prod).

const TOKEN_KEY = 'bustan-admin.token'

export type Account = {
  id_user: string
  code_user: string
  code_account_type: string
  phone_number: string
  email: string | null
  full_name: string | null
  is_approved: boolean
}

export type LoginResponse = {
  access_token: string
  token_type: string
  account: Account
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage unavailable (private mode etc.): the session just won't persist.
  }
}

// FastAPI returns { detail: string } or { detail: [{ msg, ... }] } on errors.
function errorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'detail' in body) {
    const { detail } = body as { detail: unknown }
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: unknown }
      if (typeof first?.msg === 'string') return first.msg
    }
  }
  return fallback
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  // A caller-supplied Authorization header wins over the saved token.
  const token = getToken()
  if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)

  let res: Response
  try {
    res = await fetch(`/api/v1${path}`, { ...init, headers })
  } catch {
    throw new ApiError(0, 'Network error')
  }

  const body: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiError(res.status, errorMessage(body, `Request failed (${res.status})`))
  }
  return body as T
}

export type StatsInterval = 'day' | 'week' | 'month'
export type StatsRange = '7d' | '30d' | '90d' | '1y'

export type StatsPoint = {
  /** First day of the period, YYYY-MM-DD (weeks start on Monday). */
  date: string
  /** Created during this period. */
  new: number
  /** Total up to the end of this period. */
  cumulative: number
}

export type StatsResponse = {
  interval: StatsInterval
  range: StatsRange
  /** Total right now, including everything before the range. */
  total: number
  /** Oldest first; empty periods are included with new = 0. */
  series: StatsPoint[]
}

export const statsApi = {
  users: (range: StatsRange, interval: StatsInterval) =>
    apiFetch<StatsResponse>(`/admin/stats/users?${new URLSearchParams({ range, interval })}`),
  scans: (range: StatsRange, interval: StatsInterval) =>
    apiFetch<StatsResponse>(`/admin/stats/scans?${new URLSearchParams({ range, interval })}`),
}

export const authApi = {
  login: (phone_number: string, password: string) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone_number, password }),
    }),
  me: () => apiFetch<Account>('/auth/me'),
  /** Signs out the saved session, or the given token's session. */
  logout: (token?: string) =>
    apiFetch<unknown>('/auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
}
