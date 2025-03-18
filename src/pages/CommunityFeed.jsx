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
  Row,
  Spinner,
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import '../assets/css/CommunityFeed.css'
import PostCard from '../components/PostCard'

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

  console.log('Me recuperato: ', me)

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_GET_POSTS}/${communityId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })
      setPosts(response.data)
      console.log('Posts recuperati: ', posts)
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

  useEffect(() => {
    const fetchData = async () => {
      await getMe()
      fetchPosts()
      getCommunity()
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log('Posts: ', posts)
  console.log('Me recuperato: ', me)

  return (
    <Container fluid className='p-3' style={{ height: '100vh' }}>
      {isError && <p>{isError}</p>}

      <Row className='d-flex' style={{ minHeight: '100%' }}>
        {community && (
          <Col
            md={3}
            className='border-end sidebar-left'
            style={{
              minHeight: '100vh',
              background: `linear-gradient( 0deg, ${community.color} 0%, transparent 100%)`,
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

        <Col className='d-flex flex-column align-items-center' md={6}>
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
            style={{
              minHeight: '100vh',
              background: `linear-gradient( 0deg, ${community.color} 0%, transparent 100%)`,
            }}
            md={3}
            className='sidebar-right border-start'
          >
            <Card className='border-0 bg-transparent'>
              <Button onClick={leaveCommunity} className='d-block mx-auto my-3'>
                Leave Community
              </Button>
              <Card.Body className='text-center'>
                <Card.Title className='py-2'>{community.name}</Card.Title>
                <Card.Text className='py-2'>{community.description}</Card.Text>
                <Card.Text className='py-2'>Membri della community</Card.Text>
                <Card.Text className='py-2'>25</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default CommunityFeed
