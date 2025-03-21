import axios from 'axios'
import {
  Alert,
  Button,
  Col,
  Container,
  Pagination,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import CreateAdminModal from './CreateAdminModal'
import { useNavigate } from 'react-router-dom'

const API_URL =
  'https://renewed-philomena-nichenetwork-60e5fcc0.koyeb.app/api/admin/users'
const API_URL_ROLE =
  'https://renewed-philomena-nichenetwork-60e5fcc0.koyeb.app/api/admin/users'
function ManageUsers() {
  const [users, setUsers] = useState(null)
  const [isError, setIsError] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totPages, setTotPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

  const handleSearch = async (e) => {
    const query = e.target.value
    setSearchQuery(query)

    try {
      const response = await axios.get(
        `https://renewed-philomena-nichenetwork-60e5fcc0.koyeb.app/api/users/search?query=${searchQuery}`,
        {
          headers: {
            'Content-Type': 'applicatioin/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )

      setUsers(response.data.content || [])
    } catch (error) {
      console.error('Errore nella ricerca utenti:', error)
    }
  }

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

  const fetchUsers = async () => {
    if (!authenticatedUser) {
      console.error('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axios.get(
        `${API_URL}?currentPage=${currentPage}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )

      let usersWithRoles = response.data.content

      const userPromises = usersWithRoles.map(async (user) => {
        try {
          const roleResponse = await axios.get(
            `${API_URL_ROLE}/${user.id}/role`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authenticatedUser.token}`,
              },
            }
          )
          return { ...user, role: roleResponse.data.role }
        } catch (error) {
          console.error(`Errore nel recupero ruolo per ${user.id}`, error)
          return { ...user, role: 'UNKNOWN' }
        }
      })

      usersWithRoles = await Promise.all(userPromises)

      console.log('Lista utenti con ruolo: ', usersWithRoles)

      setUsers(usersWithRoles)
      setTotPages(response.data.totalPages)
    } catch (error) {
      setIsError(true)
      console.error('Error fetching users:', error)
    }
  }
  console.log('Users:', users)

  useEffect(() => {
    fetchUsers()
  }, [currentPage])

  return (
    <>
      <h1>Utenti</h1>
      <Container>
        <input
          type='text'
          placeholder='Cerca'
          value={searchQuery}
          onChange={handleSearch}
          className='form-control mb-3'
        />
        <Row>
          <Col>
            {isError && (
              <Alert variant='danger'>
                Errore nel caricamento degli utenti
              </Alert>
            )}

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Nome</th>
                  <th>Cognome</th>
                  <th>Email</th>
                  <th>Data registrazione</th>
                  <th>Ruolo</th>
                </tr>
              </thead>
              <tbody>
                {!users ? (
                  <tr>
                    <td colSpan='6' className='text-center'>
                      <Spinner animation='border' role='status'>
                        <span className='visually-hidden'>Caricamento...</span>
                      </Spinner>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() =>
                        navigate(`/admin/gestione-utenti/${user.id}`)
                      }
                    >
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>{user.role}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <Pagination>
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
              />
              <Pagination.Item>
                {currentPage + 1} / {totPages}
              </Pagination.Item>
              <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totPages - 1}
              />
            </Pagination>
          </Col>
        </Row>

        <Row>
          <Col>
            <Button variant='warning' onClick={() => setShowModal(true)}>
              {' '}
              Crea Admin
            </Button>
          </Col>
        </Row>

        <CreateAdminModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          fetchUsers={fetchUsers}
        />
      </Container>
    </>
  )
}
export default ManageUsers
