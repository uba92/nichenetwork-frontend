import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Container, Alert, Button } from 'react-bootstrap'

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user || !user.role || user.role.toUpperCase() !== 'ADMIN') {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}

export default AdminRoute
