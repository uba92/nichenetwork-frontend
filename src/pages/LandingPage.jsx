import { Button, Col, Container, Row } from 'react-bootstrap'
import '../assets/css/LandingPage.css'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <Container fluid className='landing-container'>
      <Row className='justify-content-center'>
        <Col md='8' lg='6'>
          <h1 className='landing-title'>Benvenuto su NicheNetwork</h1>
          <p className='landing-sub'>
            Trova la Community adatta a te e inizia a condividere!
          </p>
          <div className='.landing-buttons'>
            <Link to='/login'>
              <Button size='lg' className='landing-button'>
                Inizia ora
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default LandingPage
