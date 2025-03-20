import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const API_URL = 'http://localhost:8080/api/auth/'

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}login`, credentials)

  if (response.data.token) {
    const token = response.data.token
    const decodedToken = jwtDecode(token)

    const userResponse = await axios.get(`http://localhost:8080/api/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const userData = userResponse.data

    const completeUser = {
      token,
      id: userData.id,
      role:
        decodedToken.roles && decodedToken.roles.includes('ROLE_ADMIN')
          ? 'ADMIN'
          : 'USER',
    }

    localStorage.setItem('user', JSON.stringify(completeUser))
    return completeUser
  }

  return response.data
}

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.token) {
    const decodedToken = jwtDecode(user.token)
    return decodedToken.roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER'
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
