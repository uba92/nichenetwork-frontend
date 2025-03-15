import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormGroup,
  ListGroup,
  Row,
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import '../assets/css/CommunityFeed.css'

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
      console.log('Utente recuperato: ', response.data)
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
      fetchPosts()
    } catch (error) {
      setIsError(true)
      console.error('Error creating post:', error)
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
      const response = await axios.delete(
        `${API_LEAVE_COMMUNITY}/${me.id}/${communityId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )
      console.log('Community left:', response.data)
      setTimeout(() => {
        navigate('/home')
      }, 1000)
    } catch (error) {
      setIsError(true)
      console.error('Error leaving community:', error)
    }
  }

  useEffect(() => {
    fetchPosts()
    getCommunity()
    getMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log('Posts della community: ', posts)
  console.log('Community: ', community)

  return (
    <Container fluid className='p-3' style={{ height: '100vh' }}>
      <Row className='h-100'>
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p>Error fetching posts</p>
        ) : (
          <>
            {community && (
              <Col
                md={3}
                className='border-end h-100'
                style={{
                  background: `linear-gradient( 0deg, ${community.color} 0%, transparent 100%)`,
                }}
              >
                <ListGroup>
                  <ListGroup.Item className='text-center'>
                    MyAvatar
                  </ListGroup.Item>
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
                      <Card.Title className=' display-3'>
                        {community.name}
                      </Card.Title>
                    </div>
                  </Card>
                  <Form onSubmit={createPost}>
                    <FormGroup controlId='content'>
                      <Form.Label>Contenuto del post</Form.Label>
                      <Form.Control
                        as='textarea'
                        rows={4}
                        placeholder='Cosa vuoi condividere?'
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        className='my-3'
                      />
                    </FormGroup>

                    <Form.Group controlId='imageUrl'>
                      <Form.Label>Immagine</Form.Label>
                      <Form.Control
                        onChange={(e) => {
                          setImageUrl(e.target.files[0])
                        }}
                        type='file'
                        accept='/image'
                      />
                    </Form.Group>
                    <Button type='submit'>crea post</Button>
                  </Form>
                </>
              )}
            </Col>
            {community && (
              <Col
                style={{
                  background: `linear-gradient( 0deg, ${community.color} 0%, transparent 100%)`,
                }}
                md={3}
                className='h-100 border-start'
              >
                <Card className=' border-0 bg-transparent'>
                  <Card.Body className=' text-center'>
                    <Card.Title className=' py-2'>{community.name}</Card.Title>
                    <Card.Text className=' py-2'>
                      {community.description}
                    </Card.Text>
                    <Card.Text className=' py-2'>
                      Membri della community
                    </Card.Text>
                    <Card.Text className=' py-2'>25</Card.Text>
                  </Card.Body>
                </Card>
                <Button
                  onClick={leaveCommunity}
                  className=' d-block mx-auto my-3'
                >
                  Leave Community
                </Button>
              </Col>
            )}
          </>
        )}
      </Row>
    </Container>
  )
}

export default CommunityFeed
