import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Card, Col, Container, ListGroup, Row } from 'react-bootstrap'
import PostCard from '../components/PostCard'
import { Link, useNavigate } from 'react-router-dom'
import '../assets/css/ProfilePage.css'
import { AuthContext } from '../context/AuthContext'

function ProfilePage() {
  const { user } = useContext(AuthContext)

  const navigate = useNavigate()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [me, setMe] = useState({})
  const [posts, setPosts] = useState(null)
  const [myCommunities, setMyCommunities] = useState([])

  if (!user) {
    navigate('/')
  }

  const getMe = async () => {
    if (!user) {
      console.log('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axios.get(
        'https://renewed-philomena-nichenetwork-60e5fcc0.koyeb.app/api/users/me',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setMe(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching user:', error)
    }
  }

  const getMyCommunities = async () => {
    if (!user) {
      console.log('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axios.get(
        `https://renewed-philomena-nichenetwork-60e5fcc0.koyeb.app/api/users/me/communities`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setMyCommunities(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching communities:', error)
    }
  }

  const getMyPosts = async () => {
    if (!user) {
      console.log('Nessun utente autenticato!')
      return
    }
    try {
      const response = await axios.get(
        `https://renewed-philomena-nichenetwork-60e5fcc0.koyeb.app/api/posts/user/${user.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
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

  useEffect(() => {
    getMe()
    getMyPosts()
    getMyCommunities()
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
    <Container className='p-3 mt-4' fluid>
      <Row>
        <Col md={4}>
          <Card className='text-center profile-card'>
            <div className='profile-avatar-container'>
              <Card.Img
                variant='top'
                src={me.avatar || '/img/avatar-profilo.jpg'}
                className='profile-avatar'
              />
            </div>
            <Card.Body>
              <Card.Title className='profile-name'>
                {me.firstName} {me.lastName}
              </Card.Title>
              <Card.Text className='profile-bio'>
                {me.bio || 'Nessuna bio disponibile.'}
              </Card.Text>
            </Card.Body>
            <ListGroup className='list-group-flush profile-info'>
              <ListGroup.Item>Email: {me.email}</ListGroup.Item>
              <ListGroup.Item>
                {getTimeSinceRegistration(me.createdAt)}
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Card className='text-center community-card my-3'>
            <Card.Title className='community-title'>
              Le mie Community
            </Card.Title>
            <Card.Body>
              <div className='community-grid'>
                {myCommunities.map((community) => (
                  <Link
                    key={community.id}
                    to={`/home/communities/${community.id}`}
                    className='community-item'
                  >
                    <div className='community-overlay'></div>
                    <span className='community-name'>{community.name}</span>
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <h3>I tuoi post</h3>
          {posts ? (
            posts.content.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p>Non hai ancora pubblicato post.</p>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ProfilePage
