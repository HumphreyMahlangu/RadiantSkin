export type Account = {
  userId: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: 'CUSTOMER' | 'ADMIN'
}

function account(value: unknown): Account {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('We could not load your account. Please try again.')
  const data = value as Record<string, unknown>
  if (
    !Number.isSafeInteger(data.userId) ||
    Number(data.userId) < 1 ||
    typeof data.email !== 'string' ||
    (data.role !== 'CUSTOMER' && data.role !== 'ADMIN')
  )
    throw new Error('We could not load your account. Please try again.')
  return {
    userId: data.userId as number,
    firstName: typeof data.firstName === 'string' ? data.firstName : '',
    lastName: typeof data.lastName === 'string' ? data.lastName : '',
    email: data.email,
    phoneNumber: typeof data.phoneNumber === 'string' ? data.phoneNumber : '',
    role: data.role,
  }
}

const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
async function request(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${base}/auth${path}`, {
      ...init,
      credentials: 'include',
      cache: 'no-store',
      headers: { Accept: 'application/json', ...init?.headers },
      signal: AbortSignal.any([AbortSignal.timeout(15000), ...(init?.signal ? [init.signal] : [])]),
    })
  } catch (error) {
    if (init?.signal?.aborted) throw error
    throw new Error('We could not reach the store. Check your connection and try again.', {
      cause: error,
    })
  }
}

export async function currentAccount(signal?: AbortSignal): Promise<Account | null> {
  const response = await request('/session', { signal })
  if (response.status === 401) return null
  if (!response.ok) throw new Error('We could not load your account. Please try again.')
  return account(await response.json())
}

export async function login(email: string, password: string): Promise<Account> {
  const response = await request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  })
  if (response.status === 401) throw new Error('Your email or password is incorrect.')
  if (!response.ok) throw new Error('We could not log you in right now. Please try again.')
  return account(await response.json())
}

export async function logout(): Promise<void> {
  const response = await request('/logout', { method: 'POST' })
  if (!response.ok) throw new Error('We could not log you out. Please try again.')
}
