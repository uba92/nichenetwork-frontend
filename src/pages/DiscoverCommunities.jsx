import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import '../assets/css/DiscoverCommunities.css'

function DiscoverCommunities() {
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
                className=' rounded-5 bg-secondary text-light search-community-input'
                type='text'
                placeholder='Cerca la Community più adatta a te...'
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className='d-flex flex-column align-items-center mt-3 w-100 justify-content-start'>
        <Col xs={12} sm={6} lg={4} className='mt-3'>
          <Card className='custom-discover-community-card'>
            <div className='image-container'>
              <Card.Img
                className='custom-discover-community-card-img'
                variant='top'
                src='http://placedog.net/400'
              />
              <div className='overlay'></div>
            </div>
            <div className='discover-community-card-overlay-content d-flex flex-column align-items-center'>
              <Card.Title className='discover-community-card-title'>
                Nome della community
              </Card.Title>
              <Card.Text className='discover-community-card-description'>
                Descrizione della community
              </Card.Text>
              <Button className='discover-community-btn'>JOIN</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default DiscoverCommunities
