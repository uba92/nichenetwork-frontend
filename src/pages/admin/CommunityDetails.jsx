import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Spinner,
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

const API_URL =
  'https://renewed-philomena-nichenetwork-60e5fcc0.koyeb.app/api/communities'
const API_URL_MEMBERS =
  'https://renewed-philomena-nichenetwork-60e5fcc0.koyeb.app/api/community-members'

function CommunityDetails() {
  const { id } = useParams()
  const [community, setCommunity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [communityMember, setCommunityMember] = useState([])
  const navigate = useNavigate()

  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

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

  const removeMember = async (userId) => {
    if (!authenticatedUser) {
      console.error('Nessun utente autenticato')
      return
    }

    try {
      await axios.delete(`${API_URL_MEMBERS}/leave/${userId}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })

      alert('Utente rimosso con successo dalla community')
      getCommunityMembers(id)
    } catch (error) {
      console.error('Errore nella rimozione del membro:', error)
      alert('Errore durante la rimozione del membro')
    }
  }

  const getCommunityMembers = async (id) => {
    if (!authenticatedUser) {
      console.error('Nessun utente autenticato')
      return
    }

    try {
      const response = await axios.get(`${API_URL_MEMBERS}/${id}/members`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })

      setCommunityMember(response.data)
      console.log('Membri della community: ', response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      console.error('Error fetching community-members:', error)
    }
  }

  const getCommunityById = async (id) => {
    if (!authenticatedUser) {
      console.error('Nessun utente autenticato')
      return
    }

    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })

      setCommunity(response.data)
      setIsLoading(false)
      console.log('Community recuperata da id: ', response.data)
    } catch (error) {
      setIsError(true)
      console.error('Error fetching community:', error)
    }
  }

  const handleDeleteCommunity = async () => {
    if (!authenticatedUser) {
      console.error('Nessun utente autenticato')
      return
    }

    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })

      alert(response.data)
      window.location.href = '/admin/gestione-community'
    } catch (error) {
      console.error("Errore nell'eliminazione della community:", error)
      alert("Errore durante l'eliminazione della community.")
    }
  }

  useEffect(() => {
    getCommunityById(id)
    getCommunityMembers(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

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
        <Alert variant='danger'>Errore nel caricamento della Community</Alert>
      </Container>
    )
  }

  return (
    <Container className='mt-4'>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Dettagli Community</Card.Title>
              <p>
                <strong>ID:</strong> {community.id}
              </p>
              <p>
                <strong>Nome:</strong> {community.name}
              </p>
              <p>
                <strong>Descrizione:</strong> {community.description}
              </p>
              <p>
                <strong>Data creazione:</strong>{' '}
                {formatDate(community.createdAt)}
              </p>
              <Button variant='danger' onClick={handleDeleteCommunity}>
                Rimuovi Community
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className=' mt-3'>
        <Col>
          <h2>Membri della Community - {community.name}</h2>
          <ListGroup>
            {communityMember.length > 0 ? (
              communityMember.map((member, index) => (
                <ListGroup.Item
                  key={index}
                  onClick={() =>
                    navigate(`/admin/gestione-utenti/${member.id}`)
                  }
                >
                  <div className=' d-flex justify-content-between'>
                    <span>
                      {member.username} - {member.firstName} - {member.lastName}{' '}
                      -{member.email} - {member.role}
                    </span>

                    <Button
                      className=' ms-3'
                      variant='danger'
                      size='sm'
                      onClick={(e) => {
                        e.stopPropagation()
                        removeMember(member.id)
                      }}
                    >
                      Rimuovi
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>
                Nessun membro presentein questa Community
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default CommunityDetails
