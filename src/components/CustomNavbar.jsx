import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import '../assets/css/CustomNavbar.css'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function CustomNavbar() {
  const context = useContext(AuthContext)
  // eslint-disable-next-line no-unused-vars
  const { user, logout } = context || {}
  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Navbar expand='lg' className='navbar-custom' variant='dark'>
      <Container>
        <Navbar.Brand as={Link} to='/home' className='navbar-brand-custom'>
          🌐 Niche Network
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='navbar-nav' />
        <Navbar.Collapse id='navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link as={Link} to='/home' className='nav-link-custom'>
              Home
            </Nav.Link>
            {!authenticatedUser ? (
              <Nav.Link as={Link} to='/login' className='nav-link-custom'>
                Login
              </Nav.Link>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to='/home/communities'
                  className='nav-link-custom'
                >
                  Esplora Community
                </Nav.Link>
                <Nav.Link as={Link} to='/' className='nav-link-custom'>
                  Profilo
                </Nav.Link>
                <Nav.Link as={Link} to='/' className='nav-link-custom'>
                  Impostazioni
                </Nav.Link>
                <Nav.Link
                  onClick={handleLogout}
                  style={{ cursor: 'pointer' }}
                  className='nav-link-custom'
                >
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
