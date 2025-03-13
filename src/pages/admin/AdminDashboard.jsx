import { Container, Row, Col } from 'react-bootstrap'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { Outlet, Routes } from 'react-router-dom'

function AdminDashboard() {
  return (
    <Container fluid className=' pt-3'>
      <Row>
        <Col lg='3' className=' border-end'>
          <AdminSidebar />
        </Col>
        <Col lg='9'>
          <h1>Benvenuto nella pagina di gestione per utenti Admin</h1>
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard
