import { Button, Col, Container, Row } from 'react-bootstrap'
import LoginForm from '../components/LoginForm'
import { Link } from 'react-router-dom'

function LoginPage() {
  return (
    <Container className=' text-center'>
      <Row className='justify-content-center my-5'>
        <Col xs={12} md={6} lg={4}>
          <h1>Sei già registrato?</h1>
          <h2>Accedi</h2>
          <LoginForm />
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col xs={12} md={6} lg={4}>
          <h3 className='d-inline-block'>Non sei ancora registrato?</h3>

          <Button as={Link} to='/register' variant='primary'>
            Registrati
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage
