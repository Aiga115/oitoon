'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

export interface AuthUser {
  id: number
  username: string
  email: string
  role: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  country: string | null
  member_since: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (user: AuthUser, token: string) => void
  logout: () => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('oitoon-user')
    const storedToken = localStorage.getItem('oitoon-token')
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser)
        setToken(storedToken)
      } catch {
        localStorage.removeItem('oitoon-user')
        localStorage.removeItem('oitoon-token')
      }
    }
  }, [])

  const login = (u: AuthUser, t: string) => {
    setUser(u)
    setToken(t)
    localStorage.setItem('oitoon-user', JSON.stringify(u))
    localStorage.setItem('oitoon-token', t)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('oitoon-user')
    localStorage.removeItem('oitoon-token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: user !== null }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
