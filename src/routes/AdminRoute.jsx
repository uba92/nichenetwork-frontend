import { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Container, Alert, Button } from 'react-bootstrap'

const AdminRoute = () => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)

  console.log('AdminRoute - User : ', user)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [user])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <Container className='mt-5'>
        <Alert variant='danger' className='text-center'>
          <h4>Accesso negato</h4>
          <p>Non hai i permessi per accedere a questa pagina.</p>
          <Button variant='primary' href='/login'>
            Torna al login
          </Button>
        </Alert>
      </Container>
    )
  }

  return <Outlet />
}

export default AdminRoute
