import { Button, Col, Container, Row } from 'react-bootstrap'
import '../assets/css/LandingPage.css'
import { Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

function LandingPage() {
  return (
    <Container fluid className='landing-container'>
      <Row>
        <Col>
          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
          >
            <img
              className='landing-img hide-mobile'
              src='/img/cinema.jpg'
              alt='cinema'
            />
            <img
              className='landing-img'
              src='/img/cinofilia.jpg'
              alt='cinofilia'
            />
            <img
              className='landing-img'
              src='/img/equitazione.jpg'
              alt='equitazione'
            />
          </motion.div>
        </Col>
      </Row>
      <Row className='justify-content-center z-1'>
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
      <Row>
        <Col>
          <motion.div
            initial={{ opacity: 0, y: -70 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 2 }}
          >
            <img className='landing-img' src='/img/natura.jpg' alt='natura' />
            <img
              className='landing-img hide-mobile'
              src='/img/sport.jpg'
              alt='sport'
            />
            <img className='landing-img' src='/img/tech.jpg' alt='tech' />
          </motion.div>
        </Col>
      </Row>
    </Container>
  )
}

export default LandingPage
