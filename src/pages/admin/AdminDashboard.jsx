import { Container, Row } from 'react-bootstrap'
import AdminSidebar from '../../components/admin/AdminSidebar'

function AdminDashboard() {
  return (
    <Container>
      <Row>
        <Col lg='4'>
          <AdminSidebar />
        </Col>
        <Col lg='8'></Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard
