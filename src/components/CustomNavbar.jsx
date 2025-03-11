import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './CustomNavbar.css'

function CustomNavbar() {
  return (
    <Navbar expand='lg' className='navbar-custom' variant='dark'>
      <Container>
        <Navbar.Brand as={Link} to='/' className='navbar-brand-custom'>
          🌐 Niche Network
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='navbar-nav' />
        <Navbar.Collapse id='navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link as={Link} to='/' className='nav-link-custom'>
              🏠 Home
            </Nav.Link>
            <Nav.Link as={Link} to='/login' className='nav-link-custom'>
              🔑 Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default CustomNavbar
