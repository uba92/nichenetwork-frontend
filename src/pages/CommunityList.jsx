import '../assets/css/CommunityList.css'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import axios from 'axios'
import { Link } from 'react-router-dom'

const API_URL = 'http://localhost:8080/api/users/me/communities'

function CommunityList() {
  const { user, loading } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [myCommunities, setMyCommunities] = useState([])

  const rawUser = localStorage.getItem('user')
  const authenticatedUser = JSON.parse(rawUser)

  const getMyCommunities = async () => {
    if (!authenticatedUser) {
      console.error('Nessun utente autenticato')
      return
    }
    try {
      const response = await axios.get(API_URL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })
      setMyCommunities(response.data)
      setIsLoading(false)
    } catch (error) {
      console.log('Errore nel recuper delle tue Communities', error)
      setIsError(true)
    }
  }

  console.log(' Le mie communities: ', myCommunities)

  useEffect(() => {
    if (rawUser) {
      const userUsername = jwtDecode(authenticatedUser.token).sub
      setUsername(userUsername)
    }
    getMyCommunities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return <p>Caricamento...</p>
  }

  if (!user) {
    return <p>Non sei autenticato!</p>
  }

  if (isError) {
    return (
      <Container>
        <Alert>Errore nel caricamento delle community</Alert>
      </Container>
    )
  }

  return (
    <>
      <Container fluid className='community-list-container'>
        {username ? (
          <h1>Ciao {username} - Benvenuto in NicheNetwork </h1>
        ) : (
          <p>Caricamento...</p>
        )}
        <Row>
          <Col>
            <h2>Le tue Community</h2>
          </Col>
        </Row>
        <Row className='justify-content-center mt-3'>
          {!isLoading &&
            (myCommunities.length > 0 ? (
              myCommunities.map((community, index) => (
                <Col key={index} xs={12} sm={6} lg={4} className=' mt-3'>
                  <Card className='custom-community-card'>
                    <div className='image-container'>
                      <Card.Img
                        className='custom-community-card-img'
                        variant='top'
                        src={community.imageUrl}
                      />
                      <div className='overlay'></div>
                    </div>
                    <div className='community-card-overlay-content'>
                      <Card.Title className='community-card-title'>
                        {community.name}
                      </Card.Title>
                      <Card.Text className='community-card-description'>
                        {community.description}
                      </Card.Text>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <Link to='/home/communities'>Esplora le community</Link>
            ))}
        </Row>
      </Container>
    </>
  )
}

export default CommunityList
