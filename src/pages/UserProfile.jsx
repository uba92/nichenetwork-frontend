import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Modal,
  Row,
} from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import '../assets/css/UserProfile.css'

function UserProfile() {
  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

  const { userId } = useParams()
  const [me, setMe] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [posts, setPosts] = useState(null)
  const [user, setUser] = useState(null)

  const [selectedPost, setSelectedPost] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const getMe = async () => {
    if (!authenticatedUser) {
      console.log('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axios.get('http://localhost:8080/api/users/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })

      setMe(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching user:', error)
    }
  }

  const getUser = async () => {
    if (!authenticatedUser) {
      console.log('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )
      setUser(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching user:', error)
    }
  }

  const getUserPosts = async () => {
    if (!authenticatedUser) {
      console.log('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/user/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )

      setPosts(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching posts:', error)
    }
  }

  const handlePostClick = (post) => {
    setSelectedPost(post)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPost(null)
  }

  useEffect(() => {
    getMe()
    getUser()
    getUserPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getTimeSinceRegistration = (createdAt) => {
    const createdDate = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now - createdDate)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffMonths / 12)

    if (diffYears >= 1) {
      return `Membro di NicheNetwork da ${diffYears} ${
        diffYears === 1 ? 'anno' : 'anni'
      }`
    } else if (diffMonths >= 1) {
      return `Membro di NicheNetwork da ${diffMonths} ${
        diffMonths === 1 ? 'mese' : 'mesi'
      }`
    } else {
      return `Membro di NicheNetwork da ${diffDays} ${
        diffDays === 1 ? 'giorno' : 'giorni'
      }`
    }
  }

  if (isLoading) return <p>Caricamento...</p>
  if (isError || !me) return <p>Errore nel caricamento del profilo</p>
  return (
    <>
      <Container fluid>
        <Row>
          <Col md={4}>
            <Card className='profile-card text-center mt-3'>
              <div className='profile-avatar-container'>
                <Card.Img
                  variant='top'
                  src={user?.avatar || '/img/avatar-profilo.jpg'}
                  className='profile-avatar'
                />
              </div>
              <Card.Body>
                <Card.Title className='profile-name'>
                  {user?.firstName} {user?.lastName}
                </Card.Title>
                <Card.Text className='profile-bio'>
                  {user?.bio || 'Nessuna bio disponibile.'}
                </Card.Text>
              </Card.Body>
              <ListGroup className='list-group-flush profile-info'>
                <ListGroup.Item>Email: {user?.email}</ListGroup.Item>
                <ListGroup.Item>
                  {getTimeSinceRegistration(user?.createdAt)}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col md={8}>
            <Row>
              {posts &&
                posts.content.map((post) => (
                  <Col key={post.id} xs={6} sm={4} md={3}>
                    <div
                      className={`post-thumbnail ${
                        post.image ? '' : 'text-post'
                      }`}
                      onClick={() => {
                        handlePostClick(post)
                      }}
                    >
                      {post.image ? (
                        <img src={post.image} alt='Post' />
                      ) : (
                        <p className='post-text-preview'>
                          {post.content.length > 50
                            ? post.content.substring(0, 50) + '...'
                            : post.content}
                        </p>
                      )}
                    </div>
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>

        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Dettaglio Post</Modal.Title>
          </Modal.Header>
          <Modal.Body className='modal-body'>
            {selectedPost && selectedPost.image ? (
              <img
                src={selectedPost.image}
                alt='Post'
                className='img-fluid modal-image'
              />
            ) : (
              <p className='modal-text'>{selectedPost?.content}</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseModal}>
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  )
}

export default UserProfile
