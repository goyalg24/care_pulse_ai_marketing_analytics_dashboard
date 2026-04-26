import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [registeredUsers, setRegisteredUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    
    setRegisteredUsers(users)
    if (savedUser) setUser(JSON.parse(savedUser))
    setLoading(false)
  }, [])

  const register = (username, email, password, role = 'user') => {
  const userExists = registeredUsers.find(u => u.email === email || u.username === username)
  if (userExists) return { success: false, message: 'User already exists' }

  const newUser = { 
    id: Date.now().toString(), 
    username, 
    email, 
    password, 
    role
  }
  
  const updatedUsers = [...registeredUsers, newUser]
  setRegisteredUsers(updatedUsers)
  localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))
  return { success: true }
}

  const login = (identifier, password) => {
    const foundUser = registeredUsers.find(
      u => (u.email === identifier || u.username === identifier) && u.password === password
    )

    if (foundUser) {
      const sessionData = { ...foundUser, loginTime: new Date().toISOString() }
      delete sessionData.password 
      setUser(sessionData)
      localStorage.setItem('user', JSON.stringify(sessionData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
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