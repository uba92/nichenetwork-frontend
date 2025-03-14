import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap'
import '../assets/css/DiscoverCommunities.css'
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import debounce from 'lodash.debounce'

const API_URL = 'http://localhost:8080/api/communities'
const API_URL_JOIN = 'http://localhost:8080/api/community-members'

function DiscoverCommunities() {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [communities, setCommunities] = useState([])
  const [me, setMe] = useState({})

  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

  const getCommunities = async () => {
    try {
      const response = await axios.get(`${API_URL}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })
      setCommunities(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching communities:', error)
    }
  }

  console.log('Community recuperate dal DB: ', communities)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${API_URL}/search?query=${query}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        })
        setCommunities(response.data)
        setIsLoading(false)
        console.log('Communities recuperate dalla ricerca: ', response.data)
      } catch (error) {
        setIsError(true)
        setIsLoading(false)
        console.error('Error fetching communities:', error)
      }
    }, 500),
    [API_URL, authenticatedUser.token]
  )

  const handleSearch = async (query) => {
    setSearchQuery(query)

    if (!query) {
      getCommunities()
      return
    }

    debouncedSearch(query)
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

  const handleJoinCommunity = async (communityId, userId) => {
    if (me.communities?.some((c) => c.id === communityId)) {
      alert('⚠️ Sei già iscritto a questa community!')
      return
    }

    try {
      const response = await axios.post(
        `${API_URL_JOIN}/join/${userId}/${communityId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )
      console.log('Utente aggiunto alla community: ', response.data)
      getCommunities()
      getMe()
    } catch (error) {
      if (error.response.status === 403) {
        alert('⚠️ Sei già iscritto a questa community!')
      } else {
        setIsError(true)
        console.error('Error joining community:', error)
      }
    }
  }

  useEffect(() => {
    getCommunities()
    getMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  console.log('Utente recuperato: ', me)

  if (isLoading) {
    return (
      <Container
        fluid
        className=' d-flex py-3 flex-column align-items-center discover-communities-container'
      >
        <Row>
          <Col xs='12'>
            <h1 className='text-light display-3'>Esplora nuove Community</h1>
          </Col>
        </Row>
        <Row className='mt-3 w-100'>
          <Col>
            <Spinner animation='border' variant='light' />
          </Col>
        </Row>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container
        fluid
        className=' d-flex py-3 flex-column align-items-center discover-communities-container'
      >
        <Row>
          <Col xs='12'>
            <h1 className='text-light display-3'>Esplora nuove Community</h1>
          </Col>
        </Row>
        <Row className='mt-3 w-100'>
          <Col>
            <Alert variant='danger'>Errore nella richiesta!</Alert>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container
      fluid
      className=' d-flex py-3 flex-column align-items-center discover-communities-container'
    >
      <Row>
        <Col xs='12'>
          <h1 className='text-light display-3'>Esplora nuove Community</h1>
        </Col>
      </Row>
      <Row className='mt-3 w-100'>
        <Col>
          <Form>
            <Form.Group controlId='searchCommunityInput'>
              <Form.Control
                onChange={(e) => handleSearch(e.target.value)}
                value={searchQuery}
                className=' rounded-5 bg-secondary text-light search-community-input'
                type='text'
                placeholder='Cerca la Community più adatta a te...'
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className='d-flex align-items-center mt-3 w-100 justify-content-start'>
        {communities &&
          communities.slice(0, 6).map((community) => (
            <Col xs={12} sm={6} lg={4} className='mt-3' key={community.id}>
              <Card className='custom-discover-community-card'>
                <div className='image-container'>
                  <Card.Img
                    className='custom-discover-community-card-img'
                    variant='top'
                    src={community.imageUrl}
                  />
                  <div className='overlay'></div>
                </div>
                <div className='discover-community-card-overlay-content d-flex flex-column align-items-center'>
                  <Card.Title className='discover-community-card-title'>
                    {community.name}
                  </Card.Title>
                  <Card.Text className='discover-community-card-description'>
                    {community.description}
                  </Card.Text>
                  <Button
                    onClick={() =>
                      me.id && handleJoinCommunity(community.id, me.id)
                    }
                    className='discover-community-btn'
                    disabled={!me.id}
                  >
                    JOIN
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  )
}

export default DiscoverCommunities
