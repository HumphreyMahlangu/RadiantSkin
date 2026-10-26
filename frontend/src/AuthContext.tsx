import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { currentAccount, login, logout } from './lib/auth'
import type { Account } from './lib/auth'

type Auth = {
  user: Account | null
  loading: boolean
  sessionError: string
  refresh: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
const Context = createContext<Auth | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionError, setSessionError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    currentAccount(controller.signal)
      .then((account) => {
        if (!controller.signal.aborted) setUser(account)
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setSessionError(
            error instanceof Error ? error.message : 'We could not load your account.',
          )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  async function refresh() {
    setLoading(true)
    setSessionError('')
    try {
      setUser(await currentAccount())
    } catch (error) {
      setSessionError(error instanceof Error ? error.message : 'We could not load your account.')
    } finally {
      setLoading(false)
    }
  }
  async function signIn(email: string, password: string) {
    setUser(await login(email, password))
    setSessionError('')
  }
  async function signOut() {
    await logout()
    setUser(null)
    setSessionError('')
  }
  return (
    <Context.Provider value={{ user, loading, sessionError, refresh, signIn, signOut }}>
      {children}
    </Context.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const auth = useContext(Context)
  if (!auth) throw new Error('AuthProvider is missing')
  return auth
}
