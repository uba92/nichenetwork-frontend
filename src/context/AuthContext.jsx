import { jwtDecode } from 'jwt-decode'
import { createContext, useState, useEffect } from 'react'
import AuthService from '../services/AuthService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)

        const decodedToken = jwtDecode(parsedUser.token)
        const role = decodedToken.roles.includes('ROLE_ADMIN')
          ? 'ADMIN'
          : 'USER'
        setUser({ token: parsedUser.token, role })
      } catch (error) {
        console.error('Errore durante la decodifica del token:', error)
        AuthService.logout()
      }
    }
    setLoading(false)
  }, [])

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
