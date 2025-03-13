import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap'

const API_URL = 'http://localhost:8080/api/users'

function UserDetails() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const formatDate = (dateString) => {
    const parsedDate = new Date(Date.parse(dateString))

    return parsedDate.toLocaleString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

  const fetchData = async (id) => {
    if (!authenticatedUser) {
      console.error('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })

      console.log('Utente recuperato: ', response.data)
      setUser(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      console.error('Error fetching user:', error)
    }
  }
  useEffect(() => {
    fetchData(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/deleteUser?targetUsername=${user.username}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )
      alert(response.data)
      window.location.href = '/admin/gestione-utenti'
    } catch (error) {
      console.error("Errore nell'eliminazione dell'utente:", error)
      alert("Errore durante l'eliminazione dell'utente.")
    }
  }

  if (isLoading) {
    return (
      <Container className='text-center mt-4'>
        <Spinner animation='border' />
      </Container>
    )
  }

  if (isError) {
    return (
      <Container className='text-center mt-4'>
        <Alert variant='danger'>Errore nel caricamento dell'utente</Alert>
      </Container>
    )
  }

  return (
    <Container className='mt-4'>
      <Card>
        <Card.Body>
          <Card.Title>Dettagli Utente</Card.Title>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Nome:</strong> {user.firstName}
          </p>
          <p>
            <strong>Cognome:</strong> {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Data Registrazione:</strong> {formatDate(user.createdAt)}
          </p>
        </Card.Body>
        <Button variant='danger' onClick={handleDeleteUser}>
          Elimina Utente
        </Button>
      </Card>
    </Container>
  )
}

export default UserDetails
