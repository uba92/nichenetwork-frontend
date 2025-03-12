import { Container, Row, Col } from 'react-bootstrap'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { Route, Routes } from 'react-router-dom'
import ManageUsers from './ManageUsers'
import ManageCommunities from './ManageCommunities'
import Settings from './Settings'

function AdminDashboard() {
  return (
    <Container fluid className=' pt-3'>
      <Row>
        <Col lg='3' className=' border-end'>
          <AdminSidebar />
        </Col>
        <Col lg='9'>
          <Routes>
            <Route path='/' element={<h1>Dashboard</h1>} />
            <Route path='/gestione-utenti' element={<ManageUsers />} />
            <Route path='/gestione-community' element={<ManageCommunities />} />
            <Route path='/impostazioni' element={<Settings />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard
