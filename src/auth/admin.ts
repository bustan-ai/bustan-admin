import type { Account } from '../lib/api'

// Values of Account.code_account_type that may use this dashboard.
// TODO: confirm against the Bustan API: the docs don't list the account types.
export const ADMIN_ACCOUNT_TYPES: readonly string[] = ['admin']

export function isAdmin(account: Account): boolean {
  return ADMIN_ACCOUNT_TYPES.includes(account.code_account_type)
}

/** Thrown by login when the credentials are right but the account is not an admin. */
export class NotAdminError extends Error {
  constructor() {
    super('This account is not an admin')
    this.name = 'NotAdminError'
  }
}
