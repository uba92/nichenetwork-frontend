import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const API_URL = 'http://localhost:8080/api/auth/'

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}login`, credentials)
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (user && user.token) {
    const decodedToken = jwtDecode(user.token)
    if (decodedToken.roles.includes('ROLE_ADMIN')) {
      return 'ADMIN'
    }
    return 'USER'
  }
  return null
}

const register = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData)
  return response.data
}

const logout = () => {
  localStorage.removeItem('user')
}

export default { login, register, logout, getUserRole }
