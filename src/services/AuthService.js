import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth/'

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}login`, credentials)
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data))
    console.log('Token salvato: ', response.data.token)
  }

  return response.data
}

const register = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData)
  return response.data
}

const logout = () => {
  localStorage.removeItem('user')
}

export default { login, register, logout }
