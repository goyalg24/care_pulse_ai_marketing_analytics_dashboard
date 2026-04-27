import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../service/api'
import { logClientError } from '../service/logger'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const current = await api.me()
        setUser(current)
      } catch (error) {
        logClientError('bootstrap-auth', error)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [])

  const login = async (email, password) => {
    const result = await api.login({ email, password })
    localStorage.setItem('token', result.token)
    setUser(result.user)
    return result.user
  }

  const register = async (name, email, password, role = 'analyst') => {
    return api.register({ name, email, password, role })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
