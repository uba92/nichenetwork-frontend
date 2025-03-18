import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormGroup,
  ListGroup,
  Modal,
  Offcanvas,
  Row,
  Spinner,
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import '../assets/css/CommunityFeed.css'
import PostCard from '../components/PostCard'
import { ArrowBigLeft } from 'lucide-react'

const API_GET_POSTS = 'http://localhost:8080/api/posts/community'
const API_GET_COMMUNITY = 'http://localhost:8080/api/communities'
const API_LEAVE_COMMUNITY = 'http://localhost:8080/api/community-members/leave'

function CommunityFeed() {
  const { communityId } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [posts, setPosts] = useState(null)
  const [community, setCommunity] = useState(null)
  const [me, setMe] = useState({})
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const fileInputRef = useRef(null)
  const [numberOfMembers, setNumberOfMembers] = useState(0)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [communityMembers, setCommunityMembers] = useState([])

  const [showSidebar, setShowSidebar] = useState(false)
  const handleCloseSidebar = () => setShowSidebar(false)
  const handleShowSidebar = () => setShowSidebar(true)

  const navigate = useNavigate()

  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

  const getCommunity = async () => {
    try {
      const response = await axios.get(`${API_GET_COMMUNITY}/${communityId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })
      setCommunity(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching community:', error)
    }
  }

  const getMembers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/community-members/${communityId}/members`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )
      setCommunityMembers(response.data)
      setNumberOfMembers(response.data.length)
      console.log('Membri della community: ', response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching number of members:', error)
    }
  }

  const getMe = async () => {
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

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_GET_POSTS}/${communityId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })
      setPosts(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching posts:', error)
    }
  }
  const createPost = async (e) => {
    e.preventDefault()

    if (!authenticatedUser) {
      console.error('Nessun utente autenticato!')
      return
    }

    if (!content || !communityId) {
      console.error('Content e communityId sono obbligatori!')
      return
    }

    try {
      setIsLoading(true)

      const formData = new FormData()

      formData.append('content', content)

      if (imageUrl) {
        formData.append('image', imageUrl)
      }

      formData.append('communityId', communityId)

      await axios.post('http://localhost:8080/api/posts', formData, {
        headers: {
          //   'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })
      console.log('Post creato')
      setContent('')
      setImageUrl('')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      fetchPosts()
    } catch (error) {
      setIsError(true)
      console.error('Error creating post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const leaveCommunity = async () => {
    if (!authenticatedUser) {
      console.error('Nessun utente autenticato!')
      return
    }
    if (!me) {
      console.error('Nessun utente autenticato!')
      return
    }
    try {
      await axios.delete(`${API_LEAVE_COMMUNITY}/${me.id}/${communityId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })
      setTimeout(() => {
        navigate('/home')
      }, 1000)
    } catch (error) {
      setIsError(true)
      console.error('Error leaving community:', error)
    }
  }

  const handleCloseLeaveModal = () => {
    setShowLeaveModal(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      await getMe()
      fetchPosts()
      getCommunity()
      getMembers()
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container fluid className='p-3' style={{ height: '100vh' }}>
      {isError && <p>{isError}</p>}

      <Row className='d-flex' style={{ minHeight: '100%' }}>
        {community && (
          <Col
            md={3}
            className='border-end sidebar-left d-none d-md-block'
            style={{
              background: `linear-gradient(0deg, ${community.color} 0%, transparent 100%)`,
            }}
          >
            <ListGroup>
              <ListGroup.Item className='text-center'>MyAvatar</ListGroup.Item>
              <ListGroup.Item className='text-center'>
                CommunityMember
              </ListGroup.Item>
              <ListGroup.Item className='text-center'>
                Communities
              </ListGroup.Item>
            </ListGroup>
          </Col>
        )}

        <Button
          variant='secondary'
          className='d-md-none btn-primary mb-3 text-start'
          onClick={handleShowSidebar}
        >
          <ArrowBigLeft size={20} /> Profilo
        </Button>

        <Offcanvas show={showSidebar} onHide={handleCloseSidebar}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ListGroup>
              <ListGroup.Item className='text-center'>MyAvatar</ListGroup.Item>
              <ListGroup.Item className='text-center'>
                CommunityMember
              </ListGroup.Item>
              <ListGroup.Item className='text-center'>
                Communities
              </ListGroup.Item>
            </ListGroup>
          </Offcanvas.Body>
        </Offcanvas>

        <Col className='d-flex flex-column align-items-center' md={6} sm={12}>
          {community && (
            <>
              <Card className='cover-container'>
                <div className='img-cover-container'>
                  <Card.Img variant='top' src={community.imageUrl} />
                  <div className='cover-overlay'></div>
                </div>
                <div className='cover-content-container'>
                  <Card.Title className='display-3'>
                    {community.name}
                  </Card.Title>
                </div>
              </Card>

              <Form className='post-form' onSubmit={createPost}>
                <img
                  className='form-avatar'
                  src={me.avatar ? me.avatar : 'https://placedog.net/50'}
                  alt='me-avatar'
                />{' '}
                <span>Cosa vuoi condividere?</span>
                <FormGroup controlId='content'>
                  <Form.Control
                    as='textarea'
                    rows={4}
                    placeholder='Condividi con la Community...'
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                    className='my-3'
                  />
                </FormGroup>
                <Form.Group controlId='imageUrl'>
                  <Form.Label>Immagine</Form.Label>
                  <Form.Control
                    ref={fileInputRef}
                    onChange={(e) => {
                      setImageUrl(e.target.files[0])
                    }}
                    type='file'
                    accept='/image'
                  />
                </Form.Group>
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? (
                    <Spinner animation='border' size='sm' />
                  ) : (
                    'Pubblica'
                  )}
                </Button>
              </Form>

              {!isError &&
                !isLoading &&
                posts &&
                me &&
                posts.content.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </>
          )}
        </Col>

        {community && (
          <Col
            md={3}
            className='sidebar-right border-start order-md-2 order-last'
            style={{
              background: `linear-gradient(0deg, ${community.color} 0%, transparent 100%)`,
            }}
          >
            <Card className='border-0 bg-transparent'>
              <Button
                onClick={() => setShowLeaveModal(true)}
                className='d-block mx-auto my-3 leave-community-button'
              >
                Lascia Community
              </Button>
              <Card.Body className='text-center'>
                <Card.Title className='py-2'>{community.name}</Card.Title>
                <Card.Text className='py-2'>{community.description}</Card.Text>
                <Card.Text className='py-2'>Membri della community</Card.Text>
                <Card.Text className='py-2'>{numberOfMembers}</Card.Text>
              </Card.Body>
              <ListGroup className='suggested-members'>
                <h5 className='mb-3'>Membri suggeriti</h5>
                {communityMembers
                  ?.filter((member) => member.id !== me.id)
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 3)
                  .map((member) => (
                    <ListGroup.Item
                      key={member.id}
                      className='d-flex align-items-center suggested-member-item'
                    >
                      <img
                        src={member.avatar || 'https://placedog.net/50'}
                        alt='avatar'
                        className='rounded-circle member-avatar'
                      />
                      <div className='ms-2'>
                        <strong className='member-name'>
                          {member.firstName} {member.lastName}
                        </strong>
                        <p className='member-email'>{member.email}</p>
                      </div>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card>

            <Modal show={showLeaveModal} onHide={handleCloseLeaveModal}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Title className='text-center'>
                Vuoi davvero abbandonare la community?
              </Modal.Title>
              <Modal.Body className=' d-flex justify-content-between'>
                <Button onClick={handleCloseLeaveModal} variant='secondary'>
                  Annulla
                </Button>
                <Button onClick={leaveCommunity} variant='danger'>
                  Abbandona Community
                </Button>
              </Modal.Body>
            </Modal>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default CommunityFeed
