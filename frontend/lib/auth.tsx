'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

export interface AuthUser {
  username: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('oitoon-user')
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser)
      } catch {
        localStorage.removeItem('oitoon-user')
      }
    }
  }, [])

  const login = (u: AuthUser) => {
    setUser(u)
    localStorage.setItem('oitoon-user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('oitoon-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: user !== null }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
