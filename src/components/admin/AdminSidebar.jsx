import { ListGroup } from 'react-bootstrap'

function AdminSidebar() {
  return (
    <ListGroup>
      <ListGroup.Item>Dashboard</ListGroup.Item>
      <ListGroup.Item>Gestione Utenti</ListGroup.Item>
      <ListGroup.Item>Gestioine Community</ListGroup.Item>
      <ListGroup.Item>Impostazioni</ListGroup.Item>
    </ListGroup>
  )
}

export default AdminSidebar
