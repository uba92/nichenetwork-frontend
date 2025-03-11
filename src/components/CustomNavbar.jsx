import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../assets/css/CustomNavbar.css'
import { useState } from 'react'

function CustomNavbar() {
  // eslint-disable-next-line no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
              Home
            </Nav.Link>
            {!isAuthenticated ? (
              <Nav.Link as={Link} to='/login' className='nav-link-custom'>
                Login
              </Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to='/' className='nav-link-custom'>
                  Community
                </Nav.Link>
                <Nav.Link as={Link} to='/' className='nav-link-custom'>
                  Profilo
                </Nav.Link>
                <Nav.Link as={Link} to='/' className='nav-link-custom'>
                  Impostazioni
                </Nav.Link>
                <Nav.Link as={Link} to='/' className='nav-link-custom'>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default CustomNavbar
