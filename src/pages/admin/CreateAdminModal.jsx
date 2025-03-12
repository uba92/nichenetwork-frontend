import axios from 'axios'
import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const API_CREATE_ADMIN = 'http://localhost:8080/api/admin'

function CreateAdminModal({ show, handleClose, fetchUsers }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState(null)

  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !email || !password || !firstName || !lastName) {
      setError('Tutti i campi sono obbligatori')
      return
    }

    try {
      await axios.post(
        API_CREATE_ADMIN,
        { username, password, email, firstName, lastName },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )

      handleClose()
      fetchUsers()
    } catch (err) {
      setError("Errore nella creazione dell'admin")
      console.error("Errore nella creaziione dell'admin: ", err)
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Crea un nuovo Admin</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              value={username}
              type='text'
              placeholder='Inserisci username'
            />
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              value={password}
              type='password'
              placeholder='Inserisci password'
            />
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              value={email}
              type='email'
              placeholder='Inserisci email'
            />
          </Form.Group>
          <Form.Group controlId='firstname'>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              onChange={(e) => {
                setFirstName(e.target.value)
              }}
              value={firstName}
              type='text'
              placeholder='Inserisci Nome'
            />
          </Form.Group>
          <Form.Group controlId='lastname'>
            <Form.Label>Cognome</Form.Label>
            <Form.Control
              onChange={(e) => {
                setLastName(e.target.value)
              }}
              value={lastName}
              type='text'
              placeholder='Inserisci Cognome'
            />
          </Form.Group>
          <Button variant='primary' type='submit' className='mt-3'>
            Crea Admin
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateAdminModal
